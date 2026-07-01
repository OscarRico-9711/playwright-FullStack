import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test.describe('Home page', { tag: ['@regression', '@homepage'] }, () => {

test('select element option', { tag: '@happy-path' }, async ({ page }) => {

    const homepage = new HomePage(page);

    await homepage.navigate(); 

    await homepage.selectElementOption('Forms');

    await expect(page).toHaveURL('https://demoqa.com/forms');
})

})
