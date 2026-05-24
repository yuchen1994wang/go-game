// 对弈页面 E2E 测试
const { test, expect } = require('@playwright/test');

test.describe('对弈页面', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pages/game.html?size=9&black=张三&white=李四');
    await page.waitForSelector('#goban');
  });

  test('页面加载正确', async ({ page }) => {
    await expect(page.locator('#blackPlayerName')).toContainText('张三');
    await expect(page.locator('#whitePlayerName')).toContainText('李四');
    await expect(page.locator('#boardSize')).toContainText('9×9');
  });

  test('落子功能', async ({ page }) => {
    const intersection = page.locator('.intersection').first();
    await intersection.click();
    await expect(intersection.locator('.stone')).toBeVisible();
  });

  test('轮流下棋', async ({ page }) => {
    const intersections = page.locator('.intersection');
    await intersections.nth(0).click();
    await intersections.nth(1).click();
    
    const stones = page.locator('.stone');
    await expect(stones).toHaveCount(2);
  });

  test('悔棋功能', async ({ page }) => {
    await page.locator('.intersection').first().click();
    await page.click('text=悔棋');
    await expect(page.locator('.stone')).toHaveCount(0);
  });

  test('停一手功能', async ({ page }) => {
    await page.click('text=停一手');
    await expect(page.locator('#currentTurn')).toContainText('白棋');
  });

  test('封盘功能', async ({ page }) => {
    await page.click('text=封盘');
    await expect(page.locator('.pause-overlay')).toHaveClass(/active/);
    await expect(page.locator('.pause-overlay-title')).toContainText('封盘');
  });

  test('封盘后不能落子', async ({ page }) => {
    await page.click('text=封盘');
    const intersection = page.locator('.intersection').first();
    await intersection.click();
    await expect(page.locator('.stone')).toHaveCount(0);
  });

  test('续盘功能', async ({ page }) => {
    await page.click('text=封盘');
    await page.click('text=续盘');
    await expect(page.locator('.pause-overlay')).not.toHaveClass(/active/);
  });

  test('保存对局', async ({ page }) => {
    await page.locator('.intersection').first().click();
    await page.click('text=保存');
    await expect(page.locator('.toast')).toContainText('保存');
  });

  test('数棋功能', async ({ page }) => {
    await page.locator('.intersection').first().click();
    await page.click('text=数棋');
    await expect(page.locator('.toast')).toBeVisible();
  });
});
