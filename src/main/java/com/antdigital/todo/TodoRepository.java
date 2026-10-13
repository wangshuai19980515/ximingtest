package com.antdigital.todo;

public interface TodoRepository {
    void save(TodoItem item);
    TodoItem findById(Long id);
}
