declare module "pdfjs-dist/legacy/build/pdf.worker.mjs" {
    // PDF.js consumes its worker entry internally; upstream provides no public types.
    export const WorkerMessageHandler: unknown;
}
