import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';      

export class RegisterPage {
    readonly page: Page;
constructor(page: Page) {
        this.page = page;
    }

async register(name: string, email: string, phone: string, location: string, password: string, password_confirmation: string) {
        await this.page.goto('https://ruralink.free.laravel.cloud/registrar');
        await this.page.type('input[name="name"]', name);
        await this.page.type('input[name="email"]', email);
        await this.page.type('input[name="phone"]', phone);
        await this.page.type('input[name="location"]', location);
        await this.page.type('input[name="password"]', password);
        await this.page.type('input[name="password_confirmation"]', password_confirmation);
        await this.page.click('button[type="submit"]');
    }
}