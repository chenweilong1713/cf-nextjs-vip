-- 1. 用户表（基础核心表，关联所有业务表的创建人/更新人）
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nickname TEXT NOT NULL, -- 用户昵称
    password_hash TEXT NOT NULL, -- 存储加密后的密码
    email TEXT NOT NULL UNIQUE, -- 邮箱（登录账号，唯一，不能为空）
    avatar TEXT, -- 用户头像URL
    status INTEGER DEFAULT 1, -- 1:正常 0:禁用
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER DEFAULT 0, -- 自注册用户默认0
    updated_by INTEGER DEFAULT 0
);
