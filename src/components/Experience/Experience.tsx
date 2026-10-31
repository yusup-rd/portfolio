import { experiences } from "../../data/constants";
import SectionHeading from "../ui/SectionHeading";
import Timeline from "../ui/Timeline";
const Experience = () => {
    return (
        <section
            id="experience"
            className="page-shell section-space flex flex-col gap-14"
        >
            <SectionHeading
                number="02"
                eyebrow="Experience"
                title="Built through practice."
                description="From development and automation to shipping full-stack products. Each role adds another perspective."
            />
            <Timeline
                label="Career timeline"
                entries={[...experiences].reverse().map((e) => ({
                    id: e.id,
                    title: e.role,
                    organization: e.company,
                    date: e.date,
                    description: e.desc,
                    tags: e.skills,
                }))}
            />
        </section>
    );
};
export default Experience;
