# 待办事项创建功能实施计划（最小闭环：仅创建）

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为内部用户提供"新增待办事项"能力：录入事项名称与描述，保存到内存待办列表。

**Architecture:** 本仓库是纯 Java 库工程（jar 打包，无 Spring/DB/REST，现状与 `com.antdigital.algorithm` 一致）。新增 `com.antdigital.todo` 包：`TodoItem` 不可变值对象承载「名称 + 描述」，`TodoList` 内存集合提供 `add` 创建入口，并通过 `getItems()` 返回不可变快照用于观测。遵循 YAGNI：仅实现创建，不做持久化、列表页面、修改、删除、完成标记与用户体系。

**Tech Stack:** Java 17、Maven、JUnit Jupiter 5.10.2、AssertJ 3.26.0（全部为仓库现有依赖，零新增）。

## Global Constraints

- Java 17（`maven.compiler.source/target=17`），源码编码 UTF-8。
- 不修改 `pom.xml`，不新增任何依赖。
- 新代码全部放入 `com.antdigital.todo` 包；不改动 `com.antdigital.algorithm` 现有代码。
- 代码风格沿用仓库惯例：中文 Javadoc、`@author aiwork`、`@date 2026/10/13`、卫语句参数校验、中文异常消息。
- 测试风格沿用仓库惯例：JUnit 5 + AssertJ、中文 `@DisplayName`、`should_xxx_when_yyy` 方法命名、Arrange/Act/Assert 注释。
- 最小闭环范围：仅"创建"。明确不做：持久化、REST/API、查询列表页、修改、删除、完成标记、用户体系、鉴权。
- 提交纪律：每个 Task 结束一次提交，消息格式 `feat: <中文描述>`（流水线模式下由 coding 阶段统一提交亦可，等价）。
- 环境前置：执行环境需 JDK 17 + Maven 3.6+（规划阶段沙箱未安装 JDK/Maven；coding 阶段须在标准构建环境中执行本计划中的 `mvn` 命令）。

## 文件结构（File Structure）

| 文件 | 职责 | 动作 |
|---|---|---|
| `src/main/java/com/antdigital/todo/TodoItem.java` | 待办事项不可变值对象：名称（必填、非空白）+ 描述（可选，null 归一化为 `""`），含值语义 `equals`/`hashCode`/`toString` | 新建 |
| `src/test/java/com/antdigital/todo/TodoItemTest.java` | `TodoItem` 单元测试（5 例） | 新建 |
| `src/main/java/com/antdigital/todo/TodoList.java` | 内存待办列表：`add` 新增 + `getItems` 不可变快照 | 新建 |
| `src/test/java/com/antdigital/todo/TodoListTest.java` | `TodoList` 单元测试（5 例） | 新建 |

不改动的文件：`pom.xml`、`src/main/java/com/antdigital/algorithm/**`、`src/test/java/com/antdigital/algorithm/**`。

回归基线：现有 `BubbleSortTest` 共 8 个用例。Task 1 完成后全量应为 13 个用例，Task 2 完成后全量应为 18 个用例，全部通过。

---

### Task 1: TodoItem 待办事项值对象

**Files:**
- Create: `src/main/java/com/antdigital/todo/TodoItem.java`
- Test: `src/test/java/com/antdigital/todo/TodoItemTest.java`

**Interfaces:**
- Consumes: 无（首个任务，无上游依赖）。
- Produces: `public final class TodoItem`；构造器 `public TodoItem(String name, String description)`（`name` 为 null 或空白字符串时抛 `IllegalArgumentException("待办事项名称不能为空")`；`description` 为 null 时归一化为 `""`）；`public String getName()`；`public String getDescription()`（永不为 null）；值语义 `equals`/`hashCode`（名称与描述均相同即相等）。Task 2 依赖以上全部签名。

- [ ] **Step 1: 编写失败测试**

创建 `src/test/java/com/antdigital/todo/TodoItemTest.java`：

