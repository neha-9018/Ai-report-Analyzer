import { type FormEvent, useState } from "react";
import Navbar from "~/Components/Navbar";
import FileUploader from "~/Components/FileUploader";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { convertPdfToImage } from "~/lib/pdfToImage";
import { generateUUID } from "~/Utils";
import { prepareInstructions } from "../../constant";

const Upload = (): React.JSX.Element => {
    const { isLoading, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();

    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelect = (selectedFile: File | null) => {
        setFile(selectedFile);
    };

    const handleAnalyze = async ({
                                     companyName,
                                     jobTitle,
                                     jobDescription,
                                     file,
                                 }: {
        companyName: string;
        jobDescription: string;
        jobTitle: string;
        file: File;
    }) => {
        try {
            setIsProcessing(true);

            if (isLoading || !fs || !ai || !kv) {
                setStatusText("Puter not ready...");
                return;
            }

            // 1️⃣ Upload PDF
            setStatusText("Uploading PDF...");
            const uploadedFile = await fs.upload([file]);
            if (!uploadedFile) {
                setStatusText("Error uploading PDF");
                return;
            }

            // 2️⃣ Convert PDF → Image
            setStatusText("Converting PDF to image...");
            const imageResult = await convertPdfToImage(file);
            if (!imageResult.file) {
                setStatusText("PDF conversion failed");
                return;
            }

            // 3️⃣ Upload Image
            setStatusText("Uploading image...");
            const uploadedImage = await fs.upload([imageResult.file]);
            if (!uploadedImage) {
                setStatusText("Image upload failed");
                return;
            }

            // 4️⃣ Prepare Data (✅ use .path ONLY)
            setStatusText("Saving data...");
            const uuid = generateUUID();

            const data: any = {
                id: uuid,
                resumePath: uploadedFile.path,   // ✅ correct
                imagePath: uploadedImage.path,   // ✅ correct
                companyName,
                jobTitle,
                jobDescription,
                feedback: "",
            };

            await kv.set(`resume:${uuid}`, JSON.stringify(data));

            // 5️⃣ AI ANALYSIS
            setStatusText("Analyzing resume...");

            const response = await ai.chat([
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: prepareInstructions({ jobTitle, jobDescription }),
                        },
                        {
                            type: "file",
                            puter_path: uploadedImage.path,
                        },
                    ],
                },
            ]);

            if (!response?.message?.content) {
                throw new Error("Invalid AI response format");
            }

            let feedbackText = "";
            const content = response.message.content;

            if (typeof content === "string") {
                feedbackText = content;
            } else if (Array.isArray(content)) {
                feedbackText = content.map((c: any) => c?.text || "").join("");
            }

            // 6️⃣ ✅ CLEAN + PARSE JSON (FINAL FIX)
            try {
                const cleaned = feedbackText
                    .replace(/```json/g, "")
                    .replace(/```/g, "")
                    .trim();

                const start = cleaned.indexOf("{");
                const end = cleaned.lastIndexOf("}");

                const jsonString = cleaned.substring(start, end + 1);

                data.feedback = JSON.parse(jsonString);
            } catch (err) {
                console.warn("JSON parse failed:", err);
                data.feedback = feedbackText;
            }

            // 7️⃣ Save final data
            await kv.set(`resume:${uuid}`, JSON.stringify(data));

            setStatusText("Analysis complete!");
            console.log("FINAL DATA:", data);

            // 8️⃣ Redirect
            navigate(`/resume/${uuid}`);

        } catch (err) {
            console.error(err);
            setStatusText("Something went wrong");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const companyName = formData.get("company_name") as string;
        const jobTitle = formData.get("job_title") as string;
        const jobDescription = formData.get("job_description") as string;

        if (!file) {
            alert("Please upload resume");
            return;
        }

        handleAnalyze({
            companyName,
            jobTitle,
            jobDescription,
            file,
        });
    };

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen px-6 md:px-20">
            <Navbar />

            <section className="max-w-5xl mx-auto py-16">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold">
                        Smart feedback for your dream job
                    </h1>

                    {isProcessing ? (
                        <>
                            <h2 className="mt-4 text-blue-600">{statusText}</h2>
                            <img
                                src="/images/resume-scan.gif"
                                className="w-72 mx-auto mt-6"
                                alt="processing"
                            />
                        </>
                    ) : (
                        <p className="mt-4 text-gray-600">
                            Upload resume for ATS analysis
                        </p>
                    )}
                </div>

                {!isProcessing && (
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white shadow-xl rounded-2xl p-8 space-y-6"
                    >
                        <input
                            type="text"
                            name="company_name"
                            placeholder="Company"
                            className="w-full border p-2 rounded"
                            required
                        />

                        <input
                            type="text"
                            name="job_title"
                            placeholder="Job Title"
                            className="w-full border p-2 rounded"
                            required
                        />

                        <textarea
                            name="job_description"
                            placeholder="Job Description"
                            className="w-full border p-2 rounded"
                            required
                        />

                        <FileUploader onFileSelect={handleFileSelect} />

                        <button className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700">
                            Analyze 🚀
                        </button>
                    </form>
                )}
            </section>
        </main>
    );
};

export default Upload;