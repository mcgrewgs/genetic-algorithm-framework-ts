import {
    Chromosome,
    ChromosomeCrossbreeder,
    ChromosomeDuplicateIndicator,
    ChromosomeFitnessEvaluator,
    ChromosomeGenePrinter,
    ChromosomeGenerator,
    ChromosomeMutator,
    DefaultSourceOfRandomness,
    SourceOfRandomness,
} from "../../model/chromosome";
import deepEqual from "deep-equal";

export const HpMax = 256;
export const DefMax = 256;
export const SpDefMax = 256;
export const AtkMax = 176;
export const SpAtkMax = 176;
export const SpdMax = 201;
export const StatTotalMax = 600;

export interface PokemonSpeciesChromosomeGeneType {
    hp: number;
    atk: number;
    def: number;
    spAtk: number;
    spDef: number;
    spd: number;
}

export function statTotal(p: PokemonSpeciesChromosomeGeneType): number {
    return p.hp + p.atk + p.def + p.spAtk + p.spDef + p.spd;
}

export function sweepPotential(p: PokemonSpeciesChromosomeGeneType): number {
    return p.spd * Math.max(p.atk, p.spAtk);
}

export function wallPotential(p: PokemonSpeciesChromosomeGeneType): number {
    return p.hp * Math.min(p.def, p.spDef);
}

export function EnforceStatTotalMax(
    p: PokemonSpeciesChromosomeGeneType
): PokemonSpeciesChromosomeGeneType {
    while (statTotal(p) > StatTotalMax) {
        if (p.hp > 1) {
            p.hp--;
        }
        if (p.atk > 1) {
            p.atk--;
        }
        if (p.def > 1) {
            p.def--;
        }
        if (p.spAtk > 1) {
            p.spAtk--;
        }
        if (p.spDef > 1) {
            p.spDef--;
        }
        if (p.spd > 1) {
            p.spd--;
        }
    }
    return p;
}

export const PokemonSpeciesSourceOfRandomness = DefaultSourceOfRandomness;

export const PokemonSpeciesChromosomeDuplicateIndicator: ChromosomeDuplicateIndicator<PokemonSpeciesChromosomeGeneType> = function (
    c1: Chromosome<PokemonSpeciesChromosomeGeneType>,
    c2: Chromosome<PokemonSpeciesChromosomeGeneType>
): boolean {
    return deepEqual(c1.genes, c2.genes);
};

export const PokemonSpeciesChromosomeCrossbreeder: ChromosomeCrossbreeder<PokemonSpeciesChromosomeGeneType> = function (
    c1: Chromosome<PokemonSpeciesChromosomeGeneType>,
    c2: Chromosome<PokemonSpeciesChromosomeGeneType>,
    r: SourceOfRandomness
): Chromosome<PokemonSpeciesChromosomeGeneType> {
    return {
        genes: EnforceStatTotalMax({
            hp: r.randWeightedAvg(c1.genes.hp, c2.genes.hp),
            atk: r.randWeightedAvg(c1.genes.atk, c2.genes.atk),
            def: r.randWeightedAvg(c1.genes.def, c2.genes.def),
            spAtk: r.randWeightedAvg(c1.genes.spAtk, c2.genes.spAtk),
            spDef: r.randWeightedAvg(c1.genes.spDef, c2.genes.spDef),
            spd: r.randWeightedAvg(c1.genes.spd, c2.genes.spd),
        }),
    };
};

export const PokemonSpeciesChromosomeGenePrinter: ChromosomeGenePrinter<PokemonSpeciesChromosomeGeneType> = function (
    c: Chromosome<PokemonSpeciesChromosomeGeneType>
): string {
    return JSON.stringify(c.genes);
};

export const PokemonSpeciesChromosomeGenerator: ChromosomeGenerator<PokemonSpeciesChromosomeGeneType> = function (
    r: SourceOfRandomness
): Chromosome<PokemonSpeciesChromosomeGeneType> {
    return {
        genes: EnforceStatTotalMax({
            hp: r.randInt(HpMax),
            atk: r.randInt(AtkMax),
            def: r.randInt(DefMax),
            spAtk: r.randInt(SpAtkMax),
            spDef: r.randInt(SpDefMax),
            spd: r.randInt(SpdMax),
        }),
    };
};

export const PokemonSpeciesChromosomeMutator: ChromosomeMutator<PokemonSpeciesChromosomeGeneType> = function (
    c: Chromosome<PokemonSpeciesChromosomeGeneType>,
    r: SourceOfRandomness
): Chromosome<PokemonSpeciesChromosomeGeneType> {
    return PokemonSpeciesChromosomeCrossbreeder(
        c,
        PokemonSpeciesChromosomeGenerator(r),
        r
    );
};

export const PokemonSpeciesChromosomeFitnessEvaluator: ChromosomeFitnessEvaluator<PokemonSpeciesChromosomeGeneType> = function (
    c: Chromosome<PokemonSpeciesChromosomeGeneType>
): number {
    return -Math.min(sweepPotential(c.genes), wallPotential(c.genes));
};
