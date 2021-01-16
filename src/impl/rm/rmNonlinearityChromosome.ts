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
import { Equals } from "../../utils/genericArrays";
import { BIT, NL, Word16 } from "../../utils/fft";

export type RM14Word = Word16;

export const RM14NLSourceOfRandomness = function (max: number): number {
    return Math.floor(Math.random() * Math.floor(max));
};

export const RM14NLChromosomeDuplicateIndicator: ChromosomeDuplicateIndicator<RM14Word> = function (
    c1: Chromosome<RM14Word>,
    c2: Chromosome<RM14Word>
): boolean {
    return Equals(c1.genes, c2.genes);
};

function rb(r: SourceOfRandomness): boolean {
    return r(2) == 1;
}

export const RM14NLChromosomeCrossbreeder: ChromosomeCrossbreeder<RM14Word> = function (
    c1: Chromosome<RM14Word>,
    c2: Chromosome<RM14Word>,
    r: SourceOfRandomness
): Chromosome<RM14Word> {
    return {
        genes: [
            rb(r) ? c1.genes[0] : c2.genes[0],
            rb(r) ? c1.genes[1] : c2.genes[1],
            rb(r) ? c1.genes[2] : c2.genes[2],
            rb(r) ? c1.genes[3] : c2.genes[3],
            rb(r) ? c1.genes[4] : c2.genes[4],
            rb(r) ? c1.genes[5] : c2.genes[5],
            rb(r) ? c1.genes[6] : c2.genes[6],
            rb(r) ? c1.genes[7] : c2.genes[7],
            rb(r) ? c1.genes[8] : c2.genes[8],
            rb(r) ? c1.genes[9] : c2.genes[9],
            rb(r) ? c1.genes[10] : c2.genes[10],
            rb(r) ? c1.genes[11] : c2.genes[11],
            rb(r) ? c1.genes[12] : c2.genes[12],
            rb(r) ? c1.genes[13] : c2.genes[13],
            rb(r) ? c1.genes[14] : c2.genes[14],
            rb(r) ? c1.genes[15] : c2.genes[15],
        ],
    };
};

export const RM14NLChromosomeGenePrinter: ChromosomeGenePrinter<RM14Word> = function (
    c: Chromosome<RM14Word>
): string {
    return JSON.stringify(c.genes);
};

export const RM14NLChromosomeGenerator: ChromosomeGenerator<RM14Word> = function (
    r: SourceOfRandomness
): Chromosome<RM14Word> {
    return {
        genes: [
            rb(r) ? BIT.ON : BIT.OFF,
            rb(r) ? BIT.ON : BIT.OFF,
            rb(r) ? BIT.ON : BIT.OFF,
            rb(r) ? BIT.ON : BIT.OFF,
            rb(r) ? BIT.ON : BIT.OFF,
            rb(r) ? BIT.ON : BIT.OFF,
            rb(r) ? BIT.ON : BIT.OFF,
            rb(r) ? BIT.ON : BIT.OFF,
            rb(r) ? BIT.ON : BIT.OFF,
            rb(r) ? BIT.ON : BIT.OFF,
            rb(r) ? BIT.ON : BIT.OFF,
            rb(r) ? BIT.ON : BIT.OFF,
            rb(r) ? BIT.ON : BIT.OFF,
            rb(r) ? BIT.ON : BIT.OFF,
            rb(r) ? BIT.ON : BIT.OFF,
            rb(r) ? BIT.ON : BIT.OFF,
        ],
    };
};

export const RM14NLChromosomeMutator: ChromosomeMutator<RM14Word> = function (
    c: Chromosome<RM14Word>,
    r: SourceOfRandomness
): Chromosome<RM14Word> {
    return RM14NLChromosomeCrossbreeder(c, RM14NLChromosomeGenerator(r), r);
};

export const RM14NLChromosomeFitnessEvaluator: ChromosomeFitnessEvaluator<RM14Word> = function (
    c: Chromosome<RM14Word>
): number {
    return NL(c.genes);
};
