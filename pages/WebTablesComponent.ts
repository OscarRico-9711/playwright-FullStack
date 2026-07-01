import { Page, Locator, expect } from '@playwright/test'


type WebTableUser = {
    firstName: string;
    lastName: string;
    age: string;
    salary: string;
    department: string;
    email: string;
};

export class WebTablesComponent {

    readonly page: Page;
    readonly addButton: Locator;
    readonly formContainer: Locator;
    readonly firstName: Locator;
    readonly lastName: Locator;
    readonly email: Locator;
    readonly age: Locator;
    readonly salary: Locator;
    readonly department: Locator;
    readonly submitButton: Locator;
    readonly xIcon: Locator;



    constructor(page: Page) {

        this.page = page;
        this.addButton = page.locator('#addNewRecordButton');
        this.formContainer = page.locator('.modal-content');
        this.firstName = page.locator('#firstName');
        this.lastName = page.locator('#lastName');
        this.email = page.locator('#userEmail');
        this.age = page.getByPlaceholder('Age');
        this.salary = page.locator('#salary');
        this.department = page.locator('#department-wrapper').locator('#department');
        this.submitButton = page.locator('#submit');
        this.xIcon = page.getByRole('button', { name: 'Close' });

    }

    async openform() {

        await this.addButton.click();
    }

    async fillFullForm(user: WebTableUser) {
        await this.openform();
        await this.firstName.fill(user.firstName);
        await this.lastName.fill(user.lastName);
        await this.email.fill(user.email);
        await this.age.fill(user.age);
        await this.salary.fill(user.salary);
        await this.department.fill(user.department);
        await this.submitButton.click();

    }

    async closePopup() {

        await this.xIcon.click();
    }

    async validateEmailformat() {


        const patter = await this.email.getAttribute('pattern');
        expect(this.email).toHaveAttribute('required');

        expect(patter).toContain('@');


        const isValid = await this.email.evaluate((el: HTMLInputElement) =>
            el.checkValidity()
        );

        expect(isValid).toBe(false);

    }


    async validatecreateduser(user: WebTableUser) {

        //encontrar la columna por un texto intermedio y luego validar que contenga el texto de la columna
        const raw = this.page
            .locator('tbody')
            .filter({ has: this.page.getByText(user.email) });
        await expect(raw).toBeVisible();

        // Validate that the row contains the expected user data
        await expect(raw).toContainText(user.firstName);
        await expect(raw).toContainText(user.lastName);
        await expect(raw).toContainText(user.age);
        await expect(raw).toContainText(user.salary);
        await expect(raw).toContainText(user.department);
        await expect(raw).toContainText(user.email);
    }



}