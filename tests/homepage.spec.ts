import { test, expect } from '../fixtures/pomFixtures';




test.describe('Home page', { tag: ['@regression', '@homepage'] }, () => {

    test('select element option', { tag: '@happy-path' }, async ({ page, homePage }) => {



        await homePage.navigate();

        await homePage.selectElementOption('Forms');

        await expect(page).toHaveURL('https://demoqa.com/forms');
    })

})
