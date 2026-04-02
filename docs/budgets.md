# 预算模块 API 文档

## 接口概览

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/budgets/current` | 获取当前月预算 |
| GET | `/api/budgets/month` | 获取指定月份预算 |
| GET | `/api/budgets/stats` | 获取预算统计 |
| GET | `/api/budgets/recent` | 获取最近几个月预算 |
| POST | `/api/budgets` | 设置预算（创建或更新）|
| DELETE | `/api/budgets` | 删除预算 |

---

## 1. 获取当前月预算

**GET** `/api/budgets/current`

获取当前登录用户本月的预算信息。

### 请求头

```
Authorization: Bearer <accessToken>
```

### 成功响应 (200)

```json
{
  "budget": {
    "id": "1",
    "year": 2026,
    "month": 4,
    "amount": 5000.00,
    "spent": 2350.50,
    "remaining": 2649.50,
    "percentage": 47.01
  }
}
```

### 无预算响应 (200)

```json
{
  "budget": null,
  "message": "本月尚未设置预算"
}
```

---

## 2. 获取指定月份预算

**GET** `/api/budgets/month?year=2026&month=4`

获取指定年月的预算信息。

### 请求头

```
Authorization: Bearer <accessToken>
```

### 查询参数

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| year | number | 是 | 年份，如 2026 |
| month | number | 是 | 月份，1-12 |

### 成功响应 (200)

```json
{
  "budget": {
    "id": "1",
    "year": 2026,
    "month": 4,
    "amount": 5000.00,
    "spent": 2350.50,
    "remaining": 2649.50,
    "percentage": 47.01
  }
}
```

---

## 3. 设置预算

**POST** `/api/budgets`

创建或更新指定月份的预算。如果不指定年月，默认为当前月份。

### 请求头

```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

### 请求参数

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| amount | number | 是 | 预算金额，必须 >= 0 |
| year | number | 否 | 年份，默认为当前年 |
| month | number | 否 | 月份，默认为当前月 |

### 请求示例

```json
{
  "amount": 5000.00,
  "year": 2026,
  "month": 4
}
```

### 成功响应 (200)

```json
{
  "budget": {
    "id": "1",
    "year": 2026,
    "month": 4,
    "amount": 5000.00,
    "spent": 2350.50,
    "remaining": 2649.50,
    "percentage": 47.01
  },
  "message": "预算设置成功"
}
```

### 错误响应 (400)

```json
{
  "error": "预算金额必须是非负数"
}
```

---

## 4. 删除预算

**DELETE** `/api/budgets?year=2026&month=4`

删除指定月份的预算。

### 请求头

```
Authorization: Bearer <accessToken>
```

### 查询参数

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| year | number | 是 | 年份 |
| month | number | 是 | 月份，1-12 |

### 成功响应 (200)

```json
{
  "message": "预算删除成功"
}
```

### 错误响应 (404)

```json
{
  "error": "该月份预算不存在"
}
```

---

## 5. 获取预算统计

**GET** `/api/budgets/stats`

获取预算统计信息，包括当前月、上月预算和平均支出。

### 请求头

```
Authorization: Bearer <accessToken>
```

### 成功响应 (200)

```json
{
  "currentMonth": {
    "id": "1",
    "year": 2026,
    "month": 4,
    "amount": 5000.00,
    "spent": 2350.50,
    "remaining": 2649.50,
    "percentage": 47.01
  },
  "lastMonth": {
    "id": "2",
    "year": 2026,
    "month": 3,
    "amount": 4500.00,
    "spent": 4200.00,
    "remaining": 300.00,
    "percentage": 93.33
  },
  "averageSpent": 3800.50
}
```

---

## 6. 获取最近几个月预算

**GET** `/api/budgets/recent?months=6`

获取最近几个月的预算列表。

### 请求头

```
Authorization: Bearer <accessToken>
```

### 查询参数

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| months | number | 否 | 获取最近几个月，默认 6 |

### 成功响应 (200)

```json
{
  "budgets": [
    {
      "id": "1",
      "year": 2026,
      "month": 4,
      "amount": 5000.00,
      "spent": 2350.50,
      "remaining": 2649.50,
      "percentage": 47.01
    },
    {
      "id": "2",
      "year": 2026,
      "month": 3,
      "amount": 4500.00,
      "spent": 4200.00,
      "remaining": 300.00,
      "percentage": 93.33
    }
  ]
}
```

---

## 数据类型

```typescript
interface BudgetResponse {
  id: string;
  year: number;
  month: number;
  amount: number;      // 预算总额
  spent: number;       // 已支出金额
  remaining: number;   // 剩余金额
  percentage: number;  // 已使用百分比
}

interface BudgetStats {
  currentMonth: BudgetResponse | null;  // 当前月预算
  lastMonth: BudgetResponse | null;     // 上月预算
  averageSpent: number;                 // 近6个月平均支出
}
```

---

## 预算自动更新机制

1. **创建支出记录**：自动从当月预算中扣除支出金额
2. **创建收入记录**：不影响预算支出
3. **更新记录**：
   - 如果修改了金额/类型/日期，会重新计算预算
   - 先从旧日期预算中扣除旧金额
   - 再向新日期预算中添加新金额
4. **删除记录**：从对应月份预算中扣除该笔支出

---

## 错误码说明

| HTTP 状态码 | 说明 |
|------------|------|
| 200 | 请求成功 |
| 400 | 请求参数错误 |
| 401 | 未认证或认证失败 |
| 404 | 预算不存在 |
| 500 | 服务器内部错误 |
