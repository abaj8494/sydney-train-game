export type Op = '+' | '-' | '*' | '/';

type Node = { 
  val: number;
  expr: string;
}

// for division operation
const EPS = 1e-9;

function combine(a: Node, b: Node): Node[] {
  const out: Node[] = [
    { val: a.val + b.val, expr: `(${a.expr}+${b.expr})` },
    { val: a.val - b.val, expr: `(${a.expr}-${b.expr})` },
    { val: a.val * b.val, expr: `(${a.expr}*${b.expr})` },
  ];
  if (Math.abs(b.val)>EPS) out.push({val:a.val/b.val, expr:`(${a.expr}/${b.expr})`}) // else condition?
  return out;
}

// in-order solver: keep digits in order, vary parethesis and ops
export function solveToTen(digits: number[], target=10): string[] {
  const start: Node[] = digits.map((d)=> ({val: d, expr: `${d}` })); // stack memory
  const seen = new Set <string>();

  function rec(nodes: Node[]) {
    if (nodes.length === 1) {
      if (Math.abs(nodes[0].val - target) < EPS) {
        // drop outermost parethesis:
        seen.add(nodes[0].expr.replace(/^\((.*)\)$/, '$1')); // regex broken
      }
    return;
    }
  // combine any adjacent pair. enumerates all in-order parenthesisations.
    for (let i = 0; i < nodes.length - 1; i++) {
      const a = nodes[i], b = nodes[i + 1];
      for (const nxt of combine(a, b)) {
        const nextNodes = nodes.slice(0, i).concat(nxt, nodes.slice(i+2));
        rec(nextNodes);
      }
    }
  }
  rec(start);
  return Array.from(seen).sort();
}
