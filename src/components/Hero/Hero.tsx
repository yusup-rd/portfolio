import {
    FiArrowDown,
    FiArrowUpRight,
    FiCheckCircle,
    FiCode,
    FiGithub,
    FiLinkedin,
    FiPenTool,
    FiSmartphone,
} from "react-icons/fi";
import { Bio, skills } from "../../data/constants";
import DocumentLink from "../ui/DocumentLink";
import HeroParticles from "../ui/HeroParticles";
import SkillBadge from "../ui/SkillBadge";
const Hero = () => {
    return (
        <section id="about" className="relative isolate">
            <HeroParticles />
            <div className="page-shell grid gap-14 pt-14 pb-16 md:pt-24 md:pb-24 lg:grid-cols-[1.3fr_0.7fr] lg:items-center lg:gap-20">
                <div className="flex flex-col items-start gap-6" data-reveal>
                    <p className="eyebrow flex items-center gap-3">
                        <span className="size-2 rounded-full bg-primary" />{" "}
                        Software developer · Design-minded
                    </p>
                    <h1 className="text-5xl leading-none font-semibold tracking-tighter sm:text-6xl lg:text-6xl xl:text-7xl">
                        Thoughtful interfaces.
                        <br />
                        <span className="text-text-secondary">
                            Solid engineering.
                        </span>
                    </h1>
                    <p className="max-w-135 text-lg leading-relaxed text-text-secondary">
                        I’m{" "}
                        <strong className="font-medium text-text-primary">
                            Yusup Rejebov
                        </strong>
                        , a software engineer building dependable web products
                        and iOS and Android applications. I work across the
                        interface, API, and data layer to turn product ideas
                        into reliable software.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <a href="#projects" className="button button-primary">
                            Explore my work <FiArrowDown aria-hidden="true" />
                        </a>
                        <DocumentLink
                            src={Bio.resume}
                            title="Yusup Rejebov — résumé"
                            className="button button-secondary"
                        >
                            View résumé <FiArrowUpRight aria-hidden="true" />
                        </DocumentLink>
                    </div>
                    <div className="flex flex-col gap-4 border-t border-border pt-5">
                        <p className="eyebrow text-primary">
                            Core toolkit · Web & mobile
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {skills[0]?.skills.map((skill) => (
                                <SkillBadge key={skill.name} {...skill} />
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-x-8 gap-y-3 border-t border-border pt-6 text-xs text-text-secondary">
                        <span className="flex items-center gap-2">
                            <FiCode aria-hidden="true" />
                            FULL-STACK
                        </span>
                        <span className="flex items-center gap-2">
                            <FiSmartphone aria-hidden="true" />
                            MOBILE APPS
                        </span>
                        <span className="flex items-center gap-2">
                            <FiPenTool aria-hidden="true" />
                            INTERFACE DESIGN
                        </span>
                        <span className="flex items-center gap-2">
                            <FiCheckCircle aria-hidden="true" />
                            QUALITY & AUTOMATION
                        </span>
                    </div>
                </div>
                <div className="portrait-composition" data-reveal>
                    <div className="portrait-topline">
                        <span>THE PERSON BEHIND THE PIXELS</span>
                        <span>01 — YR</span>
                    </div>
                    <div className="portrait-frame">
                        <img
                            src={Bio.image}
                            alt="Yusup Rejebov"
                            className="size-full object-cover"
                            fetchPriority="high"
                        />
                        <span className="portrait-caption">
                            Curious by nature.
                            <br />
                            Precise by practice.
                        </span>
                    </div>
                    <div className="flex items-center justify-between gap-4 pt-5">
                        <div className="flex gap-2">
                            <a
                                className="icon-button"
                                href={Bio.github}
                                aria-label="GitHub profile"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <FiGithub />
                            </a>
                            <a
                                className="icon-button"
                                href={Bio.linkedin}
                                aria-label="LinkedIn profile"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <FiLinkedin />
                            </a>
                        </div>
                        <span className="text-sm font-medium">
                            Design meets development.
                        </span>
                        <span
                            className="text-xl text-primary"
                            aria-hidden="true"
                        >
                            ↗
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
};
export default Hero;
