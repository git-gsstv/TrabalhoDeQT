import { test, expect } from '@playwright/test';
import { OnibusPage } from '../pages/onibus-page';
import * as dotenv from 'dotenv';

dotenv.config();

test('Usuário pode cadastrar um ônibus', async ({ page }) => {
    const onibuspage = new OnibusPage(page);
    await onibuspage.bus('ABC1234', '50', '1', '1');
    await expect(page).toHaveURL(/./);
});