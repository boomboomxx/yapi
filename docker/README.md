# docker-YApi

在 [Docker](https://www.docker.com/) 中运行 [YApi](https://github.com/YMFE/yapi)。

---

<!-- TOC depthFrom:2 -->
- [如何配置](#如何配置)
  - [通过 config.json 或者 config.js 配置（不推荐）](#通过-configjson-或者-configjs-配置不推荐)
  - [通过环境变量配置（推荐）](#通过环境变量配置推荐)
    - [基础配置](#基础配置)
    - [数据库配置](#数据库配置)
    - [邮件配置](#邮件配置)
    - [LDAP 登录配置](#ldap-登录配置)
    - [插件配置](#插件配置)
- [内置插件](#内置插件)
- [YApi 相关资源推荐](#yapi-相关资源推荐)
- [许可](#许可)

<!-- /TOC -->
## 如何配置


### 通过 config.json 或者 config.js 配置（不推荐）

`config.json` 是 YApi 官方支持的配置文件，`config.js` 是 `docker-YApi` 扩展支持的配置文件，其实就是将 JSON 数据写成了更简洁的 JavaScript 对象。

你可通过将外部的 `config.json` 或 `config.js` 配置文件映射进容器内部来使用它们：

```bash
./config.json:/yapi/config.json
./config.js:/yapi/config.js
```

### 通过环境变量配置（推荐）

通过环境变量配置的选项会覆盖通过 `config.json` 或者 `config.js` 配置的选项。

#### 基础配置

| 环境变量名称        | 类型    | 说明                                                                                           | 示例                            |
| ------------------- | ------- | ---------------------------------------------------------------------------------------------- | ------------------------------- |
| YAPI_ADMIN_ACCOUNT  | string  | 管理员账号（邮箱）                                                                             | admin@foo.bar                   |
| YAPI_ADMIN_PASSWORD | string  | 管理员密码                                                                                     | adm1n                           |
| YAPI_CLOSE_REGISTER | boolean | 是否关闭注册，由于 docker-YApi 已[内置相关插件](#内置插件)，你可在关闭注册后在后台手动添加用户 | true                            |
| YAPI_NPM_REGISTRY   | string  | npm 源，目前仅在安装插件时使用，默认官方源，国内可以设为淘宝源加速                             | https://registry.npm.taobao.org |

#### 数据库配置

| 环境变量名称           | 类型   | 说明                                                                                                                                                                  | 示例                                                            |
| ---------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| YAPI_DB_SERVERNAME     | string | MongoDB 服务地址                                                                                                                                                      | yapi-mongo                                                      |
| YAPI_DB_PORT           | number | MongoDB 服务端口                                                                                                                                                      | 27017                                                           |
| YAPI_DB_DATABASE       | string | 使用的 MongoDB 数据库                                                                                                                                                 | yapi                                                            |
| YAPI_DB_USER           | string | 登录 MongoDB 服务的用户名                                                                                                                                             | root                                                            |
| YAPI_DB_PASS           | string | 登录 MongoDB 服务的用户密码                                                                                                                                           | r00t                                                            |
| YAPI_DB_AUTH_SOURCE    | string | MongoDB 身份认证所用库                                                                                                                                                | admin                                                           |
| YAPI_DB_CONNECT_STRING | string | 使用 MongoDB 集群时配置                                                                                                                                               | mongodb://127.0.0.100:8418,127.0.0.101:8418/yapidb?slaveOk=true |
| YAPI_DB_OPTIONS        | json   | Mongoose 连接 MongoDB 服务时的额外选项，一般不用设置。请参考: [Mongoose.prototype.connect()](https://mongoosejs.com/docs/api/mongoose.html#mongoose_Mongoose-connect) | {}                                                              |

#### 邮件配置

| 环境变量名称        | 类型    | 说明                                                                                                            | 示例                                 |
| ------------------- | ------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| YAPI_MAIL_ENABLE    | boolean | 是否启用                                                                                                        | true                                 |
| YAPI_MAIL_HOST      | string  | 邮件服务地址                                                                                                    | smtp.163.com                         |
| YAPI_MAIL_PORT      | number  | 邮件服务端口                                                                                                    | 465                                  |
| YAPI_MAIL_FROM      | string  | 发送人邮箱                                                                                                      | foo@163.com                          |
| YAPI_MAIL_AUTH_USER | string  | 登录邮件服务的用户名                                                                                            | bar@163.com                          |
| YAPI_MAIL_AUTH_PASS | string  | 登录邮件服务的用户密码                                                                                          | f00bar                               |
| YAPI_MAIL_OPTIONS   | json    | 传递给 Nodemailer 的额外选项，一般不用设置。请参考：[Nodemailer > SMTP transport](https://nodemailer.com/smtp/) | {"tls":{"rejectUnauthorized":false}} |

#### LDAP 登录配置

[点击查看 YApi 仓库下 LDAP 相关的 issues 👉](https://github.com/YMFE/yapi/issues?utf8=%E2%9C%93&q=ldap)

| 环境变量名称                    | 类型    | 说明                                                                                                                                                             | 示例                   |
| ------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| YAPI_LDAP_LOGIN_ENABLE          | boolean | 是否启用                                                                                                                                                         | true                   |
| YAPI_LDAP_LOGIN_SERVER          | string  | LDAP 服务地址                                                                                                                                                    | ldap://ldap.foo.bar    |
| YAPI_LDAP_LOGIN_BASE_DN         | string  | 登录 LDAP 服务的用户名                                                                                                                                           | cn=admin,dc=foo,dc=bar |
| YAPI_LDAP_LOGIN_BIND_PASSWORD   | string  | 登录 LDAP 服务的用户密码                                                                                                                                         | f00bar                 |
| YAPI_LDAP_LOGIN_SEARCH_DN       | string  | 查询用户数据的路径                                                                                                                                               | ou=users,dc=foo,dc=bar |
| YAPI_LDAP_LOGIN_SEARCH_STANDARD | string  | 支持两种值：<br />1、前端登录账号对应的查询字段，如：`mail`、`uid` 等；<br />2、自定义查询条件，其中 `%s` 会被前端登录账号替换，如：`&(objectClass=user)(cn=%s)` | -                      |
| YAPI_LDAP_LOGIN_EMAIL_POSTFIX   | string  | 登录邮箱后缀                                                                                                                                                     | @163.com               |
| YAPI_LDAP_LOGIN_EMAIL_KEY       | string  | LDAP 数据库存储用户邮箱的字段                                                                                                                                    | mail                   |
| YAPI_LDAP_LOGIN_USERNAME_KEY    | string  | LDAP 数据库存储用户名的字段                                                                                                                                      | name                   |

#### 插件配置

| 环境变量名称 | 类型 | 说明                                                                                                                                                                                                                                                                                                                                                                                                                               | 示例                             |
| ------------ | ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| YAPI_PLUGINS | json | 要使用的插件列表。[点击查看开源 YApi 插件列表 →](https://www.npmjs.com/search?q=yapi-plugin-)<br /><br />**配置项数据格式：**<br />{<br /> "name": "插件名称，必须去除前缀 yapi-plugin-",<br /> "options": "插件配置，没有配置则不必设置"<br />}<br /><br />**注意：**<br />安装插件会运行 YApi 自带的打包命令，其内存消耗较大，因此，在安装插件时，物理机可用内存最好大于等于 `4GB`，否则，易出现内存溢出错误，导致插件安装失败。 | [{"name":"gitlab","options":{}}] |

## 内置插件

为 YApi 安装插件是一件异常缓慢且易因服务器配置不够而出错的事情，因此 docker-YApi 内置了以下插件，希望能减少点不必要的麻烦：

- [yapi-plugin-add-user](https://github.com/congqiu/yapi-plugin-add-user): 支持管理员直接通过邮箱添加用户。 <作者: [@congqiu](https://github.com/congqiu)>

## 如何重启

> 升级不会对原有数据造成任何影响！

## 查看日志

如果出现意外情况，你可通过以下命令查看运行日志：

```bash
docker-compose logs yapi-web
```

## YApi 相关资源推荐

- [YApi-X](https://github.com/fjc0k/YApi-X#readme)

  YApi 二次开发版，进行了很多功能上的增强，原生支持 Docker 安装。

- [YApi-X 浏览器插件](https://github.com/fjc0k/YApi-X/tree/master/chrome-extension#readme)

  为 YApi-X 开发的浏览器跨域与文件上传插件，同时支持 YApi 官方版。

- [YApi to TypeScript](https://github.com/fjc0k/yapi-to-typescript#readme)

  根据 YApi 的接口定义生成 TypeScript 的接口类型及其请求函数代码，同时支持生成 React Hooks 代码。

## 许可
xx © MIT
