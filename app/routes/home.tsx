
import type { Route } from "./+types/home";
import Navbar from "~/Components/Navbar";
import { resumes } from "../../constant";
import ResumeCard from "~/Components/ResumeCard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
  return (
      <main className="bg-[url('/images/bg-main.svg')] bg-cover bg-center min-h-screen px-6 md:px-10">
        <Navbar/>

        <section className="max-w-6xl mx-auto py-16">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-800">
              Track Your Applications & Resume Ratings
            </h1>

            <p className="text-gray-500 mt-4 text-lg">
              Review your submissions and check AI-powered feedback.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {resumes.map((resume) => (
                <ResumeCard key={resume.id} resume={resume}/>
            ))}
          </div>
        </section>
      </main>
  );
}