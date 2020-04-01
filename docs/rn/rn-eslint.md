# 为rn上eslint代码检测

# 为什么要上eslint？首先可以统一代码的风格，通过制定规则，避免一些低级的编码错误，其次可以避免因为格式化问题引起的大量冲突

## 1.安装依赖包

```bish
yarn add babel-eslint eslint eslint-config-airbnb eslint-config-react-native eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-module-resolver eslint-plugin-react eslint-plugin-react-native -D
```

## 2.配置.eslintrc.js

```js
module.exports = {
  extends: ['airbnb', 'react-native'],
  parser: 'babel-eslint',
  env: {
    browser: true,
    jest: true
  },
  plugins: ['react', 'react-native', 'import', 'jsx-a11y', 'module-resolver'],
  rules: {
    'arrow-parens': 0, //箭头函数用小括号括起来
    'arrow-spacing': 0, //=>的前/后括号
    'array-bracket-spacing': [2, 'never'], // 指定数组的元素之间要以空格隔开(,后面)
    'comma-dangle': [2, 'never'],
    'comma-spacing': [2, { 'before': false, 'after': true }],  // 控制逗号前后的空格
    'import/no-unresolved': 0,
    'import/no-extraneous-dependencies': 0,
    'jsx-quotes': [2, 'prefer-double'], //强制在JSX属性（jsx-quotes）中一致使用双引号
    'no-var': 2, //对var报错
    'no-console': 0,
    'no-irregular-whitespace': 2, //不规则的空白不允许
    'no-trailing-spaces': 1, //一行结束后面有空格就发出警告
    'no-unused-vars': [2, { vars: 'all', args: 'after-used' }], // //不能有声明后未被使用的变量或参数
    'no-class-assign': 2, //禁止给类赋值
    'no-cond-assign': 2, //禁止在条件表达式中使用赋值语句
    'no-const-assign': 2, //禁止修改const声明的变量
    'no-dupe-keys': 2, //在创建对象字面量时不允许键重复
    'no-duplicate-case': 2, //switch中的case标签不能重复
    'no-dupe-args': 2, //函数参数不能重复
    'no-empty': 2, //块语句中的内容不能为空
    'no-func-assign': 2, //禁止重复的函数声明
    'no-invalid-this': 0, //禁止无效的this，只能用在构造器，类，对象字面量
    'no-redeclare': 2, //禁止重复声明变量
    'no-spaced-func': 2, //函数调用时 函数名与()之间不能有空格
    'no-this-before-super': 0, //在调用super()之前不能使用this或super
    'no-undef': 2, //不能有未定义的变量
    'no-use-before-define': 2, //未定义前不能使用
    'no-useless-constructor': 0,
    'no-unreachable': 1, //不能有无法执行的代码
    'no-mixed-spaces-and-tabs': 0, //禁止混用tab和空格
    'no-extra-boolean-cast': 0, //禁止不必要的bool转换
    'max-len': [1, 200],
    'module-resolver/use-alias': 0,
    'react-native/no-inline-styles': 1,
    'prefer-arrow-callback': 0, //比较喜欢箭头回调
    'prefer-const': 0,
    'quotes': [2, 'single'],
    'react/jsx-filename-extension': 0,
    'react/prop-types': 0,
    'react/prefer-stateless-function': 0,
    'react/sort-comp': 0,
    'react/no-did-mount-set-state': 0,
    'react/no-array-index-key': 0,
    'react/no-direct-mutation-state': 2, //防止this.state的直接变异
    'react-native/no-color-literals': 0,
    'react/forbid-prop-types': [2, { forbid: ['any'] }],
    'react/jsx-closing-bracket-location': 1, //在JSX中验证右括号位置
    'react/jsx-curly-spacing': [2, { when: 'never', children: true }], //在JSX属性和表达式中加强或禁止大括号内的空格
    'react/jsx-indent-props': [1, 2], //验证JSX中的props缩进
    'react/jsx-key': 2, //在数组或迭代器中验证JSX具有key属性
    'react/jsx-max-props-per-line': [1, { maximum: 1 }], // 限制JSX中单行上的props的最大数量
    'react/jsx-no-bind': 0, //JSX中不允许使用箭头函数和bind
    'react/jsx-no-duplicate-props': 2, //防止在JSX中重复的props
    'react/jsx-no-literals': 0, //防止使用未包装的JSX字符串
    'react/jsx-no-undef': 1, //在JSX中禁止未声明的变量
    'react/jsx-pascal-case': 0, //为用户定义的JSX组件强制使用PascalCase
    'react/jsx-sort-props': 2, //强化props按字母排序
    'react/jsx-uses-react': 1, //防止反应被错误地标记为未使用
    'react/jsx-uses-vars': 2, //防止在JSX中使用的变量被错误地标记为未使用
    'react/no-danger': 0, //防止使用危险的JSX属性
    'react/no-did-mount-set-state': 0, //防止在componentDidMount中使用setState
    'react/no-did-update-set-state': 1, //防止在componentDidUpdate中使用setState
    'react/no-direct-mutation-state': 2, //防止this.state的直接变异
    'react/no-multi-comp': 2, //防止每个文件有多个组件定义
    'react/no-set-state': 0, //防止使用setState
    'react/no-unknown-property': 2, //防止使用未知的DOM属性
    'react/prefer-es6-class': 2, //为React组件强制执行ES5或ES6类
    'react/prop-types': 0, //防止在React组件定义中丢失props验证
    'react/react-in-jsx-scope': 2, //使用JSX时防止丢失React
    'react/self-closing-comp': 0, //防止没有children的组件的额外结束标签
    'react/sort-comp': 2, //强制组件方法顺序
    'react/no-array-index-key': 0, //防止在数组中遍历中使用数组key做索引
    'react/no-deprecated': 1, //不使用弃用的方法
    'react/jsx-equals-spacing': 2, //在JSX属性中强制或禁止等号周围的空格
    'semi': [2, 'always'],//语句强制分号结尾
    'spaced-comment': 2//注释风格有空格
  },
  globals: {
    fetch: false
  },
  settings: {
    'import/parser': 'babel-eslint'
  }
};

```

## 3.配置.eslintignore忽略不需要eslit检测的文件

```
src/*.md
```

## 4.结合vscode插件`eslint`实现运行时eslint检测

- 设置扩展 `Auto Fix On Save`实现保存自动按照eslint配置格式化

- 如果vscode的settings.json中有

```json
"eslint.options": {
  "plugins": ["html"], // rn中需要注释
}
```

## 5.package.json中加入lint命令，push之前运行，检测所有代码

```json
{
  "scripts": {
    "lint": "eslint --ext .js ./src --fix"
  },
}
```
## 6.`husky` 和 `lint-staged` 实现增量 lint 检测（只检测修改的文件）

```js
# 安装依赖
yarn add husky lint-staged -D

# 配置 package.json
{
  "lint-staged": {
    "src/**/*.js": [
      "eslint --fix",
      "git add"
    ]
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
}
```

