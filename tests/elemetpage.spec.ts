import { expect, test } from '@playwright/test';
import { ElementPage } from '../pages/ElementsPage'

let elementPage: ElementPage;

test.beforeEach(async ({ page }) => {

    elementPage = new ElementPage(page);
})

test('fill full form', async () => {

    await elementPage.navigate('/elements');
    await elementPage.completeForm('name', 'oscar@test.com', 'dfsfs', 'dff');
    await elementPage.validateFormResult('name', 'oscar@test.com', 'dfsfs', 'dff');

});


test.afterEach(async ({ page }) => {
    await page.waitForTimeout(3000);    
});


