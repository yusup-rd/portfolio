import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useEffect, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import DocumentReader from "../../src/components/ui/DocumentReader";

interface PdfPreviewProps {
    src: string;
    page: number;
    width: number;
    onLoad: (pages: number) => void;
}

// Keep the reader, Radix dialog, keyboard handling, and pagination real.
// Replace only PDF decoding/rendering, which belongs to React-PDF/PDF.js.
vi.mock("../../src/components/ui/PdfDocument", () => {
    const PdfPreview = ({ src, page, width, onLoad }: PdfPreviewProps) => {
        useEffect(() => {
            onLoad(src.includes("multipage") ? 3 : 1);
        }, [src, onLoad]);
        return (
            <p>
                PDF page {page}, render width {width}
            </p>
        );
    };
    return { default: PdfPreview };
});

const ReaderExample = () => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <button onClick={() => setOpen(true)}>Read certificate</button>
            {open && (
                <DocumentReader
                    src="/certificate.jpg"
                    title="Degree certificate"
                    onClose={() => setOpen(false)}
                />
            )}
        </>
    );
};

describe("document reader", () => {
    it("keeps zoom and download available for a single-page PDF without pagination", async () => {
        const user = userEvent.setup();
        render(
            <DocumentReader
                src="/single-page.pdf"
                title="Certificate"
                onClose={vi.fn()}
            />,
        );
        expect(
            await screen.findByText("PDF page 1, render width 800"),
        ).toBeInTheDocument();
        expect(
            screen.queryByRole("button", { name: "Next page" }),
        ).not.toBeInTheDocument();
        expect(
            screen.queryByRole("button", { name: "Previous page" }),
        ).not.toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Download" })).toHaveAttribute(
            "href",
            "/single-page.pdf",
        );
        expect(screen.getByRole("link", { name: "Download" })).toHaveAttribute(
            "download",
        );
        await user.click(screen.getByRole("button", { name: "Zoom in" }));
        expect(screen.getByText("125%")).toBeInTheDocument();
        expect(
            screen.getByText("PDF page 1, render width 1000"),
        ).toBeInTheDocument();
    });

    it("navigates a multipage PDF and enforces both page boundaries", async () => {
        const user = userEvent.setup();
        render(
            <DocumentReader
                src="/multipage.pdf"
                title="Transcript"
                onClose={vi.fn()}
            />,
        );
        expect(await screen.findByRole("status")).toHaveTextContent(
            "Page 1 of 3",
        );
        expect(
            screen.getByRole("button", { name: "Previous page" }),
        ).toBeDisabled();
        await user.click(screen.getByRole("button", { name: "Next page" }));
        expect(screen.getByRole("status")).toHaveTextContent("Page 2 of 3");
        await user.click(screen.getByRole("button", { name: "Next page" }));
        expect(screen.getByRole("status")).toHaveTextContent("Page 3 of 3");
        expect(screen.getByRole("status")).toHaveFocus();
        expect(
            screen.getByRole("button", { name: "Next page" }),
        ).toBeDisabled();
        await user.click(screen.getByRole("button", { name: "Previous page" }));
        expect(screen.getByRole("status")).toHaveTextContent("Page 2 of 3");
    });

    it("closes with Escape and restores focus to the link that opened it", async () => {
        const user = userEvent.setup();
        render(<ReaderExample />);
        const opener = screen.getByRole("button", { name: "Read certificate" });
        await user.click(opener);
        expect(
            screen.getByRole("dialog", { name: "Degree certificate" }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Close document reader" }),
        ).toHaveFocus();
        await user.keyboard("{Escape}");
        await waitFor(() =>
            expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
        );
        await waitFor(() => expect(opener).toHaveFocus());
    });

    it("offers the original file and download when an image preview fails", async () => {
        render(
            <DocumentReader
                src="/certificate.jpg"
                title="Certificate"
                onClose={vi.fn()}
            />,
        );
        fireEvent.error(screen.getByRole("img", { name: "Certificate" }));
        expect(screen.getByRole("alert")).toHaveTextContent(
            "This preview is unavailable.",
        );
        expect(
            screen.getByRole("link", {
                name: "Open original document in a new tab",
            }),
        ).toHaveAttribute("href", "/certificate.jpg");
        expect(screen.getByRole("link", { name: "Download" })).toHaveAttribute(
            "href",
            "/certificate.jpg",
        );
    });
});
