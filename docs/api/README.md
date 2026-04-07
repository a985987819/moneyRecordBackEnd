# API 文档

本文档包含记账后端 API 的完整接口说明。

## 文档结构

- [认证模块](./auth.md) - 登录、注册、Token 管理
- [分类模块](./category.md) - 收支分类管理
- [记账模块](./record.md) - 记账记录管理
- [预算模块](./budget.md) - 月度预算管理
- [储蓄模块](./savings.md) - 攒钱/储蓄目标
- [周期模块](./recurring.md) - 定期/周期记账
- [借贷模块](./debt.md) - 借入/借出管理
- [账户模块](./account.md) - 多账户管理
- [提醒模块](./reminder.md) - 记账提醒
- [模板模块](./template.md) - 账单模板
- [同步模块](./sync.md) - 数据同步与备份

## 通用规范

### 请求格式

所有请求和响应均为 JSON 格式，Content-Type 为 `application/json`。

### 认证方式

除登录、注册接口外，所有接口需要在请求头中携带 JWT Token：

```
Authorization: Bearer <accessToken>
```

### 响应格式

成功响应：
```json
{
  "data": {},
  "message": "操作成功"
}
```

错误响应：
```json
{
  "error": "错误信息",
  "code": "ERROR_CODE"
}
```

### HTTP 状态码

| 状态码 | 说明 |
|--------|------|
| 200 | 成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未认证或认证失败 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

### 日期格式

- 日期：`YYYY-MM-DD`
- 日期时间：`YYYY-MM-DD HH:mm:ss`
- 月份：`YYYY-MM`

### 金额处理

- 所有金额字段均为数字类型
- 保留 2 位小数
- 单位：元
