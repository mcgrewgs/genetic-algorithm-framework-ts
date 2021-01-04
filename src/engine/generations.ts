import { Logger } from "@nestjs/common";
import {
    Chromosome,
    ChromosomeCrossbreeder,
    ChromosomeDuplicateIndicator,
    ChromosomeFitnessEvaluator,
    ChromosomeFitnessSortFunction,
    ChromosomeGenePrinter,
    ChromosomeGenerator,
    ChromosomeMutator,
    SourceOfRandomness,
} from "../model/chromosome";
import { Contains } from "../utils/genericArrays";
import { IntRange } from "../utils/intArrays";
import {
    uniqueNamesGenerator,
    Config,
    adjectives,
    colors,
    names,
} from "unique-names-generator";

const nameGenConfig: Config = {
    dictionaries: [adjectives, colors, names],
    style: "capital",
};
const getRandomName: () => string = () => uniqueNamesGenerator(nameGenConfig);

export function FirstGeneration<T>(
    generator: ChromosomeGenerator<T>,
    fitnessFunc: ChromosomeFitnessEvaluator<T>,
    generationSize: number,
    random: SourceOfRandomness
): Chromosome<T>[] {
    return IntRange(generationSize)
        .map(() => generator(random))
        .map((c) => {
            c.fitness = fitnessFunc(c);
            if (!c.name) {
                c.name = getRandomName();
            }
            return c;
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
    random: SourceOfRandomness,
    dupeFinder?: ChromosomeDuplicateIndicator<T>
): Chromosome<T>[] {
    let nextGen: Chromosome<T>[] = [];

    IntRange(numKeepers).forEach((i) => {
        nextGen.push(currentGeneration[i]);
    });
    IntRange(numChildren).forEach((i) => {
        const nxt = crossbreeder(
            currentGeneration[i],
            currentGeneration[2 * numChildren - i - 1],
            random
        );
        nxt.parent1 = currentGeneration[i];
        nxt.parent2 = currentGeneration[2 * numChildren - i - 1];
        nextGen.push(nxt);
    });
    IntRange(numMutants).forEach((i) => {
        const nxt = mutator(currentGeneration[i], random);
        nxt.parent1 = currentGeneration[i];
        nxt.parent2 = currentGeneration[i];
        nextGen.push(nxt);
    });
    if (dupeFinder) {
        const newNextGen: Chromosome<T>[] = [];
        for (const n of nextGen) {
            if (!Contains(newNextGen, n, dupeFinder)) {
                newNextGen.push(n);
            }
        }
        nextGen = newNextGen;
        while (nextGen.length < currentGeneration.length) {
            let nxt = generator(random);
            while (Contains(nextGen, nxt, dupeFinder)) {
                nxt = generator(random);
            }
            nextGen.push(nxt);
        }
    } else {
        IntRange(
            currentGeneration.length - numKeepers - numChildren - numMutants
        ).forEach(() => {
            nextGen.push(generator(random));
        });
    }

    for (let i = 0; i < nextGen.length; i++) {
        if (!nextGen[i].fitness) {
            nextGen[i].fitness = fitnessFunc(nextGen[i]);
        }
        if (!nextGen[i].name) {
            nextGen[i].name = getRandomName();
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
        const nm = gen[i].name || `Chromosome ${i}`;
        logger.log(
            `    ${nm} (${gen[i].fitness || 0}): ${genePrinter(gen[i])}`
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
    genSize: number,
    dupeFinder?: ChromosomeDuplicateIndicator<T>
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
            sor,
            dupeFinder
        );
        PrintGeneration(logger, gen, genePrinter, i + 1, totalGens, numKeepers);
    }
    // logger.log("Family trees for keepers: ");
    // for (let i = 0; i < numKeepers; i++) {
    //     PrintFamilyTree(logger, gen[i], "  ");
    // }
}

export function PrintFamilyTree<T>(
    logger: Logger,
    c: Chromosome<T>,
    currentIndent: string,
    indentStep = "  "
): void {
    const nm = c.name || "UNKNOWN";
    logger.log(`${currentIndent}${nm}`);
    if (c.parent1) {
        PrintFamilyTree(
            logger,
            c.parent1,
            `${indentStep}${currentIndent}`,
            indentStep
        );
    }
    if (c.parent2) {
        PrintFamilyTree(
            logger,
            c.parent2,
            `${indentStep}${currentIndent}`,
            indentStep
        );
    }
}
