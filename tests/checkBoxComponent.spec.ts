import { test, expect } from '../fixtures/pomFixtures'

test.describe('Check Box component', { tag: ['@regression', '@checkbox'] }, () => {


    test('open home switcher', { tag: '@happy-path' }, async ({ elementPage, checkBoxComponent }) => {

        await elementPage.navigate('/checkbox');
        await checkBoxComponent.openHomeTreeItem('Home');
        await checkBoxComponent.validateOpenTree('Home');
        await checkBoxComponent.validateNewOptions();
    })

})

