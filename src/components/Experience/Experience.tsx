import {
    Timeline,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineItem,
    TimelineSeparator,
} from "@mui/lab";
import { experiences } from "../../data/constants";
import ExperienceCard from "../Cards/ExperienceCard";

const Experience = () => {
    return (
        <div
            className="relative z-1 flex flex-col items-center justify-center pt-10 pb-20"
            id="experience"
        >
            <div className="relative flex w-full max-w-275 flex-col items-center justify-center gap-3 pt-5 max-md:pt-3">
                <div className="text-center text-4xl font-semibold text-text-primary max-md:text-3xl">
                    Experience
                </div>
                <div className="max-w-150 text-center text-lg text-text-secondary max-md:px-3.75 max-md:text-base">
                    This is a journey of my continuous growth and development in
                    the tech industry. Each step has been a valuable opportunity
                    to refine my skills and expand my knowledge.
                </div>
                <div className="flex w-full max-w-250 flex-col items-center justify-center gap-3 pt-2.5">
                    <Timeline>
                        {[...experiences].reverse().map((experience, index) => (
                            <TimelineItem key={index}>
                                <TimelineSeparator>
                                    <TimelineDot
                                        variant="outlined"
                                        color="secondary"
                                    />
                                    {index !== experiences.length - 1 && (
                                        <TimelineConnector className="bg-[#854CE6]!" />
                                    )}
                                </TimelineSeparator>
                                <TimelineContent sx={{ py: "12px", px: 2 }}>
                                    <ExperienceCard experience={experience} />
                                </TimelineContent>
                            </TimelineItem>
                        ))}
                    </Timeline>
                </div>
            </div>
        </div>
    );
};

export default Experience;
