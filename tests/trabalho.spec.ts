import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

function dataFutura(dias: number): string {
  const data = new Date();
  data.setDate(data.getDate() + dias);
  return data.toISOString().split('T')[0];
}

function dataPassada(dias: number): string {
  const data = new Date();
  data.setDate(data.getDate() - dias);
  return data.toISOString().split('T')[0];
}

async function abrirModalTrabalho(page: any) {
  await page.goto('https://studylab.free.laravel.cloud/works');
  await page.getByRole('button', { name: 'Novo trabalho' }).click();
  await page.locator('#workType').waitFor({ state: 'visible' });
}

async function cadastrarTrabalho(page: any, descricao: string, data: string) {
  await abrirModalTrabalho(page);
  await page.locator('#workType').selectOption('Artigo');
  await page.getByRole('textbox', { name: 'Ex: Pesquisa de História...' }).fill(descricao);
  await page.locator('#workDueDate').fill(data);
  await page.getByRole('button', { name: 'Salvar Trabalho' }).click();
  await expect(page.getByText('Trabalho criado com sucesso!', { exact: false })).toBeVisible();
}

test.describe.serial('Felizes: Create, Edit e Delete', () => {

  test('Usuário pode cadastrar um trabalho', async ({ page }) => {
    await abrirModalTrabalho(page);

    await page.locator('#workType').selectOption('Artigo');
    await page.getByRole('textbox', { name: 'Ex: Pesquisa de História...' }).fill('Pesquisa sobre IA');
    await page.locator('#workDueDate').fill(dataFutura(5));
    await page.getByRole('button', { name: 'Salvar Trabalho' }).click();

    await expect(page.getByText('Trabalho criado com sucesso!', { exact: false })).toBeVisible();
  });

  test('Usuário pode editar um trabalho', async ({ page }) => {
    await page.goto('https://studylab.free.laravel.cloud/works');
    await page.getByRole('heading', { name: 'Meus Trabalhos' }).waitFor({ state: 'visible' });

    await page.locator('tr', { hasText: 'Pesquisa sobre IA' })
      .getByRole('button', { name: 'Editar' })
      .click();

    await page.locator('#workType').waitFor({ state: 'visible' });
    await page.getByRole('textbox', { name: 'Ex: Pesquisa de História...' }).fill('Pesquisa sobre IA atualizada');
    await page.getByRole('button', { name: 'Salvar Trabalho' }).click();

    await expect(page.getByText('Trabalho atualizado!', { exact: false })).toBeVisible();
  });

  test('Usuário pode deletar um trabalho', async ({ page }) => {
    await page.goto('https://studylab.free.laravel.cloud/works');
    await expect(page.getByText('Meus Trabalhos', { exact: false })).toBeVisible();


    await page.locator('tr', { hasText: 'Pesquisa sobre IA atualizada' })
      .getByRole('button', { name: 'Excluir' })
      .click();

    await expect(page.getByText('Excluir trabalho', { exact: false })).toBeVisible();
    await page.getByRole('button', { name: 'Sim, excluir' }).click();

    await expect(page.getByText('Excluído!', { exact: false })).toBeVisible();
  });

});

test.describe.serial('Tristes: Create e Edit', () => {

  test('Usuário tenta cadastrar um trabalho sem selecionar o tipo', async ({ page }) => {
    await abrirModalTrabalho(page);

    await page.getByRole('textbox', { name: 'Ex: Pesquisa de História...' }).fill('Trabalho sem tipo');
    await page.locator('#workDueDate').fill(dataFutura(5));
    await page.getByRole('button', { name: 'Salvar Trabalho' }).click();

    await expect(page.getByText('Selecione o tipo do trabalho.', { exact: false })).toBeVisible();
  });

  test('Usuário edita o trabalho de QT removendo a descrição', async ({ page }) => {
    await page.goto('https://studylab.free.laravel.cloud/works');
    await expect(page.getByText('Meus Trabalhos', { exact: false })).toBeVisible();

    await page.locator('tr', { hasText: 'Trabalho de QT' })
      .getByRole('button', { name: 'Editar' })
      .click();

    await page.locator('#workType').waitFor({ state: 'visible' });
    await page.getByRole('textbox', { name: 'Ex: Pesquisa de História...' }).clear();
    await page.getByRole('button', { name: 'Salvar Trabalho' }).click();

    await expect(page.getByText('A descrição é obrigatória.', { exact: false })).toBeVisible();
  });

});

test.describe.serial('Borda: Create e Edit', () => {

  test('Usuário tenta cadastrar um trabalho com descrição acima de 100 caracteres', async ({ page }) => {
    await abrirModalTrabalho(page);
 
    await page.locator('#workType').selectOption('Artigo');
    await page.evaluate(() => {
      const input = document.querySelector('#workDescription') as HTMLInputElement;
      input.value = 'A'.repeat(101);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await page.locator('#workDueDate').fill(dataFutura(5));
    await page.getByRole('button', { name: 'Salvar Trabalho' }).click();
 
    await expect(page.getByText('A descrição deve ter no máximo 100 caracteres.', { exact: false })).toBeVisible();
  });

  test('Usuário edita um trabalho e muda a data para ontem', async ({ page }) => {
    await cadastrarTrabalho(page, 'Trabalho de revisão', dataFutura(5));

    await page.locator('tr', { hasText: 'Trabalho de revisão' })
      .getByRole('button', { name: 'Editar' })
      .click();

    await page.locator('#workDueDate').waitFor({ state: 'visible' });
    await page.locator('#workDueDate').fill(dataPassada(1));
    await page.getByRole('button', { name: 'Salvar Trabalho' }).click();

    await expect(page.getByText('A data não pode estar no passado.', { exact: false })).toBeVisible();
  });

});