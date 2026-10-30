import styled from "styled-components";
import { Bio } from "../../data/constants";
import Typewriter from "typewriter-effect";
import HeroBgAnimation from "../HeroBgAnimation";

const HeroContainer = styled.div`
    background-color: ${({ theme }) => theme.card_light};
    display: flex;
    justify-content: center;
    position: relative;
    padding: 80px 30px;
    @media screen and (max-width: 960px) {
        padding: 66px 16px;
    }
    @media screen and (max-width: 640px) {
        padding: 32px 16px;
    }
    z-index: 1;
    clip-path: polygon(0 0, 100% 0, 100% 100%, 70% 95%, 0 100%);
`;
const HeroBg = styled.div`
    position: absolute;
    display: flex;
    justify-content: end;
    width: 100%;
    height: 100%;
    max-width: 1360px;
    overflow: hidden;
    padding: 0 30px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
    @media screen and (max-width: 960px) {
        justify-content: center;
        padding: 0 0;
    }
`;
const HeroInnerContainer = styled.div`
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 1100px;
    @media screen and (max-width: 960px) {
        flex-direction: column;
    }
`;
const HeroLeftContainer = styled.div`
    width: 100%;
    order: 1;
    @media screen and (max-width: 960px) {
        order: 2;
        margin-bottom: 32px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    @media screen and (max-width: 640px) {
        order: 2;
        margin-bottom: 30px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
`;
const HeroRightContainer = styled.div`
    width: 100%;
    display: flex;
    order: 2;
    justify-content: end;
    gap: 12px;
    @media screen and (max-width: 960px) {
        order: 1;
        justify-content: center;
        align-items: center;
        margin-bottom: 80px;
    }
    @media screen and (max-width: 640px) {
        margin-bottom: 30px;
    }
`;
const Image = styled.img`
    position: relative;
    width: 100%;
    height: 100%;
    max-height: 400px;
    max-width: 400px;
    border-radius: 50%;
    border: 2px solid ${({ theme }) => theme.primary};
    object-fit: cover;
    @media screen and (max-width: 960px) {
        max-height: 400px;
        max-width: 400px;
    }
    @media screen and (max-width: 640px) {
        max-height: 280px;
        max-width: 280px;
    }
`;
const Title = styled.div`
    font-size: 50px;
    font-weight: 700;
    color: ${({ theme }) => theme.text_primary};
    line-height: 68px;
    @media screen and (max-width: 960px) {
        text-align: center;
    }
    @media screen and (max-width: 640px) {
        font-size: 40px;
        line-height: 48px;
        margin-bottom: 8px;
    }
`;
const TextLoop = styled.div`
    font-size: 32px;
    font-weight: 600;
    display: flex;
    gap: 12px;
    color: ${({ theme }) => theme.text_primary};
    line-height: 68px;
    @media screen and (max-width: 960px) {
        text-align: center;
    }
    @media screen and (max-width: 640px) {
        font-size: 20px;
        line-height: 48px;
        margin-bottom: 12px;
    }
`;
const Span = styled.div`
    color: ${({ theme }) => theme.primary};
`;
const Subtitle = styled.div`
    font-size: 20px;
    line-height: 32px;
    margin-bottom: 42px;
    color: ${({ theme }) => theme.text_primary + 95};
    @media screen and (max-width: 960px) {
        text-align: center;
    }
    @media screen and (max-width: 640px) {
        font-size: 16px;
        line-height: 32px;
        text-align: justify;
        padding: 0 15px;
    }
`;
const ResumeButton = styled.a`
    -webkit-appearance: button;
    -moz-appearance: button;
    appearance: button;
    text-decoration: none;
    width: 95%;
    max-width: 300px;
    text-align: center;
    padding: 16px 0;
    color: ${({ theme }) => theme.white};
    border-radius: 20px;
    cursor: pointer;
    font-size: 20px;
    font-weight: 600;
    transition: all 0.2s ease-in-out !important;
    background: ${({ theme }) => theme.special_btn};
    background: -moz-${({ theme }) => theme.special_btn};
    background: -webkit-${({ theme }) => theme.special_btn};
    box-shadow: ${({ theme }) => theme.special_btn_shadow};
    &:hover {
        transform: scale(1.05);
        transition: all 0.4s ease-in-out;
        filter: brightness(1);
    }
    @media (max-width: 640px) {
        padding: 12px 0;
        font-size: 18px;
    }
`;

const Hero = () => {
    return (
        <section id="about">
            <HeroContainer>
                <HeroBg>
                    <HeroBgAnimation />
                </HeroBg>
                <HeroInnerContainer>
                    <HeroLeftContainer
                        data-aos="fade-right"
                        data-aos-once="false"
                    >
                        <Title>
                            Hi, I am <br />
                            {Bio.name}
                        </Title>
                        <TextLoop>
                            I am a
                            <Span>
                                <Typewriter
                                    options={{
                                        strings: Bio.roles,
                                        autoStart: true,
                                        loop: true,
                                    }}
                                />
                            </Span>
                        </TextLoop>
                        <Subtitle data-aos="fade-right" data-aos-once="false">
                            {Bio.description}
                        </Subtitle>
                        <ResumeButton href={Bio.resume} target="_blank">
                            My Resume
                        </ResumeButton>
                    </HeroLeftContainer>
                    <HeroRightContainer>
                        <Image src={Bio.image} alt="Profile" />
                    </HeroRightContainer>
                </HeroInnerContainer>
            </HeroContainer>
        </section>
    );
};

export default Hero;
