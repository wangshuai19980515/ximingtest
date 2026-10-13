# Todo Creation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a minimal, in-memory todo creation feature for internal users, where each todo has a name and a description.

**Architecture:** Introduce a new `com.antdigital.todo` package containing a `TodoItem` domain model, a `TodoRepository` abstraction with an in-memory implementation, and a `TodoService` that exposes a `create(name, description)` method. The project already uses JUnit 5 + AssertJ, so the existing test stack is reused.

**Tech Stack:** Java 17, Maven, JUnit 5.10.2, AssertJ 3.26.0

## Global Constraints

- Java source/target: 17
- Existing dependency stack only — do not add new libraries
- Follow the existing package convention `com.antdigital.<module>`
- Tests must use JUnit 5 + AssertJ, matching the existing `BubbleSortTest` style
- No persistence layer unless explicitly required later (YAGNI)
- All new files live under `src/main/java/com/antdigital/todo` and `src/test/java/com/antdigital/todo`

---

### Task 1: Create the `TodoItem` domain model

**Files:**
- Create: `src/main/java/com/antdigital/todo/TodoItem.java`

**Interfaces:**
- Consumes: nothing (pure data class)
- Produces: `TodoItem` with at least the following public accessors:
  - `Long getId()`
  - `String getName()`
  - `String getDescription()`

- [ ] **Step 1: Write the class**

```java
package com.antdigital.todo;

import java.util.Objects;

public final class TodoItem {
    private final Long id;
    private final String name;
    private final String description;

    public TodoItem(Long id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
}
```

- [ ] **Step 2: Verify file compiles**

Run: `mvn compile -q`
Expected: BUILD SUCCESS

- [ ] **Step 3: Commit**

```bash
git add src/main/java/com/antdigital/todo/TodoItem.java
git commit -m "feat(todo): add TodoItem domain model"
```

---

### Task 2: Create the repository interface and in-memory implementation

**Files:**
- Create: `src/main/java/com/antdigital/todo/TodoRepository.java`
- Create: `src/main/java/com/antdigital/todo/InMemoryTodoRepository.java`

**Interfaces:**
- Consumes: `TodoItem` from Task 1
- Produces:
  - `void save(TodoItem item)`
  - `TodoItem findById(Long id)`

- [ ] **Step 1: Write the repository interface**

```java
package com.antdigital.todo;

public interface TodoRepository {
    void save(TodoItem item);
    TodoItem findById(Long id);
}
```

- [ ] **Step 2: Write the in-memory implementation**

```java
package com.antdigital.todo;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public final class InMemoryTodoRepository implements TodoRepository {
    private final Map<Long, TodoItem> store = new ConcurrentHashMap<>();

    @Override
    public void save(TodoItem item) {
        if (item == null) {
            throw new IllegalArgumentException("Todo item cannot be null");
        }
        store.put(item.getId(), item);
    }

    @Override
    public TodoItem findById(Long id) {
        return store.get(id);
    }
}
```

- [ ] **Step 3: Verify it compiles**

Run: `mvn compile -q`
Expected: BUILD SUCCESS

- [ ] **Step 4: Commit**

```bash
git add src/main/java/com/antdigital/todo/TodoRepository.java src/main/java/com/antdigital/todo/InMemoryTodoRepository.java
git commit -m "feat(todo): add in-memory todo repository"
```

---

### Task 3: Create the `TodoService` for creating todos

**Files:**
- Create: `src/main/java/com/antdigital/todo/TodoService.java`

**Interfaces:**
- Consumes: `TodoRepository.save(TodoItem)` from Task 2
- Produces: `TodoItem create(String name, String description)`

- [ ] **Step 1: Write the failing test first (TDD)**

Create `src/test/java/com/antdigital/todo/TodoServiceTest.java`:

```java
package com.antdigital.todo;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class TodoServiceTest {

    private TodoService todoService;

    @BeforeEach
    void setUp() {
        TodoRepository repository = new InMemoryTodoRepository();
        todoService = new TodoService(repository);
    }

    @Test
    @DisplayName("正常路径：创建待办事项后应返回包含名称和描述的 TodoItem")
    void should_returnTodoItemWithNameAndDescription_when_createTodo() {
        // Act
        TodoItem result = todoService.create("购买牛奶", "去超市买脱脂牛奶");

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getId()).isNotNull();
        assertThat(result.getName()).isEqualTo("购买牛奶");
        assertThat(result.getDescription()).isEqualTo("去超市买脱脂牛奶");
    }

    @Test
    @DisplayName("边界值：事项名称为空时应抛出异常")
    void should_throwException_when_nameIsBlank() {
        assertThatThrownBy(() -> todoService.create("", "描述"))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("事项名称不能为空");
    }

    @Test
    @DisplayName("边界值：描述为空时应抛出异常")
    void should_throwException_when_descriptionIsBlank() {
        assertThatThrownBy(() -> todoService.create("名称", ""))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("描述不能为空");
    }
}
```

- [ ] **Step 2: Run the failing test**

Run: `mvn test -Dtest=TodoServiceTest -q`
Expected: Tests fail because `TodoService` does not exist or method missing

- [ ] **Step 3: Implement the service**

```java
package com.antdigital.todo;

import java.util.concurrent.atomic.AtomicLong;

public final class TodoService {
    private final TodoRepository todoRepository;
    private final AtomicLong idGenerator = new AtomicLong(1L);

    public TodoService(TodoRepository todoRepository) {
        if (todoRepository == null) {
            throw new IllegalArgumentException("TodoRepository cannot be null");
        }
        this.todoRepository = todoRepository;
    }

    public TodoItem create(String name, String description) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("事项名称不能为空");
        }
        if (description == null || description.isBlank()) {
            throw new IllegalArgumentException("描述不能为空");
        }
        TodoItem item = new TodoItem(idGenerator.getAndIncrement(), name, description);
        todoRepository.save(item);
        return item;
    }
}
```

- [ ] **Step 4: Run the tests again**

Run: `mvn test -Dtest=TodoServiceTest -q`
Expected: BUILD SUCCESS, tests pass

- [ ] **Step 5: Commit**

```bash
git add src/main/java/com/antdigital/todo/TodoService.java src/test/java/com/antdigital/todo/TodoServiceTest.java
git commit -m "feat(todo): implement todo creation with validation"
```

---

### Task 4: Run the full Maven test suite

**Files:**
- None to create; verifies Tasks 1–3

**Interfaces:**
- Consumes: `TodoServiceTest` and `BubbleSortTest`
- Produces: green build confirmation

- [ ] **Step 1: Run all tests**

```bash
mvn test -q
```

Expected: BUILD SUCCESS, all tests pass

- [ ] **Step 2: Commit (if build is green)**

No file changes required for this step; if a build status note is needed, document it in the next task.

---

### Task 5: Optional — add a tiny README note

**Files:**
- Modify: `README.md` (if it exists; create it only if the project already has one)

If the project already has a README, append a short usage section. If not, skip this task.

- [ ] **Step 1: Document the new feature**

Example snippet to append:

```markdown
## 待办事项

新增待办事项：

```java
TodoService service = new TodoService(new InMemoryTodoRepository());
TodoItem item = service.create("购买牛奶", "去超市买脱脂牛奶");
```
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add todo creation usage note"
```

---

## Self-Review

1. **Spec coverage:** The requirement was to create a minimal todo feature with name + description for internal users. Each requirement maps to a task: `TodoItem` (Task 1), persistence (Task 2), creation with validation (Task 3), and verification (Task 4).
2. **Placeholder scan:** No placeholders; every file, command, and code snippet is concrete.
3. **Type consistency:** `TodoItem` uses `Long id`, `String name`, `String description`; `TodoRepository.save` and `TodoRepository.findById` use the same `TodoItem` and `Long` types; `TodoService.create` returns `TodoItem`.

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-10-13-todo-creation.md`.

Recommended next step: dispatch using `superpowers:subagent-driven-development` for task-by-task implementation, or run `superpowers:executing-plans` for inline execution.