```java
package com.antdigital.todo;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * 待办事项值对象单元测试
 *
 * @author aiwork
 * @date 2026/10/13
 */
class TodoItemTest {

    @Test
    @DisplayName("正常路径：创建待办事项后应能读取名称和描述")
    void should_returnNameAndDescription_when_createTodoItem() {
        // Arrange
        String name = "写周报";
        String description = "本周完成冒泡排序模块";

        // Act
        TodoItem item = new TodoItem(name, description);

        // Assert
        assertThat(item.getName()).isEqualTo("写周报");
        assertThat(item.getDescription()).isEqualTo("本周完成冒泡排序模块");
    }

    @Test
    @DisplayName("边界值：描述为null时应归一化为空字符串")
    void should_returnEmptyDescription_when_descriptionIsNull() {
        // Arrange
        String name = "买咖啡";

        // Act
        TodoItem item = new TodoItem(name, null);

        // Assert
        assertThat(item.getDescription()).isEmpty();
    }

    @Test
    @DisplayName("异常路径：名称为null时应抛出IllegalArgumentException")
    void should_throwIllegalArgumentException_when_nameIsNull() {
        // Act & Assert
        assertThatThrownBy(() -> new TodoItem(null, "描述"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("待办事项名称不能为空");
    }

    @Test
    @DisplayName("异常路径：名称为空白字符串时应抛出IllegalArgumentException")
    void should_throwIllegalArgumentException_when_nameIsBlank() {
        // Act & Assert
        assertThatThrownBy(() -> new TodoItem("   ", "描述"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("待办事项名称不能为空");
    }

    @Test
    @DisplayName("值相等：名称与描述均相同的两个待办事项应相等")
    void should_beEqual_when_nameAndDescriptionAreSame() {
        // Arrange
        TodoItem first = new TodoItem("写周报", "本周总结");
        TodoItem second = new TodoItem("写周报", "本周总结");

        // Act & Assert
        assertThat(first).isEqualTo(second);
        assertThat(first.hashCode()).isEqualTo(second.hashCode());
    }
}
```

- [ ] **Step 2: 运行测试确认失败（红）**

Run: `mvn test -Dtest=TodoItemTest`

Expected: BUILD FAILURE，测试编译阶段报 `COMPILATION ERROR`，形如 `cannot find symbol: class TodoItem`（`TodoItem` 尚未创建，TDD 红灯确认）。

- [ ] **Step 3: 编写最小实现**

创建 `src/main/java/com/antdigital/todo/TodoItem.java`：

```java
package com.antdigital.todo;

import java.util.Objects;

/**
 * 待办事项值对象
 * <p>
 * 承载单条待办事项的信息：事项名称与描述。
 * 名称是待办事项的必填标识，不能为null或空白；描述可选，null 将被归一化为空字符串。
 * 本类为不可变对象，创建后字段不可修改。
 * </p>
 *
 * @author aiwork
 * @date 2026/10/13
 */
public final class TodoItem {

    /** 待办事项名称（必填，非空白） */
    private final String name;

    /** 待办事项描述（可选，null 归一化为空字符串） */
    private final String description;

    /**
     * 构造一个待办事项。
     *
     * @param name        事项名称，不能为null或空白字符串
     * @param description 事项描述，可为null，内部归一化为空字符串
     * @throws IllegalArgumentException 如果名称为null或空白字符串
     */
    public TodoItem(String name, String description) {
        // 参数校验：卫语句
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("待办事项名称不能为空");
        }
        this.name = name;
        this.description = description == null ? "" : description;
    }

    /**
     * 获取事项名称。
     *
     * @return 事项名称，永不为null
     */
    public String getName() {
        return name;
    }

    /**
     * 获取事项描述。
     *
     * @return 事项描述，永不为null
     */
    public String getDescription() {
        return description;
    }

    /**
     * 值相等判断：名称与描述均相同即视为同一待办事项。
     *
     * @param obj 待比较对象
     * @return 名称与描述均相同时返回 true
     */
    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (!(obj instanceof TodoItem other)) {
            return false;
        }
        return name.equals(other.name) && description.equals(other.description);
    }

    /**
     * 基于名称与描述计算哈希值。
     *
     * @return 哈希值
     */
    @Override
    public int hashCode() {
        return Objects.hash(name, description);
    }

    /**
     * 返回可读的字符串表示，便于日志与调试。
     *
     * @return 形如 {@code TodoItem{name='写周报', description='本周总结'}} 的字符串
     */
    @Override
    public String toString() {
        return "TodoItem{name='" + name + "', description='" + description + "'}";
    }
}
```

