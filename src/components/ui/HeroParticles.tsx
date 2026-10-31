// Adapted from React Bits Particles by David Haz. See THIRD_PARTY_NOTICES.md.
import { useEffect, useRef, useState } from "react";
import { FiPause, FiPlay } from "react-icons/fi";
import { useReducedMotion } from "../../hooks/useReducedMotion";

type StarColor = [number, number, number];
interface StarRenderer {
    resize: (
        width: number,
        height: number,
        ratio: number,
        stars: Float32Array,
    ) => void;
    draw: (time: number, color: StarColor, opacity: number) => void;
    dispose: () => void;
}

const vertex = `#version 300 es
precision highp float;
layout(location = 0) in vec2 aCorner;
layout(location = 1) in vec3 aPosition;
layout(location = 2) in vec4 aRandom;
uniform vec2 uView;
uniform float uTime;
uniform float uRatio;
out vec2 vLocal;
out float vRadius;
out float vHalo;
out float vAlpha;
out float vSeed;
void main() {
    vec2 bob = vec2(sin(uTime * 0.4 + aRandom.w * 40.0), cos(uTime * 0.3 + aRandom.y * 40.0));
    vec2 screen = mod(aPosition.xy * uView + bob * aPosition.z * 3.0 + uView, uView);
    float diameter = 0.8 + pow(aRandom.x, 6.0) * 2.0;
    vRadius = diameter * 0.5;
    vHalo = vRadius * 2.5 + 2.0;
    vLocal = aCorner * (vRadius + vHalo + 1.5);
    float twinkle = 1.0 - 0.85 * 0.6 * (0.5 + 0.5 * sin(uTime * (6.0 + aRandom.y * 14.0) + aRandom.w * 40.0));
    float edge = min(min(screen.x, uView.x - screen.x), min(screen.y, uView.y - screen.y));
    vAlpha = twinkle * mix(0.35, 1.0, aRandom.z) * smoothstep(0.0, 6.0, edge);
    vSeed = aRandom.z;
    gl_Position = vec4((screen + vLocal) / uView * 2.0 - 1.0, 0.0, 1.0);
}`;

const fragment = `#version 300 es
precision highp float;
uniform vec3 uColor;
uniform float uRatio;
uniform float uOpacity;
in vec2 vLocal;
in float vRadius;
in float vHalo;
in float vAlpha;
in float vSeed;
out vec4 outColor;
void main() {
    float d = length(vLocal);
    float soft = 0.7 / uRatio + vRadius * 0.1;
    float core = 1.0 - smoothstep(vRadius - soft, vRadius + soft, d);
    float halo = exp(-d / (vHalo * 0.35)) * 0.4;
    float alpha = clamp(core + halo * (1.0 - core), 0.0, 1.0) * vAlpha * uOpacity;
    if (alpha < 0.002) discard;
    vec3 color = mix(uColor, uColor * vec3(1.0, 0.94, 0.85), step(0.94, vSeed));
    outColor = vec4(color * alpha, alpha);
}`;

const makeStars = (count: number) => {
    // A stable seed preserves the composition on resize and pause/resume.
    let seed = 721;
    const random = () => {
        seed = (seed + 0x6d2b79f5) >>> 0;
        let value = seed;
        value = Math.imul(value ^ (value >>> 15), value | 1);
        value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
        return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    };
    return Float32Array.from({ length: count * 7 }, random);
};

