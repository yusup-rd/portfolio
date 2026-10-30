import {
    Timeline,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineItem,
    TimelineSeparator,
} from "@mui/lab";
import { education } from "../../data/constants";
import EducationCard from "../Cards/EducationCard";

const Education = () => {
    return (
        <div
            className="relative z-1 flex flex-col items-center justify-center pt-10 pb-20"
            id="education"
        >
            <div className="relative flex w-full max-w-275 flex-col items-center justify-center gap-3 pt-5 max-md:pt-3">
                <div className="text-center text-4xl font-semibold text-text-primary max-md:text-3xl">
                    Education
                </div>
                <div className="max-w-150 text-center text-lg text-text-secondary max-md:px-3.75 max-md:text-base">
                    My educational experience has been a voyage of
                    self-exploration and personal development. Here are the
                    specifics of my educational background.
                </div>
                <div className="flex w-full max-w-250 flex-col items-center justify-center gap-3 pt-2.5">
                    <Timeline>
                        {education.map((educationItem, index) => (
                            <TimelineItem key={index}>
                                <TimelineContent sx={{ py: "12px", px: 2 }}>
                                    <EducationCard education={educationItem} />
                                </TimelineContent>
                                <TimelineSeparator>
                                    <TimelineDot
                                        variant="outlined"
                                        color="secondary"
                                    />
                                    {index !== education.length - 1 && (
                                        <TimelineConnector className="bg-[#854CE6]!" />
                                    )}
                                </TimelineSeparator>
                            </TimelineItem>
                        ))}
                    </Timeline>
                </div>
            </div>
        </div>
    );
};

export default Education;
