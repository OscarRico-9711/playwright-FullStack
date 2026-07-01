import { test, expect } from '@playwright/test'
import { HomePage } from '../pages/HomePage';
import { ElementPage } from '../pages/ElementsPage';
import { CheckBoxComponent } from '../pages/CheckBoxComponent'

let homepage: HomePage;
let elementPage: ElementPage;
let checkBoxComponent: CheckBoxComponent;

test.describe('Check Box component', { tag: ['@regression', '@checkbox'] }, () => {

    test.beforeEach(async ({ page }) => {
        homepage = new HomePage(page);
        elementPage = new ElementPage(page);
        checkBoxComponent = new CheckBoxComponent(page);

    })

    test('open home switcher', { tag: '@happy-path' }, async () => {

        await elementPage.navigate('/checkbox');
        await checkBoxComponent.openHomeTreeItem('Home');
        await checkBoxComponent.validateOpenTree('Home');
        await checkBoxComponent.validateNewOptions();
    })

})

