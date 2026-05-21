import { test, expect } from '@playwright/test';
import { MotoristaPage } from '../pages/motorista-page';
import * as dotenv from 'dotenv';

dotenv.config();

test('Usuário pode cadastrar um motorista', async ({ page }) => {
    const motoristapage  = new MotoristaPage(page);
    await motoristapage.driver('John Doe', 'john.doe@example.com', '123456789', '1234567890', 'password', 'password');
    await expect(page).toHaveURL(/.lista_motoristas/);
});