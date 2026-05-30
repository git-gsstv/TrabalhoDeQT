import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

const run = Date.now();

async function abrirModalCadastro(page: any) {
  await page.goto('https://studylab.free.laravel.cloud/subjects');
  await page.getByRole('button', { name: 'Adicionar matéria' }).click();
  await page.locator('#modalSubjectName').waitFor({ state: 'visible' });
}

test.describe.serial('Felizes: Create e Delete', () => {

  test('Usuário pode cadastrar uma matéria', async ({ page }) => {
    await abrirModalCadastro(page);

    await page.locator('#modalSubjectName').selectOption('Biologia');
    await page.getByRole('textbox', { name: 'Ex: Prof. João Silva' }).fill(`Samira_${run}`);
    await page.locator('#modalSubjectSemester').selectOption('3');
    await page.getByRole('button', { name: 'Salvar matéria' }).click();

    await expect(page.getByText('Matéria cadastrada!', { exact: false })).toBeVisible();
  });

  test('Usuário pode deletar uma matéria', async ({ page }) => {
    await page.goto('https://studylab.free.laravel.cloud/subjects');
    await expect(page.getByText('Minhas Matérias', { exact: false })).toBeVisible();

    await page.locator(`text=Samira_${run}`)
      .locator('..')
      .getByRole('button', { name: 'Excluir' })
      .click();

    await expect(page.getByText('Excluir matéria?', { exact: false })).toBeVisible();
    await page.getByRole('button', { name: 'Sim, excluir' }).click();

    await expect(page.getByText('Matéria excluída!', { exact: false })).toBeVisible();
  });

});

test.describe.serial('Tristes: Create e Edit', () => {

  test('Usuário cadastra uma matéria sem selecionar o semestre', async ({ page }) => {
    await abrirModalCadastro(page);

    await page.locator('#modalSubjectName').selectOption('Redação');
    await page.getByRole('textbox', { name: 'Ex: Prof. João Silva' }).fill(`Cristina_${run}`);
    await page.getByRole('button', { name: 'Salvar matéria' }).click();

    await expect(page.getByText('Selecione ou informe o semestre.', { exact: false })).toBeVisible();
  });

  test('Usuário edita uma matéria e troca o semestre para vazio', async ({ page }) => {
    await abrirModalCadastro(page);

    await page.locator('#modalSubjectName').selectOption('Geografia');
    await page.getByRole('textbox', { name: 'Ex: Prof. João Silva' }).fill(`Silvania_${run}`);
    await page.locator('#modalSubjectSemester').selectOption('3');
    await page.getByRole('button', { name: 'Salvar matéria' }).click();
    await expect(page.getByText('Matéria cadastrada!', { exact: false })).toBeVisible();

    await page.locator(`text=Silvania_${run}`)
      .locator('..')
      .getByRole('button', { name: 'Editar' })
      .click();

    await page.locator('#modalSubjectSemester').waitFor({ state: 'visible' });
    await page.locator('#modalSubjectSemester').selectOption('');
    await page.getByRole('button', { name: 'Salvar alterações' }).click();

    await expect(page.getByText('Selecione ou informe o semestre.', { exact: false })).toBeVisible();
  });

});