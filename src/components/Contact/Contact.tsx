import type { FormEvent } from "react";
import React from "react";
import {
    FiMail,
    FiMessageSquare,
    FiSend,
    FiType,
    FiUser,
} from "react-icons/fi";
import SectionHeading from "../ui/SectionHeading";

import emailjs from "@emailjs/browser";
import { Snackbar } from "@mui/material";
import { useRef } from "react";

import {
    contactSchema,
    type ContactErrors,
    type ContactValues,
} from "./contactSchema";

const fields = [
    { name: "from_email", label: "Your Email", type: "email", maxLength: 254 },
    { name: "from_name", label: "Your Name", type: "text", maxLength: 100 },
    { name: "subject", label: "Subject", type: "text", maxLength: 200 },
    { name: "message", label: "Message", type: "text", maxLength: 5000 },
] as const;

const Contact = () => {
    const [open, setOpen] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = React.useState<ContactErrors>({});
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const pending = useRef(false);
    const form = useRef<HTMLFormElement>(null);

    const validateField = (name: keyof ContactValues, value: string) => {
        const result = contactSchema.shape[name].safeParse(value);
        setFieldErrors((previous) => ({
            ...previous,
            [name]: result.success
                ? undefined
                : result.error.issues[0]?.message,
        }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (pending.current) return;
        const formElement = event.currentTarget;
        setError(null);
        setOpen(false);
        const result = contactSchema.safeParse(
            Object.fromEntries(new FormData(formElement)),
        );
        if (!result.success) {
            const errors: ContactErrors = {};
            for (const field of fields) {
                const issue = result.error.issues.find(
                    (issue) => issue.path[0] === field.name,
                );
                if (issue) errors[field.name] = issue.message;
            }
            setFieldErrors(errors);
            const firstInvalid = fields.find((field) => errors[field.name]);
            const input =
                firstInvalid &&
                formElement.elements.namedItem(firstInvalid.name);
            if (input instanceof HTMLElement) input.focus();
            return;
        }
        setFieldErrors({});
        const {
            VITE_EMAILJS_SERVICE_ID: serviceId,
            VITE_EMAILJS_TEMPLATE_ID: templateId,
            VITE_EMAILJS_PUBLIC_KEY: publicKey,
        } = import.meta.env;
        if (!serviceId || !templateId || !publicKey) {
            setError("Contact form is not configured. Please try again later.");
            return;
        }
        // Keep existing EmailJS template field names and send the trimmed values.
        for (const field of fields) {
            const input = formElement.elements.namedItem(field.name);
            if (
                input instanceof HTMLInputElement ||
                input instanceof HTMLTextAreaElement
            )
                input.value = result.data[field.name];
        }
        pending.current = true;
        setIsSubmitting(true);
        try {
            await emailjs.sendForm(serviceId, templateId, formElement, {
                publicKey,
            });
            formElement.reset();
            setOpen(true);
        } catch {
            setError("Email could not be sent. Please try again.");
        } finally {
            pending.current = false;
            setIsSubmitting(false);
        }
    };

    return (
        <section id="contact" className="border-t border-border bg-bg-light">
            <div className="page-shell section-space grid gap-12 lg:grid-cols-2 lg:gap-24">
                <div className="flex flex-col gap-8">
                    <SectionHeading
                        number="05"
                        eyebrow="Start a conversation"
                        title="Good work starts with a conversation."
                    />
                    <p className="max-w-100 text-lg leading-relaxed text-text-secondary">
                        Have a product to build, a problem to solve, or a team I
                        could contribute to? I’d like to hear about it.
                    </p>
                    <p className="text-sm text-text-secondary">
                        Tell me a little about your idea and what you have in
                        mind.
                    </p>
                </div>
                <form
                    className="surface flex min-w-0 flex-col gap-5 p-6 sm:p-8"
                    ref={form}
                    onSubmit={handleSubmit}
                    noValidate
                    aria-busy={isSubmitting}
                >
                    <div className="pb-1.5 text-2xl font-semibold text-text-primary">
                        Send a message
                    </div>
                    {fields.map((field) => {
                        const inputProps = {
                            id: field.name,
                            name: field.name,
                            placeholder: field.label,
                            required: true,
                            maxLength: field.maxLength,
                            readOnly: isSubmitting,
                            "aria-invalid": Boolean(fieldErrors[field.name]),
                            "aria-describedby": fieldErrors[field.name]
                                ? field.name + "-error"
                                : undefined,
                            onBlur: (
                                event: React.FocusEvent<
                                    HTMLInputElement | HTMLTextAreaElement
                                >,
                            ) =>
                                validateField(
                                    field.name,
                                    event.currentTarget.value,
                                ),
                            onChange: (
                                event: React.ChangeEvent<
                                    HTMLInputElement | HTMLTextAreaElement
                                >,
                            ) => {
                                if (fieldErrors[field.name])
                                    validateField(
                                        field.name,
                                        event.currentTarget.value,
                                    );
                            },
                            className: "contact-input",
                        };
                        return (
                            <div
                                key={field.name}
                                className="flex flex-col gap-1.5"
                            >
                                <label
                                    htmlFor={field.name}
                                    className="flex items-center gap-2 text-sm font-medium"
                                >
                                    {field.name === "from_email" ? (
                                        <FiMail aria-hidden="true" />
                                    ) : field.name === "from_name" ? (
                                        <FiUser aria-hidden="true" />
                                    ) : field.name === "subject" ? (
                                        <FiType aria-hidden="true" />
                                    ) : (
                                        <FiMessageSquare aria-hidden="true" />
                                    )}
                                    {field.label}
                                </label>
                                {field.name === "message" ? (
                                    <textarea
                                        {...inputProps}
                                        rows={4}
                                        className={
                                            inputProps.className +
                                            " resize-none"
                                        }
                                    />
                                ) : (
                                    <input
                                        {...inputProps}
                                        type={field.type}
                                        autoComplete={
                                            field.name === "from_email"
                                                ? "email"
                                                : field.name === "from_name"
                                                  ? "name"
                                                  : undefined
                                        }
                                    />
                                )}
                                {fieldErrors[field.name] && (
                                    <p
                                        id={field.name + "-error"}
                                        className="text-sm text-error"
                                        role="alert"
                                    >
                                        {fieldErrors[field.name]}
                                    </p>
                                )}
                            </div>
                        );
                    })}
                    <button
                        className="button button-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting && (
                            <span
                                aria-hidden="true"
                                className="size-5 animate-spin rounded-full border-2 border-current border-r-transparent"
                            />
                        )}
                        {!isSubmitting && <FiSend aria-hidden="true" />}
                        <span aria-live="polite">
                            {isSubmitting ? "Sending…" : "Send"}
                        </span>
                    </button>
                    {error && (
                        <p className="text-sm text-text-primary" role="alert">
                            {error}
                        </p>
                    )}
                </form>
                <Snackbar
                    open={open}
                    autoHideDuration={6000}
                    onClose={() => setOpen(false)}
                    message="Email sent successfully!"
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                    }}
                />
            </div>
        </section>
    );
};

export default Contact;
