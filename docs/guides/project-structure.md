# 项目结构

```
moneyBackend/
├── src/                          # 源代码目录
│   ├── config/                   # 配置文件
│   │   ├── database.ts           # 数据库配置
│   │   └── env.ts                # 环境变量配置
│   ├── controllers/              # 控制器层
│   │   ├── auth.controller.ts    # 认证控制器
│   │   ├── category.controller.ts
│   │   ├── record.controller.ts
│   │   ├── budget.controller.ts
│   │   ├── savings.controller.ts
│   │   ├── debt.controller.ts
│   │   ├── account.controller.ts
│   │   ├── recurring.controller.ts
│   │   ├── reminder.controller.ts
│   │   ├── template.controller.ts
│   │   └── sync.controller.ts
│   ├── middleware/               # 中间件
│   │   └── auth.middleware.ts    # 认证中间件
│   ├── routes/                   # 路由定义
│   │   ├── auth.routes.ts
│   │   ├── category.routes.ts
│   │   ├── record.routes.ts
│   │   ├── budget.routes.ts
│   │   ├── savings.routes.ts
│   │   ├── debt.routes.ts
│   │   ├── account.routes.ts
│   │   ├── recurring.routes.ts
│   │   ├── reminder.routes.ts
│   │   ├── template.routes.ts
│   │   └── sync.routes.ts
│   ├── services/                 # 业务逻辑层
│   │   ├── auth.service.ts
│   │   ├── category.service.ts
│   │   ├── record.service.ts
│   │   ├── budget.service.ts
│   │   ├── savings.service.ts
│   │   ├── debt.service.ts
│   │   ├── account.service.ts
│   │   ├── recurring.service.ts
│   │   ├── reminder.service.ts
│   │   ├── template.service.ts
│   │   └── sync.service.ts
│   ├── types/                    # TypeScript 类型定义
│   │   ├── auth.ts
│   │   ├── category.ts
│   │   ├── record.ts
│   │   ├── budget.ts
│   │   ├── savings.ts
│   │   ├── debt.ts
│   │   ├── account.ts
│   │   ├── recurring.ts
│   │   ├── reminder.ts
│   │   ├── template.ts
│   │   ├── sync.ts
│   │   └── common.ts
│   ├── utils/                    # 工具函数
│   │   ├── date.ts               # 日期处理
│   │   ├── logger.ts             # 日志工具
│   │   ├── password.ts           # 密码加密
│   │   ├── token.ts              # JWT Token
│   │   └── validation.ts         # 输入验证
│   └── index.ts                  # 应用入口
├── docs/                         # 文档目录
│   ├── api/                      # API 文档
│   ├── guides/                   # 开发指南
│   └── database/                 # 数据库文档
├── tests/                        # 测试文件
├── .env                          # 环境变量
├── .env.example                  # 环境变量示例
├── .gitignore                    # Git 忽略配置
├── package.json                  # 项目配置
├── tsconfig.json                 # TypeScript 配置
└── README.md                     # 项目说明
```

## 架构说明

### 分层架构

```
┌─────────────────────────────────────┐
│           路由层 (Routes)            │
│    定义 API 端点和请求处理方法        │
├─────────────────────────────────────┤
│         控制器层 (Controllers)       │
│    处理 HTTP 请求，调用服务层        │
├─────────────────────────────────────┤
│         服务层 (Services)            │
│    实现业务逻辑，操作数据库           │
├─────────────────────────────────────┤
│         数据访问层 (Database)        │
│    执行 SQL 查询                     │
└─────────────────────────────────────┘
```

### 数据流向

```
HTTP Request → Routes → Controller → Service → Database
                    ↓
HTTP Response ← JSON Response ← Service Result
```

## 命名规范

### 文件命名

- 控制器: `{name}.controller.ts`
- 服务: `{name}.service.ts`
- 路由: `{name}.routes.ts`
- 类型: `{name}.ts`
- 工具: `{name}.ts`

### 类命名

- 控制器: `XxxController`
- 服务: `XxxService`
- 使用大驼峰命名法

### 接口命名

- 请求类型: `XxxRequest`
- 响应类型: `XxxResponse
- 使用大驼峰命名法

## 代码组织原则

1. **单一职责**: 每个模块只负责一个功能领域
2. **依赖注入**: 通过构造函数注入依赖
3. **接口隔离**: 使用接口定义契约
4. **错误处理**: 统一错误处理机制
5. **类型安全**: 严格使用 TypeScript 类型
