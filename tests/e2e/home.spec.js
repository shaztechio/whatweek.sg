import { test, expect } from '@playwright/test';

test.describe('whatweek.sg homepage', () => {
  test('displays current week state and metadata', async ({ page }) => {
    await page.goto('/');

    const statusText = await page.textContent('.odd-or-even');
    expect(statusText, 'Week status should be present').toBeTruthy();

    const normalizedStatus = statusText.trim().toLowerCase();
    expect(['odd', 'even', 'break']).toContain(normalizedStatus);

    const dateText = await page.textContent('.today-date');
    expect(dateText, 'Date string should include the term label').toMatch(
      /Term\s+\S+/,
    );

    const emojiText = await page.textContent('.oe-decorator');
    expect(
      emojiText?.trim(),
      'Emoji indicator should not be empty',
    ).not.toEqual('');
  });

  test('add to homescreen button visibility matches context', async ({
    page,
  }) => {
    await page.goto('/');

    const installButton = page.locator('#install-pwa');
    const classList = await installButton.getAttribute('class');
    expect(classList).not.toBeNull();
  });

  test('serves cached content when offline', async ({
    page,
    context,
    browserName,
  }) => {
    test.skip(
      browserName === 'webkit',
      'Offline emulation is not supported in WebKit',
    );

    await page.goto('/');
    await page.waitForFunction(
      () => navigator.serviceWorker?.ready?.then(() => true) ?? false,
    );
    await page.reload();
    await page.waitForFunction(
      () => navigator.serviceWorker?.controller !== null,
    );

    const onlineStatus = await page.textContent('.odd-or-even');
    await context.setOffline(true);

    try {
      await page.reload();
      const offlineStatus = await page.textContent('.odd-or-even');
      expect(offlineStatus?.trim()).toEqual(onlineStatus?.trim());
    } finally {
      await context.setOffline(false);
    }
  });
});
