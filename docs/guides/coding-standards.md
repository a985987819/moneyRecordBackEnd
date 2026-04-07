# 代码规范

本文档定义了项目的代码编写规范。

## TypeScript 规范

### 类型定义

1. **使用接口定义对象结构**

```typescript
// ✅ 正确
interface User {
  id: number;
  name: string;
  email?: string;
}

// ❌ 错误
interface User {
  id: any;
  name: any;
}
```

2. **避免使用 any**

```typescript
// ✅ 正确
function processData(data: unknown): string {
  if (typeof data === 'string') {
    return data.toUpperCase();
  }
  return '';
}

// ❌ 错误
function processData(data: any): any {
  return data.toUpperCase();
}
```

3. **使用类型别名简化复杂类型**

```typescript
type UserId = number;
type UserName = string;
type UserStatus = 'active' | 'inactive' | 'banned';
```

### 函数定义

1. **明确返回类型**

```typescript
// ✅ 正确
async function getUser(id: number): Promise<User | null> {
  // ...
}

// ❌ 错误
async function getUser(id: number) {
  // ...
}
```

2. **使用默认参数**

```typescript
// ✅ 正确
function greet(name: string, greeting: string = 'Hello'): string {
  return `${greeting}, ${name}!`;
}
```

3. **限制参数数量**

```typescript
// ✅ 正确 - 使用对象参数
interface CreateUserParams {
  username: string;
  password: string;
  email?: string;
}

function createUser(params: CreateUserParams): User {
  // ...
}

// ❌ 错误 - 参数过多
function createUser(
  username: string,
  password: string,
  email: string,
  phone: string,
  address: string
): User {
  // ...
}
```

## 命名规范

### 变量命名

```typescript
// ✅ 正确
const userCount = 10;
const isActive = true;
const userList: User[] = [];

// ❌ 错误
const user_count = 10;
const active = true;
const list = [];
```

### 常量命名

```typescript
// ✅ 正确
const MAX_RETRY_COUNT = 3;
const DEFAULT_PAGE_SIZE = 10;
const API_BASE_URL = '/api/v1';
```

### 类命名

```typescript
// ✅ 正确
class UserService {
  // ...
}

class AuthController {
  // ...
}
```

## 注释规范

### 文件头注释

```typescript
/**
 * 认证服务
 * 处理用户登录、注册、Token 管理等认证相关业务
 * @module services/auth
 */
```

### 函数注释

```typescript
/**
 * 用户登录
 * 验证用户名密码，返回 JWT Token
 * @param credentials - 登录凭证
 * @returns 认证响应，包含 accessToken 和 refreshToken
 * @throws {Error} 用户名或密码错误时抛出
 * @example
 * ```typescript
 * const result = await authService.login({
 *   username: 'admin',
 *   password: '123456'
 * });
 * ```
 */
async function login(credentials: LoginRequest): Promise<AuthResponse> {
  // ...
}
```

### 代码内注释

```typescript
// 验证用户名格式
if (!isValidUsername(username)) {
  throw new Error('用户名格式无效');
}

// TODO: 添加邮箱验证功能
```

## 错误处理

### 使用 try-catch

```typescript
// ✅ 正确
async function fetchUserData(userId: number): Promise<User | null> {
  try {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
    return result.rows[0] || null;
  } catch (error) {
    logger.error('获取用户数据失败', error as Error);
    throw new Error('获取用户数据失败');
  }
}
```

### 自定义错误类

```typescript
class ValidationError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

class NotFoundError extends Error {
  constructor(resource: string, id: string | number) {
    super(`${resource} (id: ${id}) 不存在`);
    this.name = 'NotFoundError';
  }
}
```

## 异步编程

### 使用 async/await

```typescript
// ✅ 正确
async function processUsers(): Promise<void> {
  const users = await getUsers();
  for (const user of users) {
    await processUser(user);
  }
}

// ❌ 错误 - 混合使用 Promise 和 async/await
function processUsers(): Promise<void> {
  return getUsers().then(users => {
    return Promise.all(users.map(user => processUser(user)));
  }).then(() => {});
}
```

### 并行执行

```typescript
// ✅ 正确 - 并行执行独立的异步操作
const [users, orders, products] = await Promise.all([
  getUsers(),
  getOrders(),
  getProducts(),
]);
```

## 代码格式

### 缩进和空格

- 使用 2 个空格缩进
- 运算符前后加空格
- 逗号后加空格

```typescript
// ✅ 正确
const sum = a + b;
const arr = [1, 2, 3];
const obj = { name: 'John', age: 30 };

// ❌ 错误
const sum=a+b;
const arr=[1,2,3];
```

### 引号

- 使用单引号
- JSON 使用双引号

```typescript
// ✅ 正确
const name = 'John';
const message = `Hello, ${name}!`;
```

### 分号

- 始终使用分号

```typescript
// ✅ 正确
const x = 1;
const y = 2;

// ❌ 错误
const x = 1
const y = 2
```

## 导入规范

### 导入顺序

1. 第三方库
2. 项目内部模块
3. 类型定义
4. 工具函数

```typescript
// 1. 第三方库
import type { Context } from 'hono';

// 2. 项目内部模块
import { authService } from '../services/auth.service';

// 3. 类型定义
import type { LoginRequest } from '../types/auth';

// 4. 工具函数
import { logger } from '../utils/logger';
```

### 使用类型导入

```typescript
// ✅ 正确
import type { User } from '../types/auth';

// ❌ 错误
import { User } from '../types/auth';
```
