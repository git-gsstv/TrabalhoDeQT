import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

const bimestreClasse: Record<string, string> = {
  '1': 'border-blue-200',
  '2': 'border-purple-200',
  '3': 'border-orange-200',
  '4': 'border-green-200',
};

async function abrirModalNota(page: any) {
  await page.goto('https://studylab.free.laravel.cloud/bulletin');
  await page.getByRole('button', { name: 'Nova nota' }).click();
  await page.locator('#gradeModalSubjectId').waitFor({ state: 'visible' });
}

async function selecionarMateria(page: any) {
  await page.evaluate(() => {
    const select = document.querySelector('#gradeModalSubjectId') as HTMLSelectElement;
    select.value = '128';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    select.dispatchEvent(new Event('input', { bubbles: true }));
  });
}

async function cadastrarNota(page: any, bimestre: string, parcial: string, final: string) {
  await abrirModalNota(page);
  await page.locator('#gradeModalBimester').selectOption(bimestre);
  await page.locator('#gradeModalMidterm').fill(parcial);
  await page.locator('#gradeModalEndterm').fill(final);
  await selecionarMateria(page);
  await page.getByRole('button', { name: 'Salvar nota' }).click();
  await expect(page.getByText('Nota cadastrada!', { exact: false })).toBeVisible();
}

function cardBimestre(page: any, bimestre: string) {
  return page.locator(`div.${bimestreClasse[bimestre]}`);
}

test.describe.serial('Felizes: Create e Delete', () => {

  test('Usuário pode cadastrar uma nota', async ({ page }) => {
    await abrirModalNota(page);

    await page.locator('#gradeModalBimester').selectOption('3');
    await page.locator('#gradeModalMidterm').fill('7');
    await page.locator('#gradeModalEndterm').fill('8');
    await selecionarMateria(page);
    await page.getByRole('button', { name: 'Salvar nota' }).click();

    await expect(page.getByText('Nota cadastrada!', { exact: false })).toBeVisible();
  });

  test('Usuário pode deletar uma nota', async ({ page }) => {
    await page.goto('https://studylab.free.laravel.cloud/bulletin');

    await cardBimestre(page, '3')
      .locator('tr', { hasText: 'Engenharia' })
      .locator('[data-del]')
      .click();

    await expect(page.getByText('Excluir nota?', { exact: false })).toBeVisible();
    await page.getByRole('button', { name: 'Sim, excluir' }).click();

    await expect(page.getByText('Nota excluída!', { exact: false })).toBeVisible();
  });

});

test.describe.serial('Tristes: Create e Edit', () => {

  test('Usuário tenta cadastrar uma nota sem informar a matéria', async ({ page }) => {
    await abrirModalNota(page);

    await page.locator('#gradeModalBimester').selectOption('1');
    await page.locator('#gradeModalMidterm').fill('5');
    await page.locator('#gradeModalEndterm').fill('7');
    await page.getByRole('button', { name: 'Salvar nota' }).click();

    await expect(page.getByText('Selecione a matéria.', { exact: false })).toBeVisible();
  });

  test('Usuário edita uma nota e troca o bimestre para vazio', async ({ page }) => {
    await cadastrarNota(page, '4', '6', '8');

    await cardBimestre(page, '4')
      .locator('tr', { hasText: 'Engenharia' })
      .locator('[data-edit]')
      .click();

    await page.locator('#gradeModalBimester').waitFor({ state: 'visible' });
    await page.locator('#gradeModalBimester').selectOption('');
    await page.getByRole('button', { name: 'Salvar nota' }).click();

    await expect(page.getByText('Selecione o bimestre.', { exact: false })).toBeVisible();
  });

});

test.describe.serial('Borda: Create e Edit', () => {

  test('Usuário tenta cadastrar uma nota com ano 1999', async ({ page }) => {
    await abrirModalNota(page);

    await page.locator('#gradeModalBimester').selectOption('1');
    await page.locator('#gradeModalMidterm').fill('5');
    await page.locator('#gradeModalEndterm').fill('7');
    await page.getByPlaceholder('2026').fill('1999');
    await selecionarMateria(page);
    await page.getByRole('button', { name: 'Salvar nota' }).click();

    await expect(page.getByText('Ano entre 2000 e 2027.', { exact: false })).toBeVisible();
  });

  test('Usuário edita uma nota e coloca nota final acima de 10', async ({ page }) => {
    await cadastrarNota(page, '3', '5', '6');

    await cardBimestre(page, '3')
      .locator('tr', { hasText: 'Engenharia' })
      .locator('[data-edit]')
      .click();

    await page.locator('#gradeModalEndterm').waitFor({ state: 'visible' });
    await page.locator('#gradeModalEndterm').fill('11');
    await page.getByRole('button', { name: 'Salvar alterações' }).click();

    await expect(page.getByText('Nota entre 0 e 10.', { exact: false })).toBeVisible();
  });

});