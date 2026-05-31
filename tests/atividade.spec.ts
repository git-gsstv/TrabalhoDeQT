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

function dataHoje(): string {
  return new Date().toISOString().split('T')[0];
}

async function abrirModalAtividade(page: any) {
  await page.goto('https://studylab.free.laravel.cloud/activities');
  await page.getByRole('button', { name: 'Nova atividade' }).click();
  await page.getByRole('textbox', { name: 'Ex: Fazer exercícios do capí' }).waitFor({ state: 'visible' });
}

async function cadastrarAtividade(page: any, descricao: string, data: string) {
  await abrirModalAtividade(page);
  await page.getByRole('textbox', { name: 'Ex: Fazer exercícios do capí' }).fill(descricao);
  await page.locator('#modalSubjectId').selectOption('manual');
  await page.getByRole('textbox', { name: 'Ex: GEO, Cálculo II, Inglês…' }).fill('ES');
  await page.locator('#modalDueDate').fill(data);
  await page.locator('#modalStatus').selectOption('pending');
  await page.getByRole('button', { name: 'Salvar atividade' }).click();
  await expect(page.getByText('Atividade cadastrada!', { exact: false })).toBeVisible();
}

test.describe.serial('Felizes: Create e Delete', () => {

  test('Usuário pode cadastrar uma atividade com data futura', async ({ page }) => {
    await abrirModalAtividade(page);

    await page.getByRole('textbox', { name: 'Ex: Fazer exercícios do capí' }).fill('Estudar para a prova');
    await page.locator('#modalSubjectId').selectOption('manual');
    await page.getByRole('textbox', { name: 'Ex: GEO, Cálculo II, Inglês…' }).fill('ES');
    await page.locator('#modalDueDate').fill(dataFutura(3));
    await page.locator('#modalStatus').selectOption('pending');
    await page.getByRole('button', { name: 'Salvar atividade' }).click();

    await expect(page.getByText('Atividade cadastrada!', { exact: false })).toBeVisible();
  });

  test('Usuário pode deletar uma atividade', async ({ page }) => {
    await page.goto('https://studylab.free.laravel.cloud/activities');
    await page.getByRole('heading', { name: 'Atividades' }).waitFor({ state: 'visible' });

    await page.locator('tr', { hasText: 'Estudar para a prova' })
      .getByRole('button', { name: 'Excluir' })
      .click();

    await expect(page.getByText('Excluir atividade', { exact: false })).toBeVisible();
    await page.getByRole('button', { name: 'Sim, excluir' }).click();

    await expect(page.getByText('Atividade excluída!', { exact: false })).toBeVisible();
  });

});

test.describe.serial('Tristes: Create e Edit', () => {

  test('Usuário tenta cadastrar uma atividade com caracteres especiais na descrição', async ({ page }) => {
    await abrirModalAtividade(page);

    await page.getByRole('textbox', { name: 'Ex: Fazer exercícios do capí' }).fill('@#$%&*');
    await page.locator('#modalSubjectId').selectOption('manual');
    await page.getByRole('textbox', { name: 'Ex: GEO, Cálculo II, Inglês…' }).fill('ES');
    await page.locator('#modalDueDate').fill(dataFutura(3));
    await page.locator('#modalStatus').selectOption('pending');
    await page.getByRole('button', { name: 'Salvar atividade' }).click();

    await expect(page.getByText('A descrição contém caracteres inválidos.', { exact: false })).toBeVisible();
  });

  test('Usuário edita uma atividade e remove o status', async ({ page }) => {
    await cadastrarAtividade(page, 'Revisar anotações', dataFutura(3));

    await page.locator('tr', { hasText: 'Revisar anotações' })
      .getByRole('button', { name: 'Editar' })
      .click();

    await page.locator('#modalStatus').waitFor({ state: 'visible' });
    await page.locator('#modalStatus').selectOption('');
    await page.getByRole('button', { name: 'Salvar alterações' }).click();

    await expect(page.locator('#err-modalStatus')).toBeVisible();
  });

});

test.describe.serial('Borda: Create e Edit', () => {

  test('Usuário cadastra uma atividade com a data de hoje', async ({ page }) => {
    await abrirModalAtividade(page);

    await page.getByRole('textbox', { name: 'Ex: Fazer exercícios do capí' }).fill('Tarefa do dia');
    await page.locator('#modalSubjectId').selectOption('manual');
    await page.getByRole('textbox', { name: 'Ex: GEO, Cálculo II, Inglês…' }).fill('ES');
    await page.locator('#modalDueDate').fill(dataHoje());
    await page.locator('#modalStatus').selectOption('pending');
    await page.getByRole('button', { name: 'Salvar atividade' }).click();

    await expect(page.getByText('Atividade cadastrada!', { exact: false })).toBeVisible();
  });

  test('Usuário edita uma atividade e muda a data para ontem', async ({ page }) => {
    await cadastrarAtividade(page, 'Leitura do capítulo', dataFutura(3));

    await page.locator('tr', { hasText: 'Leitura do capítulo' })
      .getByRole('button', { name: 'Editar' })
      .click();

    await page.locator('#modalDueDate').waitFor({ state: 'visible' });
    await page.locator('#modalDueDate').fill(dataPassada(1));
    await page.getByRole('button', { name: 'Salvar alterações' }).click();

    await expect(page.getByText('A data não pode estar no passado.', { exact: false })).toBeVisible();
  });

});