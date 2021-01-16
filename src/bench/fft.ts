import b from "benny";
import { Summary } from "benny/lib/internal/common-types";
import { FFT, b256, FFTDefault, FFT256, FFT256BI, b256bi } from "../utils/fft";

export function RunFFTComparison(): Promise<Summary> {
    return b.suite(
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
    );
}
