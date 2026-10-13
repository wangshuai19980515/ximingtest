package com.antdigital.todo;

import java.util.ArrayList;
import java.util.List;

/**
 * 内存待办事项仓库实现
 * <p>
 * 基于 ArrayList 的简单内存存储，适用于测试和最小闭环验证。
 * </p>
 *
 * @author aiwork
 * @date 2026/10/13
 */
public class InMemoryTodoRepository implements TodoRepository {

    private final List<TodoItem> store = new ArrayList<>();

    @Override
    public TodoItem save(TodoItem item) {
        store.add(item);
        return item;
    }

    @Override
    public List<TodoItem> findAll() {
        return new ArrayList<>(store);
    }
}