# Money Backend

一个功能完善的记账后端 API 服务，支持多用户、多账户、预算管理、储蓄目标等丰富功能。

## 功能特性

### 核心功能
- 🔐 **用户认证** - JWT 认证，支持 Token 刷新
- 📊 **记账管理** - 收支记录，支持子分类
- 🏷️ **分类管理** - 自定义收支分类
- 💰 **预算管理** - 月度预算，自动追踪

### 高级功能
- 🎯 **储蓄目标** - 设定存钱目标，追踪进度
- 🔄 **周期记账** - 自动重复记账
- 💳 **多账户** - 现金、银行卡、信用卡等
- 📈 **报表统计** - 收支分析，可视化数据
- 🔍 **智能筛选** - 多条件账单查询
- 🔔 **记账提醒** - 定时提醒记账
- 📋 **账单模板** - 快速记账模板
- ☁️ **数据同步** - 云端备份与恢复

## 技术栈

- **运行时**: [Bun](https://bun.sh/)
- **Web框架**: [Hono](https://hono.dev/)
- **数据库**: PostgreSQL
- **认证**: JWT (jsonwebtoken)
- **密码加密**: bcryptjs

## 快速开始

### 环境要求

- Bun >= 1.0
- PostgreSQL >= 14

### 安装

```bash
# 克隆项目
git clone <repository-url>
cd moneyBackend

# 安装依赖
bun install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填写数据库连接信息

# 初始化数据库
bun run db:init

# 启动开发服务器
bun run dev
```

### 环境变量配置

```env
# 数据库配置
DATABASE_URL=postgresql://username:password@localhost:5432/moneydb

# JWT 配置
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d

# 服务器配置
PORT=9876
HOST=0.0.0.0
```

## 项目结构

```
src/
├── config/         # 配置文件
├── controllers/    # 控制器层
├── middleware/     # 中间件
├── routes/         # 路由定义
├── services/       # 业务逻辑层
├── types/          # TypeScript 类型
├── utils/          # 工具函数
└── index.ts        # 应用入口
```

## API 文档

详细的 API 文档请查看 [docs/api](./docs/api) 目录。

### 主要接口

| 模块 | 基础路径 | 说明 |
|------|----------|------|
| 认证 | `/api/auth` | 登录、注册、Token 管理 |
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

## 开发指南

### 可用脚本

```bash
# 开发模式（热重载）
bun run dev

# 类型检查
bun run typecheck

# 构建
bun run build

# 运行测试
bun run test

# 初始化数据库
bun run db:init
```

### 代码规范

- 使用 TypeScript 严格模式
- 所有函数必须声明返回类型
- 使用 ESLint 进行代码检查
- 遵循 [开发指南](./docs/guides) 中的规范

## 数据库设计

数据库表结构文档请查看 [docs/database](./docs/database) 目录。

### 主要表

- `users` - 用户表
- `categories` - 分类表
- `records` - 记账记录表
- `budgets` - 预算表
- `savings_goals` - 储蓄目标表
- `accounts` - 账户表
- `debts` - 借贷表

## 部署

### Docker 部署

```bash
# 构建镜像
docker build -t money-backend .

# 运行容器
docker run -p 9876:9876 --env-file .env money-backend
```

### 生产环境注意事项

1. 使用强密码的 JWT_SECRET
2. 配置数据库连接池
3. 启用 HTTPS
4. 配置日志轮转
5. 设置适当的超时时间

## 贡献指南

1. Fork 本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

[MIT](LICENSE)

## 联系方式

如有问题或建议，欢迎提交 Issue 或 Pull Request。
