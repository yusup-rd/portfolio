// Adapted from React Bits Particles by David Haz. See THIRD_PARTY_NOTICES.md.
import { useHeroCanvas } from "../../hooks/useHeroCanvas";

type StarColor = [number, number, number];
const particleSpeed = 0.05;
interface StarRenderer {
    resize: (
        width: number,
        height: number,
        ratio: number,
        stars: Float32Array,
    ) => void;
    draw: (
        time: number,
        color: StarColor,
        opacity: number,
        pointer: [number, number],
        intro: number,
    ) => void;
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
uniform vec2 uPointer;
uniform float uIntro;
out vec2 vLocal;
out float vRadius;
out float vHalo;
out float vAlpha;
out float vSeed;
void main() {
    vec2 bob = vec2(sin(uTime * 0.4 + aRandom.w * 40.0), cos(uTime * 0.3 + aRandom.y * 40.0));
    float angle = uTime * 0.6;
    vec2 field = (aPosition.xy - 0.5) * length(uView) * 1.15;
    vec2 rotated = vec2(field.x * cos(angle) - field.y * sin(angle), field.x * sin(angle) + field.y * cos(angle));
    vec2 screen = uView * 0.5 + rotated + bob * aPosition.z * 7.0 + uPointer * mix(4.0, 18.0, aPosition.z);
    float diameter = 0.8 + pow(aRandom.x, 6.0) * 2.0;
    vRadius = diameter * 0.5;
    vHalo = vRadius * 2.5 + 2.0;
    vLocal = aCorner * (vRadius + vHalo + 1.5);
    float twinkle = 1.0 - 0.85 * 0.6 * (0.5 + 0.5 * sin(uTime * (6.0 + aRandom.y * 14.0) + aRandom.w * 40.0));
    float edge = min(min(screen.x, uView.x - screen.x), min(screen.y, uView.y - screen.y));
    float reveal = smoothstep(0.0, 1.0, clamp(uIntro * 1.6 - aRandom.z * 0.6, 0.0, 1.0));
    vAlpha = reveal * twinkle * mix(0.35, 1.0, aRandom.z) * smoothstep(0.0, 6.0, edge);
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
        draw: (time, color, opacity, pointer, intro) => {
            context.clearRect(0, 0, width, height);
            const rgb = color
                .map((channel) => Math.round(channel * 255))
                .join(",");
            for (let i = 0; i < stars.length; i += 7) {
                const depth = stars[i + 2] ?? 0;
                const span = Math.hypot(width, height) * 1.15;
                const dx = ((stars[i] ?? 0) - 0.5) * span;
                const dy = ((stars[i + 1] ?? 0) - 0.5) * span;
                const angle = time * 0.6;
                const x =
                    width / 2 +
                    dx * Math.cos(angle) -
                    dy * Math.sin(angle) +
                    pointer[0] * (4 + depth * 14);
                const y =
                    height / 2 -
                    dx * Math.sin(angle) -
                    dy * Math.cos(angle) -
                    pointer[1] * (4 + depth * 14);
                if (x < 0 || x > width || y < 0 || y > height) continue;
                const radius = 0.4 + Math.pow(stars[i + 3] ?? 0, 6);
                const phase =
                    time * (6 + (stars[i + 4] ?? 0) * 14) +
                    (stars[i + 6] ?? 0) * 40;
                context.globalAlpha =
                    Math.min(
                        1,
                        Math.max(0, intro * 1.6 - (stars[i + 5] ?? 0) * 0.6),
                    ) *
                    opacity *
                    (1 - 0.51 * (0.5 + 0.5 * Math.sin(phase)));
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
        [
            "uView",
            "uTime",
            "uRatio",
            "uColor",
            "uOpacity",
            "uPointer",
            "uIntro",
        ].map((name) => [name, gl.getUniformLocation(program, name)] as const),
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
        draw: (time, color, opacity, pointer, intro) => {
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
            gl.uniform1f(uniforms.uTime ?? null, time);
            gl.uniform2fv(uniforms.uPointer ?? null, pointer);
            gl.uniform1f(uniforms.uIntro ?? null, intro);
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

const createStars = (host: HTMLDivElement) => {
    const renderer = makeRenderer(host);
    if (!renderer) return null;
    return {
        resize: (width: number, height: number, ratio: number) =>
            renderer.resize(
                width,
                height,
                ratio,
                makeStars(
                    Math.min(
                        850,
                        Math.max(
                            200,
                            Math.round(
                                ((width * width + height * height) * 1.3225) /
                                    8000,
                            ),
                        ),
                    ),
                ),
            ),
        draw: (time: number, intro: number, pointer: [number, number]) =>
            renderer.draw(
                time * particleSpeed,
                [0.96, 0.97, 1],
                0.75,
                pointer,
                intro,
            ),
        dispose: renderer.dispose,
    };
};
const HeroParticles = () => {
    const host = useHeroCanvas(createStars, "dark");
    return (
        <div
            ref={host}
            className="hero-background hero-stars"
            aria-hidden="true"
        />
    );
};
export default HeroParticles;
