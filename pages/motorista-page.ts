import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class MotoristaPage {
    readonly page: Page;
constructor(page: Page) {
        this.page = page;
    }

async driver(nome: string, email: string, telefone: string, numeroCnh: string, senha: string, confirarSenha: string) {
        await this.page.goto('https://omnibusdrive.up.railway.app/cadastro_motorista');
        await this.page.type('input[name="nome"]', nome);
        await this.page.type('input[name="email"]', email);
        await this.page.type('input[name="telefone"]', telefone);
        await this.page.type('input[name="numeroCnh"]', numeroCnh);
        await this.page.type('input[name="senha"]', senha);
        await this.page.type('input[name="confirarSenha"]', confirarSenha);
        await this.page.click('button[type="submit"]');
    }
}
