# MoneyBackend API 文档

## 基础信息

- **基础 URL**: `http://localhost:9876` 或 `http://你的IP:9876`
- **Content-Type**: `application/json`
- **数据库**: PostgreSQL

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

---

### 2. 用户登录

**POST** `/api/auth/login`

#### 请求参数

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | 是 | 用户名 |
| password | string | 是 | 密码 |

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

---

### 3. 刷新 Token

**POST** `/api/auth/refresh`

#### 请求参数

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| refreshToken | string | 是 | 刷新令牌 |

---

### 4. 用户登出

**POST** `/api/auth/logout`

#### 请求参数

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| refreshToken | string | 是 | 刷新令牌 |

---

### 5. 全设备登出

**POST** `/api/auth/logout-all`

需要认证。

---

### 6. 获取用户信息

**GET** `/api/auth/profile`

需要认证。

---

## 分类接口

### 1. 获取支出分类列表

**GET** `/api/categories/expense`

需要认证。

#### 成功响应 (200)

```json
[
  {
    "id": "1",
    "name": "餐饮",
    "icon": "🍔",
    "type": "expense",
    "color": "#FF6B6B"
  }
]
```

---

### 2. 获取收入分类列表

**GET** `/api/categories/income`

需要认证。

---

### 3. 获取所有分类

**GET** `/api/categories`

需要认证。

#### 成功响应 (200)

```json
{
  "expense": [
    {
      "id": "1",
      "name": "餐饮",
      "icon": "🍔",
      "type": "expense",
      "color": "#FF6B6B"
    }
  ],
  "income": [
    {
      "id": "9",
      "name": "工资",
      "icon": "💰",
      "type": "income",
      "color": "#00B894"
    }
  ]
}
```

---

### 4. 创建分类

**POST** `/api/categories`

需要认证。

#### 请求参数

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 分类名称 |
| icon | string | 是 | 图标 |
| type | string | 是 | expense/income/transfer/debt/reimbursement |
| color | string | 否 | 颜色 |

---

### 5. 更新分类

**PUT** `/api/categories/:id`

需要认证。

---

### 6. 删除分类

**DELETE** `/api/categories/:id`

需要认证。

---

## 记账记录接口

### 1. 获取月度统计

**GET** `/api/records/stats?month=2024-01`

需要认证。

#### 成功响应 (200)

```json
{
  "totalExpense": 1500.00,
  "totalIncome": 5000.00,
  "budget": 5000
}
```

---

### 2. 获取最近3天记录

**GET** `/api/records/recent`

需要认证。

#### 成功响应 (200)

```json
[
  {
    "id": "1",
    "type": "expense",
    "category": "餐饮",
    "categoryIcon": "🍔",
    "amount": 35.50,
    "remark": "午餐",
    "date": "2024-01-15",
    "account": "现金"
  }
]
```

---

### 3. 获取所有记录

**GET** `/api/records?startDate=2024-01-01&endDate=2024-01-31&type=expense`

需要认证。

#### 查询参数

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| startDate | string | 否 | 开始日期 |
| endDate | string | 否 | 结束日期 |
| type | string | 否 | expense/income |

---

### 4. 创建记账记录

**POST** `/api/records`

需要认证。

#### 请求参数

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| type | string | 是 | expense/income |
| category | string | 是 | 分类名称 |
| categoryIcon | string | 是 | 分类图标 |
| amount | number | 是 | 金额 |
| remark | string | 是 | 备注 |
| date | string | 是 | 日期 |
| account | string | 是 | 账户 |

#### 请求示例

```json
{
  "type": "expense",
  "category": "餐饮",
  "categoryIcon": "🍔",
  "amount": 35.50,
  "remark": "午餐",
  "date": "2024-01-15",
  "account": "现金"
}
```

---

### 5. 更新记账记录

**PUT** `/api/records/:id`

需要认证。

---

### 6. 删除记账记录

**DELETE** `/api/records/:id`

需要认证。

---

## 健康检查

**GET** `/health`

---

## 认证说明

所有需要认证的接口都需要在请求头中添加：

```
Authorization: Bearer <accessToken>
```

---

## 环境配置

创建 `.env` 文件：

```env
DATABASE_URL="postgresql://username:password@localhost:5432/moneydb"
JWT_SECRET="your-secret-key-change-this-in-production"
JWT_EXPIRES_IN="2h"
REFRESH_TOKEN_EXPIRES_IN="30d"
```
