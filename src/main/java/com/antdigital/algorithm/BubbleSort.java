package com.antdigital.algorithm;

/**
 * 冒泡排序工具类
 * <p>
 * 冒泡排序通过反复交换相邻的逆序元素，将较大值逐步"冒泡"到数组尾部。
 * 本实现支持提前终止优化：当某轮遍历未发生任何交换时，说明数组已有序，
 * 无需继续后续轮次。
 * </p>
 *
 * @author aiwork
 * @date 2026/10/10
 */
public final class BubbleSort {

    /**
     * 对整型数组进行升序冒泡排序，返回排序后的新数组。
     * <p>
     * 该方法不会修改输入数组，而是返回一个排序后的副本。
     * </p>
     *
     * @param array 待排序的整型数组，不能为null
     * @return 升序排列的新数组
     * @throws IllegalArgumentException 如果输入数组为null
     */
    public static int[] sort(int[] array) {
        // 参数校验：卫语句
        if (array == null) {
            throw new IllegalArgumentException("数组不能为null");
        }

        int[] result = array.clone();
        int n = result.length;

        // 外层循环控制排序轮数，每轮将当前未排序部分的最大值冒泡到末尾
        for (int i = 0; i < n - 1; i++) {
            // swapped 标记本轮是否发生交换，若未发生则数组已有序
            boolean swapped = false;

            // 内层循环进行相邻元素比较与交换
            for (int j = 0; j < n - 1 - i; j++) {
                if (result[j] > result[j + 1]) {
                    swap(result, j, j + 1);
                    swapped = true;
                }
            }

            // 提前终止：本轮无交换说明数组已完全有序
            if (!swapped) {
                break;
            }
        }

        return result;
    }

    /**
     * 交换数组中指定下标的两个元素。
     *
     * @param array 目标数组
     * @param i     第一个元素下标
     * @param j     第二个元素下标
     */
    private static void swap(int[] array, int i, int j) {
        int temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    /**
     * 私有构造方法，防止实例化
     */
    private BubbleSort() {
    }

}
