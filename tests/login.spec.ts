import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import * as dotenv from 'dotenv';

dotenv.config();

const email = process.env.USER_EMAIL!;
const password = process.env.USER_PASSWORD!;

test('Usuário pode fazer login', async ({ page }) => {
    const loginpage = new LoginPage(page);
    await loginpage.login(email, password);
    await expect(page).toHaveURL(/.dashboard/);
});

test('Usuário não pode fazer login com credenciais inválidas', async ({ page }) => {
    const loginpage = new LoginPage(page);
    await loginpage.login(email, 'wrongpassword');
    await expect(page.getByText('These credentials do not match our records.')).toBeVisible();
});

test('Usuário não pode fazer login com campos vazios', async ({ page }) => {
    const loginpage = new LoginPage(page);
    await loginpage.login('', '');
    await expect(page).toHaveURL(/.login/);
});