package com.antdigital.todo;

import java.util.List;

/**
 * 待办事项仓库端口
 * <p>
 * 定义持久化操作的抽象接口，允许替换不同存储实现。
 * </p>
 *
 * @author aiwork
 * @date 2026/10/13
 */
public interface TodoRepository {

    /**
     * 保存待办事项
     *
     * @param item 待保存的待办事项，不能为 null
     * @return 保存后的待办事项（原样返回）
     */
    TodoItem save(TodoItem item);

    /**
     * 查询所有已保存的待办事项
     *
     * @return 待办事项列表的防御性副本
     */
    List<TodoItem> findAll();
}