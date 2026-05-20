#!/usr/bin/env python3
import os

filepath = 'pages/statistics.html'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old_str = '<script src="../js/storage.js"></script>\n  <script src="../js/statistics.js"></script>'
new_str = '<script src="../js/storage.js"></script>\n  <script src="../js/theme.js"></script>\n  <script src="../js/statistics.js"></script>'

content = content.replace(old_str, new_str)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"已修复 statistics.html")
