import { Page, expect, Locator } from '@playwright/test'

export class RadioButtonComponent {

    readonly page: Page;
    readonly yesRadio: Locator;
    readonly impressive: Locator;
    readonly noRadio: Locator;
    readonly resultPanel: Locator;

    readonly check: (option: string) => Locator;

    readonly dynamictext: Locator;

    constructor(page: Page) {

        this.page = page;
        this.yesRadio = page.locator('#yesRadio');
        this.impressive = page.getByRole('radio', { name: 'Impressive' });;
        this.noRadio = page.locator('#noRadio');
        this.resultPanel = page
            .locator('.mt-3')
            .filter({ hasText: 'You have selected ' });

        this.check = (option: string) => {
            return page.locator(`#${option}Radio`);
        }

        this.dynamictext = page.locator('.text-success');;

    }


    async selectCheck(check: string) {
        await this.check(check).click();
    }

    async generalValidations(text: string) {

        await expect(this.resultPanel).toBeVisible();
        await expect(this.dynamictext).toContainText(new RegExp(text, 'i'));

    }
    async validateCheckDisabled() {

        await expect(this.noRadio).toBeDisabled();

    }




}