/** Original, template code:
import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
**/

import { solveToTen } from "./solver";

const $ = <T extends HTMLElement>(s: string) => document.querySelector(s) as T;
const form = $<HTMLFormElement>('#form');
const digitsEl = $('#digits') as HTMLInputElement;
const allEl = $('#all') as HTMLInputElement;
const out = $('#out');

function parseDigits(s: string): number[] {
  if (!/^\d{4}$/.test(s)) throw new Error('Enter exactly 4 digits');
  return s.split('').map((ch)=>Number(ch));
}

function renderSolutions(exprs: string[], showAll: boolean) {
  if (exprs.length === 0) {
    out.innerHTML = `<p>No solution with + - * /.</p>`;
    return;
  }
  const head = `<p><strong>${exprs.length}</strong> solutions(s). </p>`;
  const list = showAll ? exprs : exprs.slice(0,5);
  out.innerHTML = head + `<ul>${list.map((e)=>`<li><code>${e}</code></li>`).join('')}</ul>`;
  if (!showAll && exprs.length > 5) out.innerHTML += `<p>Showing 5 of ${exprs.length}.</p>`;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  try {
    const digits = parseDigits(digitsEl.value.trim());
    const exprs = solveToTen(digits, 10);
    renderSolutions(exprs, allEl.checked);
  } catch (err) {
    out.innerHTML = `<p style="color:#b00">${(err as Error).message}</p>`;
  }
});

document.querySelectorAll('.ex').forEach((btn) =>
  btn.addEventListener('click', (e) => {
    digitsEl.value = (e.target as HTMLButtonElement).textContent ?? '';
    form.requestSubmit();
  }),
);


