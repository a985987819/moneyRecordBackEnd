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

### 2. 获取报表统计数据

**GET** `/report`

获取指定时间段的详细报表数据，包括每日统计和分类统计，用于生成统计图表。

#### 请求头

```
Authorization: Bearer <accessToken>
```

#### 查询参数

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| year | number | 否 | 年份，如 2026，默认为当前年 |
| month | number | 否 | 月份，如 3，不传则查询全年 |

#### 请求示例

```
# 获取2026年3月报表
GET /api/records/report?year=2026&month=3

# 获取2026年全年报表
GET /api/records/report?year=2026
```

#### 成功响应 (200)

```json
{
  "period": {
    "startDate": "2026-03-01",
    "endDate": "2026-03-31"
  },
  "summary": {
    "totalExpense": 5362.58,
    "totalIncome": 0,
    "balance": -5362.58
  },
  "dailyStats": [
    {
      "date": "2026-03-01",
      "expense": 1965.83,
      "income": 0
    },
    {
      "date": "2026-03-02",
      "expense": 79.49,
      "income": 0
    }
  ],
  "categoryStats": {
    "expense": [
      {
        "category": "住宿",
        "categoryIcon": "🏠",
        "type": "expense",
        "amount": 2238.40,
        "percentage": 41.74,
        "count": 3
      },
      {
        "category": "吃",
        "categoryIcon": "🍽️",
        "type": "expense",
        "amount": 1349.35,
        "percentage": 25.16,
        "count": 50
      }
    ],
    "income": [
      {
        "category": "工资",
        "categoryIcon": "💰",
        "type": "income",
        "amount": 8000.00,
        "percentage": 100,
        "count": 1
      }
    ]
  }
}
```

#### 响应字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| period | object | 查询时间段 |
| period.startDate | string | 开始日期 |
| period.endDate | string | 结束日期 |
| summary | object | 汇总数据 |
| summary.totalExpense | number | 总支出 |
| summary.totalIncome | number | 总收入 |
| summary.balance | number | 结余（收入-支出）|
| dailyStats | array | 每日收支统计（用于折线图）|
| dailyStats[].date | string | 日期 |
| dailyStats[].expense | number | 当日支出 |
| dailyStats[].income | number | 当日收入 |
| categoryStats | object | 分类统计 |
| categoryStats.expense | array | 支出分类统计（用于饼图）|
| categoryStats.income | array | 收入分类统计（用于饼图）|
| categoryStats[].category | string | 分类名称 |
| categoryStats[].categoryIcon | string | 分类图标 |
| categoryStats[].type | string | 类型：expense/income |
| categoryStats[].amount | number | 该分类总金额 |
| categoryStats[].percentage | number | 占比百分比 |
| categoryStats[].count | number | 记录数量 |

---

### 3. 账单筛选查询

**GET** `/bills`

支持多种筛选条件的账单查询，可按年月、日期范围、类型、分类、金额范围筛选。

#### 请求头

```
Authorization: Bearer <accessToken>
```

#### 查询参数

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| year | number | 否 | 按年查询，如 2026 |
| month | number | 否 | 按月查询（需配合 year），如 3 |
| startDate | string | 否 | 开始日期，格式：YYYY-MM-DD |
| endDate | string | 否 | 结束日期，格式：YYYY-MM-DD |
| type | string | 否 | 收支类型：expense（支出）/ income（收入）|
| categories | string | 否 | 分类筛选，多个分类用逗号分隔，如"吃,交通,购物" |
| minAmount | number | 否 | 最小金额（包含）|
| maxAmount | number | 否 | 最大金额（包含）|

#### 请求示例

```
# 筛选2026年3月的支出记录
GET /api/records/bills?year=2026&month=3&type=expense

# 筛选金额大于100的分类为"吃"或"交通"的记录
GET /api/records/bills?minAmount=100&categories=吃,交通

# 筛选日期范围和金额范围
GET /api/records/bills?startDate=2026-03-01&endDate=2026-03-15&minAmount=50&maxAmount=500

# 综合筛选：2026年3月，支出类型，餐饮分类，金额50-500
GET /api/records/bills?year=2026&month=3&type=expense&categories=餐饮&minAmount=50&maxAmount=500
```

#### 成功响应 (200)

```json
{
  "summary": {
    "totalExpense": 5362.58,
    "totalIncome": 0,
    "count": 100
  },
  "records": [
    {
      "id": "10",
      "type": "expense",
      "category": "餐饮",
      "subCategory": "午餐",
      "categoryIcon": "🍔",
      "amount": 35.50,
      "remark": "午餐",
      "date": "2026-03-15",
      "account": "现金",
      "isImport": false
    }
  ]
}
```

#### 响应字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| summary | object | 汇总数据 |
| summary.totalExpense | number | 筛选结果总支出 |
| summary.totalIncome | number | 筛选结果总收入 |
| summary.count | number | 记录总数 |
| records | array | 记账记录列表 |

---

### 4. 获取最近3天记录

**GET** `/recent`

获取最近3天的记账记录（不包含今天），按日期倒序排列。

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
    "subCategory": "午餐",
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

### 5. 分页获取记录（按日期分组）

**GET** `/by-date`

按日期分组获取记账记录，每次返回最近10个有记录的日期。

#### 请求头

```
Authorization: Bearer <accessToken>
```

#### 查询参数

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| cursor | string | 否 | 分页游标（日期），首次请求不传，下次请求使用返回的 `nextCursor` |
| limit | number | 否 | 每次返回的日期数量，默认10，最大20 |

#### 请求示例

```
# 首次请求
GET /api/records/by-date

# 分页请求
GET /api/records/by-date?cursor=2025-03-05&limit=10
```

#### 成功响应 (200)

