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

import { solveToTen, type Op } from "./solver";

const DEBUG = import.meta.env.VITE_DEBUG === 'true'  || import.meta.env.DEV === true;

let traceMod: null | typeof import('./trace') = null;

if (DEBUG) {
  traceMod = await import('./trace');
}

const $ = <T extends HTMLElement>(s: string) => document.querySelector(s) as T;
let selectedOps: Set <Op> = new Set(['+', '-', '*', '/']);

function currentOps(): Op[] {return Array.from(selectedOps); }

// parsing the passed html classes from index.html
document.querySelectorAll<HTMLButtonElement>('#ops .op').forEach(btn => {
  btn.addEventListener('click', () => {
    const op = btn.dataset.op as Op;
    if (selectedOps.has(op)) { selectedOps.delete(op); btn.classList.remove('on'); }
    else { selectedOps.add(op); btn.classList.add('on'); }
    // resolve current input if present
    const s = (document.getElementById('digits') as HTMLInputElement).value.trim();
    if (/^\d{4}$/.test(s)) {
      const exprs = solveToTen(s.split('').map(Number), 10, currentOps());
      renderSolutions(exprs, (document.getElementById('all') as HTMLInputElement).checked);
   }
  });
});

//scan all numbers
const scanBtn = $('#scan') as HTMLButtonElement;
const scanStatus = $('#scanStatus');
const canvas = $('#summary') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!; // note the bang

function drawBarChart(solved: number, unsolved: number) {
  // no libs
  ctx.clearRect(0,0,canvas.width, canvas.height);
  //const total = solved + unsolved
  const max = Math.max(solved, unsolved);
  const W = canvas.width, H = canvas.height, pad = 40, barW = (W - 3*pad)/2;
  const scale = (H - 2*pad) / max;
  const bars = [
    { x: pad,           v: solved,     label: `solved (${solved})` },
    { x: 2*pad+barW,    v: unsolved,   label: `unsolved (${unsolved})` },
  ];
  ctx.font = '14px system-ui';
  ctx.textBaseline = 'bottom';
  bars.forEach(b => {
    const h = b.v * scale;
    ctx.fillRect(b.x, H - pad - h, barW, h);
    ctx.fillText(b.label, b.x, H - pad - h - 6);
  });
  // axis
  ctx.beginPath();
  ctx.moveTo(pad - 10, H - pad);
  ctx.lineTo(W - pad + 10, H - pad);
  ctx.stroke();
}

async function scanAll() {
  scanBtn.disabled = true;
  scanStatus.textContent = "zzzzzzzz...";
  await new Promise(r => setTimeout(r, 0)); // let ui update

  let solved = 0;
  const ops = currentOps();

  // chunk to keep ui responsive
  for (let base = 0; base < 10000; base += 500) {
    const end = Math.min(10000, base + 500);
    for (let i = base; i < end; i++) {
      const s = i.toString().padStart(4, '0');
      const digits = s.split('').map(Number);
      const solutions = solveToTen(digits, 10, ops);
      if (solutions.length > 0) solved++;
    }
    scanStatus.textContent = `Scanning... ${end}/10000`;
    await new Promise(r => setTimeout(r, 0));
  }

  const unsolved = 10000 - solved;
  drawBarChart(solved, unsolved);
  scanStatus.textContent = `Done: ${solved} solvable, ${unsolved} not solvable with [${ops.join(' ')}].`;
  scanBtn.disabled = false;
}

scanBtn.addEventListener('click', () => void scanAll());


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
    const exprs = solveToTen(digits, 10, currentOps());
    renderSolutions(exprs, allEl.checked);
    
    // Add trace output for single digit solving
    if (DEBUG && traceMod) {
      const ops = currentOps();
      const tree = traceMod.traceSolve(digits, ops, 10);
      console.clear();
      console.group(`Trace for ${digits.join('')}, ops=[${ops.join(' ')}]`);
      traceMod.printTrace(tree, /*onlySolutions=*/false);
      console.groupEnd();
    }
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


// Trace functionality is now integrated into the main solve button
