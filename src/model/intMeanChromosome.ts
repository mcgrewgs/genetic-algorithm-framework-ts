import { IntRange, Mean } from "../utils/intArrays";
import {
    Chromosome,
    ChromosomeCrossbreeder,
    ChromosomeFitnessEvaluator,
    ChromosomeGenePrinter,
    ChromosomeGenerator,
    ChromosomeMutator,
    SourceOfRandomness,
} from "./chromosome";

const maxGeneratedArrayLength = 8;
const maxGeneratedIntValue = 16384;

export const IntMeanSourceOfRandomness = function (max: number): number {
    return Math.floor(Math.random() * Math.floor(max));
};

export const IntMeanChromosomeCrossbreeder: ChromosomeCrossbreeder<
    number[]
> = function (
    c1: Chromosome<number[]>,
    c2: Chromosome<number[]>,
    r: SourceOfRandomness
): Chromosome<number[]> {
    const newGenes = [...c1.genes];
    newGenes.push(...c2.genes);
    while (newGenes.length > maxGeneratedArrayLength) {
        newGenes.splice(r(newGenes.length), 1);
    }
    return {
        genes: newGenes,
    };
};

export const IntMeanChromosomeGenePrinter: ChromosomeGenePrinter<
    number[]
> = function (c: Chromosome<number[]>): string {
    return `[${c.genes.join(", ")}]`;
};

export const IntMeanChromosomeGenerator: ChromosomeGenerator<
    number[]
> = function (r: SourceOfRandomness): Chromosome<number[]> {
    return {
        genes: IntRange(r(maxGeneratedArrayLength) + 1).map(() =>
            r(maxGeneratedIntValue)
        ),
    };
};

export const IntMeanChromosomeMutator: ChromosomeMutator<number[]> = function (
    c: Chromosome<number[]>,
    r: SourceOfRandomness
): Chromosome<number[]> {
    return IntMeanChromosomeCrossbreeder(c, IntMeanChromosomeGenerator(r), r);
};

export const IntMeanChromosomeFitnessEvaluator: ChromosomeFitnessEvaluator<
    number[]
> = function (c: Chromosome<number[]>): number {
    return -Mean(c.genes);
};
