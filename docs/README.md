# MoneyBackend API 文档

## 项目简介

MoneyBackend 是一个记账应用的后端 API 服务，提供用户认证、分类管理和记账记录等功能。

## 基础信息

- **基础 URL**: `http://localhost:9876`
- **Content-Type**: `application/json`
- **数据库**: PostgreSQL

## 文档模块

| 模块 | 说明 | 文档链接 |
|------|------|----------|
| [认证模块](./auth.md) | 用户注册、登录、Token 刷新、登出 | [查看](./auth.md) |
| [分类模块](./categories.md) | 收支分类的增删改查 | [查看](./categories.md) |
| [记账记录模块](./records.md) | 记账记录的增删改查、统计 | [查看](./records.md) |

## 快速开始

### 1. 注册账号

```bash
POST /api/auth/register
{
  "username": "yourname",
  "password": "yourpassword"
}
```

### 2. 登录获取 Token

```bash
POST /api/auth/login
{
  "username": "yourname",
  "password": "yourpassword"
}
```

### 3. 使用 Token 访问其他接口

在请求头中添加：

```
Authorization: Bearer <accessToken>
```

## 认证说明

所有非认证接口都需要在请求头中携带 Access Token：

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

当 Access Token 过期时（返回 401 且 code 为 TOKEN_EXPIRED），使用 Refresh Token 调用 `/api/auth/refresh` 获取新的 Token。

## 错误码说明

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未认证或令牌无效/过期 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

## 环境配置

创建 `.env` 文件：

```env
DATABASE_URL="postgresql://username:password@localhost:5432/moneydb"
JWT_SECRET="your-secret-key-change-this-in-production"
JWT_EXPIRES_IN="2h"
REFRESH_TOKEN_EXPIRES_IN="30d"
```