const makeFallback = (canvas: HTMLCanvasElement): StarRenderer | null => {
    const context = canvas.getContext("2d");
    if (!context) return null;
    let width = 1,
        height = 1,
        stars: Float32Array = new Float32Array();
    return {
        resize: (w, h, ratio, points) => {
            width = w;
            height = h;
            stars = points;
            canvas.width = Math.round(w * ratio);
            canvas.height = Math.round(h * ratio);
            context.setTransform(ratio, 0, 0, ratio, 0, 0);
        },
        draw: (time, color, opacity) => {
            context.clearRect(0, 0, width, height);
            const rgb = color
                .map((channel) => Math.round(channel * 255))
                .join(",");
            for (let i = 0; i < stars.length; i += 7) {
                const x = (stars[i] ?? 0) * width,
                    y = (stars[i + 1] ?? 0) * height;
                const radius = 0.4 + Math.pow(stars[i + 3] ?? 0, 6);
                const phase =
                    time * (6 + (stars[i + 4] ?? 0) * 14) +
                    (stars[i + 6] ?? 0) * 40;
                context.globalAlpha =
                    opacity * (1 - 0.51 * (0.5 + 0.5 * Math.sin(phase)));
                const glow = context.createRadialGradient(
                    x,
                    y,
                    0,
                    x,
                    y,
                    radius + 3,
                );
                glow.addColorStop(0, "rgba(" + rgb + ",1)");
                glow.addColorStop(0.22, "rgba(" + rgb + ",0.4)");
                glow.addColorStop(1, "rgba(" + rgb + ",0)");
                context.fillStyle = glow;
                context.fillRect(
                    x - radius - 3,
                    y - radius - 3,
                    (radius + 3) * 2,
                    (radius + 3) * 2,
                );
            }
        },
        dispose: () => canvas.remove(),
    };
};

const makeRenderer = (host: HTMLDivElement): StarRenderer | null => {
    let canvas = document.createElement("canvas");
    canvas.className = "block size-full";
    host.append(canvas);
    const gl = canvas.getContext("webgl2", {
        alpha: true,
        antialias: false,
        depth: false,
    });
    if (!gl) return makeFallback(canvas);
    const shaders: WebGLShader[] = [];
    for (const [type, source] of [
        [gl.VERTEX_SHADER, vertex],
        [gl.FRAGMENT_SHADER, fragment],
    ] as const) {
        const shader = gl.createShader(type);
        if (!shader) continue;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        shaders.push(shader);
    }
    const program = gl.createProgram();
    if (program) {
        shaders.forEach((shader) => gl.attachShader(program, shader));
        gl.linkProgram(program);
    }
    shaders.forEach((shader) => gl.deleteShader(shader));
    if (!program || !gl.getProgramParameter(program, gl.LINK_STATUS)) {
        gl.deleteProgram(program);
        gl.getExtension("WEBGL_lose_context")?.loseContext();
        canvas.remove();
        canvas = document.createElement("canvas");
        canvas.className = "block size-full";
        host.append(canvas);
        return makeFallback(canvas);
    }
    const vao = gl.createVertexArray();
    const corners = gl.createBuffer();
    const points = gl.createBuffer();
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, corners);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
        gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, points);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 28, 0);
    gl.vertexAttribDivisor(1, 1);
    gl.enableVertexAttribArray(2);
    gl.vertexAttribPointer(2, 4, gl.FLOAT, false, 28, 12);
    gl.vertexAttribDivisor(2, 1);
    gl.useProgram(program);
    const uniforms = Object.fromEntries(
        ["uView", "uTime", "uRatio", "uColor", "uOpacity"].map(
            (name) => [name, gl.getUniformLocation(program, name)] as const,
        ),
    );
    let count = 0;
    return {
        resize: (width, height, ratio, stars) => {
            canvas.width = Math.round(width * ratio);
            canvas.height = Math.round(height * ratio);
            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.uniform2f(uniforms.uView ?? null, width, height);
            gl.uniform1f(uniforms.uRatio ?? null, ratio);
            gl.bindBuffer(gl.ARRAY_BUFFER, points);
            gl.bufferData(gl.ARRAY_BUFFER, stars, gl.STATIC_DRAW);
            count = stars.length / 7;
        },
        draw: (time, color, opacity) => {
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
            gl.uniform1f(uniforms.uTime ?? null, time);
            gl.uniform3fv(uniforms.uColor ?? null, color);
            gl.uniform1f(uniforms.uOpacity ?? null, opacity);
            gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, count);
        },
        dispose: () => {
            gl.deleteBuffer(corners);
            gl.deleteBuffer(points);
            gl.deleteVertexArray(vao);
            gl.deleteProgram(program);
            gl.getExtension("WEBGL_lose_context")?.loseContext();
            canvas.remove();
        },
    };
};

