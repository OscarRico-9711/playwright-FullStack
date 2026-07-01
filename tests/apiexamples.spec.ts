import { test, expect } from '@playwright/test'


test('Get Books',async({request})=>{

const response = await request.get('/BookStore/v1/Books');

expect(response.status()).toBe(200);

const body = await response.json();



})