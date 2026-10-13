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
