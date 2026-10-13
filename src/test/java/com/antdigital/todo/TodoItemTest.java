package com.antdigital.todo;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * TodoItem 领域实体单元测试
 *
 * @author aiwork
 * @date 2026/10/13
 */
class TodoItemTest {

    @Test
    @DisplayName("正常路径：构造时应保存名称和描述并自动生成 ID 与创建时间")
    void should_createItemWithNameDescriptionIdAndCreatedAt() {
        // Arrange & Act
        TodoItem item = new TodoItem("  需求评审  ", "  评审最小闭环创建功能  ");

        // Assert
        assertThat(item.getId()).isNotBlank();
        assertThat(item.getName()).isEqualTo("需求评审");
        assertThat(item.getDescription()).isEqualTo("评审最小闭环创建功能");
        assertThat(item.getCreatedAt()).isNotNull();
    }

    @Test
    @DisplayName("边界值：描述为 null 时应存储空字符串")
    void should_storeEmptyDescription_when_descriptionIsNull() {
        // Arrange & Act
        TodoItem item = new TodoItem("需求评审", null);

        // Assert
        assertThat(item.getDescription()).isEmpty();
    }

    @Test
    @DisplayName("异常路径：名称为 null 时应抛出 IllegalArgumentException")
    void should_throwException_when_nameIsNull() {
        // Act & Assert
        assertThatThrownBy(() -> new TodoItem(null, "描述"))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("事项名称不能为空");
    }

    @Test
    @DisplayName("异常路径：名称为空或仅含空白时应抛出 IllegalArgumentException")
    void should_throwException_when_nameIsBlank() {
        // Act & Assert
        assertThatThrownBy(() -> new TodoItem("   ", "描述"))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("事项名称不能为空");
    }

    @Test
    @DisplayName("正常路径：两个实例 ID 应不同")
    void should_generateUniqueIds() {
        // Arrange & Act
        TodoItem item1 = new TodoItem("任务A", "描述A");
        TodoItem item2 = new TodoItem("任务B", "描述B");

        // Assert
        assertThat(item1.getId()).isNotEqualTo(item2.getId());
    }
}