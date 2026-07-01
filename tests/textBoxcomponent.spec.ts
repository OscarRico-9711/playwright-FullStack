import { test, expect } from '@playwright/test'
import { HomePage } from '../pages/HomePage';
import { ElementPage } from '../pages/ElementsPage'
import { TextBoxComponent } from '../pages/TextBoxComponent'


let homepage: HomePage;
let elementPage: ElementPage;
let texboxComponent: TextBoxComponent;

test.describe('Text Box component', { tag: ['@regression', '@textbox'] }, () => {

test.beforeEach(async ({ page }) => {

    homepage = new HomePage(page);
    elementPage = new ElementPage(page);
    texboxComponent = new TextBoxComponent(page)
});

test('fill full form - successfully', { tag: '@happy-path' }, async () => {

    await elementPage.navigate('/elements');
    await elementPage.select_Menu_Option('Text Box');
    await texboxComponent.completeForm('name', 'oscar@test.com', 'dfsfs', 'dff');
    await texboxComponent.validateFormResult('name', 'oscar@test.com', 'dfsfs', 'dff');
});

test('validate email field - error ', async ({page}) => {
    await elementPage.navigate('/text-box');
    //await elementPage.select_Menu_Option('Text Box');
    await texboxComponent.completeForm('name', 'xxx', 'dfsfs', 'dff');
    await texboxComponent.validateEmailFieldError('field-error');
});

});


