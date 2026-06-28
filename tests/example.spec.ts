import { test, expect } from '@playwright/test';

test('fill in text box fields', async ({ page }) => {
  await page.goto('/elements');

  await page // busca elemento que cumpla con el rol de link y el nombre 'Text Box', luego filtra por el texto 'Text Box' y hace click en él
    .getByRole('link', { name: 'Text Box' })
    .filter({ hasText: 'Text Box' })
    .click();

  await page.getByRole('textbox', { name: 'Full Name' }).clear(); // busca elemento que cumpla con el rol de textbox y el nombre 'Full Name' y limpia el campo

  await page // busca elemento que cumpla con el placeholder 'Full Name', 
    // luego filtra por el rol de textbox con el nombre 'Full Name' y 
    // llena el campo con 'oscar rico'
    .getByRole('textbox', { name: 'Full Name' })
    .fill('oscar rico');

  await page.locator('//input[@placeholder="name@example.com"]').fill("oscar@example.com"); //busca elemento usando xpath

  await page
    //.locator('textarea[placeholder="Current Address"][id="currentAddress"]').fill('1234 Main St'); //combinacion de selectores CSS
    .locator('.form-control').nth(2).fill('5678 Elm St'); //busca elemento usando nth para seleccionar el tercer elemento con la clase 'form-control'

  await page.locator('#permanentAddress').fill('5678 Elm St- permanent'); //busca elemento usando el id 'permanentAddress'

  await page.getByRole('button', { name: 'Submit' }).click()

  await expect(page.locator('#output')).toContainText('oscar rico');

  let elementos = await page.locator('#output > div > p').count(); // genera un numero de elementos que tengan el mismo locator '#output > div > p' y lo guarda en la variable elementos

  let lista = await page.locator('#output > div > p').all(); // with all i  get an array or elements that match the locator '#output > div > p' and store it in the variable lista

  await expect(page.locator('#output')).toContainText('oscar@example.com');

  const texto = await page.locator('#output > div > p').first().textContent();

  console.log('Texto del elemento:------ ', texto);

  for (let i = 0; i < elementos; i++) { //iterate an array of elements and check if each element has the attribute 'id'
    await expect(page.locator('#output > div > p').nth(i)).toHaveAttribute('id');
  }

  for (const elemento of lista) { // iterate an array of elements and check if each element has the attribute 'class'
    await expect(elemento).toHaveAttribute('class', 'mb-1');
  }

});

test('edit form', async ({ page }) => {

  await page.goto('/elements');

  await page.getByRole('link', { name: 'Text Box' }).click();

  const fullName = page
    .locator('#userName-wrapper')
    .getByPlaceholder('Full Name');

  const email = page.locator('#userEmail-wrapper input[autocomplete="off"]');

  const currentAddress = page
    .locator('#currentAddress-wrapper')
    .locator('#currentAddress[placeholder="Current Address"]');

  const permanentAddress = page.locator('#permanentAddress-wrapper textarea');
  const submitButton = page.getByRole('button', { name: 'Submit' });
  const output = page.locator('#output');

  await fullName.fill('Oscar Rico');
  await email.fill('oscar@example.com');
  await currentAddress.fill('cra 78 H # 57 B 43');
  await permanentAddress.fill('cra 78 H # 57 B 43');

  await submitButton.click();

  await expect(output.locator('#name')).toContainText('Oscar Rico');
  await expect(output.locator('#email')).toContainText('oscar@example.com');
  await expect(output.locator('#currentAddress')).toContainText('cra 78 H # 57 B 43');
  await expect(output.locator('#permanentAddress')).toContainText('cra 78 H # 57 B 43');

  await fullName.fill('Oscar daniel');
  await submitButton.click();

  await expect(output.locator('#name')).toContainText('Oscar daniel');

})

test.afterEach(async ({ page }) => {
  await page.waitForTimeout(1000);
});
