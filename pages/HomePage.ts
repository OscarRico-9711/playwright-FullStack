import { Page, Locator } from '@playwright/test';

export class HomePage {

    //locators - variables
    readonly page: Page; // declarar variables de pagina
    readonly elementsoption: Locator; //locator for the heading with the name 'Elements'

    //constructor 
    constructor(page: Page) {

        this.page = page; // this is the page object that is passed to the constructor
        this.elementsoption = page.getByRole('link',{name:'Elements'});
    }

    //methods for calling in the test
    async navigate() {
        await this.page.goto("/");
    }

    async selectElementOption() {
        await this.elementsoption.click();
    }

}