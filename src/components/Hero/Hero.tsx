import Typewriter from "typewriter-effect";
import { Bio } from "../../data/constants";
import HeroBgAnimation from "../HeroBgAnimation";

const Hero = () => {
    return (
        <section id="about">
            <div className="relative z-1 flex justify-center bg-card-light px-7.5 py-20 [clip-path:polygon(0_0,100%_0,100%_100%,70%_95%,0_100%)] max-lg:px-4 max-lg:py-16.5 max-sm:py-8">
                <div className="absolute top-1/2 left-1/2 flex size-full max-w-340 -translate-x-1/2 -translate-y-1/2 justify-end overflow-hidden px-7.5 max-lg:justify-center max-lg:px-0">
                    <HeroBgAnimation />
                </div>
                <div className="relative flex w-full max-w-275 items-center justify-between max-lg:flex-col max-lg:gap-20 max-sm:gap-7.5">
                    <div
                        className="order-1 flex w-full flex-col gap-10.5 max-lg:order-2 max-lg:items-center max-lg:pb-8 max-sm:pb-7.5"
                        data-aos="fade-right"
                        data-aos-once="false"
                    >
                        <div className="flex w-full flex-col max-lg:items-center max-sm:gap-3">
                            <div className="flex w-full flex-col max-lg:items-center max-sm:gap-2">
                                <div className="text-5xl leading-17 font-bold text-text-primary max-lg:text-center max-sm:text-4xl max-sm:leading-12">
                                    Hi, I am <br />
                                    {Bio.name}
                                </div>
                                <div className="flex gap-3 text-3xl leading-17 font-semibold text-text-primary max-lg:text-center max-sm:text-xl max-sm:leading-12">
                                    I am a
                                    <div className="text-primary">
                                        <Typewriter
                                            options={{
                                                strings: Bio.roles,
                                                autoStart: true,
                                                loop: true,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div
                                className="text-xl leading-8 text-text-primary/[58.43%] max-lg:text-center max-sm:px-3.75 max-sm:text-justify max-sm:text-base"
                                data-aos="fade-right"
                                data-aos-once="false"
                            >
                                {Bio.description}
                            </div>
                        </div>
                        <a
                            className="w-[95%] max-w-75 cursor-pointer rounded-3xl bg-(image:--portfolio-special-btn) py-4 text-center text-xl font-semibold text-white no-underline shadow-(--portfolio-special-btn-shadow) transition-all duration-200 ease-in-out hover:scale-105 hover:brightness-100 max-sm:py-3 max-sm:text-lg"
                            href={Bio.resume}
                            target="_blank"
                        >
                            My Resume
                        </a>
                    </div>
                    <div className="order-2 flex w-full justify-end gap-3 max-lg:order-1 max-lg:items-center max-lg:justify-center">
                        <img
                            className="relative size-full max-h-100 max-w-100 rounded-full border-2 border-primary object-cover max-sm:max-h-70 max-sm:max-w-70"
                            src={Bio.image}
                            alt="Profile"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
