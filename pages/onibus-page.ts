import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class OnibusPage {
    readonly page: Page;
constructor(page: Page) {
        this.page = page;
    }

async bus(plate: string, capacity: string, driver_id: string, route_id: string) {
        await this.page.goto('https://omnibusdrive.up.railway.app/cadastro_onibus');
        await this.page.type('input[name="plate"]', plate);
        await this.page.type('input[name="capacity"]', capacity);
        await this.page.type('input[name="driver_id"]', driver_id);
        await this.page.type('input[name="route_id"]', route_id);
        await this.page.click('button[type="submit"]');
    }
}
