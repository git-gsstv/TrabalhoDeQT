import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/register-page'; 
import * as dotenv from 'dotenv';

dotenv.config();

const email = process.env.EXISTING_USER_EMAIL!;

test('Usuário pode se registrar', async ({ page }) => {

    const registerPage = new RegisterPage(page);
    await registerPage.register('user1', 'user1@gmail.com','000000000', 'S/N', '12345678', '12345678');
    await expect(page).toHaveURL(/.TelaInicial/);
});

test('Usuário não pode se registrar com e-mail existente', async ({ page }) => {

    const registerPage = new RegisterPage(page);
    await registerPage.register('user2', email,'000000001', 'S/N', '12345678', '12345678');
    await expect(page.getByText('Este e-mail já está cadastrado.')).toBeVisible();
});

test('Usuário não pode se registrar com senhas não conferem', async ({ page }) => {

    const registerPage = new RegisterPage(page);
    await registerPage.register('user3', 'user3@gmail.com','000000002', 'S/N', '12345678', '87654321');
    await expect(page.getByText('As senhas não conferem.')).toBeVisible();
});

test('Usuário não pode se registrar com e-mail inválido', async ({ page }) => {

    const registerPage = new RegisterPage(page);
    await registerPage.register('user4', 'user4gmail.com','000000003', 'S/N', '12345678', '12345678');
    await expect(page).toHaveURL(/.registrar/);
});

test('Usuário não pode se registrar com campos vazios', async ({ page }) => {

    const registerPage = new RegisterPage(page);
    await registerPage.register('', '','', '', '', '');
    await expect(page).toHaveURL(/.registrar/);
});