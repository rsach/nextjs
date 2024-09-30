import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://nextjs-seven-blush-21.vercel.app/blocking');
  await page.locator('div').filter({ hasText: /^Submit$/ }).click();
  await page.getByPlaceholder('Username').click();
  await page.getByPlaceholder('Username').fill('rahul');
  await page.getByPlaceholder('Username').press('Tab');
  await page.getByPlaceholder('Job Title').fill('software engineer');
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('button', { name: 'Edit Information' }).click();
  await page.getByPlaceholder('Username').click();
  await page.getByPlaceholder('Username').fill('rahul s');
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByLabel('Open modal for Rick Sanchez').click();
  await page.getByLabel('Close').click();
});