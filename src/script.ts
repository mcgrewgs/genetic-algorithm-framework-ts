import { Logger } from "@nestjs/common";
import b from "benny";

import { b256, FFT, FFT256, FFTDefault } from "./utils/fft";
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

    // b.suite(
    //     "Bit AND methods",
    //     b.add("SingleBitAndMath", () => {
    //         SingleBitAndMath(BIT.OFF, BIT.OFF);
    //         SingleBitAndMath(BIT.OFF, BIT.ON);
    //         SingleBitAndMath(BIT.ON, BIT.OFF);
    //         SingleBitAndMath(BIT.ON, BIT.ON);
    //     }),
    //     b.add("SingleBitAndConditional", () => {
    //         SingleBitAndConditional(BIT.OFF, BIT.OFF);
    //         SingleBitAndConditional(BIT.OFF, BIT.ON);
    //         SingleBitAndConditional(BIT.ON, BIT.OFF);
    //         SingleBitAndConditional(BIT.ON, BIT.ON);
    //     }),
    //     b.cycle(),
    //     b.complete(),
    //     b.save({ file: "SingleBitAnd", version: "1.0.0" }),
    //     b.save({ file: "SingleBitAnd", format: "chart.html" })
    // ).then(
    //     () => {
    //         logger.log("Suite passed!");
    //     },
    //     () => {
    //         logger.error("Suite failed!");
    //     }
    // );

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
