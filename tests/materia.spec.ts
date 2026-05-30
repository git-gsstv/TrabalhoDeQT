import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

async function abrirModalCadastro(page: any) {
  await page.goto('https://studylab.free.laravel.cloud/subjects');
  await page.getByRole('button', { name: 'Adicionar matéria' }).click();
  await page.locator('#modalSubjectName').waitFor({ state: 'visible' });
}

test.describe.serial('Felizes: Create e Delete', () => {

  test('Usuário pode cadastrar uma matéria', async ({ page }) => {
    await abrirModalCadastro(page);

    await page.locator('#modalSubjectName').selectOption('Biologia');
    await page.getByRole('textbox', { name: 'Ex: Prof. João Silva' }).fill('Samira Bessa');
    await page.locator('#modalSubjectSemester').selectOption('3');
    await page.getByRole('button', { name: 'Salvar matéria' }).click();

    await expect(page.getByText('Matéria cadastrada!', { exact: false })).toBeVisible();
  });

  test('Usuário pode deletar uma matéria', async ({ page }) => {
    await page.goto('https://studylab.free.laravel.cloud/subjects');
    await expect(page.getByText('Minhas Matérias', { exact: false })).toBeVisible();

    await page.locator('text=Biologia')
      .locator('..')
      .getByRole('button', { name: 'Excluir' })
      .click();

    await expect(page.getByText('Excluir matéria?', { exact: false })).toBeVisible();
    await page.getByRole('button', { name: 'Sim, excluir' }).click();

    await expect(page.getByText('Matéria excluída!', { exact: false })).toBeVisible();
  });

});

test.describe.serial('Tristes: Create e Edit', () => {

  test('Usuário tenta cadastrar uma matéria com números no campo de professor', async ({ page }) => {
    await abrirModalCadastro(page);

    await page.locator('#modalSubjectName').selectOption('Redação');
    await page.getByRole('textbox', { name: 'Ex: Prof. João Silva' }).fill('12345678');
    await page.locator('#modalSubjectSemester').selectOption('3');
    await page.getByRole('button', { name: 'Salvar matéria' }).click();

    await expect(page.getByText('O campo professor não pode conter números.', { exact: false })).toBeVisible();
  });

  test('Usuário edita uma matéria e troca o semestre para vazio', async ({ page }) => {
    await abrirModalCadastro(page);

    await page.locator('#modalSubjectName').selectOption('Geografia');
    await page.getByRole('textbox', { name: 'Ex: Prof. João Silva' }).fill('Silvânia');
    await page.locator('#modalSubjectSemester').selectOption('3');
    await page.getByRole('button', { name: 'Salvar matéria' }).click();
    await expect(page.getByText('Matéria cadastrada!', { exact: false })).toBeVisible();

    await page.locator('text=Geografia')
      .locator('..')
      .getByRole('button', { name: 'Editar' })
      .click();

    await page.locator('#modalSubjectSemester').waitFor({ state: 'visible' });
    await page.locator('#modalSubjectSemester').selectOption('');
    await page.getByRole('button', { name: 'Salvar alterações' }).click();

    await expect(page.getByText('Selecione ou informe o semestre.', { exact: false })).toBeVisible();
  });

});

test.describe.serial('Borda: Create e Edit', () => {

  test('Usuário cadastra uma matéria com o nome do professor tendo 256 caracteres', async ({ page }) => {
    await abrirModalCadastro(page);

    await page.locator('#modalSubjectName').selectOption('Física');
    await page.getByRole('textbox', { name: 'Ex: Prof. João Silva' }).fill('dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd');
    await page.locator('#modalSubjectSemester').selectOption('3');
    await page.getByRole('button', { name: 'Salvar matéria' }).click();

    await expect(page.getByText('O nome não pode ter mais de 255 caracteres.', { exact: false })).toBeVisible();
  });

  test('Usuário edita uma matéria trocando o semestre de vinte para vinte e um', async ({ page }) => {
    await abrirModalCadastro(page);

    await page.locator('#modalSubjectName').selectOption('Química');
    await page.getByRole('textbox', { name: 'Ex: Prof. João Silva' }).fill('Nayane');
    await page.locator('#modalSubjectSemester').selectOption('outro');
    await page.locator('#modalSubjectSemesterCustom').waitFor({ state: 'visible' });
    await page.locator('#modalSubjectSemesterCustom').fill('20');
    await page.getByRole('button', { name: 'Salvar matéria' }).click();
    await expect(page.getByText('Matéria cadastrada!', { exact: false })).toBeVisible();

    await page.locator('text=Química')
      .locator('..')
      .getByRole('button', { name: 'Editar' })
      .click();

    await page.locator('#modalSubjectSemester').waitFor({ state: 'visible' });
    await page.locator('#modalSubjectSemester').selectOption('outro');
    await page.locator('#modalSubjectSemesterCustom').waitFor({ state: 'visible' });
    await page.locator('#modalSubjectSemesterCustom').fill('21');
    await page.getByRole('button', { name: 'Salvar alterações' }).click();

    await expect(page.getByText('O semestre não pode ser maior que 20.', { exact: false })).toBeVisible();
  });

});