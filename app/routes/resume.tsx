import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { usePuterStore } from "~/lib/puter";
import ScoreCircle from "~/Components/ScoreCircle";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";

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
    const chartData =
        feedback && typeof feedback !== "string"
            ? [
                { name: "ATS", score: feedback.ATS?.score || 0 },
                { name: "Content", score: feedback.content?.score || 0 },
                { name: "Structure", score: feedback.structure?.score || 0 },
                { name: "Skills", score: feedback.skills?.score || 0 },
                { name: "Tone", score: feedback.toneAndStyle?.score || 0 },
            ]
            : [];

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
        <main className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto p-6 md:p-10">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">
                        Resume Analysis Dashboard
                    </h1>
                    <p className="text-gray-500 mt-2">
                        AI-powered evaluation of your resume
                    </p>
                </div>

                {/* Top Section */}
                <div className="grid lg:grid-cols-3 gap-6 mb-8">

                    {/* Resume Info */}
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <h2 className="font-semibold text-xl mb-4">
                            Resume Details
                        </h2>

                        <div className="space-y-3">
                            <p>
                            <span className="font-semibold">
                                Company:
                            </span>{" "}
                                {data.companyName}
                            </p>

                            <p>
                            <span className="font-semibold">
                                Job Title:
                            </span>{" "}
                                {data.jobTitle}
                            </p>

                            {resumeUrl && (
                                <a
                                    href={resumeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg"
                                >
                                    View Resume
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Overall Score */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center justify-center">
                        <div className="text-center">
                            <ScoreCircle
                                score={feedback?.overallScore || 0}
                            />
                            <h2 className="text-xl font-bold mt-4">
                                Overall Score
                            </h2>
                        </div>
                    </div>

                    {/* Resume Preview */}
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <h2 className="font-semibold text-xl mb-4">
                            Resume Preview
                        </h2>

                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt="Resume Preview"
                                className="rounded-xl border w-full"
                            />
                        ) : (
                            <p>Loading Preview...</p>
                        )}
                    </div>
                </div>

                {feedback && typeof feedback !== "string" && (
                    <>
                        {/* KPI Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">

                            <div className="bg-blue-50 rounded-2xl p-5">
                                <p className="text-gray-500">ATS</p>
                                <h3 className="text-3xl font-bold">
                                    {feedback.ATS?.score}
                                </h3>
                            </div>

                            <div className="bg-purple-50 rounded-2xl p-5">
                                <p className="text-gray-500">Content</p>
                                <h3 className="text-3xl font-bold">
                                    {feedback.content?.score}
                                </h3>
                            </div>

                            <div className="bg-green-50 rounded-2xl p-5">
                                <p className="text-gray-500">Structure</p>
                                <h3 className="text-3xl font-bold">
                                    {feedback.structure?.score}
                                </h3>
                            </div>

                            <div className="bg-orange-50 rounded-2xl p-5">
                                <p className="text-gray-500">Skills</p>
                                <h3 className="text-3xl font-bold">
                                    {feedback.skills?.score}
                                </h3>
                            </div>

                            <div className="bg-pink-50 rounded-2xl p-5">
                                <p className="text-gray-500">Tone</p>
                                <h3 className="text-3xl font-bold">
                                    {feedback.toneAndStyle?.score}
                                </h3>
                            </div>

                        </div>

                        {/* Analytics Chart */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
                            <h2 className="text-2xl font-bold mb-6">
                                Performance Analytics
                            </h2>

                            <div className="h-96">
                                <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                >
                                    <BarChart data={chartData}>
                                        <XAxis dataKey="name" />
                                        <YAxis domain={[0, 100]} />
                                        <Tooltip />
                                        <Bar dataKey="score" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Feedback Cards */}
                        <div className="grid md:grid-cols-2 gap-6">

                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <h2 className="text-xl font-bold mb-4">
                                    ATS ({feedback.ATS.score})
                                </h2>
                                {renderTips(feedback.ATS.tips)}
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <h2 className="text-xl font-bold mb-4">
                                    Tone ({feedback.toneAndStyle.score})
                                </h2>
                                {renderTips(
                                    feedback.toneAndStyle.tips
                                )}
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <h2 className="text-xl font-bold mb-4">
                                    Content ({feedback.content.score})
                                </h2>
                                {renderTips(feedback.content.tips)}
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <h2 className="text-xl font-bold mb-4">
                                    Structure ({feedback.structure.score})
                                </h2>
                                {renderTips(
                                    feedback.structure.tips
                                )}
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm p-6 md:col-span-2">
                                <h2 className="text-xl font-bold mb-4">
                                    Skills ({feedback.skills.score})
                                </h2>
                                {renderTips(feedback.skills.tips)}
                            </div>

                        </div>
                    </>
                )}

                {typeof feedback === "string" && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        {feedback}
                    </div>
                )}
            </div>
        </main>
    )};