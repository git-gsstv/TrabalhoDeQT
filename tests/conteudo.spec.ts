import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

async function abrirModalConteudo(page: any) {
  await page.goto('https://studylab.free.laravel.cloud/contents');
  await page.getByRole('button', { name: 'Adicionar conteúdo' }).click();
  await page.locator('#modalContentSubject').waitFor({ state: 'visible' });
}

async function cadastrarConteudo(page: any, nome: string) {
  await abrirModalConteudo(page);
  await page.getByRole('textbox', { name: 'Ex: Derivadas e integrais,' }).fill(nome);
  await page.locator('#modalContentSubject').selectOption({ label: 'Engenharia de Software' });
  await page.locator('#modalContentSemester').selectOption('3');
  await page.getByRole('button', { name: 'Salvar conteúdo' }).click();
  await expect(page.getByText('Conteúdo cadastrado!', { exact: false })).toBeVisible();
}

test.describe.serial('Felizes: Create e Delete', () => {

  test('Usuário pode cadastrar um conteúdo', async ({ page }) => {
    await abrirModalConteudo(page);

    await page.getByRole('textbox', { name: 'Ex: Derivadas e integrais,' }).fill('Introdução ao Python');
    await page.locator('#modalContentSubject').selectOption({ label: 'Engenharia de Software' });
    await page.locator('#modalContentSemester').selectOption('3');
    await page.getByRole('button', { name: 'Salvar conteúdo' }).click();

    await expect(page.getByText('Conteúdo cadastrado!', { exact: false })).toBeVisible();
  });

  test('Usuário pode deletar um conteúdo', async ({ page }) => {
    await page.goto('https://studylab.free.laravel.cloud/contents');

    await page.locator('text=Introdução ao Python')
      .locator('..')
      .getByRole('button', { name: 'Excluir' })
      .click();

    await expect(page.getByText('Excluir conteúdo?', { exact: false })).toBeVisible();
    await page.getByRole('button', { name: 'Sim, excluir' }).click();

    await expect(page.getByText('Conteúdo excluído!', { exact: false })).toBeVisible();
  });

});

test.describe.serial('Tristes: Create e Edit', () => {

  test('Usuário tenta cadastrar um conteúdo sem informar o nome', async ({ page }) => {
    await abrirModalConteudo(page);

    await page.locator('#modalContentSubject').selectOption({ label: 'Engenharia de Software' });
    await page.locator('#modalContentSemester').selectOption('3');
    await page.getByRole('button', { name: 'Salvar conteúdo' }).click();

    await expect(page.getByText('Informe o nome do conteúdo.', { exact: false })).toBeVisible();
  });

  test('Usuário edita um conteúdo e remove a matéria — botão salvar deve ficar desabilitado', async ({ page }) => {
    await cadastrarConteudo(page, 'Algoritmos');

    await page.locator('text=Algoritmos')
      .locator('..')
      .getByRole('button', { name: 'Editar' })
      .click();

    await page.locator('#modalContentSubject').waitFor({ state: 'visible' });
    await page.locator('#modalContentSubject').selectOption('');

    await expect(page.locator('#contentModalSubmitBtn')).toBeDisabled();
  });

});

test.describe.serial('Borda: Create e Edit', () => {

  test('Usuário tenta cadastrar um conteúdo com caracteres especiais no nome', async ({ page }) => {
    await abrirModalConteudo(page);

    await page.getByRole('textbox', { name: 'Ex: Derivadas e integrais,' }).fill('@#$%&*');
    await page.locator('#modalContentSubject').selectOption({ label: 'Engenharia de Software' });
    await page.locator('#modalContentSemester').selectOption('3');
    await page.getByRole('button', { name: 'Salvar conteúdo' }).click();

    await expect(page.getByText('O nome do conteúdo não pode conter números ou caracteres especiais.', { exact: false })).toBeVisible();
  });

  test('Usuário edita um conteúdo e coloca semestre acima do limite — botão salvar deve ficar desabilitado', async ({ page }) => {
    await cadastrarConteudo(page, 'Redes de Computadores');

    await page.locator('text=Redes de Computadores')
      .locator('..')
      .getByRole('button', { name: 'Editar' })
      .click();

    await page.locator('#modalContentSemester').waitFor({ state: 'visible' });
    await page.locator('#modalContentSemester').selectOption('outro');
    await page.locator('#modalContentSemesterCustom').waitFor({ state: 'visible' });
    await page.locator('#modalContentSemesterCustom').fill('21');

    await expect(page.locator('#contentModalSubmitBtn')).toBeDisabled();
  });

});