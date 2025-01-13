# 规范git提交利器指南

## 推荐使用 cz-git

这种提交格式不香吗？ 😍

![20191022165222.png](https://i.loli.net/2019/10/22/OHbd5vM1uQz69A4.png)

### 一、全局安装

```bish
npm install -g commitizen cz-git
```

run

```bish
git cz
```

![20211102141718](https://i.loli.net/2021/11/02/mwXbWiQ8RfPO2Gl.png)

### 二、本地安装

```bish
npm install commitizen cz-git -D
```

package.json:

```json
{
  "config": {
    "commitizen": {
      "path": "cz-git"
    }
  },
}
```

run

```bish
git cz
```

## `.czrc` 自定义配置

```js
{
  "path": "cz-git",
  "alias": {
  },
  "messages": {
    "type": "Select the type of change that you're committing:",
    "scope": "Denote the SCOPE of this change (optional):",
    "customScope": "Denote the SCOPE of this change:",
    "subject": "Write a SHORT, IMPERATIVE tense description of the change:\n",
    "body": "Provide a LONGER description of the change (optional). Use \"|\" to break new line:\n",
    "footer": "List any ISSUES by this change. E.g.: #31, #34:\n",
    "confirmCommit": "Are you sure you want to proceed with the commit above?"
  },
  "types": [
    {
      "value": "feat",
      "name": "✨ feat:     A new feature",
      "emoji": "✨"
    },
    {
      "value": "fix",
      "name": "🐛 fix:      A bug fix",
      "emoji": "🐛"
    },
    {
      "value": "docs",
      "name": "📝 docs:     Documentation only changes",
      "emoji": "📝"
    },
    {
      "value": "style",
      "name": "💄 style:    Changes that do not affect the meaning of the code",
      "emoji": "💄"
    },
    {
      "value": "refactor",
      "name": "💡 refactor: A code change that neither fixes a bug nor adds a feature",
      "emoji": "💡"
    },
    {
      "value": "perf",
      "name": "⚡️ perf:     A code change that improves performance",
      "emoji": "⚡️"
    },
    {
      "value": "test",
      "name": "✅ test:     Adding missing tests or correcting existing tests",
      "emoji": "✅"
    },
    {
      "value": "build",
      "name": "📦️ build:    Changes that affect the build system or external dependencies",
      "emoji": "📦️"
    },
    {
      "value": "ci",
      "name": "🎡 ci:       Changes to our CI configuration files and scripts",
      "emoji": "🎡"
    },
    {
      "value": "chore",
      "name": "🎨 chore:    Other changes that don't modify src or test files",
      "emoji": "🎨"
    },
    {
      "value": "revert",
      "name": "revert:   Reverts a previous commit",
      "emoji": "⏪️"
    }
  ],
  "useEmoji": true,
  "emojiAlign": "center",
  "useAI": false,
  "aiNumber": 1,
  "themeColorCode": "",
  "scopes": [],
  "allowCustomScopes": true,
  "allowEmptyScopes": true,
  "customScopesAlign": "bottom",
  "customScopesAlias": "custom",
  "emptyScopesAlias": "empty",
  "upperCaseSubject": false,
  "markBreakingChangeMode": false,
  "allowBreakingChanges": [
    "feat",
    "fix"
  ],
  "breaklineNumber": 100,
  "breaklineChar": "|",
  "skipQuestions": [
    "body",
    "breaking",
    "footer",
    "footerPrefixesSelect"
  ],
  "issuePrefixes": [
    {
      "value": "closed",
      "name": "closed:   ISSUES has been processed"
    }
  ],
  "customIssuePrefixAlign": "top",
  "emptyIssuePrefixAlias": "skip",
  "customIssuePrefixAlias": "custom",
  "allowCustomIssuePrefix": true,
  "allowEmptyIssuePrefix": true,
  "confirmColorize": true,
  "minSubjectLength": 0,
  "defaultBody": "",
  "defaultIssues": "",
  "defaultScope": "",
  "defaultSubject": ""
}
```
