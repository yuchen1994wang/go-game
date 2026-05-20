#!/usr/bin/env python3
import os

# 需要修复的文件列表
files_to_fix = [
    'pages/home.html',
    'pages/ai-match.html',
    'pages/tsumego.html',
    'pages/kifu-player.html',
    'pages/statistics.html',
    'pages/game.html',
    'pages/setup.html',
    'pages/ai-setup.html',
    'pages/practice.html',
    'pages/review.html',
    'pages/kifu.html',
    'pages/auth.html'
]

# 模式：查找 storage.js 之后，在 board-component.js 之前插入 theme.js
# 或者更简单的方式：在 storage.js 之后立即插入 theme.js

for filepath in files_to_fix:
    if not os.path.exists(filepath):
        print(f"文件不存在: {filepath}")
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 查找 storage.js 之后，board-component.js 之前的位置
    old_str = '<script src="../js/storage.js"></script>\n  <script src="../js/board-component.js"></script>'
    new_str = '<script src="../js/storage.js"></script>\n  <script src="../js/theme.js"></script>\n  <script src="../js/board-component.js"></script>'
    
    if old_str in content:
        content = content.replace(old_str, new_str)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"已修复: {filepath}")
    else:
        # 尝试第二种模式（用于 tsumego.html 这样的文件）
        old_str2 = '<script src="../js/storage.js"></script>\n  <script src="../js/board-component.js"></script>'
        if old_str2 in content:
            content = content.replace(old_str2, new_str)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"已修复 (模式2): {filepath}")
        else:
            print(f"未找到匹配的模式: {filepath}")

print("\n修复完成！")
