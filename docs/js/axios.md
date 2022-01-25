# axios封装（支持请求失败自动重发,缓存请求，设置缓存过期时长）

## 痛点：工作中总有服务器抽风的时候，比如前一秒某个接口请求失败了，后一秒接口成功，但是页面没有刷新，这时候并无法拿到最新的数据

- 缓存请求
- 关键api cancelToken ，内部通过调用 `abort` 方法 来实现中断请求的目的，同时调用reject让外层的promise失败。
- 请求重发

## 关于cancelToken

可以使用 CancelToken.source 工厂方法创建 cancel token，像这样
```js
const CancelToken = axios.CancelToken;
const source = CancelToken.source();
axios.get('/user/12345', {
  cancelToken: source.token
}).catch(function(thrown) {
  if (axios.isCancel(thrown)) {
    console.log('Request canceled', thrown.message);
  } else {
     // 处理错误
  }
});

axios.post('/user/12345', {
  name: 'new name'
}, {
  cancelToken: source.token
})

// 取消请求（message 参数是可选的）
source.cancel('Operation canceled by the user.');

```

还可以通过传递一个 executor 函数到 CancelToken 的构造函数来创建 cancel token：
```js
const CancelToken = axios.CancelToken;
let cancel;
axios.get('/user/12345', {
  cancelToken: new CancelToken(cancel => {
    // cancel the request
    cancel();
  })
});
```
## 结构🌲

```
- request
  - index.js 
  - requestCache.js 请求缓存
  - cancelRepeatRequest.js 取消重复请求
  - requestAgainSend.js 请求重发

- commonFuns.js 工具函数
```

### index

```js
import Axios from 'axios';
import { addPendingRequest, removePendingRequest } from './cancelRepeatRquest'; // 取消重复请求
import { againRequest } from './requestAgainSend'; // 请求重发
import { requestInterceptor as cacheReqInterceptor, responseInterceptor as cacheResInterceptor } from './requestCache';

// 返回结果处理
// 自定义约定接口返回{code: xxx, result: xxx, message: 'err message'}, 根据api模拟，具体可根据业务调整
const responseHandle = {
  200: response => {
    return Promise.resolve(response.data);
  },
  201: response => {
    alert(response.data.message);
    console.log(`参数异常:${response.data.message}`);
    return Promise.resolve(response.data);
  },
  404: response => {
    alert('接口地址不存在');
    return Promise.reject(response);
  },
  default: response => {
    alert('操作失败');
    return Promise.reject(response);
  }
};

const axios = Axios.create({
  baseURL: import.meta.env.BASE_URL || '',
  timeout: 50000
});

// 添加请求拦截器
axios.interceptors.request.use(
  function (config) {
    // 请求头用于接口token 认证
    // getToken() && (config.headers['Authorization'] = getToken());

    if (config.method.toLocaleLowerCase() === 'post' || config.method.toLocaleLowerCase() === 'put') {
      // 参数统一处理，请求都使用data传参
      config.data = config.data.data;
    } else if (config.method.toLocaleLowerCase() === 'get' || config.method.toLocaleLowerCase() === 'delete') {
      // 参数统一处理
      config.params = config.data;
    } else {
      alert('不允许的请求方法：' + config.method);
    }
    // pendding 中的请求，后续请求不发送（由于存放的peddingMap 的key 和参数有关，所以放在参数处理之后）
    addPendingRequest(config); // 把当前请求信息添加到pendingRequest对象中
    //  请求缓存
    cacheReqInterceptor(config, axios);
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axios.interceptors.response.use(
  response => {
    // 响应正常时候就从pendingRequest对象中移除请求
    removePendingRequest(response);
    cacheResInterceptor(response);
    return (responseHandle[response.data.code] || responseHandle['default'])(response);
  },
  error => {
    // 从pending 列表中移除请求
    removePendingRequest(error.config || {});
    // 需要特殊处理请求被取消的情况
    if (!Axios.isCancel(error)) {
      // 请求重发
      againRequest(error, axios);
    }
    // 请求缓存处理方式
    if (Axios.isCancel(error) && error.message.data && error.message.data.config.cache) {
      return Promise.resolve(error.message.data.data.result); // 返回结果数据,根据实际业务配置
    }
    return Promise.reject(error);
  }
);
export default axios;

```

