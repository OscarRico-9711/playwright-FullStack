import { test, expect } from '../fixtures/pomFixtures'


const user = {
    firstName: 'Oscar',
    lastName: 'Rico',
    age: '30',
    salary: '50000',
    department: 'IT',
    email: 'oscar.doe@example.com'
};

test.beforeEach(async ({ elementPage }) => {
    await elementPage.navigate('/webtables');
})

test('fill Full form', async ({ webTablesComponent }) => {
    await webTablesComponent.fillFullForm(user);
    await expect(webTablesComponent.formContainer).toBeHidden();
    await webTablesComponent.validatecreateduser(user);
})


test('fill form with wrong email - validate formaat', async ({ webTablesComponent }) => {

    const userfake = {
    firstName: 'Oscar',
    lastName: 'Rico',
    age: '30',
    salary: '50000',
    department: 'IT',
    email: 'invalid-email'
};

    await webTablesComponent.fillFullForm(userfake);
    await webTablesComponent.validateEmailformat();
    await expect(webTablesComponent.formContainer).toBeVisible();

})
