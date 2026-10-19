# Code Review Checklist

> **Change** `帮助用户记录日常待办事项_核心功能（todo 最小闭环新增）` · **分支/Commit** `task/DEV-…be863` / `d5d3980` · **日期** `2026-10-19`
>
> **AI**：唯一进度源；状态仅用 `⬜` `✅` `❌` `⚠️` `N/A`。
> **自动化预扫**：已在仓库根目录运行 `scan-all-rules.sh src/main/java/com/antdigital/todo src/test/java/com/antdigital/todo`，结果 **No findings（52/222 条可程序化规则）**。

---

## Step 1 — 执行队列（产物 A）

| # | 文件（仓库相对路径） | 归属原因 | 总状态 |
|---|----------------------|----------|--------|
| 1 | `src/main/java/com/antdigital/todo/TodoItem.java` | F01/F02/F03/R01-R03 | ✅ 已审 |
| 2 | `src/main/java/com/antdigital/todo/TodoRepository.java` | S02/S03 仓储端口 | ✅ 已审 |
| 3 | `src/main/java/com/antdigital/todo/InMemoryTodoRepository.java` | S02/S03 内存适配器 | ⚠️ 已审有问题(G1 P2) |
| 4 | `src/main/java/com/antdigital/todo/TodoService.java` | S01 应用服务 | ⚠️ 已审有问题(G16 P2) |
| 5 | `src/test/java/com/antdigital/todo/TodoItemTest.java` | 领域实体单测 | ✅ 已审 |
| 6 | `src/test/java/com/antdigital/todo/InMemoryTodoRepositoryTest.java` | 内存仓储单测 | ⚠️ 已审有问题(A2.4 P2) |
| 7 | `src/test/java/com/antdigital/todo/TodoServiceTest.java` | 应用服务单测 | ✅ 已审 |

> 收口：执行队列全部非 ⬜；无跳过文件。

---

## Step 2 — 功能（产物 B）

| REQ | Scenario | Spec证据（原文/章节） | 关联文件 | 状态 | 代码证据 |
|-----|----------|----------------------|----------|------|----------|
| REQ-1 新增待办 | 名称+描述创建并保存 | `design.md L45 F01` | `TodoService.java` | ✅ | `TodoService.java:33-36` |
| REQ-2 名称必填 | null/空/纯空白拒绝 | `design.md L46 F02、L303 R01` | `TodoItem.java` | ✅ | `TodoItem.java:31-33` |
| REQ-3 描述可选 | null 转空串 + trim | `design.md L47 F03、L305 R03` | `TodoItem.java` | ✅ | `TodoItem.java:36` |
| REQ-4 唯一 ID/时间 | UUID + UTC 时间 | `design.md L21、L244-247` | `TodoItem.java` | ✅ | `TodoItem.java:34,37` |
| REQ-5 最小闭环 | 仅创建，无其它用例 | `design.md §1.4` | 模块整体 | ✅ | 仅有 save/findAll |

---

## Step 3 — 可读性检查（产物 C）

| ID | 检查项 | 状态 | 备注 |
|----|--------|------|------|
| A1 | 源文件格式 | ✅ | UTF-8、文件名=类名 |
| A2 | 源文件结构/import 顺序 | ⚠️ | `InMemoryTodoRepositoryTest.java:7` 非静态 import 分组/排序（P2） |
| A3 | 代码样式 | ✅ | K&R、4 空格、行宽 |
| A4 | 命名规范 | ✅ | 符合驼峰与 Test 后缀 |
| A5 | 编码实践 | ✅ | 无空 catch、@Override 合理 |
| A6 | 特定元素样式 | ✅ | 无违规 |
| A7 | Javadoc 规范 | ✅ | 类均有 Javadoc |

---

## Step 4 — 可靠性检查（产物 D）

### 4.1 Bug 模式（预扫 52/222，No findings；LLM 补扫无 Blocker/Major/Info 命中）

