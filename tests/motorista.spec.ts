import { test, expect } from '@playwright/test';
import { MotoristaPage } from '../pages/motorista-page';

test('Usuário pode cadastrar um motorista com sucesso', async ({ page }) => {
    const motoristaPage = new MotoristaPage(page);
    
    // Criando um e-mail único baseado no timestamp atual para o teste nunca falhar por e-mail duplicado
    const emailUnico = `john.doe.${Date.now()}@example.com`;

    await motoristaPage.cadastrarMotorista(
        'John Doe', 
        emailUnico, 
        '123456789', 
        '1234567890', 
        'password123', 
        'password123'
    );
    
    await expect(page).toHaveURL(/.lista_motoristas/);
});