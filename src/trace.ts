// src/trace.ts
export type Op = '+' | '-' | '*' | '/' | '^';

type Node = { val:number; expr:string };
export type TraceNode = {
  state: string[];
  isSolution?: boolean;
  action?: { i:number; op:Op; out:string; val:number };
  children: TraceNode[];
};

const EPS = 1e-9;
function safePow(a:number,b:number): number | null {
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
  if (Math.abs(b) > 9) return null;
  if (a < 0 && Math.trunc(b) !== b) return null;
  const out = a ** b;
  return Number.isFinite(out) && Math.abs(out) <= 1e9 ? out : null;
}

function combineAll(a: Node, b: Node, ops: Set<Op>): Array<{ node:Node, op:Op }> {
  const out: Array<{node:Node, op:Op}> = [];
  const make = (op:Op, val:number, disp=op) =>
    out.push({ op, node: { val, expr:`(${a.expr}${disp}${b.expr})` } });
  if (ops.has('+')) make('+', a.val + b.val);
  if (ops.has('-')) make('-', a.val - b.val);
  if (ops.has('*')) make('*', a.val * b.val);
  if (ops.has('/')) if (Math.abs(b.val) > EPS) make('/', a.val / b.val);
  if (ops.has('^')) { const p = safePow(a.val, b.val); if (p !== null) make('^', p, '^'); }
  return out;
}

export function traceSolve(digits:number[], ops:Op[], target=10): TraceNode {
  const allowed = new Set(ops);
  function rec(nodes: Node[]): TraceNode {
    const here: TraceNode = { state: nodes.map(n => n.expr), children: [] };
    if (nodes.length === 1) {
      here.isSolution = Math.abs(nodes[0].val - target) < EPS;
      return here;
    }
    for (let i=0;i<nodes.length-1;i++){
      const a = nodes[i], b = nodes[i+1];
      for (const {node:n2, op} of combineAll(a,b,allowed)) {
        const next = nodes.slice(0,i).concat(n2, nodes.slice(i+2));
        const child = rec(next);
        child.action = { i, op, out:n2.expr, val:n2.val };
        here.children.push(child);
      }
    }
    return here;
  }
  return rec(digits.map(d => ({ val:d, expr:String(d) })));
}

export function printTrace(root: TraceNode, onlySolutions=false, indent=''): void {
  const line = `${indent}[${root.state.join(', ')}]${root.isSolution ? ' ✅' : ''}`;
  console.log(line);
  for (const ch of root.children) {
    if (onlySolutions && !hasSolution(ch)) continue;
    const a = ch.action!;
    console.log(`${indent}  merge(${a.i},${a.i+1}) op ${a.op} -> ${a.out} = ${fmt(a.val)}`);
    printTrace(ch, onlySolutions, indent + '    ');
  }
}
function hasSolution(n: TraceNode): boolean {
  if (n.isSolution) return true;
  return n.children.some(hasSolution);
}
const fmt = (x:number) => Number.isInteger(x) ? String(x) : x.toFixed(6);