- [ ] **Step 4: 运行测试确认通过（绿）**

Run: `mvn test -Dtest=TodoItemTest`

Expected: BUILD SUCCESS，`Tests run: 5, Failures: 0, Errors: 0, Skipped: 0`。

- [ ] **Step 5: 全量回归**

Run: `mvn test`

Expected: BUILD SUCCESS，`Tests run: 13, Failures: 0, Errors: 0, Skipped: 0`（BubbleSortTest 8 + TodoItemTest 5）。

- [ ] **Step 6: 提交**

```bash
git add src/main/java/com/antdigital/todo/TodoItem.java src/test/java/com/antdigital/todo/TodoItemTest.java
git commit -m "feat: 新增待办事项值对象 TodoItem（名称+描述）"
```

---

### Task 2: TodoList 待办列表（新增待办）

**Files:**
- Create: `src/main/java/com/antdigital/todo/TodoList.java`
- Test: `src/test/java/com/antdigital/todo/TodoListTest.java`

**Interfaces:**
- Consumes: Task 1 的 `new TodoItem(String name, String description)`、`getName()`、`getDescription()` 及值语义 `equals`（`containsExactly` 断言依赖 equals）。
- Produces: `public final class TodoList`；`public void add(TodoItem item)`（`item` 为 null 时抛 `IllegalArgumentException("待办事项不能为null")`）；`public java.util.List<TodoItem> getItems()`（按插入顺序排列的不可变快照，永不为 null）。

- [ ] **Step 1: 编写失败测试**

创建 `src/test/java/com/antdigital/todo/TodoListTest.java`：

```java
package com.antdigital.todo;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * 待办事项列表单元测试
 *
 * @author aiwork
 * @date 2026/10/13
 */
class TodoListTest {

    @Test
    @DisplayName("正常路径：新增一条待办事项后列表应包含该事项")
    void should_containItem_when_addSingleTodoItem() {
        // Arrange
        TodoList todoList = new TodoList();
        TodoItem item = new TodoItem("写周报", "本周完成冒泡排序模块");

        // Act
        todoList.add(item);

        // Assert
        assertThat(todoList.getItems()).containsExactly(item);
    }

    @Test
    @DisplayName("正常路径：连续新增多条待办事项应保持添加顺序")
    void should_keepInsertionOrder_when_addMultipleTodoItems() {
        // Arrange
        TodoList todoList = new TodoList();
        TodoItem first = new TodoItem("写周报", "总结本周工作");
        TodoItem second = new TodoItem("买咖啡", null);

        // Act
        todoList.add(first);
        todoList.add(second);

        // Assert
        assertThat(todoList.getItems()).containsExactly(first, second);
    }

    @Test
    @DisplayName("边界值：新建列表应为空")
    void should_returnEmptyList_when_todoListIsNew() {
        // Arrange & Act
        TodoList todoList = new TodoList();

        // Assert
        assertThat(todoList.getItems()).isEmpty();
    }

    @Test
    @DisplayName("异常路径：新增null待办事项应抛出IllegalArgumentException")
    void should_throwIllegalArgumentException_when_addNullItem() {
        // Arrange
        TodoList todoList = new TodoList();

        // Act & Assert
        assertThatThrownBy(() -> todoList.add(null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("待办事项不能为null");
    }

    @Test
    @DisplayName("防御性：修改返回的列表应抛出UnsupportedOperationException且不影响内部状态")
    void should_throwUnsupportedOperation_when_modifyReturnedList() {
        // Arrange
        TodoList todoList = new TodoList();
        todoList.add(new TodoItem("写周报", "总结本周工作"));
        List<TodoItem> exposed = todoList.getItems();

        // Act & Assert
        assertThatThrownBy(() -> exposed.add(new TodoItem("买咖啡", null)))
                .isInstanceOf(UnsupportedOperationException.class);
        assertThat(todoList.getItems()).hasSize(1);
    }
}
```

