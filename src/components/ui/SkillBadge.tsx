import { FiCode } from "react-icons/fi";
interface SkillBadgeProps {
    name: string;
    image: string;
}
const SkillBadge = ({ name, image }: SkillBadgeProps) => {
    return (
        <span className="tag gap-2">
            {image ? (
                <img
                    src={image}
                    alt=""
                    className="devicon size-5 object-contain"
                    loading="lazy"
                />
            ) : (
                <FiCode className="size-4" aria-hidden="true" />
            )}
            {name}
        </span>
    );
};
export default SkillBadge;
