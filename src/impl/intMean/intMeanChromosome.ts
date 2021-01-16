import { Equals } from "../../utils/genericArrays";
import { IntRange, Mean } from "../../utils/intArrays";
import {
    Chromosome,
    ChromosomeCrossbreeder,
    ChromosomeDuplicateIndicator,
    ChromosomeFitnessEvaluator,
    ChromosomeGenePrinter,
    ChromosomeGenerator,
    ChromosomeMutator,
    SourceOfRandomness,
} from "../../model/chromosome";

const maxGeneratedArrayLength = 8;
const maxGeneratedIntValue = 16384;

export type IntMeanChromosomeGeneType = number[];

export const IntMeanSourceOfRandomness = function (max: number): number {
    return Math.floor(Math.random() * Math.floor(max));
};

export const IntMeanChromosomeDuplicateIndicator: ChromosomeDuplicateIndicator<IntMeanChromosomeGeneType> = function (
    c1: Chromosome<IntMeanChromosomeGeneType>,
    c2: Chromosome<IntMeanChromosomeGeneType>
): boolean {
    return Equals(c1.genes, c2.genes);
};

export const IntMeanChromosomeCrossbreeder: ChromosomeCrossbreeder<IntMeanChromosomeGeneType> = function (
    c1: Chromosome<IntMeanChromosomeGeneType>,
    c2: Chromosome<IntMeanChromosomeGeneType>,
    r: SourceOfRandomness
): Chromosome<IntMeanChromosomeGeneType> {
    const newGenes = [...c1.genes];
    newGenes.push(...c2.genes);
    while (newGenes.length > maxGeneratedArrayLength) {
        newGenes.splice(r(newGenes.length), 1);
    }
    return {
        genes: newGenes.sort(),
    };
};

export const IntMeanChromosomeGenePrinter: ChromosomeGenePrinter<IntMeanChromosomeGeneType> = function (
    c: Chromosome<IntMeanChromosomeGeneType>
): string {
    return JSON.stringify(c.genes);
};

export const IntMeanChromosomeGenerator: ChromosomeGenerator<IntMeanChromosomeGeneType> = function (
    r: SourceOfRandomness
): Chromosome<IntMeanChromosomeGeneType> {
    return {
        genes: IntRange(r(maxGeneratedArrayLength) + 1)
            .map(() => r(maxGeneratedIntValue))
            .sort(),
    };
};

export const IntMeanChromosomeMutator: ChromosomeMutator<IntMeanChromosomeGeneType> = function (
    c: Chromosome<IntMeanChromosomeGeneType>,
    r: SourceOfRandomness
): Chromosome<IntMeanChromosomeGeneType> {
    return IntMeanChromosomeCrossbreeder(c, IntMeanChromosomeGenerator(r), r);
};

export const IntMeanChromosomeFitnessEvaluator: ChromosomeFitnessEvaluator<IntMeanChromosomeGeneType> = function (
    c: Chromosome<IntMeanChromosomeGeneType>
): number {
    return -Mean(c.genes);
};
