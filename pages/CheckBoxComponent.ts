    import { Page, Locator, expect } from '@playwright/test'

    export class CheckBoxComponent {


        readonly page: Page

        readonly checksContainer: Locator;

        readonly homeTreeItem: (option: string) => Locator;

        readonly homeSwitcher: (option: string) => Locator;

        readonly checkBox: (option: string) => Locator;

        readonly resultBox: Locator;

        constructor(page: Page) {

            this.page = page;

            this.checksContainer = page.getByRole('treeitem');

            this.homeTreeItem = (option: string): Locator => {
                return page
                    .getByRole('treeitem')
                    .filter({ has: page.getByText(option) });
                //*[@role="treeitem"][.//*[normalize-space()="Home"]]

            }

            this.homeSwitcher = (option: string): Locator => {

                return this.homeTreeItem(option).locator('.rc-tree-switcher');
                //*[@role="treeitem"][.//*[normalize-space()="Home"]]//span[contains(@class, "rc-tree-switcher")]

            }

            this.checkBox = (option: string): Locator => {
                return page.getByRole('checkbox', { name: `Select ${option}` });
            }

            this.resultBox = page.locator('#result');
        }


        async openHomeTreeItem(option: string) {
            await this.homeSwitcher(option).click();
        }

        async selectCheckBox(option: string) {
            await expect(this.checkBox(option)).toBeAttached();
            await this.checkBox(option).check();
        }

        async validateOpenTree(option: string) {
            await expect(this.homeTreeItem(option)).toHaveAttribute('aria-expanded', 'true')
        }


        async validateNewOptions() {
            await expect(this.checksContainer).toHaveCount(4);
        }







    }
