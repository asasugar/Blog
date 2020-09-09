(window.webpackJsonp=window.webpackJsonp||[]).push([[16],{258:function(e,s,a){"use strict";a.r(s);var t=a(17),i=Object(t.a)({},(function(){var e=this,s=e.$createElement,a=e._self._c||s;return a("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[a("h1",{attrs:{id:"带你掌握git命令"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#带你掌握git命令"}},[e._v("#")]),e._v(" 带你掌握Git命令")]),e._v(" "),a("h2",{attrs:{id:"基本概念"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#基本概念"}},[e._v("#")]),e._v(" 基本概念")]),e._v(" "),a("ul",[a("li",[a("p",[e._v("版本库"),a("code",[e._v(".git")])]),e._v(" "),a("ul",[a("li",[e._v("当我们使用git管理文件时，比如git init时，这个时候，会多一个.git文件，我们把这个文件称之为版本库。")]),e._v(" "),a("li",[e._v(".git文件另外一个作用就是它在创建的时候，会自动创建master分支，并且将HEAD指针指向master分支")])])]),e._v(" "),a("li",[a("p",[e._v("工作区")]),e._v(" "),a("ul",[a("li",[e._v("本地项目存放文件的位置")]),e._v(" "),a("li",[e._v("可以理解成图上的workspace")])])]),e._v(" "),a("li",[a("p",[e._v("暂存区 (Index/Stage)")]),e._v(" "),a("ul",[a("li",[e._v("顾名思义就是暂时存放文件的地方，通过是通过"),a("code",[e._v("add")]),e._v("命令将工作区的文件添加到缓冲区")])])]),e._v(" "),a("li",[a("p",[e._v("本地仓库（Repository）")]),e._v(" "),a("ul",[a("li",[e._v("通常情况下，我们使用commit命令可以将暂存区的文件添加到本地仓库")]),e._v(" "),a("li",[e._v("通常而言，HEAD指针指向的就是master分支")])])]),e._v(" "),a("li",[a("p",[e._v("远程仓库（Remote）")]),e._v(" "),a("ul",[a("li",[e._v("第三方托管如：github、gitlab、码云里托管的项目，就是一个远程仓库")]),e._v(" "),a("li",[e._v("通常我们使用clone命令将远程仓库代码拷贝下来，本地代码更新后，通过"),a("code",[e._v("push")]),e._v("推送给远程仓库")])])])]),e._v(" "),a("h2",{attrs:{id:"配置命令"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#配置命令"}},[e._v("#")]),e._v(" 配置命令")]),e._v(" "),a("ul",[a("li",[a("p",[e._v("配置用户名")]),e._v(" "),a("div",{staticClass:"language-bish line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v('git config --global user.name "your name"\n')])]),e._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[e._v("1")]),a("br")])])]),e._v(" "),a("li",[a("p",[e._v("配置用户邮箱")]),e._v(" "),a("div",{staticClass:"language-bish line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v('git config --global user.email "youremail@github.com"\n')])]),e._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[e._v("1")]),a("br")])])]),e._v(" "),a("li",[a("p",[e._v("列出当前配置")]),e._v(" "),a("div",{staticClass:"language-bish line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("git config --list   \n")])]),e._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[e._v("1")]),a("br")])])]),e._v(" "),a("li",[a("p",[e._v("列出Repository配置")]),e._v(" "),a("div",{staticClass:"language-bish line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("git config --local --list\n")])]),e._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[e._v("1")]),a("br")])])]),e._v(" "),a("li",[a("p",[e._v("列出全局配置")]),e._v(" "),a("div",{staticClass:"language-bish line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("git config --global --list\n")])]),e._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[e._v("1")]),a("br")])])]),e._v(" "),a("li",[a("p",[e._v("列出系统配置")]),e._v(" "),a("div",{staticClass:"language-bish line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("git config --system --list  \n")])]),e._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[e._v("1")]),a("br")])])])]),e._v(" "),a("h2",{attrs:{id:"分支管理"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#分支管理"}},[e._v("#")]),e._v(" 分支管理")]),e._v(" "),a("ul",[a("li",[a("p",[e._v("查看本地分支")]),e._v(" "),a("div",{staticClass:"language-bish line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("git branch\n")])]),e._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[e._v("1")]),a("br")])])]),e._v(" "),a("li",[a("p",[e._v("查看远程分支")]),e._v(" "),a("div",{staticClass:"language-bish line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("git branch -r\n")])]),e._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[e._v("1")]),a("br")])])]),e._v(" "),a("li",[a("p",[e._v("查看本地和远程分支")]),e._v(" "),a("div",{staticClass:"language-bish line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("git branch -a\n")])]),e._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[e._v("1")]),a("br")])])]),e._v(" "),a("li",[a("p",[e._v("切换到其他分支")]),e._v(" "),a("div",{staticClass:"language-bish line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("git checkout <branch-name>\n")])]),e._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[e._v("1")]),a("br")])])]),e._v(" "),a("li",[a("p",[e._v("基于当前分支创建并切换到新建分支")]),e._v(" "),a("div",{staticClass:"language-bish line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("git checkout -b <branch-name>\n")])]),e._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[e._v("1")]),a("br")])])]),e._v(" "),a("li",[a("p",[e._v("拉取远程分支并创建本地分支")]),e._v(" "),a("div",{staticClass:"language-bish line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("git checkout -b 本地分支名x origin/远程分支名x\n\n// 另外一种方式,也可以完成这个操作。\ngit fetch origin <branch-name>:<local-branch-name>\n")])]),e._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[e._v("1")]),a("br"),a("span",{staticClass:"line-number"},[e._v("2")]),a("br"),a("span",{staticClass:"line-number"},[e._v("3")]),a("br"),a("span",{staticClass:"line-number"},[e._v("4")]),a("br")])])]),e._v(" "),a("li",[a("p",[e._v("重命名分支")]),e._v(" "),a("div",{staticClass:"language-bish line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("git branch -m <oldbranch-name> <newbranch-name>\n")])]),e._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[e._v("1")]),a("br")])])]),e._v(" "),a("li",[a("p",[e._v("当前分支与指定分支合并")]),e._v(" "),a("div",{staticClass:"language-bish line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("git merge <branch-name>\n")])]),e._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[e._v("1")]),a("br")])])]),e._v(" "),a("li",[a("p",[e._v("删除本地分支")]),e._v(" "),a("div",{staticClass:"language-bish line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("git branch -d <branch-name>\n")])]),e._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[e._v("1")]),a("br")])])]),e._v(" "),a("li",[a("p",[e._v("删除远程分支")]),e._v(" "),a("div",{staticClass:"language-bish line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("git push origin -d <branch-name>\n")])]),e._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[e._v("1")]),a("br")])])])]),e._v(" "),a("h2",{attrs:{id:"撤销"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#撤销"}},[e._v("#")]),e._v(" 撤销")]),e._v(" "),a("ul",[a("li",[a("p",[e._v("撤销工作区修改")]),e._v(" "),a("div",{staticClass:"language-bish line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("git checkout --\n")])]),e._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[e._v("1")]),a("br")])])]),e._v(" "),a("li",[a("p",[e._v("暂存区文件撤销 (不覆盖工作区)")]),e._v(" "),a("div",{staticClass:"language-bish line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("git reset HEAD\n")])]),e._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[e._v("1")]),a("br")])])]),e._v(" "),a("li",[a("p",[e._v("版本回退")]),e._v(" "),a("ul",[a("li",[a("p",[e._v("显示从最近到最远的提交日志")]),e._v(" "),a("div",{staticClass:"language-bish line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("git log\n")])]),e._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[e._v("1")]),a("br")])])]),e._v(" "),a("li",[a("p",[e._v("回退到指定commit-id版本")]),e._v(" "),a("div",{staticClass:"language-bish line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("git reset --(soft | mixed | hard ) <commit-id> // 底下会列出三者的区别\n// 举个例子👇\ngit reset --hard 7222c8f6be2d663982faa98dffe2647966b438b1\n")])]),e._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[e._v("1")]),a("br"),a("span",{staticClass:"line-number"},[e._v("2")]),a("br"),a("span",{staticClass:"line-number"},[e._v("3")]),a("br")])])]),e._v(" "),a("li",[a("p",[e._v("推送到本地到远程仓库：让远程仓库代码和你本地一样，到当前你本地的版本")]),e._v(" "),a("div",{staticClass:"language-bish line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("git push origin HEAD --force\n")])]),e._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[e._v("1")]),a("br")])])]),e._v(" "),a("li",[a("p",[e._v("这个时候突然又发现不需要回退了，刚才那些消失的代码又要重新找回来了")]),e._v(" "),a("div",{staticClass:"language-bish line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("git reflog\ngit reset --(soft | mixed | hard ) <commit-id>\n")])]),e._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[e._v("1")]),a("br"),a("span",{staticClass:"line-number"},[e._v("2")]),a("br")])])])])])]),e._v(" "),a("blockquote",[a("p",[a("code",[e._v("revert")]),e._v(" 的语法和命令和 "),a("code",[e._v("reset")]),e._v(" 一致。但是产生的实际效果会有不同,从需要提交到远程分支的角度来讲，reset 能够“毁尸灭迹”，不让别人发现我们曾经错误的合并过分支（注：多人协作中，需要谨慎使用）；revert 则会将合并分支和撤回记录一并显示在远程提交记录上")])]),e._v(" "),a("h2",{attrs:{id:"soft-mixed-hard"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#soft-mixed-hard"}},[e._v("#")]),e._v(" soft | mixed | hard")]),e._v(" "),a("ul",[a("li",[a("p",[e._v("已将更改提交到本地，需要撤回提交")]),e._v(" "),a("ul",[a("li",[e._v("语法： "),a("code",[e._v("git reset --soft [<commit-id>/HEAD~n>]")])]),e._v(" "),a("li",[e._v("命令："),a("code",[e._v("git reset --soft HEAD~1")])])])]),e._v(" "),a("li",[a("p",[e._v("用新的更改替换撤回的更改")]),e._v(" "),a("ul",[a("li",[e._v("语法： "),a("code",[e._v("git reset --mixed [<commit-id>/HEAD~n>]")])]),e._v(" "),a("li",[e._v("命令："),a("code",[e._v("git reset --mixed HEAD~1")])])])]),e._v(" "),a("li",[a("p",[e._v("本地提交了错误的文件到了仓库")]),e._v(" "),a("ul",[a("li",[e._v("语法： "),a("code",[e._v("git reset --reset [<commit-id>/HEAD~n>]")])]),e._v(" "),a("li",[e._v("命令："),a("code",[e._v("git reset --reset HEAD~1")])])])])]),e._v(" "),a("h2",{attrs:{id:"分支命名"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#分支命名"}},[e._v("#")]),e._v(" 分支命名")]),e._v(" "),a("ul",[a("li",[a("p",[e._v("master分支")]),e._v(" "),a("ul",[a("li",[e._v("主分支，用于部署生产环境的分支，确保稳定性")]),e._v(" "),a("li",[e._v("master分支一般由develop以及hotfix分支合并，任何情况下都不能直接修改代码")])])]),e._v(" "),a("li",[a("p",[e._v("develop分支")]),e._v(" "),a("ul",[a("li",[e._v("develop为开发分支，通常情况下，保存最新完成以及bug修复后的代码")]),e._v(" "),a("li",[e._v("开发新功能时，feature分支都是基于develop分支下创建的")])])]),e._v(" "),a("li",[a("p",[e._v("feature分支")]),e._v(" "),a("ul",[a("li",[e._v("开发新功能，基本上以develop为基础创建feature分支")]),e._v(" "),a("li",[e._v("分支命名：feature/ 开头的为特性分支， 命名规则: feature/user_module、 feature/cart_module")])])]),e._v(" "),a("li",[a("p",[e._v("release分支")]),e._v(" "),a("ul",[a("li",[e._v("release 为预上线分支，发布提测阶段，会release分支代码为基准提测")])])]),e._v(" "),a("li",[a("p",[e._v("hotfix分支")]),e._v(" "),a("ul",[a("li",[e._v("线上出现紧急问题时，需要及时修复，以master分支为基线，创建hotfix分支，修复完成后，需要合并到master分支和develop分支")]),e._v(" "),a("li",[e._v("分支命名：hotfix/ 开头的为修复分支，它的命名规则与 feature 分支类似")])])])])])}),[],!1,null,null,null);s.default=i.exports}}]);