# 记账记录模块 API 文档

## 基础信息

- **基础 URL**: `/api/records`
- **Content-Type**: `application/json`
- **认证**: 所有接口都需要认证

---

## 接口列表

### 1. 获取月度统计

**GET** `/stats`

获取指定月份的收支统计信息。

#### 请求头

```
Authorization: Bearer <accessToken>
```

#### 查询参数

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| month | string | 否 | 月份，格式：YYYY-MM，默认为当前月份 |

#### 请求示例

```
GET /api/records/stats?month=2024-01
```

#### 成功响应 (200)

```json
{
  "totalExpense": 3500.50,
  "totalIncome": 8000.00,
  "budget": 5000
}
```

| 字段 | 说明 |
|------|------|
| totalExpense | 总支出 |
| totalIncome | 总收入 |
| budget | 预算（固定值 5000） |

---

### 2. 获取最近3天记录

**GET** `/recent`

获取最近3天的记账记录，按日期倒序排列。

#### 请求头

```
Authorization: Bearer <accessToken>
```

#### 成功响应 (200)

```json
[
  {
    "id": "10",
    "type": "expense",
    "category": "餐饮",
    "categoryIcon": "🍔",
    "amount": 35.50,
    "remark": "午餐",
    "date": "2024-01-15",
    "account": "现金"
  },
  {
    "id": "9",
    "type": "income",
    "category": "工资",
    "categoryIcon": "💰",
    "amount": 8000.00,
    "remark": "1月工资",
    "date": "2024-01-15",
    "account": "银行卡"
  }
]
```

---

### 3. 获取所有记录

**GET** `/`

支持按日期范围和类型筛选记账记录。

#### 请求头

```
Authorization: Bearer <accessToken>
```

#### 查询参数

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| startDate | string | 否 | 开始日期，格式：YYYY-MM-DD |
| endDate | string | 否 | 结束日期，格式：YYYY-MM-DD |
| type | string | 否 | 类型：expense/income |

#### 请求示例

```
GET /api/records?startDate=2024-01-01&endDate=2024-01-31&type=expense
```

#### 成功响应 (200)

```json
[
  {
    "id": "10",
    "type": "expense",
    "category": "餐饮",
    "categoryIcon": "🍔",
    "amount": 35.50,
    "remark": "午餐",
    "date": "2024-01-15",
    "account": "现金"
  },
  {
    "id": "8",
    "type": "expense",
    "category": "交通",
    "categoryIcon": "🚗",
    "amount": 50.00,
    "remark": "打车",
    "date": "2024-01-14",
    "account": "微信"
  }
]
```

---

### 4. 创建记账记录

**POST** `/`

创建新的记账记录。

#### 请求头

```
Authorization: Bearer <accessToken>
```

#### 请求参数

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| type | string | 是 | 类型：expense（支出）/ income（收入） |
| category | string | 是 | 分类名称，如"餐饮" |
| categoryIcon | string | 是 | 分类图标，如"🍔" |
| amount | number | 是 | 金额，必须大于0 |
| remark | string | 是 | 备注说明 |
| date | string | 是 | 日期，格式：YYYY-MM-DD |
| account | string | 是 | 账户，如"现金"、"银行卡"、"微信"、"支付宝" |

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

#### 成功响应 (201)

```json
{
  "id": "11",
  "type": "expense",
  "category": "餐饮",
  "categoryIcon": "🍔",
  "amount": 35.50,
  "remark": "午餐",
  "date": "2024-01-15",
  "account": "现金"
}
```

#### 错误响应 (400)

```json
{
  "error": "类型、分类、金额和日期不能为空"
}
```

---

### 5. 更新记账记录

**PUT** `/:id`

更新指定记账记录的信息。

#### 请求头

```
Authorization: Bearer <accessToken>
```

#### 请求参数

所有字段都是可选的，只更新提供的字段。

| 字段 | 类型 | 说明 |
|------|------|------|
| type | string | 类型：expense/income |
| category | string | 分类名称 |
| categoryIcon | string | 分类图标 |
| amount | number | 金额 |
| remark | string | 备注 |
| date | string | 日期 |
| account | string | 账户 |

#### 请求示例

```json
{
  "amount": 40.00,
  "remark": "午餐+饮料"
}
```

#### 成功响应 (200)

```json
{
  "id": "11",
  "type": "expense",
  "category": "餐饮",
  "categoryIcon": "🍔",
  "amount": 40.00,
  "remark": "午餐+饮料",
  "date": "2024-01-15",
  "account": "现金"
}
```

#### 错误响应 (404)

```json
{
  "error": "记录不存在"
}
```

---

### 6. 删除记账记录

**DELETE** `/:id`

删除指定记账记录。

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
  "error": "记录不存在"
}
```

---

## 数据类型

```typescript
interface RecordItem {
  id: string;
  type: 'expense' | 'income';
  category: string;
  categoryIcon: string;
  amount: number;
  remark: string;
  date: string;
  account: string;
}

interface MonthlyStats {
  totalExpense: number;
  totalIncome: number;
  budget: number;
}

interface RecordQueryParams {
  startDate?: string;
  endDate?: string;
  type?: string;
}
```

---

## 常用账户类型建议

- 现金
- 银行卡
- 信用卡
- 微信支付
- 支付宝
- 云闪付
