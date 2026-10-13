package com.antdigital.todo;

/**
 * 待办事项应用服务
 * <p>
 * 封装"创建待办事项"用例，协调领域对象的校验与持久化。
 * </p>
 *
 * @author aiwork
 * @date 2026/10/13
 */
public class TodoService {

    private final TodoRepository repository;

    /**
     * 构造应用服务
     *
     * @param repository 待办事项仓库，不能为 null
     */
    public TodoService(TodoRepository repository) {
        this.repository = repository;
    }

    /**
     * 创建新的待办事项并持久化
     *
     * @param name        事项名称，不能为空或仅含空白
     * @param description 事项描述，可为 null
     * @return 创建并保存后的待办事项
     * @throws IllegalArgumentException 当 name 为 null、空字符串或仅含空白时
     */
    public TodoItem createTodo(String name, String description) {
        TodoItem item = new TodoItem(name, description);
        return repository.save(item);
    }
}