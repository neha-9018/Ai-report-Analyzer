
import type { Route } from "./+types/home";
import Navbar from "~/Components/Navbar";
import {resumes} from "../../constant";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
  return <main className="bg-[url('/images/bg-main.svg')]bg-cover">
    <Navbar />
<section className="main-section">
  <div className="Page-heading">
    <h1> Track your Application and Resume Rating</h1>
    <h2>Review your Submissions and Check AI-powered Feedback</h2>
  </div>
</section>
    {resumes.map((resume) => (
        <div key={resume.id}>
          <h1>{resume.jobTitle}</h1>
        </div>
    ))}

    </main>
}
