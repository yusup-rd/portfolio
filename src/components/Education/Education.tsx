import { FiAward, FiBookOpen } from "react-icons/fi";
import { education } from "../../data/constants";
import DocumentLink from "../ui/DocumentLink";
import SectionHeading from "../ui/SectionHeading";
import Timeline from "../ui/Timeline";
const Education = () => {
    return (
        <section
            id="education"
            className="page-shell section-space flex flex-col gap-14"
        >
            <SectionHeading
                number="04"
                eyebrow="Education"
                title="A foundation for what’s next."
                description="Formal study, independent learning, and a continuing curiosity about how things work."
            />
            <Timeline
                label="Education timeline"
                entries={[...education]
                    .filter((e) => e.school.includes("Tenaga"))
                    .sort(
                        (a, b) =>
                            Number(b.date.match(/20\d{2}/g)?.at(-1) ?? 0) -
                            Number(a.date.match(/20\d{2}/g)?.at(-1) ?? 0),
                    )
                    .map((e) => ({
                        id: e.id,
                        title: e.degree,
                        organization: e.school,
                        date: e.date,
                        description: e.desc,
                        tags: [e.grade],
                        ...(e.documents ? { documents: e.documents } : {}),
                    }))}
            />
            <div className="flex flex-col gap-5">
                <h3 className="flex items-center gap-2 text-xl font-semibold">
                    <FiBookOpen aria-hidden="true" />
                    Courses & continuing education
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                    {education
                        .filter((e) => !e.school.includes("Tenaga"))
                        .map((e) => (
                            <article
                                key={e.id}
                                className="surface flex flex-col gap-3 p-6"
                            >
                                <p className="eyebrow text-primary">
                                    {e.school} · {e.date}
                                </p>
                                <h4 className="text-lg font-medium">
                                    {e.degree}
                                </h4>
                                <p className="text-sm leading-relaxed text-text-secondary">
                                    {e.desc}
                                </p>
                                <p className="text-xs text-text-secondary">
                                    {e.grade}
                                </p>
                                {e.documents?.map((document) => (
                                    <DocumentLink
                                        key={document.src}
                                        src={document.src}
                                        title={document.title}
                                    >
                                        <FiAward aria-hidden="true" />
                                        View certificate
                                    </DocumentLink>
                                ))}
                            </article>
                        ))}
                </div>
            </div>
        </section>
    );
};
export default Education;
