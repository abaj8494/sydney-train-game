export type Op = '+' | '-' | '*' | '/' | '^';

type Node = { 
  val: number;
  expr: string;
}

// epsilon for division
const EPS = 1e-9;


// in-order solver: keep digits in order, vary parethesis and ops
export function solveToTen(digits: number[], target=10, ops: ReadonlyArray<Op> = ['+','-','*','/']): string[] {
  const start: Node[] = digits.map((d)=> ({val: d, expr: `${d}` })); // populate from func args
  const allowed = new Set(ops);
  const seen = new Set <string>();

  function safePow(a: number, b: number): number | null {
    // keep it real and bounded
    if (!Number.isFinite(a) || !Number.isFinite(b)) return null; // float
    if (Math.abs(b) > 9) return null; // too large
    if (a < 0 && Math.abs(b - Math.trunc(b)) > EPS) return null; // too small
    const out = a ** b; // ^ is xor in js / ts; duh
    if (!Number.isFinite(out) || Math.abs(out) > 1e9) return null;
    return out;
  }

  function combine(a: Node, b: Node): Node[] {
    const out: Node[] = [];
    if (allowed.has('+')) out.push( { val: a.val + b.val, expr: `(${a.expr}+${b.expr})` });
    if (allowed.has('-')) out.push( { val: a.val - b.val, expr: `(${a.expr}-${b.expr})` });
    if (allowed.has('*')) out.push( { val: a.val * b.val, expr: `(${a.expr}*${b.expr})` });
    if (allowed.has('/')) if (Math.abs(b.val)>EPS) out.push({val:a.val/b.val, expr:`(${a.expr}/${b.expr})`});
    if (allowed.has('^')) {
      const p = safePow(a.val, b.val);
      if (p != null) out.push({ val: p, expr: `(${a.expr}^${b.expr})` }); // note internal data structure is ^ display.
    }
    return out;
  }

  function rec(nodes: Node[]) {
    if (nodes.length === 1) {
      if (Math.abs(nodes[0].val - target) < EPS) {
        // drop outermost parethesis:
        seen.add(nodes[0].expr.replace(/^\((.*)\)$/, '$1'));
        /**
         *     /    start
         *     ^    anchors to beginning of string
         *     \(   matches the ( literal
         *     (.*) capturing group; matches any char >=0 times.
         *     \)   matches ) literal 
         *     $    anchors to end of string
         *     /    end of exp.
         *     $1   first and only capturing group.
         **/
      }
    return;
    }
  // combine any adjacent pair. enumerates all in-order parenthesisations.
    for (let i = 0; i < nodes.length - 1; i++) { // tries every adjacent pair loop
      const a = nodes[i], b = nodes[i + 1]; // sliding window adjacent pair combine
      for (const nxt of combine(a, b)) { // pushes allowable ops into Node[]. checks ops loop
        const nextNodes = nodes.slice(0, i).concat(nxt, nodes.slice(i+2));
        rec(nextNodes);
      }
    }
  }
  rec(start);
  return Array.from(seen).sort();
}
