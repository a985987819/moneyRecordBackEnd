# 开发指南

本文档包含项目的开发指南和最佳实践。

## 目录

- [项目结构](./project-structure.md)
- [开发环境搭建](./development-setup.md)
- [代码规范](./coding-standards.md)
- [数据库设计](./database-design.md)
- [错误处理](./error-handling.md)
- [测试指南](./testing.md)
- [部署指南](./deployment.md)

## 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd moneyBackend
```

### 2. 安装依赖

```bash
bun install
```

### 3. 配置环境变量

复制 `.env.example` 为 `.env` 并填写配置：

```bash
cp .env.example .env
```

### 4. 初始化数据库

```bash
bun run db:init
```

### 5. 启动开发服务器

```bash
bun run dev
```

## 技术栈

- **运行时**: Bun
- **Web框架**: Hono
- **数据库**: PostgreSQL
- **ORM**: 原生 SQL (pg)
- **认证**: JWT
- **密码加密**: bcryptjs

## 项目特点

- 🔐 JWT 认证与授权
- 📊 完整的记账功能
- 💰 预算管理
- 🎯 储蓄目标
- 🔄 周期记账
- 💳 多账户管理
- 📈 数据统计与报表
- 🔔 记账提醒
- ☁️ 数据同步与备份
