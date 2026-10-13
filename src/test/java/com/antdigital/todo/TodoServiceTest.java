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
