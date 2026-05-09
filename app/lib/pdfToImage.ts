import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.js?url";

if (typeof window !== "undefined") {
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
}

export interface PdfConversionResult {
    imageUrl: string;
    file: File | null;
    error?: string;
}

export async function convertPdfToImage(
    file: File
): Promise<PdfConversionResult> {
    try {
        console.log("PDF conversion started");

        const arrayBuffer = await file.arrayBuffer();

        const pdf = await pdfjsLib.getDocument({
            data: arrayBuffer,
        }).promise;

        const page = await pdf.getPage(1);

        const viewport = page.getViewport({
            scale: 2,
        });

        const canvas = document.createElement("canvas");

        const context = canvas.getContext("2d");

        if (!context) {
            throw new Error("Canvas context unavailable");
        }

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
            canvasContext: context,
            viewport,
        }).promise;

        return new Promise((resolve) => {
            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        resolve({
                            imageUrl: "",
                            file: null,
                            error: "Failed to create image blob",
                        });

                        return;
                    }

                    const imageFile = new File(
                        [blob],
                        file.name.replace(/\\.pdf$/i, ".png"),
                        {
                            type: "image/png",
                        }
                    );

                    console.log("PDF converted successfully");

                    resolve({
                        imageUrl: URL.createObjectURL(blob),
                        file: imageFile,
                    });
                },
                "image/png",
                1
            );
        });
    } catch (err) {
        console.error("PDF ERROR:", err);

        return {
            imageUrl: "",
            file: null,
            error: `Failed to convert PDF: ${err}`,
        };
    }
}