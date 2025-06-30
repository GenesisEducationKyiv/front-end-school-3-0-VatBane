import { test, expect } from '@playwright/test';


test.describe('AudioPlayer Component', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("http://localhost:3000/tracks");
    });

    test('audio player should open on click on track', async ({ page }) => {
        const audioPlayer = page.locator('#audio-player');

        await expect(page.locator(".track-list")).toBeVisible();
        await expect(audioPlayer).toHaveCSS('max-height', '0px');
        const firstTrack = page.locator('[data-testid^="track-item-"]').first();
        await firstTrack.locator('.track-container').click();
        await expect(audioPlayer).not.toHaveCSS('max-height', '0px');

    });

    test("audio player should start playing automatically", async ({ page }) => {
        const audioPlayer = page.locator('#audio-player');

        await expect(page.locator(".track-list")).toBeVisible();
        const firstTrack = page.locator('[data-testid^="track-item-"]').first();
        await firstTrack.locator('.track-container').click();
        await expect(audioPlayer).not.toHaveCSS('max-height', '0px');
        const audio = page.locator('audio');
        await expect(audio).toHaveAttribute('src', /blob:/);

        await page.waitForFunction(() => {
            const audioEl = document.querySelector('audio');
            return audioEl && !audioEl.paused && audioEl.readyState >= 2;
        });

        const isPaused = await audio.evaluate(el => el.paused);
        expect(isPaused).toBe(false);
    })

});