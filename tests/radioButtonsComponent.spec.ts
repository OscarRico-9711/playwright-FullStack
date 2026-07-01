import { test, expect } from '../fixtures/pomFixtures'


const radioOptions = [ // this is a array of objects, each object has two properties: option and expectedText
    { option: 'yes', expectedText: 'yes' },
    { option: 'impressive', expectedText: 'impressive' },
];

for (const { option, expectedText } of radioOptions) { //here there ara two options, so the test will run twice, once for each option

    test(`check radios and validate the results ${option}`, async ({ elementPage, radioButtonComponent }) => {
        await elementPage.navigate('/radio-button');
        await radioButtonComponent.selectCheck(option);
        await radioButtonComponent.generalValidations(expectedText);

    })

}