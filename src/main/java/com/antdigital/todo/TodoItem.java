package com.antdigital.todo;

import java.time.Instant;
import java.util.UUID;

/**
 * 待办事项领域实体
 * <p>
 * 不可变对象，构造时自动生成唯一 ID 与创建时间。
 * 名称不能为空或仅含空白；描述可为 null，存储时转为空字符串。
 * </p>
 *
 * @author aiwork
 * @date 2026/10/13
 */
public final class TodoItem {

    private final String id;
    private final String name;
    private final String description;
    private final Instant createdAt;

    /**
     * 构造待办事项
     *
     * @param name        事项名称，不能为空或仅含空白
     * @param description 事项描述，可为 null（存储为空字符串）
     * @throws IllegalArgumentException 当 name 为 null、空字符串或仅含空白时
     */
    public TodoItem(String name, String description) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("事项名称不能为空");
        }
        this.id = UUID.randomUUID().toString();
        this.name = name.trim();
        this.description = description == null ? "" : description.trim();
        this.createdAt = Instant.now();
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}