import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
constructor(page: Page) {
        this.page = page;
    }

async login(email: string, password: string) {
        await this.page.goto('https://omnibusdrive.up.railway.app/login');
        await this.page.type('input[name="email"]', email);
        await this.page.type('input[name="password"]', password);
        await this.page.click('button[type="submit"]');
    }
}
