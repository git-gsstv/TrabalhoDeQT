import type { Page } from '@playwright/test';

export class MotoristaPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Troquei .type por .fill e corrigimos a grafia de confirmarSenha (ajuste se necessário)
    async cadastrarMotorista(nome: string, email: string, telefone: string, numeroCnh: string, senha: string, confirmarSenha: string) {
        await this.page.goto('https://omnibusdrive.up.railway.app/cadastro_motorista');
        await this.page.fill('input[name="nome"]', nome);
        await this.page.fill('input[name="email"]', email);
        await this.page.fill('input[name="telefone"]', telefone);
        await this.page.fill('input[name="numeroCnh"]', numeroCnh);
        await this.page.fill('input[name="senha"]', senha);
        await this.page.fill('input[name="confirmarSenha"]', confirmarSenha);
        await this.page.click('button[type="submit"]');
    }
}