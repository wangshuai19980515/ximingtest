package com.antdigital.algorithm;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * 冒泡排序单元测试
 *
 * @author aiwork
 * @date 2026/10/10
 */
class BubbleSortTest {

    // ==================== sort(int[]) 测试 ====================

    @Test
    @DisplayName("正常路径：无序数组排序后应升序排列")
    void should_returnSortedArray_when_inputUnsorted() {
        // Arrange (Given)
        int[] input = {5, 3, 8, 1, 9, 2, 7};

        // Act (When)
        int[] result = BubbleSort.sort(input);

        // Assert (Then)
        assertThat(result).containsExactly(1, 2, 3, 5, 7, 8, 9);
    }

    @Test
    @DisplayName("边界值：空数组排序后应返回空数组")
    void should_returnEmptyArray_when_inputIsEmpty() {
        // Arrange
        int[] input = {};

        // Act
        int[] result = BubbleSort.sort(input);

        // Assert
        assertThat(result).isEmpty();
    }

    @Test
    @DisplayName("边界值：单元素数组排序后应保持不变")
    void should_returnSingleElement_when_inputHasOneElement() {
        // Arrange
        int[] input = {42};

        // Act
        int[] result = BubbleSort.sort(input);

        // Assert
        assertThat(result).containsExactly(42);
    }

    @Test
    @DisplayName("边界值：已排序数组排序后应保持不变")
    void should_returnSameOrder_when_inputAlreadySorted() {
        // Arrange
        int[] input = {1, 2, 3, 4, 5};

        // Act
        int[] result = BubbleSort.sort(input);

        // Assert
        assertThat(result).containsExactly(1, 2, 3, 4, 5);
    }

    @Test
    @DisplayName("分支覆盖：逆序数组排序后应升序排列")
    void should_returnSortedArray_when_inputIsDescending() {
        // Arrange
        int[] input = {5, 4, 3, 2, 1};

        // Act
        int[] result = BubbleSort.sort(input);

        // Assert
        assertThat(result).containsExactly(1, 2, 3, 4, 5);
    }

    @Test
    @DisplayName("业务规则：含重复元素的数组排序后应保持稳定")
    void should_returnSortedArray_when_inputHasDuplicates() {
        // Arrange
        int[] input = {3, 1, 2, 3, 1, 2};

        // Act
        int[] result = BubbleSort.sort(input);

        // Assert
        assertThat(result).containsExactly(1, 1, 2, 2, 3, 3);
    }

    @Test
    @DisplayName("边界值：含负数的数组排序后应正确升序排列")
    void should_returnSortedArray_when_inputHasNegativeNumbers() {
        // Arrange
        int[] input = {-3, 0, -1, 5, -8, 2};

        // Act
        int[] result = BubbleSort.sort(input);

        // Assert
        assertThat(result).containsExactly(-8, -3, -1, 0, 2, 5);
    }

    @Test
    @DisplayName("异常路径：传入null应抛出IllegalArgumentException")
    void should_throwException_when_inputIsNull() {
        // Arrange
        int[] input = null;

        // Act & Assert
        assertThatThrownBy(() -> BubbleSort.sort(input))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("数组不能为null");
    }

}
