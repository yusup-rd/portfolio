import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useReducedMotion } from "../../hooks/useReducedMotion";
interface ImageCarouselProps {
    images: string[];
    title: string;
}
const ImageCarousel = ({ images, title }: ImageCarouselProps) => {
    const [viewport, api] = useEmblaCarousel({ align: "start", loop: false });
    const [index, setIndex] = useState(0);
    const reduced = useReducedMotion();
    useEffect(() => {
        if (!api) return;
        const update = () => setIndex(api.selectedScrollSnap());
        api.on("select", update).on("reInit", update);
        return () => {
            api.off("select", update).off("reInit", update);
        };
    }, [api]);
    const jump = (keyboard: boolean) => keyboard || Boolean(reduced);
    return (
        <section
            className="flex min-w-0 flex-col gap-3"
            role="region"
            aria-roledescription="carousel"
            aria-label={title + " screenshots"}
            onKeyDown={(event) => {
                if (event.key === "ArrowRight") {
                    event.preventDefault();
                    api?.scrollNext(true);
                }
                if (event.key === "ArrowLeft") {
                    event.preventDefault();
                    api?.scrollPrev(true);
                }
            }}
        >
            <div
                ref={viewport}
                tabIndex={images.length > 1 ? 0 : undefined}
                aria-label="Screenshots. Use left and right arrow keys to navigate."
                className="overflow-hidden rounded-xl border border-border bg-bg-light"
            >
                <div className="flex touch-pan-y touch-pinch-zoom">
                    {images.map((src, i) => (
                        <div
                            key={src}
                            role="group"
                            aria-roledescription="slide"
                            aria-label={i + 1 + " of " + images.length}
                            aria-hidden={index !== i}
                            className="min-w-0 flex-[0_0_100%]"
                        >
                            <img
                                src={src}
                                alt={title + " screenshot " + (i + 1)}
                                draggable={false}
                                loading={i === 0 ? "eager" : "lazy"}
                                className="h-68 w-full object-contain p-3 sm:h-96 md:h-110"
                            />
                        </div>
                    ))}
                </div>
            </div>
            {images.length > 1 && (
                <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2">
                    <button
                        className="icon-button"
                        type="button"
                        aria-label="Previous screenshot"
                        disabled={index === 0}
                        onClick={(event) =>
                            api?.scrollPrev(jump(event.detail === 0))
                        }
                    >
                        <FiChevronLeft aria-hidden="true" />
                    </button>

                    <p
                        className="text-center text-xs text-text-secondary tabular-nums"
                        aria-live="polite"
                    >
                        {index + 1} / {images.length}
                    </p>
                    <button
                        className="icon-button"
                        type="button"
                        aria-label="Next screenshot"
                        disabled={index === images.length - 1}
                        onClick={(event) =>
                            api?.scrollNext(jump(event.detail === 0))
                        }
                    >
                        <FiChevronRight aria-hidden="true" />
                    </button>
                    <div
                        className="col-span-3 flex items-center justify-center"
                        role="group"
                        aria-label="Choose screenshot"
                    >
                        {images.map((src, i) => (
                            <button
                                className="carousel-dot"
                                key={src}
                                type="button"
                                aria-label={"Go to screenshot " + (i + 1)}
                                aria-current={index === i ? "true" : undefined}
                                onClick={(event) =>
                                    api?.scrollTo(i, jump(event.detail === 0))
                                }
                            >
                                <span />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
};
export default ImageCarousel;
