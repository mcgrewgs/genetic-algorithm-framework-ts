import { Logger } from "@nestjs/common";
import { RunGenerations } from "./engine/generations";
import {
    IntMeanChromosomeCrossbreeder,
    IntMeanChromosomeDuplicateIndicator,
    IntMeanChromosomeFitnessEvaluator,
    IntMeanChromosomeGenePrinter,
    IntMeanChromosomeGenerator,
    IntMeanChromosomeMutator,
    IntMeanSourceOfRandomness,
} from "./impl/intMean/intMeanChromosome";
const logger = new Logger("script.ts", true);

const numGenerations = 100;
const numKeepers = 4;
const numChildren = 4;
const numMutants = 4;
const generationSize = 2 * (numKeepers + numChildren + numMutants);

function main(): void {
    RunGenerations(
        IntMeanChromosomeGenerator,
        IntMeanChromosomeFitnessEvaluator,
        IntMeanChromosomeCrossbreeder,
        IntMeanChromosomeMutator,
        IntMeanSourceOfRandomness,
        logger,
        IntMeanChromosomeGenePrinter,
        numGenerations,
        numKeepers,
        numChildren,
        numMutants,
        generationSize,
        IntMeanChromosomeDuplicateIndicator
    );
}

logger.warn("Main starting...");
main();
logger.warn("Main done!");
