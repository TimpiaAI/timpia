import { test, expect } from '@playwright/test';

type ImageCheck = {
  locator: string;
  name: string;
  maxWidth: number;
  description: string;
};

const IMAGE_CHECKS: ImageCheck[] = [
  {
    locator: '[data-ai-hint="female robot marketing"]',
    name: 'Ava - AI Marketing Manager',
    maxWidth: 900,
    description: 'Marketing expert hero should receive a responsive width smaller than original 1080px asset.',
  },
  {
    locator: '[data-ai-hint="integration diagram robot"]',
    name: 'Integration diagram',
    maxWidth: 850,
    description: 'Integration diagram should honour sizes hint and stay well below raw 1200px width.',
  },
  {
    locator: '[data-ai-hint="three friendly robots"]',
    name: 'Landing hero artwork',
    maxWidth: 950,
    description: 'Landing hero artwork must not exceed tuned container width.',
  },
];

test.describe('Image optimization hints', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  for (const image of IMAGE_CHECKS) {
    test(`Scaled image served for ${image.name}`, async ({ page }) => {
      const imgLocator = page.locator(image.locator).first();

      await imgLocator.waitFor({ state: 'attached' });
      await imgLocator.evaluate((element) => {
        element.scrollIntoView({ behavior: 'instant', block: 'center', inline: 'center' });
      });
      await page.waitForTimeout(200);
      await expect(imgLocator, image.description).toBeVisible();

      await expect
        .poll(async () =>
          imgLocator.evaluate((img) => (img as HTMLImageElement).naturalWidth),
        )
        .toBeGreaterThan(0);

      const metrics = await imgLocator.evaluate((img) => {
        const el = img as HTMLImageElement;
        const rect = el.getBoundingClientRect();
        const url = el.currentSrc || el.src;
        const params = new URL(url, window.location.origin).searchParams;
        const widthParam = params.get('w');
        const widthFromParam = widthParam ? Number(widthParam) : undefined;
        return {
          naturalWidth: el.naturalWidth,
          renderedWidth: rect.width,
          currentSrc: url,
          widthFromParam,
        };
      });

      expect(
        metrics.naturalWidth,
        `Expected natural width <= ${image.maxWidth}px but received ${metrics.naturalWidth}px for ${metrics.currentSrc}`,
      ).toBeLessThanOrEqual(image.maxWidth);

      if (metrics.widthFromParam) {
        expect(
          metrics.widthFromParam,
          `Expected request width <= ${image.maxWidth}px but received ${metrics.widthFromParam}px for ${metrics.currentSrc}`,
        ).toBeLessThanOrEqual(image.maxWidth);
      }

      expect(metrics.renderedWidth).toBeGreaterThan(0);
    });
  }
});
