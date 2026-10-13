package com.antdigital.todo;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * TodoService 应用服务单元测试
 *
 * @author aiwork
 * @date 2026/10/13
 */
class TodoServiceTest {

    private InMemoryTodoRepository repository;
    private TodoService service;

    @BeforeEach
    void setUp() {
        repository = new InMemoryTodoRepository();
        service = new TodoService(repository);
    }

    @Test
    @DisplayName("正常路径：创建待办事项并持久化到仓库")
    void should_createAndPersistTodo_withNameAndDescription() {
        // Act
        TodoItem created = service.createTodo("需求评审", "评审创建功能");

        // Assert
        assertThat(created.getName()).isEqualTo("需求评审");
        assertThat(created.getDescription()).isEqualTo("评审创建功能");
        assertThat(created.getId()).isNotBlank();
        assertThat(created.getCreatedAt()).isNotNull();
        assertThat(repository.findAll()).containsExactly(created);
    }

    @Test
    @DisplayName("正常路径：描述为 null 时仍可成功创建")
    void should_createTodo_when_descriptionIsNull() {
        // Act
        TodoItem created = service.createTodo("需求评审", null);

        // Assert
        assertThat(created.getDescription()).isEmpty();
        assertThat(repository.findAll()).hasSize(1);
    }

    @Test
    @DisplayName("异常路径：名称为空白时应抛出 IllegalArgumentException")
    void should_throwException_when_nameIsBlank() {
        // Act & Assert
        assertThatThrownBy(() -> service.createTodo("   ", "描述"))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("事项名称不能为空");
    }

    @Test
    @DisplayName("异常路径：名称为 null 时应抛出 IllegalArgumentException")
    void should_throwException_when_nameIsNull() {
        // Act & Assert
        assertThatThrownBy(() -> service.createTodo(null, "描述"))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("事项名称不能为空");
    }

    @Test
    @DisplayName("正常路径：多次创建后仓库包含所有事项")
    void should_accumulateMultipleTodos() {
        // Act
        service.createTodo("任务A", "描述A");
        service.createTodo("任务B", "描述B");

        // Assert
        assertThat(repository.findAll()).hasSize(2);
    }
}