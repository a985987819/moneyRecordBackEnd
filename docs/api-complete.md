# Money Backend API 完整文档

## 接口概览

| 模块 | 基础路径 | 说明 |
|------|----------|------|
| 认证 | `/api/auth` | 登录、注册、Token刷新 |
| 分类 | `/api/categories` | 收支分类管理 |
| 记账 | `/api/records` | 记账记录管理 |
| 预算 | `/api/budgets` | 月度预算管理 |
| 储蓄 | `/api/savings` | 攒钱/储蓄目标 |
| 周期 | `/api/recurring` | 定期/周期记账 |
| 借贷 | `/api/debts` | 借入/借出管理 |
| 账户 | `/api/accounts` | 多账户管理 |
| 提醒 | `/api/reminders` | 记账提醒 |
| 模板 | `/api/templates` | 账单模板 |
| 同步 | `/api/sync` | 数据同步与备份 |

---

## 认证模块

### 1. 注册
- **方法**: `POST`
- **路径**: `/api/auth/register`
- **参数**:
```json
{
  "username": "string (3-20字符)",
  "password": "string (至少6位)"
}
```

### 2. 登录
- **方法**: `POST`
- **路径**: `/api/auth/login`
- **参数**:
```json
{
  "username": "string",
  "password": "string"
}
```

### 3. 刷新Token
- **方法**: `POST`
- **路径**: `/api/auth/refresh`
- **参数**:
```json
{
  "refreshToken": "string"
}
```

### 4. 登出
- **方法**: `POST`
- **路径**: `/api/auth/logout`
- **参数**:
```json
{
  "refreshToken": "string"
}
```

---

## 分类模块

### 1. 获取分类列表
- **方法**: `GET`
- **路径**: `/api/categories`
- **参数**: 无

### 2. 创建分类
- **方法**: `POST`
- **路径**: `/api/categories`
- **参数**:
```json
{
  "name": "string",
  "icon": "string",
  "type": "expense | income | transfer | debt | reimbursement",
  "color": "string (可选)"
}
```

### 3. 更新分类
- **方法**: `PUT`
- **路径**: `/api/categories/:id`
- **参数**:
```json
{
  "name": "string (可选)",
  "icon": "string (可选)",
  "color": "string (可选)"
}
```

### 4. 删除分类
- **方法**: `DELETE`
- **路径**: `/api/categories/:id`
- **参数**: 无

---

## 记账模块

### 1. 获取月度统计
- **方法**: `GET`
- **路径**: `/api/records/stats`
- **查询参数**: `?month=YYYY-MM`

### 2. 获取最近记录
- **方法**: `GET`
- **路径**: `/api/records/recent`
- **参数**: 无

### 3. 获取记录列表
- **方法**: `GET`
- **路径**: `/api/records`
- **查询参数**: `?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&type=expense|income`

### 4. 分页查询记录
- **方法**: `GET`
- **路径**: `/api/records/paginated`
- **查询参数**: `?cursor=YYYY-MM-DD&limit=10`

### 5. 按日期分组查询
- **方法**: `GET`
- **路径**: `/api/records/by-date`
- **查询参数**: `?cursor=YYYY-MM-DD&limit=10`

### 6. 创建记录
- **方法**: `POST`
- **路径**: `/api/records`
- **参数**:
```json
{
  "type": "expense | income",
  "category": "string",
  "subCategory": "string (可选)",
  "categoryIcon": "string",
  "amount": "number",
  "remark": "string (可选)",
  "date": "string (YYYY-MM-DD HH:mm:ss 或时间戳)",
  "account": "string"
}
```

### 7. 更新记录
- **方法**: `PUT`
- **路径**: `/api/records/:id`
- **参数**:
```json
{
  "type": "expense | income (可选)",
  "category": "string (可选)",
  "subCategory": "string (可选)",
  "categoryIcon": "string (可选)",
  "amount": "number (可选)",
  "remark": "string (可选)",
  "date": "string (可选)",
  "account": "string (可选)"
}
```

### 8. 删除记录
- **方法**: `DELETE`
- **路径**: `/api/records/:id`
- **参数**: 无

### 9. 批量导入
- **方法**: `POST`
- **路径**: `/api/records/batch-import`
- **参数**:
```json
{
  "records": [
    {
      "type": "expense | income",
      "category": "string",
      "subCategory": "string (可选)",
      "categoryIcon": "string",
      "amount": "number",
      "remark": "string (可选)",
      "date": "string",
      "account": "string"
    }
  ]
}
```

### 10. 删除导入数据
- **方法**: `DELETE`
- **路径**: `/api/records/imported`
- **参数**: 无

### 11. 账单筛选
- **方法**: `GET`
- **路径**: `/api/records/bills`
- **查询参数**:
  - `year`: 年份
  - `month`: 月份
  - `startDate`: 开始日期
  - `endDate`: 结束日期
  - `type`: expense|income
  - `category`: 分类名称
  - `minAmount`: 最小金额
  - `maxAmount`: 最大金额
  - `keyword`: 搜索关键词

