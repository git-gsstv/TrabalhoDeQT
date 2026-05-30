import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
constructor(page: Page) {
        this.page = page;
    }

async login(email: string, password: string) {
        await this.page.goto('https://studylab.free.laravel.cloud/login');
        await this.page.fill('input[type="email"]', email);
        await this.page.fill('input[type="password"]', password);
        await this.page.click('button[type="submit"]');
    }
}
