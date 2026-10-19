# todo 待办事项模块

## 职责

待办事项「新增」最小闭环：领域实体字段约束、应用服务用例编排、仓储端口与内存适配器。

## 关键类

| 类 | 职责 |
|----|------|
| `TodoItem` | 待办事项领域实体（不可变），校验名称非空非空白、trim 名称/描述、自动生成 ID 与创建时间 |
| `TodoRepository` | 仓储端口，定义 `save` / `findAll` 抽象持久化接口 |
| `InMemoryTodoRepository` | 内存存储适配器，基于 `ArrayList`，满足最小闭环验证 |
| `TodoService` | 应用服务，封装「创建待办事项」用例，协调校验与持久化 |

## 依赖

- 向下依赖：`TodoRepository`（仓储端口）
- 领域实体 `TodoItem` 无外部依赖
- 不得依赖：Web 框架、数据库、外部系统

## 接口列表

| 编号 | 接口 | 方法签名 | 说明 |
|------|------|----------|------|
| S01 | 创建待办事项 | `TodoService.createTodo(String name, String description) -> TodoItem` | 校验并持久化，返回保存后实例 |
| S02 | 保存待办事项 | `TodoRepository.save(TodoItem item) -> TodoItem` | 保存并原样返回 |
| S03 | 查询全部待办事项 | `TodoRepository.findAll() -> List<TodoItem>` | 返回防御性副本 |