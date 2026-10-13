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
