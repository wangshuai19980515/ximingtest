# Code Review Report

> **Change** `帮助用户记录日常待办事项_核心功能（todo 最小闭环新增）` · **分支/Commit** `task/DEV-…be863` / `d5d3980` · **日期** `2026-10-19` · **审查者** AI
>
> **AI**：等级 **P0 / P1 / P2**；G/S 以 checklist 行内定义为准；Bug 模式以 `bug-pattern-checklist.md` 表头为准（Blocker→P0、Major→P1、Info→P2）。已先运行 `scan-all-rules.sh`（52/222 条可程序化规则，**No findings**），并据结果并入 §5，再由 LLM 补全未覆盖项。

---

## 1. 审查范围

| 项 | 值 |
|----|-----|
| `.java` 文件数 | 7（4 主类 + 3 测试类） |
| 变更行数 | Java 实现与测试全部为新增；本轮 review 对应 impl.md 声明的 todo 模块交付物 |

| 类/接口 | 路径 | 角色 |
|---------|------|------|
| TodoItem | `src/main/java/com/antdigital/todo/TodoItem.java` | 领域实体（不可变，字段校验/trim/ID/时间） |
| TodoRepository | `src/main/java/com/antdigital/todo/TodoRepository.java` | 仓储端口（save / findAll） |
| InMemoryTodoRepository | `src/main/java/com/antdigital/todo/InMemoryTodoRepository.java` | 内存适配器 |
| TodoService | `src/main/java/com/antdigital/todo/TodoService.java` | 应用服务（创建用例） |
| TodoItemTest | `src/test/java/com/antdigital/todo/TodoItemTest.java` | 领域实体单测 |
| InMemoryTodoRepositoryTest | `src/test/java/com/antdigital/todo/InMemoryTodoRepositoryTest.java` | 内存仓储单测 |
| TodoServiceTest | `src/test/java/com/antdigital/todo/TodoServiceTest.java` | 应用服务单测 |

> 补充说明：本轮 coding 提交 `d5d3980` 只包含 `impl.md`、`docs/ARCHITECTURE.md`、`docs/modules/todo/README.md`；上述 7 个 Java 文件在其父提交 `e6f234e` 中已落库，工作区与 HEAD 一致（`git status` 干净）。审查范围以 impl.md 声明的 todo 模块交付物为准。

---

## 2. 问题计数

| P0 | P1 | P2 |
|----|----|-----|
| 0 | 0 | 3 |

---

## 3. Step 2 — 功能（REQ）

> REQ 来源约束：以下功能点均取自 `design.md` §1.5 与 PRD 原始描述，不发明范围外功能。

### REQ-1: 新增待办事项（F01）

| Scenario | 结果 | Spec证据 | 代码证据 | 说明 |
|----------|------|----------|----------|------|
| 给定名称+描述，创建一条待办并保存 | ✅ | design.md L45「F01 新增待办事项 P0 创建一条待办并保存」 | `TodoService.java:33-36`、`TodoServiceTest.java:23-31` | createTodo 构造实体后 save 并返回 |

### REQ-2: 名称必填校验（F02）

| Scenario | 结果 | Spec证据 | 代码证据 | 说明 |
|----------|------|----------|----------|------|
| name 为 None/空串/纯空白时拒绝 | ✅ | design.md L46、L303 R01「name 不能为 None、空串或仅含空白，抛 ValueError」；impl 采用 `IllegalArgumentException` | `TodoItem.java:31-33`、`TodoItemTest.java:31-44`、`TodoServiceTest.java:43-56` | `name == null || name.isBlank()` 预检抛出，异常文案一致 |

### REQ-3: 描述可选及归一化（F03）

| Scenario | 结果 | Spec证据 | 代码证据 | 说明 |
|----------|------|----------|----------|------|
| 描述可为 null，trim 后保存，null 转空串 | ✅ | design.md L47、L304-305 R02/R03 | `TodoItem.java:35-36`、`TodoItemTest.java:24-28` | `description == null ? "" : description.trim()` |

### REQ-4: 自动生成唯一 ID 与创建时间

