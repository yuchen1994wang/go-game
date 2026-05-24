// 对弈设置页面 E2E 测试
const { test, expect } = require('@playwright/test');

test.describe('设置页面', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pages/setup.html');
  });

  test('页面加载正确', async ({ page }) => {
    await expect(page.locator('h1, h2')).toContainText(/设置|对弈/);
  });

  test('选择随机执子', async ({ page }) => {
    await page.click('text=随机');
    await expect(page.locator('text=玩家1')).toBeVisible();
    await expect(page.locator('text=玩家2')).toBeVisible();
  });

  test('选择黑棋执子', async ({ page }) => {
    await page.click('text=黑棋');
    await expect(page.locator('text=黑棋玩家')).toBeVisible();
    await expect(page.locator('text=白棋玩家')).toBeVisible();
  });

  test('输入玩家姓名', async ({ page }) => {
    await page.fill('input[name="player1"]', '张三');
    await page.fill('input[name="player2"]', '李四');
    await expect(page.locator('input[name="player1"]')).toHaveValue('张三');
  });

  test('选择棋盘大小', async ({ page }) => {
    await page.selectOption('select[name="size"]', '13');
    await expect(page.locator('select[name="size"]')).toHaveValue('13');
  });

  test('开始对战按钮', async ({ page }) => {
    await expect(page.locator('button[type="submit"], text=开始对弈')).toBeEnabled();
  });
});
