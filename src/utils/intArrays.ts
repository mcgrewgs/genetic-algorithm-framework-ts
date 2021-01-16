export function IntRange(n: number): number[] {
    return Array.from(Array(n).keys());
}

export function Sum(ns: number[]): number {
    return ns.reduce((sum, nxt) => sum + nxt);
}

export function Mean(ns: number[]): number {
    return Sum(ns) / ns.length;
}

export function Negate(ns: number[]): number[] {
    return ns.map((n) => -n);
}
