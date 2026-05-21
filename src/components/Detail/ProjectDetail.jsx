import { CloseRounded, GitHub, LinkedIn } from "@mui/icons-material";
import { Modal } from "@mui/material";
import styled from "styled-components";

const Container = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: #000000a7;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px 12px;
    overflow-y: auto;
    outline: none;
    transition: all 0.5s ease;
`;
const Wrapper = styled.div`
    max-width: 800px;
    width: 100%;
    max-height: 90dvh;
    border-radius: 16px;
    margin: auto;
    background-color: ${({ theme }) => theme.card};
    color: ${({ theme }) => theme.text_primary};
    padding: 20px;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
`;
const ImageSection = styled.div`
    flex: 0 0 auto;
    width: 100%;
    max-height: 42dvh;
    min-height: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 24px;
    margin-bottom: 8px;
    border-radius: 12px;
    overflow: hidden;
    background: ${({ theme }) => theme.bgLight};
`;
const Content = styled.div`
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    padding-right: 4px;

    scrollbar-width: thin;
    scrollbar-color: ${({ theme }) => theme.primary + 99}
        ${({ theme }) => theme.bgLight};

    &::-webkit-scrollbar {
        width: 8px;
    }
    &::-webkit-scrollbar-track {
        background: ${({ theme }) => theme.bgLight};
        border-radius: 10px;
    }
    &::-webkit-scrollbar-thumb {
        background-color: ${({ theme }) => theme.primary + 99};
        border-radius: 10px;
        border: 2px solid ${({ theme }) => theme.bgLight};
        background-clip: padding-box;
    }
    &::-webkit-scrollbar-thumb:hover {
        background-color: ${({ theme }) => theme.primary};
    }
`;
const Title = styled.div`
    font-size: 28px;
    font-weight: 600;
    color: ${({ theme }) => theme.text_primary};
    margin: 8px 6px 0px 6px;
    @media only screen and (max-width: 600px) {
        font-size: 24px;
        margin: 6px 6px 0px 6px;
    }
`;
const Date = styled.div`
    font-size: 16px;
    margin: 2px 6px;
    font-weight: 400;
    color: ${({ theme }) => theme.text_secondary};
    @media only screen and (max-width: 768px) {
        font-size: 12px;
    }
`;
const Desc = styled.div`
    font-size: 16px;
    font-weight: 400;
    color: ${({ theme }) => theme.text_primary};
    margin: 8px 6px;
    @media only screen and (max-width: 600px) {
        font-size: 14px;
        margin: 6px 6px;
    }
`;
const Image = styled.img`
    display: block;
    max-width: 100%;
    max-height: 42dvh;
    width: auto;
    height: auto;
    object-fit: contain;
    border-radius: 12px;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
`;

const Label = styled.div`
    font-size: 20px;
    font-weight: 600;
    color: ${({ theme }) => theme.text_primary};
    margin: 8px 6px;
    @media only screen and (max-width: 600px) {
        font-size: 16px;
        margin: 8px 6px;
    }
`;
const Tags = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin: 8px 0px;
    @media only screen and (max-width: 600px) {
        margin: 4px 0px;
    }
`;
const Tag = styled.div`
    font-size: 14px;
    font-weight: 400;
    color: ${({ theme }) => theme.primary};
    margin: 4px;
    padding: 4px 8px;
    border-radius: 8px;
    background-color: ${({ theme }) => theme.primary + 20};
    @media only screen and (max-width: 600px) {
        font-size: 12px;
    }
`;
const Members = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex-wrap: wrap;
    margin: 12px 6px;
    @media only screen and (max-width: 600px) {
        margin: 4px 6px;
    }
`;
const Member = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;
const MemberImage = styled.img`
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 50%;
    margin-bottom: 4px;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.3);
    @media only screen and (max-width: 600px) {
        width: 32px;
        height: 32px;
    }
`;
const MemberName = styled.div`
    font-size: 16px;
    font-weight: 500;
    width: 200px;
    color: ${({ theme }) => theme.text_primary};
    @media only screen and (max-width: 600px) {
        font-size: 14px;
    }
`;
const ButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    margin: 12px 0px;
    gap: 12px;
`;
const Button = styled.a`
    width: 100%;
    text-align: center;
    font-size: 16px;
    font-weight: 600;
    color: ${({ theme }) => theme.text_primary};
    padding: 12px 16px;
    border-radius: 8px;
    background-color: ${({ theme }) => theme.primary};
    ${({ dull, theme }) =>
        dull &&
        `
        background-color: ${theme.bgLight};
        color: ${theme.text_secondary};
        &:hover {
            background-color: ${({ theme }) => theme.bg + 99};
        }
    `}
    cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
    pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};
    opacity: ${({ disabled }) => (disabled ? "0.6" : "1")};
    text-decoration: ${({ disabled }) => (disabled ? "line-through" : "none")};
    transition: all 0.5s ease;
    &:hover {
        ${({ disabled, theme }) =>
            !disabled && `background-color: ${theme.primary + 99};`}
    }
    @media only screen and (max-width: 600px) {
        font-size: 12px;
    }
`;

const ProjectDetail = ({ openModal, setOpenModal }) => {
    const project = openModal?.project;
    const isWebAppLinkEmpty = !project?.webapp;
    return (
        <Modal
            open={true}
            onClose={() => setOpenModal({ state: false, project: null })}
        >
            <Container>
                <Wrapper>
                    <CloseRounded
                        style={{
                            position: "absolute",
                            top: "10px",
                            right: "20px",
                            cursor: "pointer",
                        }}
                        onClick={() =>
                            setOpenModal({ state: false, project: null })
                        }
                    />
                    <ImageSection>
                        <Image src={project?.image} alt={project?.title} />
                    </ImageSection>
                    <Content>
                        <Title>{project?.title}</Title>
                        <Date>{project.date}</Date>
                        <Tags>
                            {project?.tags.map((tag, index) => (
                                <Tag key={index}>{tag}</Tag>
                            ))}
                        </Tags>
                        <Desc>{project?.description}</Desc>
                        {project.members && (
                            <>
                                <Label>Members</Label>
                                <Members>
                                    {project?.members.map((member, index) => (
                                        <Member key={index}>
                                            <MemberImage src={member.img} />
                                            <MemberName>
                                                {member.name}
                                            </MemberName>
                                            <a
                                                href={member.github}
                                                target="new"
                                                style={{
                                                    textDecoration: "none",
                                                    color: "inherit",
                                                }}
                                            >
                                                <GitHub />
                                            </a>
                                            <a
                                                href={member.linkedin}
                                                target="new"
                                                style={{
                                                    textDecoration: "none",
                                                    color: "inherit",
                                                }}
                                            >
                                                <LinkedIn />
                                            </a>
                                        </Member>
                                    ))}
                                </Members>
                            </>
                        )}
                        <ButtonGroup>
                            <Button href={project?.github} target="_blank">
                                View Code
                            </Button>
                            <Button
                                dull
                                disabled={isWebAppLinkEmpty}
                                href={project?.webapp}
                                target="_blank"
                            >
                                View Live App
                            </Button>
                        </ButtonGroup>
                    </Content>
                </Wrapper>
            </Container>
        </Modal>
    );
};

export default ProjectDetail;
