import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test('select element option', async ({ page }) => {

    const homepage = new HomePage(page);

    await homepage.navigate(); 

    await homepage.selectElementOption();

    await expect(page).toHaveURL('https://demoqa.com/elements');
})


test.afterEach(async ({page})=>{
await page.waitForTimeout(1000);
})