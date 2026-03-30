# MoneyBackend API 文档

## 基础信息

- **基础 URL**: `http://localhost:9876` 或 `http://你的IP:9876`
- **Content-Type**: `application/json`

---

## 认证接口

### 1. 用户注册

**POST** `/api/auth/register`

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

**POST** `/api/auth/login`

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

**POST** `/api/auth/refresh`

使用刷新令牌获取新的访问令牌。

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

**POST** `/api/auth/logout`

登出当前设备。

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

**POST** `/api/auth/logout-all`

从所有设备登出（需要认证）。

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

**GET** `/api/auth/profile`

获取当前登录用户信息（需要认证）。

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

## 健康检查

### 服务健康状态

**GET** `/health`

#### 成功响应 (200)

```json
{
  "status": "healthy",
  "database": "connected"
}
```

#### 错误响应 (500)

```json
{
  "status": "unhealthy",
  "database": "disconnected"
}
```

---

## 认证说明

### Token 机制

1. **Access Token**: 有效期 2 小时，用于 API 鉴权
2. **Refresh Token**: 有效期 30 天，用于刷新 Access Token

### 使用方式

在请求头中添加：

```
Authorization: Bearer <accessToken>
```

### Token 刷新流程

1. 当 Access Token 过期时，使用 Refresh Token 调用 `/api/auth/refresh`
2. 获取新的 Access Token 和 Refresh Token
3. 30 天内活跃可保持登录状态

### 错误码说明

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未认证或令牌无效 |
| 500 | 服务器内部错误 |

---

## 密码安全

- 密码使用 `bcryptjs` 加密存储
- Salt Rounds: 12
- 密码永不以明文存储或传输（建议使用 HTTPS）
