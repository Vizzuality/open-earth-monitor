import { test, expect } from '@playwright/test';

import type { MonitorTypes } from 'types/datasets';

test.beforeEach(async ({ page }) => {
  await page.goto('/map', { waitUntil: 'load' });
  const response = await page.waitForResponse('https://api.earthmonitor.org/monitors');
  const json = (await response.json()) as MonitorTypes[];
  const monitorsIds = json.map((data) => data.id);
  const monitorsList = page.getByTestId('monitors-list');

  await expect(monitorsList).toBeVisible();
  for (const id of monitorsIds) {
    const monitorItem = page.getByTestId(`monitor-item-${id}`);
    await expect(monitorItem).toBeVisible();
    await expect(monitorItem).toHaveAttribute('href', `/map/${id}/datasets`);
  }

  // we only test the navigation of the first monitor
  await page.getByTestId(`monitor-item-${monitorsIds[0]}`).click();
  await page.waitForURL(`**/map/${monitorsIds[0]}/datasets`, { waitUntil: 'load' });
});

test.describe('user should be able to copy and share current url', () => {
  test('copy link to clipboard', async ({ page }) => {
    await expect(page.getByTestId('share-tool-trigger')).toBeVisible();
    await page.getByTestId('share-tool-trigger').click();

    const copyButton = page.getByTestId('copy-link-button');

    await expect(page.getByTestId('copy-link-success')).toBeHidden();
    await expect(page.getByTestId('copy-message')).toBeVisible();

    await expect(copyButton).toBeVisible();
    await copyButton.click();

    const clipboardText = await page.evaluate('navigator.clipboard.readText()');
    expect(clipboardText).toContain(`${process.env.BASE_URL}/map/`);

    await expect(page.getByTestId('copy-message')).toBeHidden();
    await expect(page.getByTestId('copy-link-success')).toBeVisible();

    await expect(page.getByTestId('copy-link-success')).toBeHidden({ timeout: 10000 });
    await expect(page.getByTestId('copy-message')).toBeVisible({ timeout: 10000 });
  });

  test('share in Twitter', async ({ page }) => {
    await expect(page.getByTestId('share-tool-trigger')).toBeVisible();
    await page.getByTestId('share-tool-trigger').click();
    const shareTwitterButton = page.getByTestId('share-twitter-button');
    await expect(shareTwitterButton).toBeVisible();
    await shareTwitterButton.click();
  });

  test('share in Linkedin', async ({ page }) => {
    await expect(page.getByTestId('share-tool-trigger')).toBeVisible();
    await page.getByTestId('share-tool-trigger').click();
    const shareLinkedinButton = page.getByTestId('share-linkedin-button');
    await expect(shareLinkedinButton).toBeVisible();
    await shareLinkedinButton.click();
  });
});
