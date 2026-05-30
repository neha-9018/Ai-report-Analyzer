import React from "react";
import { useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

export const meta = () => [
    { title: "Resumind | Authentication" },
    {
        name: "description",
        content: "Login to continue your career journey",
    },
];

export default function Auth() {
    const { auth, isLoading } = usePuterStore();
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            await auth.signIn();
            navigate("/");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 flex items-center justify-center p-6">
            <div className="w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-2xl">
                <div className="grid md:grid-cols-2 min-h-[650px]">

                    <div className="hidden md:flex flex-col justify-center p-12 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
                        <h1 className="text-5xl font-bold mb-6">
                            AI Resume Analyzer
                        </h1>

                        <p className="text-lg text-indigo-100 mb-8">
                            Improve your resume with AI-powered insights and ATS analysis.
                        </p>

                        <div className="space-y-4">
                            <div>✅ ATS Score Analysis</div>
                            <div>✅ Resume Feedback</div>
                            <div>✅ Skill Gap Detection</div>
                            <div>✅ Career Recommendations</div>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center p-8 md:p-12">
                        <div className="max-w-md mx-auto w-full">
                            <h2 className="text-4xl font-bold text-gray-900 mb-3">
                                Welcome Back 👋
                            </h2>

                            <p className="text-gray-500 mb-8">
                                Sign in to continue your job journey.
                            </p>

                            <button
                                onClick={handleLogin}
                                disabled={isLoading}
                                className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all duration-300"
                            >
                                {isLoading ? "Signing In..." : "Continue with Google"}
                            </button>

                            <p className="text-center text-sm text-gray-500 mt-6">
                                Secure authentication powered by Google
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}