- 预扫脚本输出：`=== No findings. 52/222 rules scanned ===`
- LLM 关键补扫结论：
  - `B001/B006/B011/B026/B066` N/A（无对应模式）
  - `M007` ✅ 无空 catch；`M016` ✅ 用 `Instant.now()` 无默认时区依赖；`M017` ✅ JUnit5 `@Test` 齐全；`M008` N/A（未重写 equals/hashCode，按引用语义当前够用）
  - `I001` ✅ 异常断言含 `hasMessageContaining`；`I004` ✅ 使用 `Instant`
  - 其余 B/M/I 规则在 7 个文件范围内均无匹配，判定 N/A（无对应代码形态）

### 4.2 可靠性（G）

| ID | 状态 | 备注 |
|----|------|------|
| G1.1/G1.2 | N/A | 无事务/先读后写更新 |
| G1.3 | N/A | 无乐观锁 |
| G1.4 | ⚠️(P2) | `InMemoryTodoRepository.java:17` ArrayList 非线程安全（design 声明本期无并发） |
| G2.1-G2.3 | N/A | 无幂等诉求 |
| G3.1/G3.2 | N/A | 无 DB 事务 |
| G4.1-G4.3 | N/A | 无 SQL |
| G5.1 | N/A | 无 MQ |
| G6.1/G6.2 | N/A | 无缓存 |
| G7.1/G7.2 | N/A | 无定时任务 |
| G8.1-G8.6 | ✅/N/A | 无 I/O/连接/线程池/ThreadLocal |
| G9.1-G9.3 | N/A | 无外部调用 |
| G10.1/G10.2 | ✅ | 语义清晰，无 null 混义 |
| G11.1-G11.4 | ✅ | 22 用例覆盖边界与异常 |
| G12.1/G12.2 | N/A | 非资金 |
| G13.1 | ✅ | 无日志级别错配 |
| G14.1/G14.2 | N/A | 无金额/多租户 |
| G14.3/G14.4 | ✅ | `Instant.now()` 存 UTC |
| G15.1-G15.3 | N/A | 纯新增，无兼容变更 |
| G16.1 | ⚠️(P2) | `TodoService.java:33` 无日志埋点（design §6.5 建议） |
| G16.2-G16.4 | ✅ | 无 catch 吞异常 |
| G17.1-G17.3 | N/A | 回退代码即可，无开关/数据变更 |

### 4.3 安全（S）

| ID | 状态 | 备注 |
|----|------|------|
| S1.1-S1.3 | N/A | 无 SQL |
| S2.1-S2.3 | N/A | 无 Web 输出 |
| S3.1-S3.3 | N/A | 无外部 URL |
| S4.1/S4.2 | N/A | 无命令执行 |
| S5.1/S5.2 | N/A | 无 XML |
| S6.1-S6.3 | N/A | 无反序列化 |
| S7.1-S7.3 | N/A | 无文件上传 |
| S8.1-S8.4 | N/A | 无 Web 鉴权 |
| S9.1-S9.4 | N/A | 无密钥/敏感数据 |
| S10.1-S10.3 | N/A | 无 CSRF/CORS/跳转 |

---

## Step 5 — 自定义扩展检查（产物 E）

| ID | 状态 | 备注 |
|----|------|------|
| U1.1 | N/A(未启用自定义规则) | 示例项，未启用 |

---

## 终检（防漏检）

- [x] 执行队列 7 文件全部非 ⬜
- [x] Step 2 全部 REQ 非 ⬜
- [x] Step 3 A1–A7 非 ⬜
- [x] Step 4 G/S 全部核销（预扫 + LLM 补扫）
- [x] Step 5 U* 标记 N/A(未启用)
- [x] 所有 ❌/⚠️ 已写入 report（含 ID + path:line）：A2.4、G1.4、G16.1 均为 P2

**汇总**：P0=0，P1=0，P2=3 → 合并建议「通过（可合并）」。