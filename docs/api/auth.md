# 认证模块 API

基础路径：`/api/auth`

## 接口列表

### 1. 用户注册

注册新用户账号。

- **方法**: `POST`
- **路径**: `/api/auth/register`
- **认证**: 不需要

**请求参数**:
```json
{
  "username": "string (3-20字符，必填)",
  "password": "string (至少6位，必填)"
}
```

**响应示例**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "userId": 1,
    "username": "zhangsan"
  }
}
```

**错误码**:
- `USERNAME_EXISTS` - 用户名已存在
- `INVALID_USERNAME` - 用户名格式无效
- `INVALID_PASSWORD` - 密码格式无效

---

### 2. 用户登录

使用用户名密码登录。

- **方法**: `POST`
- **路径**: `/api/auth/login`
- **认证**: 不需要

**请求参数**:
```json
{
  "username": "string (必填)",
  "password": "string (必填)"
}
```

**响应示例**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "userId": 1,
    "username": "zhangsan"
  }
}
```

**错误码**:
- `INVALID_CREDENTIALS` - 用户名或密码错误
- `USER_NOT_FOUND` - 用户不存在

---

### 3. 刷新 Token

使用刷新令牌获取新的访问令牌。

- **方法**: `POST`
- **路径**: `/api/auth/refresh`
- **认证**: 不需要

**请求参数**:
```json
{
  "refreshToken": "string (必填)"
}
```

**响应示例**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**错误码**:
- `REFRESH_TOKEN_INVALID` - 刷新令牌无效
- `TOKEN_EXPIRED` - 令牌已过期

---

### 4. 用户登出

注销当前设备的登录状态。

- **方法**: `POST`
- **路径**: `/api/auth/logout`
- **认证**: 不需要

**请求参数**:
```json
{
  "refreshToken": "string (必填)"
}
```

**响应示例**:
```json
{
  "message": "登出成功"
}
```

---

### 5. 登出所有设备

从所有设备登出。

- **方法**: `POST`
- **路径**: `/api/auth/logout-all`
- **认证**: 需要

**请求参数**: 无

**响应示例**:
```json
{
  "message": "已从所有设备登出"
}
```

---

### 6. 获取用户信息

获取当前登录用户信息。

- **方法**: `GET`
- **路径**: `/api/auth/profile`
- **认证**: 需要

**请求参数**: 无

**响应示例**:
```json
{
  "userId": 1,
  "username": "zhangsan"
}
```

---

## Token 说明

### Access Token

- 用于访问受保护的 API 接口
- 有效期：15 分钟
- 在请求头中携带：`Authorization: Bearer <token>`

### Refresh Token

- 用于获取新的 Access Token
- 有效期：30 天
- 在刷新接口的请求体中携带

### Token 刷新机制

1. 客户端存储 Access Token 和 Refresh Token
2. Access Token 过期前，使用 Refresh Token 获取新的 Access Token
3. 如果 Refresh Token 也过期，需要重新登录
