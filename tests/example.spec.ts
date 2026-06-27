import { test, expect } from '@playwright/test';

test('fill in text box fields', async ({ page }) => {
  await page.goto('/elements');

  await page // busca elemento que cumpla con el rol de link y el nombre 'Text Box', luego filtra por el texto 'Text Box' y hace click en él
    .getByRole('link', { name: 'Text Box' })
    .filter({ hasText: 'Text Box' })
    .click();

  await page // busca elemento que cumpla con el placeholder 'Full Name', 
    // luego filtra por el rol de textbox con el nombre 'Full Name' y 
    // llena el campo con 'oscar rico'
    .getByRole('textbox', { name: 'Full Name' })
    .fill('oscar rico');

    await page.locator('//input[@placeholder="name@example.com"]').fill("oscar@example.com"); //busca elemento usando xpath

    await page
    //.locator('textarea[placeholder="Current Address"][id="currentAddress"]').fill('1234 Main St');
    .locator('.form-control').nth(2).fill('5678 Elm St');





});

test.afterEach(async ({ page }) => {
  await page.waitForTimeout(1000);
});