import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { usePuterStore } from "~/lib/puter";
import ScoreCircle from "~/Components/ScoreCircle";

export default function ResumePage() {
    const { id } = useParams();
    const { kv, fs } = usePuterStore();

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [imageUrl, setImageUrl] = useState("");
    const [resumeUrl, setResumeUrl] = useState("");

    // ✅ Fetch stored data
    useEffect(() => {
        const fetchData = async () => {
            if (!kv || !id) return;

            try {
                const stored = await kv.get(`resume:${id}`);
                if (stored) {
                    setData(JSON.parse(stored));
                }
            } catch (err) {
                console.error("KV error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [kv, id]);

    // ✅ Load files safely
    useEffect(() => {
        const loadFiles = async () => {
            if (!fs || !data) return;

            try {
                const img = await fs.read(data.imagePath);
                if (img) {
                    const blob = new Blob([img as BlobPart]);
                    setImageUrl(URL.createObjectURL(blob));
                }

                const pdf = await fs.read(data.resumePath);
                if (pdf) {
                    const blob = new Blob([pdf as BlobPart], {
                        type: "application/pdf",
                    });
                    setResumeUrl(URL.createObjectURL(blob));
                }
            } catch (err) {
                console.error("File error:", err);
            }
        };

        loadFiles();

        return () => {
            if (imageUrl) URL.revokeObjectURL(imageUrl);
            if (resumeUrl) URL.revokeObjectURL(resumeUrl);
        };
    }, [fs, data]);

    if (loading) return <div className="p-10">Loading...</div>;
    if (!data) return <div className="p-10">No data found</div>;

    // ✅ 🔥 CLEAN + PARSE FEEDBACK (handles old + new data)
    let feedback: any = data.feedback;

    if (typeof feedback === "string") {
        try {
            const cleaned = feedback
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();

            const start = cleaned.indexOf("{");
            const end = cleaned.lastIndexOf("}");

            const jsonString = cleaned.substring(start, end + 1);

            feedback = JSON.parse(jsonString);
        } catch (err) {
            console.warn("Still not JSON:", err);
        }
    }

    // ✅ Render tips
    const renderTips = (tips: any[]) => {
        return tips.map((tip, i) => (
            <div
                key={i}
                className={`p-3 rounded mb-2 ${
                    tip.type === "improve"
                        ? "bg-red-50 border-l-4 border-red-400"
                        : "bg-green-50 border-l-4 border-green-400"
                }`}
            >
                <p className="font-medium">
                    {tip.type === "improve" ? "⚠️ Improve" : "✅ Good"}
                </p>
                <p className="text-sm">{tip.tip}</p>
                {tip.explanation && (
                    <p className="text-xs text-gray-500 mt-1">
                        {tip.explanation}
                    </p>
                )}
            </div>
        ));
    };

    return (
        <div className="p-10 space-y-8">

            <h1 className="text-3xl font-bold">Resume Analysis</h1>

            {/* ✅ Basic Info */}
            <div className="bg-white p-6 rounded-xl shadow">
                <p><strong>Company:</strong> {data.companyName}</p>
                <p><strong>Job Title:</strong> {data.jobTitle}</p>

                {resumeUrl && (
                    <a
                        href={resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                    >
                        View Resume
                    </a>
                )}
            </div>

            {/* ✅ Preview */}
            <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="font-semibold mb-3">Resume Preview</h3>

                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt="Resume preview"
                        className="w-80 border"
                    />
                ) : (
                    <p>Loading preview...</p>
                )}
            </div>

            {/* ✅ AI Dashboard */}
            {feedback && typeof feedback !== "string" && (
                <div className="space-y-6">

                    {/* Score */}
                    <div className="bg-white p-6 rounded-xl shadow flex items-center gap-6">
                        <ScoreCircle score={feedback.overallScore} />
                        <div>
                            <h2 className="text-xl font-bold">Overall Score</h2>
                            <p className="text-gray-500">
                                Based on ATS, content, skills & tone
                            </p>
                        </div>
                    </div>

                    {/* Sections */}
                    <div className="grid md:grid-cols-2 gap-6">

                        <div className="bg-white p-6 rounded-xl shadow">
                            <h2 className="text-lg font-bold">
                                ATS ({feedback.ATS.score})
                            </h2>
                            {renderTips(feedback.ATS.tips)}
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow">
                            <h2 className="text-lg font-bold">
                                Tone ({feedback.toneAndStyle.score})
                            </h2>
                            {renderTips(feedback.toneAndStyle.tips)}
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow">
                            <h2 className="text-lg font-bold">
                                Content ({feedback.content.score})
                            </h2>
                            {renderTips(feedback.content.tips)}
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow">
                            <h2 className="text-lg font-bold">
                                Structure ({feedback.structure.score})
                            </h2>
                            {renderTips(feedback.structure.tips)}
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow md:col-span-2">
                            <h2 className="text-lg font-bold">
                                Skills ({feedback.skills.score})
                            </h2>
                            {renderTips(feedback.skills.tips)}
                        </div>

                    </div>
                </div>
            )}

            {/* ✅ Fallback (if still string) */}
            {typeof feedback === "string" && (
                <div className="bg-gray-100 p-4 rounded">
                    {feedback}
                </div>
            )}
        </div>
    );
}