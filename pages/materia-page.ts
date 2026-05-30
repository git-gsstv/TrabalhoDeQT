import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class MateriaPage {
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
    
async materia(materia: string, professor: string, semestre: string) {
        await this.page.goto('https://studylab.free.laravel.cloud/subjects');
        await this.page.locator('#modalSubjectName').selectOption(materia);
        await this.page.getByRole('textbox', { name: 'Ex: Prof. João Silva' }).fill(professor);
        await this.page.locator('#modalSubjectSemester').selectOption(semestre);
        await this.page.click('button[type="submit"]');
    }
}
