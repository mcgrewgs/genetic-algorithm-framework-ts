import { Logger } from "@nestjs/common";
import b from "benny";

import { b256, b256bi, FFT, FFT256, FFT256BI, FFTDefault } from "./utils/fft";
const logger = new Logger("script.ts", true);

const numGenerations = 100;
const numKeepers = 4;
const numChildren = 4;
const numMutants = 4;
const generationSize = 2 * (numKeepers + numChildren + numMutants);

function main(): void {
    // RunGenerations(
    //     IntMeanChromosomeGenerator,
    //     IntMeanChromosomeFitnessEvaluator,
    //     IntMeanChromosomeCrossbreeder,
    //     IntMeanChromosomeMutator,
    //     IntMeanSourceOfRandomness,
    //     logger,
    //     IntMeanChromosomeGenePrinter,
    //     numGenerations,
    //     numKeepers,
    //     numChildren,
    //     numMutants,
    //     generationSize,
    //     IntMeanChromosomeDuplicateIndicator
    // );
    // const x = b256;
    // logger.log(JSON.stringify(x));
    // logger.log(JSON.stringify(FFT(x)));
    // logger.log(NL(x));

    b.suite(
        "FFTs",
        b.add("FFT", () => {
            FFT(b256);
        }),
        b.add("FFTDefault", () => {
            FFTDefault(b256);
        }),
        b.add("FFT256", () => {
            FFT256(b256);
        }),
        b.add("FFT256BI", () => {
            FFT256BI(b256bi);
        }),
        b.cycle(),
        b.complete(),
        b.save({ file: "FFTs", version: "1.0.0" }),
        b.save({ file: "FFTs", format: "chart.html" })
    ).then(
        () => {
            logger.log("Suite passed!");
        },
        () => {
            logger.error("Suite failed!");
        }
    );
}

logger.warn("Main starting...");
main();
logger.warn("Main done!");
