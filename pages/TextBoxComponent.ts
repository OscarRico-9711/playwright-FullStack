import {Page, Locator, expect} from '@playwright/test'

export class TextBoxComponent {

    readonly page: Page;
    readonly fullNameField: Locator;
    readonly emailField: Locator;
    readonly currentAddress: Locator;
    readonly permanentAddressField: Locator;
    readonly submitButton: Locator;
    readonly resultContainer: Locator;
    readonly resultName: Locator;
    readonly resultEmail: Locator;
    readonly resultCurrentAddress: Locator;
    readonly resultPermanentAddress: Locator;


    constructor(page:Page){
        this.page = page;
         this.fullNameField = page.getByRole('textbox', { name: 'Full Name' });
        this.emailField = page.getByRole('textbox', { name: 'name@example.com' });
        this.currentAddress = page.getByRole('textbox', { name: 'Current Address' });
        this.permanentAddressField = page.locator('#permanentAddress');
        this.submitButton = page.getByRole('button', { name: 'Submit' });
        //---------
        this.resultContainer = page.locator('#output > div');
        this.resultName = page.locator('#name');
        this.resultEmail = page.locator('#email');
        this.resultCurrentAddress = this.resultContainer.locator('#currentAddress');
        this.resultPermanentAddress = this.resultContainer.locator('#permanentAddress');
    }

     async fillFullNameField(name: string) {

        await this.fullNameField.fill(name);
    }

    async fillEmailField(email: string) {

        await this.emailField.fill(email);

    }

    async fillcurrentAddressField(address: string) {
        await this.currentAddress.pressSequentially(address);
    }

    async fillPermanentAddressField(permanent: string) {
        await this.permanentAddressField.fill(permanent);
    }


    async clickButtonSubmit() {
        await expect(this.submitButton).toBeEnabled();
        await expect(this.submitButton).toBeVisible();
        await this.submitButton.click();        
    }

    /**centralizes the form completion process */
    async completeForm(
        name: string,
        email: string,
        currentAddress: string,
        permanentAddress: string,
    ) {
        await this.fillFullNameField(name);
        await this.fillEmailField(email);
        await this.fillcurrentAddressField(currentAddress);
        await this.fillPermanentAddressField(permanentAddress);
        await this.clickButtonSubmit();
    }

    async validateFormResult(
        name: string,
        email: string,
        currentAddress: string,
        permanentAddress: string
    ) {
        await expect(this.resultName).toHaveText(`Name:${name}`);
        await expect(this.resultEmail).toHaveText(`Email:${email}`);
        await expect(this.resultCurrentAddress).toHaveText(`Current Address :${currentAddress}`);
        await expect(this.resultPermanentAddress).toHaveText(`Permananet Address :${permanentAddress}`);
    }


    async validateEmailFieldError(error: string) {
        await expect(this.emailField).toContainClass(error);
    }
}