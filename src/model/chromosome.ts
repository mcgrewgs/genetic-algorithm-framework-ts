// should generate an int between 0 (inclusive) and max (exclusive)
export interface SourceOfRandomness {
    randInt(max: number): number;
    randWeightedAvg(n1: number, n2: number): number;
}

export const DefaultSourceOfRandomness: SourceOfRandomness = {
    randInt: (max: number) => {
        return Math.floor(Math.random() * Math.floor(max));
    },
    randWeightedAvg: (n1: number, n2: number) => {
        const w = Math.random();
        return Math.floor(w * n1) + Math.ceil((1.0 - w) * n2);
    },
};

export interface Chromosome<T> {
    genes: T;
    // lower fitness is better
    fitness?: number;
    name?: string;
    parent1?: Chromosome<T>;
    parent2?: Chromosome<T>;
}

export interface ChromosomeDuplicateIndicator<T> {
    (c1: Chromosome<T>, c2: Chromosome<T>): boolean;
}

export interface ChromosomeGenePrinter<T> {
    (c: Chromosome<T>): string;
}

export interface ChromosomeCrossbreeder<T> {
    (
        c1: Chromosome<T>,
        c2: Chromosome<T>,
        r: SourceOfRandomness
    ): Chromosome<T>;
}

export interface ChromosomeGenerator<T> {
    (r: SourceOfRandomness): Chromosome<T>;
}

export interface ChromosomeMutator<T> {
    (c: Chromosome<T>, r: SourceOfRandomness): Chromosome<T>;
}

// lower fitness is better
export interface ChromosomeFitnessEvaluator<T> {
    (c: Chromosome<T>): number;
}

export function ChromosomeFitnessSortFunction<T>(): (
    a: Chromosome<T>,
    b: Chromosome<T>
) => number {
    return (a: Chromosome<T>, b: Chromosome<T>) =>
        (a.fitness || 0) - (b.fitness || 0);
}