```json
{
  "data": [
    {
      "date": "2025-03-14",
      "records": [
        {
          "id": "10",
          "type": "expense",
          "category": "餐饮",
          "subCategory": "午餐",
          "categoryIcon": "🍔",
          "amount": 35.50,
          "remark": "午餐",
          "date": "2025-03-14",
          "account": "现金"
        }
      ]
    },
    {
      "date": "2025-03-10",
      "records": [
        {
          "id": "9",
          "type": "income",
          "category": "工资",
          "categoryIcon": "💰",
          "amount": 8000.00,
          "remark": "工资",
          "date": "2025-03-10",
          "account": "银行卡"
        },
        {
          "id": "8",
          "type": "expense",
          "category": "交通",
          "categoryIcon": "🚗",
          "amount": 50.00,
          "remark": "打车",
          "date": "2025-03-10",
          "account": "微信"
        }
      ]
    }
  ],
  "hasMore": true,
  "nextCursor": "2025-03-05"
}
```

#### 响应字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| data | array | 按日期分组的数据列表 |
| data[].date | string | 日期，格式：YYYY-MM-DD |
| data[].records | array | 该日期下的所有记账记录 |
| hasMore | boolean | 是否还有更多数据 |
| nextCursor | string | 下次请求使用的游标（日期），当 hasMore 为 false 时不返回 |

---

### 6. 获取所有记录

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
    "subCategory": "午餐",
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

### 7. 创建记账记录

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
| subCategory | string | 否 | 子分类，如"午餐"、"晚餐" |
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
  "subCategory": "午餐",
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
  "subCategory": "午餐",
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

### 8. 批量导入记账记录

**POST** `/import`

批量导入记账记录，导入的记录会标记 `isImport: true`。

#### 请求头

```
Authorization: Bearer <accessToken>
```

#### 请求参数

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| records | array | 是 | 记录数组，最多 1000 条 |
| records[].type | string | 是 | 类型：expense/income |
| records[].category | string | 是 | 分类名称 |
| records[].subCategory | string | 否 | 子分类 |
| records[].categoryIcon | string | 否 | 分类图标，默认 📦 |
| records[].amount | number | 是 | 金额 |
| records[].remark | string | 否 | 备注，默认空字符串 |
| records[].date | string | 是 | 日期，格式：YYYY-MM-DD |
| records[].account | string | 否 | 账户，默认"现金" |

#### 请求示例

```json
{
  "records": [
    {
      "type": "expense",
      "category": "餐饮",
      "subCategory": "午餐",
      "categoryIcon": "🍔",
      "amount": 35.50,
      "remark": "午餐",
      "date": "2024-01-15",
      "account": "现金"
    },
    {
      "type": "income",
      "category": "工资",
      "amount": 8000.00,
      "remark": "1月工资",
      "date": "2024-01-15",
      "account": "银行卡"
    }
  ]
}
```

#### 成功响应 (201)

```json
{
  "success": 2,
  "failed": 0
}
```

#### 部分失败响应 (201)

```json
{
  "success": 1,
  "failed": 1,
  "errors": [
    "第 2 条记录: 类型、分类、金额和日期不能为空"
  ]
}
```

#### 错误响应 (400)

```json
{
  "error": "请提供要导入的记录数组"
}
```

```json
{
  "error": "单次导入最多支持 1000 条记录"
}
```

---

### 9. 删除导入的记账记录

**DELETE** `/import`

删除当前用户所有导入的记录（`isImport: true` 的记录）。

#### 请求头

```
Authorization: Bearer <accessToken>
```

#### 成功响应 (200)

```json
{
  "message": "导入数据删除成功",
  "deletedCount": 150
}
```

---

### 10. 更新记账记录

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
| subCategory | string | 子分类 |
| categoryIcon | string | 分类图标 |
| amount | number | 金额 |
| remark | string | 备注 |
| date | string | 日期 |
| account | string | 账户 |

#### 请求示例

```json
{
  "amount": 40.00,
  "subCategory": "午餐+饮料",
  "remark": "午餐+饮料"
}
```

#### 成功响应 (200)

```json
{
  "id": "11",
  "type": "expense",
  "category": "餐饮",
  "subCategory": "午餐+饮料",
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

### 11. 删除记账记录

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
  subCategory?: string;
  categoryIcon: string;
  amount: number;
  remark: string;
  date: string;
  account: string;
  isImport?: boolean;
}

interface MonthlyStats {
  totalExpense: number;
  totalIncome: number;
  budget: number;
}

interface RecordsByDate {
  date: string;
  records: RecordItem[];
}

interface PaginatedRecordsResponse {
  data: RecordsByDate[];
  hasMore: boolean;
  nextCursor?: string;
}

// 报表相关类型
interface DailyStats {
  date: string;
  expense: number;
  income: number;
}

interface CategoryStats {
  category: string;
  categoryIcon: string;
  type: 'expense' | 'income';
  amount: number;
  percentage: number;
  count: number;
}

interface ReportData {
  period: {
    startDate: string;
    endDate: string;
  };
  summary: {
    totalExpense: number;
    totalIncome: number;
    balance: number;
  };
  dailyStats: DailyStats[];
  categoryStats: {
    expense: CategoryStats[];
    income: CategoryStats[];
  };
}

// 账单筛选参数
interface BillFilterParams {
  year?: number;
  month?: number;
  startDate?: string;
  endDate?: string;
  type?: 'expense' | 'income';
  categories?: string[];
  minAmount?: number;
  maxAmount?: number;
}

interface BillListResponse {
  summary: {
    totalExpense: number;
    totalIncome: number;
    count: number;
  };
  records: RecordItem[];
}
```

---

## 错误码说明

| HTTP 状态码 | 说明 |
|------------|------|
| 200 | 请求成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未认证或认证失败 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |
