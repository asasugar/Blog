# window git 生成 ssh key

## 1、安装 git

下载地址：[https://git-scm.com/](https://git-scm.com/)

## 2、右键鼠标，选中 "Git Bash here"

![20190606100744.png](https://i.loli.net/2019/06/06/5cf8757506b2b45485.png)

## 3、进入.ssh 文件夹

```bish
cd ~/.ssh/
```

如果提示 “ No such file or directory”，你可以手动的创建一个 .ssh 文件夹

```bish
mkdir ~/.ssh
```

## 4、配置全局的 name 和 email

```bish
git config --global user.name "xxj95719"
git config --global user.email "xxj95719@gmail.com"
```

## 5、生成 key

```bish
ssh-keygen -t rsa -C "xxj95719@gmail.com"
```

连续按三次回车，这里设置的密码就为空了，并且创建了 key

## 6、进入.ssh 文件夹，用编辑器打开 id_rsa.pub，复制内容

![20190606101445.png](https://i.loli.net/2019/06/06/5cf877166e90915758.png)