| Scenario | 结果 | Spec证据 | 代码证据 | 说明 |
|----------|------|----------|----------|------|
| 生成全局唯一 UUID 与 UTC 创建时间 | ✅ | design.md L21、L244-247、S01 出参 | `TodoItem.java:34,37`、`TodoItemTest.java:46-53` | `UUID.randomUUID()` + `Instant.now()`（UTC） |

### REQ-5: 最小闭环仅创建

| Scenario | 结果 | Spec证据 | 代码证据 | 说明 |
|----------|------|----------|----------|------|
| 不涉及编辑/删除/状态/查询界面/权限/Web | ✅ | design.md §1.4 排除范围 | 模块仅含 save/findAll，无其它用例 | 符合最小闭环 |

**Step 2 结论**：5 个 REQ 全部满足，无 P0。

---

## 4. Step 3 — 可读性检查

> 对照 `readability-checklist.md` A1–A7。

| ID | 结果 | 说明 |
|----|------|------|
| A1 源文件格式 | ✅ | 文件名=顶层类名、UTF-8、无 Tab |
| A2 源文件结构/import | ⚠️ | `InMemoryTodoRepositoryTest.java:7` 的 `java.util.List` 与 `org.junit.*` 同属非静态组，但被空行拆成两组且字典序颠倒（`java` 应置于 `org` 前，A2.3/A2.4）——P2 风格项 |
| A3 代码样式 | ✅ | K&R、4 空格、行宽符合 |
| A4 命名规范 | ✅ | 类大驼峰、方法小驼峰、测试类 `XxxTest` |
| A5 编码实践 | ✅ | 无空 catch、@Override 合理 |
| A6 特定元素样式 | ✅ | 无数组风格/switch 问题 |
| A7 Javadoc | ✅ | public 类均有 Javadoc，简单 getter 自解释可省略 |

---

## 5. Step 4 — 可靠性检查

| 域 | 参考 | 结果 | 等级 | 说明 |
|----|------|------|------|-------------------------------------|
| 可靠性 | `reliability-checklist.md` G1–G17 | ✅（1 项 P2 建议） | P0–P2 | 预扫无命中；LLM 补扫见下 |
| 安全 | `security-checklist.md` S1–S10 | ✅ / N/A | P0–P1 | 无 SQL/Web/文件/序列化/硬编码，无注入面，全部 N/A（无相关变更） |
| Bug 模式 | `bug-pattern-checklist.md` B/M/I（120） | ✅ | P0–P2 | `scan-all-rules.sh`：**No findings（52/222）**；LLM 补扫未发现 Blocker/Major；`Instant.now()` 规避 M016（时区），无 M007 空 catch，JUnit5 `@Test` 齐全 |

**可靠性 G 逐类核销（与变更相关部分）**

| ID | 结果 | 说明 |
|----|------|------|
| G1 并发 | ⚠️(P2) | `InMemoryTodoRepository.java:17` 基于 `ArrayList` 非线程安全；design §5.1.3 已声明「本期无并发风险」并给出理由，属范围外。仅作未来多线程访问时的参考建议 |
| G2 幂等 | N/A | 无重试/MQ/定时任务，每笔独立 UUID，无幂等诉求 |
| G3 事务 | N/A | 无 DB 事务 |
| G4 SQL | N/A | 无 SQL |
| G5 消息 | N/A | 无 MQ |
| G6 缓存 | N/A | 无缓存 |
| G7 调度 | N/A | 无定时任务 |
| G8 防御编程 | ✅ | 无 I/O 流/连接/锁/线程池，无 catch 吞异常 |
| G9 网络调用 | N/A | 无外部调用 |
| G10 接口契约 | ✅ | name/description 语义清晰，无 null 混义 |
| G11 开发自测 | ✅ | 3 测试类 22 断言用例，覆盖正常/边界/异常/防御副本 |
| G12 资损 | N/A | 非资金场景 |
| G13 监控 | ✅/N/A | 无日志调用，不存在级别错配 |
| G14 时区/多租户 | ✅ | `Instant.now()` 存 UTC；无多租户（范围外） |
| G15 可灰度 | N/A | 无表结构/接口兼容变更（纯新增） |
| G16 可监控 | ⚠️(P2) | `TodoService.java:33` 无日志埋点；design §6.5 建议「可仅记录创建操作的日志点」，最小闭环未实现，作为后续补充项 |
| G17 可应急 | N/A | 纯新增，回退代码即可 |