const HeroParticles = () => {
    const host = useRef<HTMLDivElement>(null);
    const elapsed = useRef(0);
    const [paused, setPaused] = useState(false);
    const reduced = useReducedMotion();
    useEffect(() => {
        const element = host.current;
        if (!element) return;
        const renderer = makeRenderer(element);
        if (!renderer) return;
        let frame = 0,
            last = 0,
            visible = true,
            color: StarColor = [1, 1, 1],
            opacity = 0.75;
        const draw = () =>
            renderer.draw(elapsed.current * 0.07, color, opacity);
        const running = () =>
            !paused && !reduced && visible && !document.hidden;
        const tick = (now: number) => {
            frame = 0;
            if (!running()) return;
            if (!last || now - last >= 1000 / 30) {
                elapsed.current += last
                    ? Math.min((now - last) / 1000, 0.05)
                    : 0;
                last = now;
                draw();
            }
            frame = requestAnimationFrame(tick);
        };
        const wake = () => {
            if (running() && !frame) {
                last = 0;
                frame = requestAnimationFrame(tick);
            } else if (!running()) {
                cancelAnimationFrame(frame);
                frame = 0;
            }
        };
        const theme = () => {
            const root = document.documentElement;
            const hex = getComputedStyle(root)
                .getPropertyValue("--ink")
                .trim()
                .slice(1);
            color = [0, 2, 4].map(
                (offset) => parseInt(hex.slice(offset, offset + 2), 16) / 255,
            ) as StarColor;
            opacity = root.dataset.theme === "dark" ? 0.75 : 0.3;
            draw();
        };
        const resize = () => {
            const { width, height } = element.getBoundingClientRect();
            const count = Math.min(
                260,
                Math.max(80, Math.round((width * height) / 6000)),
            );
            renderer.resize(
                width,
                height,
                Math.min(devicePixelRatio || 1, 1.5),
                makeStars(count),
            );
            draw();
            wake();
        };
        const size = new ResizeObserver(resize);
        size.observe(element);
        const intersection = new IntersectionObserver(([entry]) => {
            visible = Boolean(entry?.isIntersecting);
            wake();
        });
        intersection.observe(element);
        const palette = new MutationObserver(theme);
        palette.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["data-theme"],
        });
        document.addEventListener("visibilitychange", wake);
        window.addEventListener("resize", resize);
        theme();
        resize();
        return () => {
            cancelAnimationFrame(frame);
            size.disconnect();
            intersection.disconnect();
            palette.disconnect();
            document.removeEventListener("visibilitychange", wake);
            window.removeEventListener("resize", resize);
            renderer.dispose();
        };
    }, [paused, reduced]);
    return (
        <>
            <div
                ref={host}
                className="pointer-events-none absolute inset-y-0 left-1/2 -z-10 w-dvw -translate-x-1/2"
                aria-hidden="true"
            />
            {!reduced && (
                <div className="page-shell pointer-events-none absolute inset-x-0 bottom-3 flex justify-end">
                    <button
                        type="button"
                        className="pointer-events-auto flex min-h-11 items-center gap-2 rounded-full border border-border bg-bg px-3 py-2 text-xs text-text-secondary"
                        aria-label={
                            paused
                                ? "Play star animation"
                                : "Pause star animation"
                        }
                        aria-pressed={paused}
                        onClick={() => setPaused(!paused)}
                    >
                        {paused ? (
                            <FiPlay aria-hidden="true" />
                        ) : (
                            <FiPause aria-hidden="true" />
                        )}
                        {paused ? "Play motion" : "Pause motion"}
                    </button>
                </div>
            )}
        </>
    );
};
export default HeroParticles;
