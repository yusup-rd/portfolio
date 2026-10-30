import { skills } from "../../data/constants";

const Skills = () => {
    return (
        <div
            className="relative z-1 flex flex-col items-center justify-center"
            id="skills"
        >
            <div className="relative flex w-full max-w-275 flex-col items-center justify-center gap-10.5 pt-5 max-md:pt-3">
                <div className="flex flex-col items-center gap-3">
                    <div className="text-center text-4xl font-semibold text-text-primary max-md:text-3xl">
                        Skills
                    </div>
                    <div className="max-w-150 text-center text-lg text-text-secondary max-md:text-base">
                        In recent years, I&apos;ve dedicated myself to mastering
                        the following skills.
                    </div>
                </div>
                {/* Top Skills (alone in row) */}
                {skills.length > 0 && (
                    <div className="flex w-full justify-center">
                        <div
                            className="flex w-full max-w-125 flex-col gap-5 rounded-2xl border-[0.1px] border-border bg-card px-9 pt-4.5 pb-9.5 max-md:max-w-100 max-md:pt-2.5 max-md:pb-7.5 max-sm:max-w-82.5"
                            data-aos="fade-up"
                            data-aos-delay={`0`}
                            data-aos-once="false"
                        >
                            <h2 className="text-center text-3xl font-semibold text-text-secondary">
                                {skills[0]?.title}
                            </h2>
                            <div className="flex flex-wrap justify-center gap-3">
                                {skills[0]?.skills.map((skill, index) => (
                                    <div
                                        className="flex items-center justify-center gap-2 rounded-xl border border-text-primary/[50.2%] px-4 py-3 text-base font-normal text-text-primary/[50.2%] max-md:px-3 max-md:py-2 max-md:text-sm max-sm:py-1.5"
                                        key={index}
                                    >
                                        <img
                                            className="size-6"
                                            src={skill.image}
                                        />
                                        {skill.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Other skills in wrapped layout */}
                <div className="flex w-full flex-wrap justify-center gap-7.5">
                    {skills.slice(1).map((item, index) => (
                        <div
                            className="flex w-full max-w-125 flex-col gap-5 rounded-2xl border-[0.1px] border-border bg-card px-9 pt-4.5 pb-9.5 max-md:max-w-100 max-md:pt-2.5 max-md:pb-7.5 max-sm:max-w-82.5"
                            key={index + 1}
                            data-aos="fade-up"
                            data-aos-delay={`${(index + 1) * 50}`}
                            data-aos-once="false"
                        >
                            <h2 className="text-center text-3xl font-semibold text-text-secondary">
                                {item.title}
                            </h2>
                            <div className="flex flex-wrap justify-center gap-3">
                                {item.skills.map((skill, index) => (
                                    <div
                                        className="flex items-center justify-center gap-2 rounded-xl border border-text-primary/[50.2%] px-4 py-3 text-base font-normal text-text-primary/[50.2%] max-md:px-3 max-md:py-2 max-md:text-sm max-sm:py-1.5"
                                        key={index}
                                    >
                                        <img
                                            className="size-6"
                                            src={skill.image}
                                        />
                                        {skill.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Skills;
