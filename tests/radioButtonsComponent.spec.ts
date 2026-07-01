import { test, expect } from 'playwright/test'
import { RadioButtonComponent } from '../pages/RadioButtonComponent'

let radioButtonComponent: RadioButtonComponent;


const radioOptions = [ // this is a array of objects, each object has two properties: option and expectedText
    { option: 'yes', expectedText: 'yes' },
    { option: 'impressive', expectedText: 'impressive' },
];


test.beforeEach(async ({ page }) => {

    radioButtonComponent = new RadioButtonComponent(page);
    await page.goto('/radio-button');
})


for (const { option, expectedText } of radioOptions) { //here there ara two options, so the test will run twice, once for each option

    test(`check radios and validate the results ${option}`, async () => {

        await radioButtonComponent.selectCheck(option);
        await radioButtonComponent.generalValidations(expectedText);

    })

}