import { chromium } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

async function globalSetup() {
  const browser = await chromium.launch();
  const page    = await browser.newPage();

  await page.goto('https://studylab.free.laravel.cloud/login');
  await page.getByRole('textbox', { name: 'nome@exemplo.com' }).fill(process.env.USER_EMAIL!);
  await page.getByRole('textbox', { name: '••••••••' }).fill(process.env.USER_PASSWORD!);
  await page.getByRole('button', { name: 'Entrar na plataforma' }).click();
  await page.waitForURL('**/dashboard');

  await page.context().storageState({ path: 'auth.json' });
  await browser.close();
}

export default globalSetup;