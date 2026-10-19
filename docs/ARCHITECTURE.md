# ARCHITECTURE.md

本文件为项目单一架构事实源，描述模块边界、分层约束与依赖方向。

## 模块边界与依赖方向

```
todo（领域层 TodoItem）
    ↑
todo（应用服务层 TodoService） ── 依赖 ──> TodoRepository（仓储端口）
                                              ↑
                                        InMemoryTodoRepository（内存适配器）
```

| 模块 | 职责 | 不得包含 |
|------|------|----------|
| `com.antdigital.todo` 领域层 | `TodoItem` 领域实体：字段约束、trim、ID/创建时间自生成 | 持久化、Web、框架依赖 |
| `com.antdigital.todo` 应用服务层 | `TodoService` 封装「新增待办事项」用例 | 存储细节、Web 处理 |
| `com.antdigital.todo` 仓储端口 | `TodoRepository` 定义 save/findAll 抽象接口 | 具体存储实现 |
| `com.antdigital.todo` 适配层 | `InMemoryTodoRepository` 内存存储适配器 | 业务编排 |

## 分层约束

- 领域层不可变，构造即校验，避免脏数据进入存储。
- 应用服务只依赖端口，不依赖具体适配器；替换为数据库适配器时核心层无需改动。
- 本期为最小闭环：仅「创建」，无编辑、删除、完成状态、查询界面、权限体系。

## 错误处理

- 参数校验失败抛 `IllegalArgumentException`（进程内调用，内部工具不出 Web 接口）。
- 本期无外部系统集成，不涉及错误码平台与第三方异常包装。
- 后续对外暴露时，按 Java 编码规范引入自定义业务异常与错误码。

## 安全约束

- 无 SQL、无 Web 入口，无注入面。
- 名称/描述为普通文本，无敏感数据，不涉及脱敏与加密。

## 测试策略

- 领域/服务/仓储层：JUnit 5 + AssertJ 单元测试，实测 22/22 通过。
- 运行命令：`mvn test`。

## AI 编码约束

- 改动前先读本文件与新编码规范（dtazziboot-java-coding-standards）。
- 新增模块或接口需同步更新本文件与 `docs/modules/{module}/README.md`。