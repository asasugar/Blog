# 带你掌握 Git 命令

## 基本概念

- 版本库`.git`

  - 当我们使用 git 管理文件时，比如 git init 时，这个时候，会多一个.git 文件，我们把这个文件称之为版本库。
  - .git 文件另外一个作用就是它在创建的时候，会自动创建 master 分支，并且将 HEAD 指针指向 master 分支

* 工作区

  - 本地项目存放文件的位置
  - 可以理解成图上的 workspace

- 暂存区 (Index/Stage)

  - 顾名思义就是暂时存放文件的地方，通过是通过`add`命令将工作区的文件添加到缓冲区

* 本地仓库（Repository）

  - 通常情况下，我们使用 commit 命令可以将暂存区的文件添加到本地仓库
  - 通常而言，HEAD 指针指向的就是 master 分支

* 远程仓库（Remote）

  - 第三方托管如：github、gitlab、码云里托管的项目，就是一个远程仓库
  - 通常我们使用 clone 命令将远程仓库代码拷贝下来，本地代码更新后，通过`push`推送给远程仓库

## 配置命令

- 配置用户名

  ```bish
  git config --global user.name "your name"
  ```

- 配置用户邮箱

  ```bish
  git config --global user.email "youremail@github.com"
  ```

- 列出当前配置

  ```bish
  git config --list
  ```

- 列出 Repository 配置

  ```bish
  git config --local --list
  ```

- 列出全局配置

  ```bish
  git config --global --list
  ```

- 列出系统配置

  ```bish
  git config --system --list
  ```

## 分支管理

- 查看本地分支

  ```bish
  git branch
  ```

- 查看远程分支

  ```bish
  git branch -r
  ```

- 查看本地和远程分支

  ```bish
  git branch -a
  ```

- 切换到其他分支

  ```bish
  git checkout <branch-name>
  ```

- 基于当前分支创建并切换到新建分支

  ```bish
  git checkout -b <branch-name>
  ```

- 拉取远程分支并创建本地分支

  ```bish
  git checkout -b 本地分支名x origin/远程分支名x

  // 另外一种方式,也可以完成这个操作。
  git fetch origin <branch-name>:<local-branch-name>
  ```

- 重命名本地分支

  ```bish
  git branch -m <oldbranch-name> <newbranch-name>
  ```

- 当前分支与指定分支合并

  ```bish
  git merge <branch-name>
  ```

- 删除本地分支

  ```bish
  git branch -d <branch-name>
  ```

- 删除远程分支

  ```bish
  git push origin -d <branch-name>
  ```

- 重命名本地并推送至远程分支

  ```bish
  git branch -m <oldbranch-name> <newbranch-name>
  git push origin :<oldbranch-name>
  git push --set-upstream origin <newbranch-name>
  ```

## stash 储藏代码

- 场景：当你的功能还没开发完不能 commit 但是现在需要 rebase 下 master,缓存区的代码该咋办？当你写了几行代码，但是现在需要切到其他分支去改 bug，缓存区的代码该咋办？
  用 git stash 就好啦

- git stash 储藏代码

- git stash pop 恢复到工作区和缓存区，会移除 stashid

- git stash list 查看当前储藏区

- git stash save 'msg' 带备注储藏

- git stash show -p 显示最新的储藏文件具体改动

- git stash show -p stashname 显示指定的储藏文件具体改动

## 撤销

- 撤销工作区修改

  ```bish
  git checkout --
  ```

- 暂存区文件撤销 (不覆盖工作区)

  ```bish
  git reset HEAD
  ```

- 版本回退

  - 显示从最近到最远的提交日志

    ```bish
    git log
    ```

  - 回退到指定 commit-id 版本

    ```bish
    git reset --(soft | mixed | hard ) <commit-id> // 底下会列出三者的区别
    // 举个例子👇
    git reset --hard 7222c8f6be2d663982faa98dffe2647966b438b1
    ```

  - 推送到本地到远程仓库：让远程仓库代码和你本地一样，到当前你本地的版本

    ```bish
    git push origin HEAD --force
    ```

  - 这个时候突然又发现不需要回退了，刚才那些消失的代码又要重新找回来了
    `bish git reflog git reset --(soft | mixed | hard ) <commit-id>`
    > `revert` 的语法和命令和 `reset` 一致。但是产生的实际效果会有不同,从需要提交到远程分支的角度来讲，reset 能够“毁尸灭迹”，不让别人发现我们曾经错误的合并过分支（注：多人协作中，需要谨慎使用）；revert 则会将合并分支和撤回记录一并显示在远程提交记录上

## soft | mixed | hard

- 已将更改提交到本地，需要撤回提交

  - 语法： `git reset --soft [<commit-id>/HEAD~n>]`
  - 命令：`git reset --soft HEAD~1`

- 用新的更改替换撤回的更改

  - 语法： `git reset --mixed [<commit-id>/HEAD~n>]`
  - 命令：`git reset --mixed HEAD~1`

- 本地提交了错误的文件到了仓库

  - 语法： `git reset --reset [<commit-id>/HEAD~n>]`
  - 命令：`git reset --reset HEAD~1`

## 分支命名

- master 分支

  - 主分支，用于部署生产环境的分支，确保稳定性
  - master 分支一般由 develop 以及 hotfix 分支合并，任何情况下都不能直接修改代码

- develop 分支

  - develop 为开发分支，通常情况下，保存最新完成以及 bug 修复后的代码
  - 开发新功能时，feature 分支都是基于 develop 分支下创建的

- feature 分支

  - 开发新功能，基本上以 develop 为基础创建 feature 分支
  - 分支命名：feature/ 开头的为特性分支， 命名规则: feature/user_module、 feature/cart_module

- release 分支

  - release 为预上线分支，发布提测阶段，会 release 分支代码为基准提测

- hotfix 分支

  - 线上出现紧急问题时，需要及时修复，以 master 分支为基线，创建 hotfix 分支，修复完成后，需要合并到 master 分支和 develop 分支
  - 分支命名：hotfix/ 开头的为修复分支，它的命名规则与 feature 分支类似
