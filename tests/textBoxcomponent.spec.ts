import { test } from '../fixtures/pomFixtures';


test.describe('Text Box component', { tag: ['@regression', '@textbox'] }, () => {

    test('fill full form - successfully', { tag: '@happy-path' }, async ({ elementPage, textBoxComponent }) => {

        await elementPage.navigate('/elements');
        await elementPage.select_Menu_Option('Text Box');
        await textBoxComponent.completeForm('name', 'oscar@test.com', 'dfsfs', 'dff');
        await textBoxComponent.validateFormResult('name', 'oscar@test.com', 'dfsfs', 'dff');
    });

    test('validate email field - error ', async ({ elementPage, textBoxComponent }) => {
        await elementPage.navigate('/text-box');
        //await elementPage.select_Menu_Option('Text Box');
        await textBoxComponent.completeForm('name', 'xxx', 'dfsfs', 'dff');
        await textBoxComponent.validateEmailFieldError('field-error');
    });

});


