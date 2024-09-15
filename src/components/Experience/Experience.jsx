import React from "react";
import styled, { useTheme }  from "styled-components";
import { Timeline } from "@mui/lab";
import { TimelineItem } from "@mui/lab";
import { TimelineSeparator } from "@mui/lab";
import { TimelineConnector } from "@mui/lab";
import { TimelineContent } from "@mui/lab";
import { TimelineDot } from "@mui/lab";
import { experiences } from "../../data/constants";
import ExperienceCard from "../Cards/ExperienceCard";

const Section = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    z-index: 1;
    padding: 40px 0 80px 0;
`;
const Wrapper = styled.div`
    max-width: 1100px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    gap: 12px;
`;
const Title = styled.div`
    font-size: 42px;
    font-weight: 600;
    text-align: center;
    margin-top: 20px;
    color: ${({ theme }) => theme.text_primary};
    @media (max-width: 768px) {
        margin-top: 12px;
        font-size: 32px;
    }
`;
const Desc = styled.div`
    font-size: 18px;
    max-width: 600px;
    text-align: center;
    color: ${({ theme }) => theme.text_secondary};
    @media (max-width: 768px) {
        font-size: 16px;
        padding: 0 15px;
    }
`;
const TimelineSection = styled.div`
    width: 100%;
    max-width: 1000px;
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
`;

const Experience = () => {
    return (
        <Section id="experience">
            <Wrapper>
                <Title>Experience</Title>
                <Desc>This is a journey of my continuous growth and development in the tech industry. Each step has been a valuable opportunity to refine my skills and expand my knowledge.</Desc>
                <TimelineSection>
                    <Timeline>
                        {experiences.map((experience, index) => (
                            <TimelineItem key={index}>
                                <TimelineSeparator>
                                    <TimelineDot
                                        variant="outlined"
                                        color="secondary"
                                    />
                                    {index !== experiences.length - 1 && (
                                        <TimelineConnector style={{background: "#854CE6"}} />
                                    )}
                                </TimelineSeparator>
                                <TimelineContent sx={{py: "12px", px: 2 }}>
                                    <ExperienceCard experience={experience} />
                                </TimelineContent>
                            </TimelineItem>
                        ))}
                    </Timeline>
                </TimelineSection>
            </Wrapper>
        </Section>
    );
};

export default Experience;
