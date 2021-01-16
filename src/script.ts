import { Logger } from "@nestjs/common";
import { RunGenerations } from "./engine/generations";


import {
    PokemonSpeciesChromosomeGenerator,
    PokemonSpeciesChromosomeFitnessEvaluator,
    PokemonSpeciesChromosomeCrossbreeder,
    PokemonSpeciesChromosomeMutator,
    PokemonSpeciesSourceOfRandomness,
    PokemonSpeciesChromosomeGenePrinter,
    PokemonSpeciesChromosomeDuplicateIndicator,
} from "./impl/pokemon/pokemonSpeciesChromosome";

const logger = new Logger("script.ts", true);

const numGenerations = 100;
const numKeepers = 4;
const numChildren = 4;
const numMutants = 4;
const generationSize = 2 * (numKeepers + numChildren + numMutants);

function main(): void {
    RunGenerations(
        PokemonSpeciesChromosomeGenerator,
        PokemonSpeciesChromosomeFitnessEvaluator,
        PokemonSpeciesChromosomeCrossbreeder,
        PokemonSpeciesChromosomeMutator,
        PokemonSpeciesSourceOfRandomness,
        logger,
        PokemonSpeciesChromosomeGenePrinter,
        numGenerations,
        numKeepers,
        numChildren,
        numMutants,
        generationSize,
        PokemonSpeciesChromosomeDuplicateIndicator
    );
}

logger.warn("Main starting...");
main();
logger.warn("Main done!");
