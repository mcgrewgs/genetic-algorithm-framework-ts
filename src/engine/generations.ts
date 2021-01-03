import { Logger } from "@nestjs/common";
import {
    Chromosome,
    ChromosomeCrossbreeder,
    ChromosomeFitnessEvaluator,
    ChromosomeFitnessSortFunction,
    ChromosomeGenePrinter,
    ChromosomeGenerator,
    ChromosomeMutator,
    SourceOfRandomness,
} from "../model/chromosome";
import { IntRange } from "../utils/intArrays";

export function FirstGeneration<T>(
    generator: ChromosomeGenerator<T>,
    fitnessFunc: ChromosomeFitnessEvaluator<T>,
    generationSize: number,
    random: SourceOfRandomness
): Chromosome<T>[] {
    return IntRange(generationSize)
        .map(() => generator(random))
        .map((c) => {
            return {
                genes: c.genes,
                fitness: fitnessFunc(c),
            };
        })
        .sort(ChromosomeFitnessSortFunction<T>());
}

export function NextGeneration<T>(
    currentGeneration: Chromosome<T>[],
    crossbreeder: ChromosomeCrossbreeder<T>,
    generator: ChromosomeGenerator<T>,
    mutator: ChromosomeMutator<T>,
    fitnessFunc: ChromosomeFitnessEvaluator<T>,
    numKeepers: number,
    numChildren: number,
    numMutants: number,
    random: SourceOfRandomness
): Chromosome<T>[] {
    const nextGen: Chromosome<T>[] = [];

    IntRange(numKeepers).forEach((i) => {
        nextGen.push(currentGeneration[i]);
    });
    IntRange(numChildren).forEach((i) => {
        nextGen.push(
            crossbreeder(
                currentGeneration[i],
                currentGeneration[2 * numChildren - i - 1],
                random
            )
        );
    });
    IntRange(numMutants).forEach((i) => {
        nextGen.push(mutator(currentGeneration[i], random));
    });
    IntRange(
        currentGeneration.length - numKeepers - numChildren - numMutants
    ).forEach(() => {
        nextGen.push(generator(random));
    });

    for (let i = 0; i < nextGen.length; i++) {
        if (!nextGen[i].fitness) {
            nextGen[i].fitness = fitnessFunc(nextGen[i]);
        }
    }

    return nextGen.sort(ChromosomeFitnessSortFunction<T>());
}

export function PrintGeneration<T>(
    logger: Logger,
    gen: Chromosome<T>[],
    genePrinter: ChromosomeGenePrinter<T>,
    genNum: number,
    totalGens: number,
    numKeepers: number
): void {
    logger.log(`Generation ${genNum}/${totalGens}:`);
    logger.log("  Keepers:");
    for (let i = 0; i < numKeepers; i++) {
        logger.log(
            `    Chromosome ${i} (${gen[i].fitness || 0}): ${genePrinter(
                gen[i]
            )}`
        );
    }
}

export function RunGenerations<T>(
    cg: ChromosomeGenerator<T>,
    cfe: ChromosomeFitnessEvaluator<T>,
    cc: ChromosomeCrossbreeder<T>,
    cm: ChromosomeMutator<T>,
    sor: SourceOfRandomness,
    logger: Logger,
    genePrinter: ChromosomeGenePrinter<T>,
    totalGens: number,
    numKeepers: number,
    numChildren: number,
    numMutants: number,
    genSize: number
): void {
    let gen = FirstGeneration(cg, cfe, genSize, sor);
    PrintGeneration(logger, gen, genePrinter, 0, totalGens, numKeepers);
    for (let i = 0; i < totalGens; i++) {
        gen = NextGeneration(
            gen,
            cc,
            cg,
            cm,
            cfe,
            numKeepers,
            numChildren,
            numMutants,
            sor
        );
        PrintGeneration(logger, gen, genePrinter, i + 1, totalGens, numKeepers);
    }
}
