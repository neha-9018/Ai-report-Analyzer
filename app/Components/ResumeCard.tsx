import type { JSX } from "react";
import { Link } from "react-router";
import ScoreCircle from "~/Components/ScoreCircle";

type ResumeCardProps = {
    resume: Resume;
};

const ResumeCard = ({ resume }: ResumeCardProps): JSX.Element => {
    return (
        <Link
            to={`/resume/${resume.id}`}
            className="resume-card animate-in fade-in duration-1000"
        >
            <div className="flex flex-col gap-2">
                <h2 className="!text-black font-bold break-words">
                    {resume.companyName}
                </h2>
                <h3 className="text-lg break-words text-gray-500">
                    {resume.jobTitle}
                </h3>
            </div>

            <div className="flex-shrink-0" >

            </div>
        </Link>
    );
};

export default ResumeCard;