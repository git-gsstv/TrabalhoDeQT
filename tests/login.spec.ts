import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';

test('User can login', async ({ page }) => {

    const loginpage = new LoginPage(page);
    await loginpage.login('', '');
    await expect(page).toHaveURL(/.TelaInicial/);
  });

