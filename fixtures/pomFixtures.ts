import { test as base } from '@playwright/test' // importamos test de playwright y lo renombramos a base para poder extenderlo con nuestros propios fixtures
import { HomePage } from '../pages/HomePage';
import { ElementPage } from '../pages/ElementsPage';
import { CheckBoxComponent } from '../pages/CheckBoxComponent'
import { RadioButtonComponent } from '../pages/RadioButtonComponent'
import { TextBoxComponent } from '../pages/TextBoxComponent'


type PomFixtures = { //definimos un tipo de dato PomFixtures que contiene los fixtures que vamos a usar en nuestros tests

    homePage: HomePage;
    elementPage: ElementPage;
    checkBoxComponent: CheckBoxComponent;
    radioButtonComponent: RadioButtonComponent;
    textBoxComponent: TextBoxComponent;
}


export const test = base.extend<PomFixtures>({ // extendemos los fixtures de playwright con nuestros propios fixtures

    homePage: async ({ page }, use) => { // definimos el fixture homePage que es de tipo HomePage y recibe un page de playwright
        const homePage = new HomePage(page);
        await use(homePage);
    },

    elementPage: async ({ page }, use) => {
        const elementPage = new ElementPage(page);
        await use(elementPage);
    },
    checkBoxComponent: async ({ page }, use) => {
        const checkBoxComponent = new CheckBoxComponent(page);
        await use(checkBoxComponent);
    },

    radioButtonComponent: async ({ page }, use) => {
        const radioButtonComponent = new RadioButtonComponent(page);
        await use(radioButtonComponent);
    },
    textBoxComponent: async ({ page }, use) => {
        const textBoxComponent = new TextBoxComponent(page)
        await use(textBoxComponent);
    }
});

export { expect } from '@playwright/test'; // necesario para poder usar expect en los tests, ya que al extender los fixtures de playwright, perdemos el acceso a expect