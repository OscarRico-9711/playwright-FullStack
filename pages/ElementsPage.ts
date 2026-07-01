import { expect, Locator, Page } from '@playwright/test';


export class ElementPage {

    readonly page: Page;
    readonly menuOption: (optionText: string) => Locator;

    constructor(page: Page) {
        this.page = page;

        this.menuOption = (optionText: string): Locator => {
            return this.page.getByText(optionText);
        };
    }

    async navigate(url: string) {
        await this.page.goto(url);
    }

    /**selects the opcion text box in the lateral menu with the locator @textBoxOption */
    async select_Menu_Option(option: string) {
        await this.menuOption(option).click();
    }


}
