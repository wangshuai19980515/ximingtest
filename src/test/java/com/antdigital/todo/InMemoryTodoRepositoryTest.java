package com.antdigital.todo;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * 内存待办事项仓库单元测试
 *
 * @author aiwork
 * @date 2026/10/13
 */
class InMemoryTodoRepositoryTest {

    private InMemoryTodoRepository repository;

    @BeforeEach
    void setUp() {
        repository = new InMemoryTodoRepository();
    }

    @Test
    @DisplayName("正常路径：保存后 findAll 可查询到已保存事项")
    void should_findSavedItem_afterSave() {
        // Arrange
        TodoItem item = new TodoItem("需求评审", "评审创建功能");

        // Act
        TodoItem saved = repository.save(item);

        // Assert
        assertThat(saved).isSameAs(item);
        assertThat(repository.findAll()).containsExactly(item);
    }

    @Test
    @DisplayName("边界值：未保存任何事项时 findAll 返回空列表")
    void should_returnEmptyList_when_noItemsSaved() {
        // Act
        List<TodoItem> result = repository.findAll();

        // Assert
        assertThat(result).isEmpty();
    }

    @Test
    @DisplayName("正常路径：多次保存后 findAll 返回所有事项")
    void should_returnAllSavedItems_when_multipleSaved() {
        // Arrange
        TodoItem item1 = new TodoItem("任务一", "描述一");
        TodoItem item2 = new TodoItem("任务二", "描述二");

        // Act
        repository.save(item1);
        repository.save(item2);

        // Assert
        assertThat(repository.findAll()).containsExactly(item1, item2);
    }

    @Test
    @DisplayName("防御性：findAll 返回列表修改不影响仓库内部数据")
    void should_notAffectInternalStore_when_findAllResultModified() {
        // Arrange
        TodoItem item = new TodoItem("任务", "描述");
        repository.save(item);

        // Act
        List<TodoItem> result = repository.findAll();
        result.clear();

        // Assert
        assertThat(repository.findAll()).containsExactly(item);
    }
}