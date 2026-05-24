// 首页 E2E 测试
const { test, expect } = require('@playwright/test');

test.describe('首页', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('页面标题正确', async ({ page }) => {
    await expect(page).toHaveTitle(/围棋/);
  });

  test('导航到人人对弈', async ({ page }) => {
    await page.click('text=人人对弈');
    await expect(page).toHaveURL(/setup.html/);
  });

  test('导航到AI对弈', async ({ page }) => {
    await page.click('text=AI对弈');
    await expect(page).toHaveURL(/ai-setup.html/);
  });

  test('导航到死活题', async ({ page }) => {
    await page.click('text=死活题');
    await expect(page).toHaveURL(/tsumego-list.html/);
  });

  test('导航到棋谱', async ({ page }) => {
    await page.click('text=棋谱');
    await expect(page).toHaveURL(/kifu.html/);
  });

  test('响应式布局', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const menu = page.locator('.mobile-menu');
    await expect(menu).toBeVisible();
  });
});