### requestCache

```js
import Axios from 'axios';
import { generateReqKey } from '../commonFuns';

const options = {
  storage: true, // 是否开启loclastorage缓存
  storageKey: 'apiCache',
  storage_expire: 600000, // localStorage 数据存储时间10min（刷新页面判断是否清除）
  expire: 20000 // 每个接口数据缓存ms 数
};
// 初始化
(function () {
  let cache = window.localStorage.getItem(options.storageKey);
  if (cache) {
    let { storageExpire } = JSON.parse(cache);
    // 未超时不做处理
    if (storageExpire && getNowTime() - storageExpire < options.storage_expire) {
      return;
    }
  }
  window.localStorage.setItem(options.storageKey, JSON.stringify({ data: {}, storageExpire: getNowTime() }));
})();

function getCacheItem(key) {
  let cache = window.localStorage.getItem(options.storageKey);
  let { data } = JSON.parse(cache);
  return (data && data[key]) || null;
}
function setCacheItem(key, value) {
  let cache = window.localStorage.getItem(options.storageKey);
  let { data, storageExpire } = JSON.parse(cache);
  data[key] = value;
  window.localStorage.setItem(options.storageKey, JSON.stringify({ data, storageExpire }));
}

let _CACHES = {};
// 使用Proxy代理
let cacheHandler = {
  get: function (target, key) {
    let value = target[key];
    console.log(`${key} 被读取`, value);
    if (options.storage && !value) {
      value = getCacheItem(key);
    }
    return value;
  },
  set: function (target, key, value) {
    console.log(`${key} 被设置为 ${JSON.stringify(value)}`);
    target[key] = value;
    if (options.storage) {
      setCacheItem(key, value);
    }
    return true;
  }
};
let CACHES = new Proxy(_CACHES, cacheHandler);

export function requestInterceptor(config, axios) {
  // 开启缓存则保存请求结果和cancel 函数
  if (config.cache) {
    let data = CACHES[`${generateReqKey(config)}`];
    // 这里用于存储是默认时间还是用户传递过来的时间
    let setExpireTime;
    config.setExpireTime ? (setExpireTime = config.setExpireTime) : (setExpireTime = options.expire);
    // 判断缓存数据是否存在 存在的话 是否过期 没过期就返回
    if (data && getNowTime() - data.expire < setExpireTime) {
      config.cancelToken = new Axios.CancelToken(cancel => {
        // cancel 函数的参数会作为 promise 的 error 被捕获
        cancel(data);
      }); // 传递结果到catch中
    }
  }
}

export function responseInterceptor(response) {
  // 返回的code === 0 时候才会缓存下来,可根据实际业务配置
  if (response && response.config.cache && response.data.code === 0) {
    let data = {
      expire: getNowTime(),
      data: response
    };

    CACHES[`${generateReqKey(response.config)}`] = data;
  }
}

// 获取当前时间戳
function getNowTime() {
  return new Date().getTime();
}
```

### cancelRepeatRequest

```js
import Axios from 'axios';
import { generateReqKey } from '../commonFuns';
// TODO: 用于把当前请求信息添加到pendingRequest对象 中；
const pendingRequest = new Map(); // Map对象保存键值对。任何值(对象或者原始值) 都可以作为一个键或一个值。
export function addPendingRequest(config) {
  if (config.cancelRequest) {
    const requestKey = generateReqKey(config);
    if (pendingRequest.has(requestKey)) {
      config.cancelToken = new Axios.CancelToken(cancel => {
        // cancel 函数的参数会作为 promise 的 error 被捕获
        cancel(`${config.url} 请求已取消`);
      });
    } else {
      config.cancelToken =
        config.cancelToken ||
        new Axios.CancelToken(cancel => {
          pendingRequest.set(requestKey, cancel);
        });
    }
  }
}

// TODO：检查是否存在重复请求，若存在则取消已发的请求。
export function removePendingRequest(response) {
  if (response && response.config && response.config.cancelRequest) {
    const requestKey = generateReqKey(response.config);
    // 判断是否有这个 key
    if (pendingRequest.has(requestKey)) {
      const cancelToken = pendingRequest.get(requestKey);
      cancelToken(requestKey);
      pendingRequest.delete(requestKey);
    }
  }
}
```

