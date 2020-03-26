(window.webpackJsonp=window.webpackJsonp||[]).push([[26],{258:function(s,a,t){"use strict";t.r(a);var n=t(28),e=Object(n.a)({},(function(){var s=this,a=s.$createElement,t=s._self._c||a;return t("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[t("h1",{attrs:{id:"rn修改应用版本号"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#rn修改应用版本号"}},[s._v("#")]),s._v(" rn修改应用版本号")]),s._v(" "),t("h2",{attrs:{id:"一般情况下修改版本号需要去分别设置android端和ios端，但是我们可以通过设置package-json的版本，然后来读取其值"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#一般情况下修改版本号需要去分别设置android端和ios端，但是我们可以通过设置package-json的版本，然后来读取其值"}},[s._v("#")]),s._v(" 一般情况下修改版本号需要去分别设置Android端和ios端，但是我们可以通过设置package.json的版本，然后来读取其值")]),s._v(" "),t("h3",{attrs:{id:"一、android端设置"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#一、android端设置"}},[s._v("#")]),s._v(" 一、Android端设置")]),s._v(" "),t("h4",{attrs:{id:"_1、在-android-app-build-gradle"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_1、在-android-app-build-gradle"}},[s._v("#")]),s._v(" 1、在 "),t("code",[s._v("android/app/build.gradle")]),s._v(" :")]),s._v(" "),t("div",{staticClass:"language-gradle line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[s._v('import java.io.File;\nimport groovy.json.JsonSlurper \n\ndef getAppVersion() {\n    def inputFile = new File("../package.json")\n    def packageJson = new JsonSlurper().parseText(inputFile.text)\n    return packageJson["version"]\n}\n \ndef appVersion = getAppVersion()\n\n...\n\ndefaultConfig {\n    ...\n    versionName appVersion\n}\n')])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br"),t("span",{staticClass:"line-number"},[s._v("4")]),t("br"),t("span",{staticClass:"line-number"},[s._v("5")]),t("br"),t("span",{staticClass:"line-number"},[s._v("6")]),t("br"),t("span",{staticClass:"line-number"},[s._v("7")]),t("br"),t("span",{staticClass:"line-number"},[s._v("8")]),t("br"),t("span",{staticClass:"line-number"},[s._v("9")]),t("br"),t("span",{staticClass:"line-number"},[s._v("10")]),t("br"),t("span",{staticClass:"line-number"},[s._v("11")]),t("br"),t("span",{staticClass:"line-number"},[s._v("12")]),t("br"),t("span",{staticClass:"line-number"},[s._v("13")]),t("br"),t("span",{staticClass:"line-number"},[s._v("14")]),t("br"),t("span",{staticClass:"line-number"},[s._v("15")]),t("br"),t("span",{staticClass:"line-number"},[s._v("16")]),t("br"),t("span",{staticClass:"line-number"},[s._v("17")]),t("br")])]),t("h3",{attrs:{id:"二、ios端设置"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#二、ios端设置"}},[s._v("#")]),s._v(" 二、Ios端设置")]),s._v(" "),t("h4",{attrs:{id:"_1、找到-project-name-targets-build-phases-添加run-script"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_1、找到-project-name-targets-build-phases-添加run-script"}},[s._v("#")]),s._v(" 1、找到:"),t("code",[s._v("PROJECT_NAME=>TARGETS->Build Phases")]),s._v("->添加"),t("code",[s._v("Run Script")])]),s._v(" "),t("p",[t("img",{attrs:{src:"https://i.loli.net/2019/12/04/fO2iP5jVFAcmlgh.png",alt:"20191204143700.png"}}),s._v("\n替换")]),s._v(" "),t("h4",{attrs:{id:"_2、插入bash"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_2、插入bash"}},[s._v("#")]),s._v(" 2、插入bash")]),s._v(" "),t("div",{staticClass:"language-bash line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-bash"}},[t("code",[t("span",{pre:!0,attrs:{class:"token assign-left variable"}},[s._v("PACKAGE_VERSION")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),t("span",{pre:!0,attrs:{class:"token variable"}},[t("span",{pre:!0,attrs:{class:"token variable"}},[s._v("$(")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("cat")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("..")]),s._v("/package.json "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("grep")]),s._v(" version "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("head")]),s._v(" -1 "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("awk")]),s._v(" -F: "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'{ print "),t("span",{pre:!0,attrs:{class:"token variable"}},[s._v("$2")]),s._v(" }'")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("sed")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'s/["),t("span",{pre:!0,attrs:{class:"token entity",title:'\\"'}},[s._v('\\"')]),s._v(",]//g'")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("tr")]),s._v(" -d "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'[[:space:]]'")]),t("span",{pre:!0,attrs:{class:"token variable"}},[s._v(")")])]),s._v("\n\n/usr/libexec/PlistBuddy -c "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"Set :CFBundleShortVersionString '),t("span",{pre:!0,attrs:{class:"token variable"}},[s._v("$PACKAGE_VERSION")]),s._v('"')]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"'),t("span",{pre:!0,attrs:{class:"token variable"}},[s._v("${PROJECT_DIR}")]),s._v("/"),t("span",{pre:!0,attrs:{class:"token variable"}},[s._v("${INFOPLIST_FILE}")]),s._v('"')]),s._v("\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br")])])])}),[],!1,null,null,null);a.default=e.exports}}]);