import { skills } from "../../data/constants";
import SectionHeading from "../ui/SectionHeading";
import SkillBadge from "../ui/SkillBadge";
const Skills = () => {
    return (
        <section
            id="skills"
            className="page-shell section-space flex flex-col gap-12"
        >
            <SectionHeading
                number="03"
                eyebrow="Expertise"
                title="The tools behind the work."
                description="A practical toolkit for turning a good idea into something people can use."
            />
            <div className="grid gap-4 md:grid-cols-2">
                {skills.slice(1).map((group, index) => (
                    <article
                        key={group.title}
                        className="surface flex flex-col gap-6 p-6 sm:p-8"
                        data-reveal
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold tracking-tight">
                                {group.title}
                            </h3>
                            <span className="font-mono text-xs text-primary">
                                0{index + 1}
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {group.skills.map((skill) => (
                                <SkillBadge key={skill.name} {...skill} />
                            ))}
                        </div>
                    </article>
                ))}
            </div>
            <div className="flex flex-wrap gap-3 border-t border-border pt-6 text-sm text-text-secondary">
                <span className="font-medium text-text-primary">Languages</span>
                <span>English · Professional</span>
                <span>Russian · Native</span>
            </div>
        </section>
    );
};
export default Skills;
