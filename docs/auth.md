# 认证模块 API 文档

## 基础信息

- **基础 URL**: `/api/auth`
- **Content-Type**: `application/json`

---

## 接口列表

### 1. 用户注册

**POST** `/register`

用户注册时会自动创建默认的分类数据。

#### 请求参数

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | 是 | 用户名，3-20个字符 |
| password | string | 是 | 密码，最少6个字符 |

#### 请求示例

```json
{
  "username": "testuser",
  "password": "123456"
}
```

#### 成功响应 (201)

```json
{
  "user": {
    "id": 1,
    "username": "testuser",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "a1b2c3d4e5f6...",
    "expiresIn": 7200,
    "tokenType": "Bearer"
  }
}
```

#### 错误响应 (400)

```json
{
  "error": "用户名已存在"
}
```

---

### 2. 用户登录

**POST** `/login`

#### 请求参数

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | 是 | 用户名 |
| password | string | 是 | 密码 |

#### 请求示例

```json
{
  "username": "testuser",
  "password": "123456"
}
```

#### 成功响应 (200)

```json
{
  "user": {
    "id": 1,
    "username": "testuser",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "a1b2c3d4e5f6...",
    "expiresIn": 7200,
    "tokenType": "Bearer"
  }
}
```

#### 错误响应 (400)

```json
{
  "error": "用户名或密码错误"
}
```

---

### 3. 刷新 Token

**POST** `/refresh`

使用刷新令牌获取新的访问令牌，同时会生成新的刷新令牌。

#### 请求参数

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| refreshToken | string | 是 | 刷新令牌 |

#### 请求示例

```json
{
  "refreshToken": "a1b2c3d4e5f6..."
}
```

#### 成功响应 (200)

```json
{
  "user": {
    "id": 1,
    "username": "testuser",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "f6e5d4c3b2a1...",
    "expiresIn": 7200,
    "tokenType": "Bearer"
  }
}
```

#### 错误响应 (401)

```json
{
  "error": "无效的刷新令牌"
}
```

---

### 4. 用户登出

**POST** `/logout`

登出当前设备，使该设备的刷新令牌失效。

#### 请求参数

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| refreshToken | string | 是 | 刷新令牌 |

#### 请求示例

```json
{
  "refreshToken": "a1b2c3d4e5f6..."
}
```

#### 成功响应 (200)

```json
{
  "message": "登出成功"
}
```

---

### 5. 全设备登出

**POST** `/logout-all`

从所有设备登出，使该用户的所有刷新令牌失效。

#### 请求头

```
Authorization: Bearer <accessToken>
```

#### 成功响应 (200)

```json
{
  "message": "已从所有设备登出"
}
```

#### 错误响应 (401)

```json
{
  "error": "未提供认证令牌"
}
```

---

### 6. 获取用户信息

**GET** `/profile`

获取当前登录用户的基本信息。

#### 请求头

```
Authorization: Bearer <accessToken>
```

#### 成功响应 (200)

```json
{
  "userId": 1,
  "username": "testuser"
}
```

#### 错误响应 (401)

```json
{
  "error": "令牌已过期",
  "code": "TOKEN_EXPIRED"
}
```

---

## Token 机制说明

### Access Token
- **有效期**: 2 小时
- **用途**: API 请求鉴权
- **存储位置**: 前端内存或 localStorage

### Refresh Token
- **有效期**: 30 天
- **用途**: 刷新 Access Token
- **存储位置**: 建议存储在 httpOnly cookie 或 localStorage

### 使用流程

1. **登录/注册**后获取 `accessToken` 和 `refreshToken`
2. **请求 API**时在请求头添加：`Authorization: Bearer <accessToken>`
3. **Token 过期**时（返回 401 且 code 为 TOKEN_EXPIRED）：
   - 使用 `refreshToken` 调用 `/refresh` 接口
   - 获取新的 `accessToken` 和 `refreshToken`
   - 使用新 token 重试原请求

---

## 错误码说明

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未认证或令牌无效/过期 |
| 500 | 服务器内部错误 |