---

## 6. Step 5 — 自定义扩展检查

| 域 | 参考 | 结果 | 等级 | 说明 |
|----|------|------|------|------------------------------------------|
| 自定义扩展 | `customized-checklist.md` U* | N/A(未启用自定义规则) | — | 清单仅含示例项 U1.1，无团队/项目私有红线 |

---

## 7. 结论

- **合并建议**：**通过（可合并）**
- **P0**：无
- **P1**：无
- **P2**：
  1. `A2.4` `InMemoryTodoRepositoryTest.java:7` — 非静态 import 分组与字典序（`java.util.List` 应在 `org.junit.*` 之前且不单独成组）
  2. `G1` `InMemoryTodoRepository.java:17` — `ArrayList` 非线程安全，未来多线程访问时建议换 `CopyOnWriteArrayList` 或加锁
  3. `G16` `TodoService.java:33` — 最小闭环无创建/校验日志埋点，可后续补充
- **一句话**：todo 新增最小闭环实现与系分规格完全对齐，分层清晰、校验正确、单测覆盖充分，无阻塞或高优问题，仅有 3 项可选优化建议。

---

## 7.1 问题片段

> P2 项均为轻微风格/可选建议。

- **P2** `A2.4` `src/test/java/com/antdigital/todo/InMemoryTodoRepositoryTest.java:7` — 非静态 import 组内字典序：`java.util.List` 应置于 `org.junit.*` 之前，且不应被空行单独成组。
  片段范围：`src/test/java/com/antdigital/todo/InMemoryTodoRepositoryTest.java:3-9`

```java
L3 |import org.junit.jupiter.api.BeforeEach;
L4 |import org.junit.jupiter.api.DisplayName;
L5 |import org.junit.jupiter.api.Test;
L6 |
L7 |import java.util.List;
L8 |
L9 |import static org.assertj.core.api.Assertions.assertThat;
```

- **P2** `G1` `src/main/java/com/antdigital/todo/InMemoryTodoRepository.java:17` — 内存存储用 `ArrayList`，单线程安全；若未来转为多实例/多线程共享访问，需替换线程安全容器或加锁。
  片段范围：`src/main/java/com/antdigital/todo/InMemoryTodoRepository.java:17-28`

```java
L17|    private final List<TodoItem> store = new ArrayList<>();
L18|
L19|    @Override
L20|    public TodoItem save(TodoItem item) {
L21|        store.add(item);
L22|        return item;
L23|    }
L24|
L25|    @Override
L26|    public List<TodoItem> findAll() {
L27|        return new ArrayList<>(store);
L28|    }
```

- **P2** `G16.1` `src/main/java/com/antdigital/todo/TodoService.java:33` — 无创建成功/参数校验失败日志点（design §6.5 建议项，最小闭环未实现）。
  片段范围：`src/main/java/com/antdigital/todo/TodoService.java:33-36`

```java
L33|    public TodoItem createTodo(String name, String description) {
L34|        TodoItem item = new TodoItem(name, description);
L35|        return repository.save(item);
L36|    }
```

---

## 8. 修复任务列表

### P0

- 无

### P1

- 无

### P2（可选）

- [ ] **P2** `src/test/java/com/antdigital/todo/InMemoryTodoRepositoryTest.java:7` — 调整 import：`java.util.List` 移至 `org.junit.jupiter.*` 之前，并与其它非静态 import 合并为同一组
- [ ] **P2** `src/main/java/com/antdigital/todo/InMemoryTodoRepository.java:17` — 评估未来并发访问场景，必要时改用 `CopyOnWriteArrayList` 或加锁
- [ ] **P2** `src/main/java/com/antdigital/todo/TodoService.java:33` — 按 design §6.5 补充创建成功/参数校验失败的日志埋点