### requestAgainSend

```js
import { isJsonStr } from '../commonFuns';
/**
 * @param {失败信息} err
 * @param {实例化的单例} axios
 * @returns
 */
export function againRequest(err, axios) {
  let config = err.config;
  // config.retry 具体接口配置的重发次数
  if (!config || !config.retry) return Promise.reject(err);

  // 设置用于记录重试计数的变量 默认为0
  config.__retryCount = config.__retryCount || 0;

  // 判断是否超过了重试次数
  if (config.__retryCount >= config.retry) {
    return Promise.reject(err);
  }
  // 重试次数
  config.__retryCount += 1;

  // 延时处理
  var backoff = new Promise(function (resolve) {
    setTimeout(function () {
      resolve();
    }, config.retryDelay || 1000);
  });
  // 重新发起axios请求
  return backoff.then(function () {
    // 判断是否是JSON字符串
    // TODO: 未确认config.data再重发时变为字符串的原因
    if (config.data && isJsonStr(config.data)) {
      config.data = JSON.parse(config.data);
    }
    return axios(config);
  });
}
```

### commonFuns

```js
import Qs from 'qs';

// generateReqKey ：用于根据当前请求的信息，生成请求 Key；
export function generateReqKey(config) {
  // 响应的时候，response.config 中的data 是一个JSON字符串，所以需要转换一下
  if (config && config.data && isJsonStr(config.data)) {
    config.data = JSON.parse(config.data);
  }
  const { method, url, params, data } = config; // 请求方式，参数，请求地址，
  return [method, url, Qs.stringify(params), Qs.stringify(data)].join('&'); // 拼接
}

// 判断一个字符串是否为JSON字符串
export let isJsonStr = str => {
  if (typeof str == 'string') {
    try {
      var obj = JSON.parse(str);
      if (typeof obj == 'object' && obj) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.log('error：' + str + '!!!' + e);
      return false;
    }
  }
};

```

## 用法（Vue3为例）

```js
import { getCurrentInstance } from 'vue';
const { proxy } = getCurrentInstance();

// 正常请求
proxy.$http.get("/api/simpleWeather/query", { 
  data: { 
    city: 481, 
    key: "55333d85ca99360f79d67b452b51e277" 
  } 
});
// 主动取消请求
 proxy.$http.get('/api/simpleWeather/query', { 
   data: { 
    city: 481, 
    key: "55333d85ca99360f79d67b452b51e277"
  }, 
  cancelRequest: true 
});

// 请求重发，如果请求失败，1s后除了原请求外还会重发3次
proxy.$http.get('/api/simpleWeather/query', { 
  data: { 
    city: 481, 
    key: "55333d85ca99360f79d67b452b51e277"
  }, 
  retry: 3, 
  retryDelay: 1000 
});

// 缓存请求，如果请求参数一样就不请求
proxy.$http.get('/api/simpleWeather/query', { 
  data: { 
    city: 481, 
    key: "55333d85ca99360f79d67b452b51e277" 
  }, 
  cache: true 
});

// 缓存请求：setExpireTime 为缓存有效时间ms
proxy.$http.get('/api/simpleWeather/query', { 
  data: { 
    city: 481, 
    key: "55333d85ca99360f79d67b452b51e277" 
  }, 
  cache: true, 
  setExpireTime: 30000 
}); 

```