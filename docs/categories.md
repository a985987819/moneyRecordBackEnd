# 分类模块 API 文档

## 基础信息

- **基础 URL**: `/api/categories`
- **Content-Type**: `application/json`
- **认证**: 所有接口都需要认证

---

## 接口列表

### 1. 获取支出分类列表

**GET** `/expense`

获取当前用户的所有支出分类（包括系统默认分类和用户自定义分类）。

#### 请求头

```
Authorization: Bearer <accessToken>
```

#### 成功响应 (200)

```json
[
  {
    "id": "1",
    "name": "餐饮",
    "icon": "🍔",
    "type": "expense",
    "color": "#FF6B6B"
  },
  {
    "id": "2",
    "name": "交通",
    "icon": "🚗",
    "type": "expense",
    "color": "#4ECDC4"
  }
]
```

---

### 2. 获取收入分类列表

**GET** `/income`

获取当前用户的所有收入分类。

#### 请求头

```
Authorization: Bearer <accessToken>
```

#### 成功响应 (200)

```json
[
  {
    "id": "9",
    "name": "工资",
    "icon": "💰",
    "type": "income",
    "color": "#00B894"
  },
  {
    "id": "10",
    "name": "奖金",
    "icon": "🎁",
    "type": "income",
    "color": "#FDCB6E"
  }
]
```

---

### 3. 获取所有分类

**GET** `/`

一次性获取所有支出和收入分类。

#### 请求头

```
Authorization: Bearer <accessToken>
```

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
    },
    {
      "id": "2",
      "name": "交通",
      "icon": "🚗",
      "type": "expense",
      "color": "#4ECDC4"
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

**POST** `/`

创建自定义分类。

#### 请求头

```
Authorization: Bearer <accessToken>
```

#### 请求参数

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 分类名称，如"餐饮" |
| icon | string | 是 | 图标，如"🍔" |
| type | string | 是 | 类型：expense/income/transfer/debt/reimbursement |
| color | string | 否 | 颜色代码，如"#FF6B6B" |

#### 请求示例

```json
{
  "name": "宠物",
  "icon": "🐕",
  "type": "expense",
  "color": "#8B4513"
}
```

#### 成功响应 (201)

```json
{
  "id": "15",
  "name": "宠物",
  "icon": "🐕",
  "type": "expense",
  "color": "#8B4513"
}
```

#### 错误响应 (400)

```json
{
  "error": "名称、图标和类型不能为空"
}
```

---

### 5. 更新分类

**PUT** `/:id`

更新指定分类的信息。只能更新用户自己创建的分类。

#### 请求头

```
Authorization: Bearer <accessToken>
```

#### 请求参数

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 否 | 分类名称 |
| icon | string | 否 | 图标 |
| type | string | 否 | 类型 |
| color | string | 否 | 颜色代码 |

#### 请求示例

```json
{
  "name": "宠物用品",
  "color": "#A0522D"
}
```

#### 成功响应 (200)

```json
{
  "id": "15",
  "name": "宠物用品",
  "icon": "🐕",
  "type": "expense",
  "color": "#A0522D"
}
```

#### 错误响应 (404)

```json
{
  "error": "分类不存在"
}
```

---

### 6. 删除分类

**DELETE** `/:id`

删除指定分类。只能删除用户自己创建的分类，默认分类无法删除。

#### 请求头

```
Authorization: Bearer <accessToken>
```

#### 成功响应 (200)

```json
{
  "message": "删除成功"
}
```

#### 错误响应 (404)

```json
{
  "error": "分类不存在"
}
```

---

## 默认分类

用户注册时系统会自动创建以下默认分类：

### 支出分类

| 名称 | 图标 | 颜色 |
|------|------|------|
| 餐饮 | 🍔 | #FF6B6B |
| 交通 | 🚗 | #4ECDC4 |
| 购物 | 🛍️ | #45B7D1 |
| 娱乐 | 🎮 | #96CEB4 |
| 居住 | 🏠 | #FFEAA7 |
| 医疗 | 🏥 | #DFE6E9 |
| 教育 | 📚 | #A29BFE |
| 其他支出 | 📦 | #B2BEC3 |

### 收入分类

| 名称 | 图标 | 颜色 |
|------|------|------|
| 工资 | 💰 | #00B894 |
| 奖金 | 🎁 | #FDCB6E |
| 投资 | 📈 | #E17055 |
| 兼职 | 💼 | #74B9FF |
| 其他收入 | 💵 | #55A3FF |

---

## 数据类型

```typescript
type CategoryType = 'expense' | 'income' | 'transfer' | 'debt' | 'reimbursement';

interface Category {
  id: string;
  name: string;
  icon: string;
  type: CategoryType;
  color?: string;
}
```