### 12. 获取报表数据
- **方法**: `GET`
- **路径**: `/api/records/report`
- **查询参数**: `?year=2026&month=4`

### 13. 检测重复记录
- **方法**: `GET`
- **路径**: `/api/records/duplicates`
- **参数**: 无

### 14. 删除重复记录
- **方法**: `DELETE`
- **路径**: `/api/records/duplicates`
- **参数**: 无

### 15. 创建定时记账
- **方法**: `POST`
- **路径**: `/api/records/recurring`
- **参数**:
```json
{
  "type": "expense | income",
  "category": "string",
  "subCategory": "string (可选)",
  "categoryIcon": "string",
  "amount": "number",
  "remark": "string",
  "frequency": "daily | workday | weekly | monthly",
  "startDate": "string",
  "durationMonths": "number (可选,默认12)"
}
```

---

## 预算模块

### 1. 获取当前月预算
- **方法**: `GET`
- **路径**: `/api/budgets/current`
- **参数**: 无

### 2. 获取指定月份预算
- **方法**: `GET`
- **路径**: `/api/budgets/month`
- **查询参数**: `?year=2026&month=4`

### 3. 设置预算
- **方法**: `POST`
- **路径**: `/api/budgets`
- **参数**:
```json
{
  "amount": "number",
  "year": "number (可选,默认当前年)",
  "month": "number (可选,默认当前月)"
}
```

### 4. 删除预算
- **方法**: `DELETE`
- **路径**: `/api/budgets`
- **查询参数**: `?year=2026&month=4`

### 5. 获取预算统计
- **方法**: `GET`
- **路径**: `/api/budgets/stats`
- **参数**: 无

### 6. 获取最近预算
- **方法**: `GET`
- **路径**: `/api/budgets/recent`
- **查询参数**: `?months=6`

---

## 储蓄目标模块

### 1. 获取所有储蓄目标
- **方法**: `GET`
- **路径**: `/api/savings/goals`
- **参数**: 无

### 2. 创建储蓄目标
- **方法**: `POST`
- **路径**: `/api/savings/goals`
- **参数**:
```json
{
  "name": "string",
  "targetAmount": "number",
  "deadline": "string (可选, YYYY-MM-DD)",
  "icon": "string",
  "color": "string"
}
```

### 3. 更新储蓄目标
- **方法**: `PUT`
- **路径**: `/api/savings/goals/:id`
- **参数**:
```json
{
  "name": "string (可选)",
  "targetAmount": "number (可选)",
  "deadline": "string (可选)",
  "icon": "string (可选)",
  "color": "string (可选)"
}
```

### 4. 删除储蓄目标
- **方法**: `DELETE`
- **路径**: `/api/savings/goals/:id`
- **参数**: 无

### 5. 向目标存钱
- **方法**: `POST`
- **路径**: `/api/savings/goals/:id/deposit`
- **参数**:
```json
{
  "amount": "number",
  "remark": "string (可选)"
}
```

### 6. 从目标取钱
- **方法**: `POST`
- **路径**: `/api/savings/goals/:id/withdraw`
- **参数**:
```json
{
  "amount": "number",
  "remark": "string (可选)"
}
```

### 7. 获取储蓄统计
- **方法**: `GET`
- **路径**: `/api/savings/summary`
- **参数**: 无

---

## 周期记账模块

### 1. 获取周期记账列表
- **方法**: `GET`
- **路径**: `/api/recurring`
- **参数**: 无

### 2. 创建周期记账
- **方法**: `POST`
- **路径**: `/api/recurring`
- **参数**:
```json
{
  "type": "expense | income",
  "category": "string",
  "subCategory": "string (可选)",
  "categoryIcon": "string (可选)",
  "amount": "number",
  "remark": "string",
  "frequency": "daily | weekly | monthly | yearly",
  "startDate": "string (YYYY-MM-DD)",
  "endDate": "string (可选)",
  "account": "string"
}
```

### 3. 更新周期记账
- **方法**: `PUT`
- **路径**: `/api/recurring/:id`
- **参数**: (同创建,全部可选)

### 4. 删除周期记账
- **方法**: `DELETE`
- **路径**: `/api/recurring/:id`
- **参数**: 无

### 5. 切换启用/禁用
- **方法**: `POST`
- **路径**: `/api/recurring/:id/toggle`
- **参数**: 无

### 6. 获取统计
- **方法**: `GET`
- **路径**: `/api/recurring/summary`
- **参数**: 无

---

## 借贷管理模块

### 1. 获取借贷列表
- **方法**: `GET`
- **路径**: `/api/debts`
- **参数**: 无

### 2. 创建借贷记录
- **方法**: `POST`
- **路径**: `/api/debts`
- **参数**:
```json
{
  "type": "lend | borrow",
  "personName": "string",
  "amount": "number",
  "date": "string (YYYY-MM-DD)",
  "expectedRepayDate": "string (可选)",
  "remark": "string (可选)"
}
```