- [ ] **Step 2: 运行测试确认失败（红）**

Run: `mvn test -Dtest=TodoListTest`

Expected: BUILD FAILURE，测试编译阶段报 `COMPILATION ERROR`，形如 `cannot find symbol: class TodoList`（`TodoList` 尚未创建，TDD 红灯确认）。

- [ ] **Step 3: 编写最小实现**

创建 `src/main/java/com/antdigital/todo/TodoList.java`：

```java
package com.antdigital.todo;

import java.util.ArrayList;
import java.util.List;

/**
 * 待办事项列表
 * <p>
 * 内存态的待办事项集合，支持新增待办事项（最小闭环：仅创建）。
 * 内部使用 {@link ArrayList} 按插入顺序维护，通过 {@link #getItems()}
 * 返回不可变快照，避免外部修改破坏内部状态。
 * </p>
 *
 * @author aiwork
 * @date 2026/10/13
 */
public final class TodoList {

    /** 内部待办事项存储，按插入顺序维护 */
    private final List<TodoItem> items = new ArrayList<>();

    /**
     * 新增一条待办事项。
     *
     * @param item 待新增的待办事项，不能为null
     * @throws IllegalArgumentException 如果待办事项为null
     */
    public void add(TodoItem item) {
        // 参数校验：卫语句
        if (item == null) {
            throw new IllegalArgumentException("待办事项不能为null");
        }
        items.add(item);
    }

    /**
     * 获取当前全部待办事项的不可变快照。
     *
     * @return 按插入顺序排列的待办事项列表，永不为null
     */
    public List<TodoItem> getItems() {
        return List.copyOf(items);
    }
}
```

- [ ] **Step 4: 运行测试确认通过（绿）**

Run: `mvn test -Dtest=TodoListTest`

Expected: BUILD SUCCESS，`Tests run: 5, Failures: 0, Errors: 0, Skipped: 0`。

- [ ] **Step 5: 全量回归**

Run: `mvn test`

Expected: BUILD SUCCESS，`Tests run: 18, Failures: 0, Errors: 0, Skipped: 0`（BubbleSortTest 8 + TodoItemTest 5 + TodoListTest 5）。

- [ ] **Step 6: 提交**

```bash
git add src/main/java/com/antdigital/todo/TodoList.java src/test/java/com/antdigital/todo/TodoListTest.java
git commit -m "feat: 新增待办列表 TodoList 支持创建待办事项"
```

---

## 需求覆盖对照（Spec Coverage）

| 需求条目 | 覆盖位置 |
|---|---|
| 目标：帮助用户记录日常待办事项 | Task 1 + Task 2（内存态记录） |
| 核心功能：新增待办事项 | Task 2 `TodoList.add(TodoItem)` |
| 任务信息：事项名称和描述 | Task 1 `TodoItem(String name, String description)` |
| 目标用户：内部用户 | 纯库交付、无鉴权要求（内部工具场景，范围外） |
| 最小闭环：仅创建 | Global Constraints 排除清单（持久化/列表页/修改/删除/完成标记均不做） |

## 执行交接（Execution Handoff）

本计划已保存，两种执行方式：

1. **Subagent-Driven（推荐）** — 每个 Task 派发独立子代理实现，Task 间两阶段评审（REQUIRED SUB-SKILL: superpowers:subagent-driven-development）。
2. **Inline Execution** — 在当前会话内按 superpowers:executing-plans 分批执行并设检查点。

按流水线全自动模式，本计划直接移交后续 coding 阶段执行，默认采用方式 1（若子代理不可用则回退方式 2）。
