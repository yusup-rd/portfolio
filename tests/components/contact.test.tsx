import emailjs from "@emailjs/browser";
import {
    act,
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Contact from "../../src/components/Contact/Contact";

vi.mock("@emailjs/browser", () => ({ default: { sendForm: vi.fn() } }));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), dismiss: vi.fn() } }));

const fillMessage = async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Your Email"), "reader@example.com");
    await user.type(screen.getByLabelText("Your Name"), "  A Reader  ");
    await user.type(screen.getByLabelText("Subject"), "  Project inquiry  ");
    await user.type(
        screen.getByLabelText("Message"),
        "  Let us discuss a project.  ",
    );
    return user;
};

beforeEach(() => {
    vi.mocked(emailjs.sendForm).mockReset();
    vi.stubEnv("VITE_EMAILJS_SERVICE_ID", "test-service");
    vi.stubEnv("VITE_EMAILJS_TEMPLATE_ID", "test-template");
    vi.stubEnv("VITE_EMAILJS_PUBLIC_KEY", "test-public-key");
});

describe("contact form", () => {
    it("reports required fields, focuses the first invalid field, and does not send", async () => {
        const user = userEvent.setup();
        render(<Contact />);
        await user.click(screen.getByRole("button", { name: "Send" }));
        expect(screen.getAllByRole("alert")).toHaveLength(4);
        expect(screen.getByLabelText("Your Email")).toHaveFocus();
        expect(screen.getByLabelText("Your Email")).toHaveAccessibleDescription(
            "Enter your email address.",
        );
        expect(emailjs.sendForm).not.toHaveBeenCalled();
        await user.type(
            screen.getByLabelText("Your Email"),
            "reader@example.com",
        );
        expect(screen.getByLabelText("Your Email")).toHaveAttribute(
            "aria-invalid",
            "false",
        );
    });

    it("sends trimmed values once while pending, then clears the form on success", async () => {
        let finish: (() => void) | undefined;
        let sent: Record<string, FormDataEntryValue> | undefined;
        vi.mocked(emailjs.sendForm).mockImplementation(
            (_service, _template, form) => {
                if (!(form instanceof HTMLFormElement))
                    throw new Error("Expected form element");
                sent = Object.fromEntries(new FormData(form));
                return new Promise((resolve) => {
                    finish = () => resolve({ status: 200, text: "OK" });
                });
            },
        );
        render(<Contact />);
        const user = await fillMessage();
        await user.click(screen.getByRole("button", { name: "Send" }));
        expect(screen.getByRole("button", { name: "Sending…" })).toBeDisabled();
        expect(screen.getByLabelText("Message")).toHaveAttribute("readonly");
        // Exercise the guard even if another submission bypasses the disabled button.
        const form = screen.getByLabelText("Message").closest("form");
        if (!form) throw new Error("Missing contact form");
        fireEvent.submit(form);
        expect(emailjs.sendForm).toHaveBeenCalledTimes(1);
        expect(emailjs.sendForm).toHaveBeenCalledWith(
            "test-service",
            "test-template",
            form,
            { publicKey: "test-public-key" },
        );
        expect(sent).toEqual({
            from_email: "reader@example.com",
            from_name: "A Reader",
            subject: "Project inquiry",
            message: "Let us discuss a project.",
        });
        await act(async () => {
            finish?.();
        });
        expect(screen.getByLabelText("Message")).toHaveValue("");
        expect(screen.getByRole("button", { name: "Send" })).toBeEnabled();
        expect(toast.success).toHaveBeenCalledWith("Email sent successfully!", {
            id: "contact-success",
        });
    });

    it("preserves the message after delivery fails and allows retry", async () => {
        vi.mocked(emailjs.sendForm).mockRejectedValueOnce(new Error("Offline"));
        vi.mocked(emailjs.sendForm).mockResolvedValueOnce({
            status: 200,
            text: "OK",
        });
        render(<Contact />);
        const user = await fillMessage();
        await user.click(screen.getByRole("button", { name: "Send" }));
        expect(await screen.findByRole("alert")).toHaveTextContent(
            "Email could not be sent. Please try again.",
        );
        expect(screen.getByLabelText("Message")).toHaveValue(
            "Let us discuss a project.",
        );
        expect(toast.success).not.toHaveBeenCalled();
        await user.click(screen.getByRole("button", { name: "Send" }));
        await waitFor(() =>
            expect(screen.getByLabelText("Message")).toHaveValue(""),
        );
        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
        expect(emailjs.sendForm).toHaveBeenCalledTimes(2);
    });

    it("shows a useful error without sending when configuration is missing", async () => {
        vi.stubEnv("VITE_EMAILJS_PUBLIC_KEY", "");
        render(<Contact />);
        const user = await fillMessage();
        await user.click(screen.getByRole("button", { name: "Send" }));
        expect(screen.getByRole("alert")).toHaveTextContent(
            "Contact form is not configured.",
        );
        expect(emailjs.sendForm).not.toHaveBeenCalled();
        expect(screen.getByLabelText("Message")).not.toHaveValue("");
    });
});