### 3. 更新借贷
- **方法**: `PUT`
- **路径**: `/api/debts/:id`
- **参数**: (同创建,全部可选)

### 4. 删除借贷
- **方法**: `DELETE`
- **路径**: `/api/debts/:id`
- **参数**: 无

### 5. 记录还款
- **方法**: `POST`
- **路径**: `/api/debts/:id/repay`
- **参数**:
```json
{
  "amount": "number",
  "remark": "string (可选)"
}
```

### 6. 获取借贷统计
- **方法**: `GET`
- **路径**: `/api/debts/summary`
- **参数**: 无

---

## 账户管理模块

### 1. 获取账户列表
- **方法**: `GET`
- **路径**: `/api/accounts`
- **参数**: 无

### 2. 创建账户
- **方法**: `POST`
- **路径**: `/api/accounts`
- **参数**:
```json
{
  "name": "string",
  "type": "cash | bank | alipay | wechat | credit | other",
  "icon": "string",
  "initialBalance": "number",
  "isDefault": "boolean (可选)",
  "color": "string (可选)"
}
```

### 3. 更新账户
- **方法**: `PUT`
- **路径**: `/api/accounts/:id`
- **参数**: (同创建,全部可选)

### 4. 删除账户
- **方法**: `DELETE`
- **路径**: `/api/accounts/:id`
- **参数**: 无

### 5. 调整余额
- **方法**: `POST`
- **路径**: `/api/accounts/:id/adjust`
- **参数**:
```json
{
  "newBalance": "number",
  "remark": "string (可选)"
}
```

### 6. 获取账户统计
- **方法**: `GET`
- **路径**: `/api/accounts/summary`
- **参数**: 无

---

## 记账提醒模块

### 1. 获取提醒列表
- **方法**: `GET`
- **路径**: `/api/reminders`
- **参数**: 无

### 2. 创建提醒
- **方法**: `POST`
- **路径**: `/api/reminders`
- **参数**:
```json
{
  "type": "daily | weekly | monthly",
  "time": "string (HH:mm)",
  "message": "string (可选)",
  "daysOfWeek": "number[] (可选, 0-6, 周提醒时)"
}
```

### 3. 更新提醒
- **方法**: `PUT`
- **路径**: `/api/reminders/:id`
- **参数**: (同创建,全部可选)

### 4. 删除提醒
- **方法**: `DELETE`
- **路径**: `/api/reminders/:id`
- **参数**: 无

### 5. 切换启用/禁用
- **方法**: `POST`
- **路径**: `/api/reminders/:id/toggle`
- **参数**: 无

---

## 账单模板模块

### 1. 获取模板列表
- **方法**: `GET`
- **路径**: `/api/templates`
- **参数**: 无

### 2. 创建模板
- **方法**: `POST`
- **路径**: `/api/templates`
- **参数**:
```json
{
  "name": "string",
  "type": "expense | income",
  "category": "string",
  "subCategory": "string (可选)",
  "categoryIcon": "string (可选)",
  "amount": "number (可选)",
  "remark": "string (可选)",
  "account": "string"
}
```

### 3. 更新模板
- **方法**: `PUT`
- **路径**: `/api/templates/:id`
- **参数**: (同创建,全部可选)

### 4. 删除模板
- **方法**: `DELETE`
- **路径**: `/api/templates/:id`
- **参数**: 无

### 5. 使用模板创建记录
- **方法**: `POST`
- **路径**: `/api/templates/:id/use`
- **参数**:
```json
{
  "date": "string (可选, 默认当前时间)",
  "amount": "number (可选, 覆盖模板金额)",
  "remark": "string (可选, 覆盖模板备注)"
}
```

---

## 数据同步模块

### 1. 上传数据到云端
- **方法**: `POST`
- **路径**: `/api/sync/upload`
- **参数**:
```json
{
  "data": {
    "records": "array",
    "categories": "array",
    "accounts": "array",
    "savingsGoals": "array",
    "debts": "array",
    "budgets": "array",
    "templates": "array",
    "recurringRecords": "array"
  }
}
```

### 2. 从云端下载数据
- **方法**: `GET`
- **路径**: `/api/sync/download`
- **查询参数**: `?version=number (可选)`

### 3. 获取历史版本
- **方法**: `GET`
- **路径**: `/api/sync/versions`
- **参数**: 无

### 4. 恢复到指定版本
- **方法**: `POST`
- **路径**: `/api/sync/restore/:versionId`
- **参数**: 无

---

## 通用说明

### 请求头
所有需要认证的接口都需要在请求头中携带:
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

### 认证接口列表
除以下接口外，其他所有接口都需要认证:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`

### 金额字段
所有金额字段均为数字类型，保留2位小数

### 日期格式
- 日期: `YYYY-MM-DD`
- 日期时间: `YYYY-MM-DD HH:mm:ss`
- 月份: `YYYY-MM`

### 状态码
- `200`: 成功
- `201`: 创建成功
- `400`: 请求参数错误
- `401`: 未认证或认证失败
- `404`: 资源不存在
- `500`: 服务器内部错误
