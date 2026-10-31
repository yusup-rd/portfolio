// Adapted from React Bits Dot Grid by David Haz. See THIRD_PARTY_NOTICES.md.
import { useHeroCanvas } from "../../hooks/useHeroCanvas";
const createGrid = (host: HTMLDivElement) => {
    const canvas = document.createElement("canvas");
    canvas.className = "block size-full";
    host.append(canvas);
    const context = canvas.getContext("2d");
    if (!context) return null;
    let width = 1,
        height = 1;
    const dots: { x: number; y: number; dx: number; dy: number }[] = [];
    return {
        resize: (w: number, h: number, ratio: number) => {
            width = w;
            height = h;
            canvas.width = Math.round(w * ratio);
            canvas.height = Math.round(h * ratio);
            context.setTransform(ratio, 0, 0, ratio, 0, 0);
            dots.length = 0;
            const gap = 28;
            for (let y = (h % gap) / 2; y < h; y += gap)
                for (let x = (w % gap) / 2; x < w; x += gap)
                    dots.push({ x, y, dx: 0, dy: 0 });
        },
        draw: (
            _time: number,
            intro: number,
            pointer: [number, number],
            presence: number,
        ) => {
            context.clearRect(0, 0, width, height);
            const px = ((pointer[0] + 1) * width) / 2,
                py = ((1 - pointer[1]) * height) / 2;
            const color = getComputedStyle(document.documentElement)
                .getPropertyValue("--accent")
                .trim();
            for (const dot of dots) {
                const distance = Math.hypot(dot.x - px, dot.y - py);
                const proximity =
                    presence * Math.exp((-distance * distance) / (140 * 140));
                dot.dx += ((dot.x - px) * proximity * 0.12 - dot.dx) * 0.15;
                dot.dy += ((dot.y - py) * proximity * 0.12 - dot.dy) * 0.15;
                const radial =
                    Math.hypot(dot.x - width / 2, dot.y - height / 2) /
                    Math.hypot(width / 2, height / 2);
                const reveal = Math.min(
                    1,
                    Math.max(0, intro * 1.6 - radial * 0.6),
                );
                const eased = reveal * reveal * (3 - 2 * reveal);
                context.globalAlpha = (0.16 + proximity * 0.22) * eased;
                context.fillStyle = color;
                context.beginPath();
                context.arc(
                    dot.x + dot.dx,
                    dot.y + dot.dy,
                    (1.1 + proximity * 0.5) * eased,
                    0,
                    Math.PI * 2,
                );
                context.fill();
            }
        },
        dispose: () => canvas.remove(),
    };
};
const HeroDotGrid = () => {
    const host = useHeroCanvas(createGrid, "light");
    return (
        <div
            ref={host}
            className="hero-background hero-dots"
            aria-hidden="true"
        />
    );
};
export default HeroDotGrid;
