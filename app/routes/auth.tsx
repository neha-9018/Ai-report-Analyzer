import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

export const meta = () => [
    { title: "Resumind | Authentication" },
    {
        name: "description",
        content: "Login to continue your career journey",
    },
];

const Auth = () => {
    const { isLoading, auth } = usePuterStore();

    const location = useLocation();
    const navigate = useNavigate();

    const params = new URLSearchParams(location.search);
    const next = params.get("next") || "/";

    useEffect(() => {
        if (auth.isAuthenticated) {
            navigate(next);
        }
    }, [auth.isAuthenticated, navigate, next]);

    const handleLogin = async () => {
        try {
            await auth.signIn();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 flex items-center justify-center p-6">
            <div className="w-full max-w-6xl bg-white rounded-3xl overflow-hidden shadow-2xl">
                <div className="grid md:grid-cols-2 min-h-[650px]">

                    {/* Left Side */}
                    <div className="hidden md:flex flex-col justify-center p-12 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
                        <div className="space-y-6">
                            <div className="text-6xl">📄</div>

                            <h1 className="text-5xl font-bold leading-tight">
                                AI Resume Analyzer
                            </h1>

                            <p className="text-lg text-indigo-100">
                                Build stronger resumes, improve ATS scores, and land your dream
                                job with AI-powered insights.
                            </p>

                            <div className="space-y-4 pt-6">
                                <div className="flex items-center gap-3">
                                    <span>✅</span>
                                    <p>ATS Score Analysis</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span>✅</span>
                                    <p>AI Resume Feedback</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span>✅</span>
                                    <p>Skill Gap Detection</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span>✅</span>
                                    <p>Career Recommendations</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="flex flex-col justify-center p-8 md:p-12">
                        <div className="max-w-md mx-auto w-full">
                            <div className="md:hidden text-center mb-8">
                                <div className="text-5xl mb-4">📄</div>
                                <h1 className="text-3xl font-bold">
                                    AI Resume Analyzer
                                </h1>
                            </div>

                            <h2 className="text-4xl font-bold text-gray-900 mb-3">
                                Welcome Back 👋
                            </h2>

                            <p className="text-gray-500 mb-8">
                                Sign in to continue your career journey and unlock AI-powered
                                resume insights.
                            </p>

                            {isLoading ? (
                                <button
                                    disabled
                                    className="w-full py-4 rounded-xl bg-indigo-400 text-white font-semibold animate-pulse"
                                >
                                    Signing you in...
                                </button>
                            ) : (
                                <button
                                    onClick={handleLogin}
                                    className="
                    w-full
                    py-4
                    rounded-xl
                    bg-indigo-600
                    hover:bg-indigo-700
                    text-white
                    font-semibold
                    transition-all
                    duration-300
                    hover:scale-[1.02]
                    shadow-lg
                  "
                                >
                                    Continue with Google
                                </button>
                            )}

                            <div className="mt-6 text-center">
                                <p className="text-sm text-gray-500">
                                    Secure authentication powered by Google
                                </p>
                            </div>

                            <div className="mt-8 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                <p className="text-sm text-indigo-700 text-center">
                                    🚀 Trusted by students and professionals to optimize resumes,
                                    improve ATS scores, and accelerate career growth.
                                </p>
                            </div>

                            <div className="mt-8 text-center text-sm text-gray-400">
                                © 2026 Resumind. All rights reserved.
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
};

export default Auth;