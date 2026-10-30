import type { FormEvent } from "react";
import React from "react";

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
        <div className="relative z-1 flex flex-col items-center justify-center">
            <div className="relative flex w-full max-w-337.5 flex-col items-center justify-between gap-10 pt-5 pb-20 max-md:pt-3">
                <div className="flex flex-col items-center gap-3 max-md:gap-6">
                    <div className="text-center text-4xl font-semibold text-text-primary max-md:text-3xl">
                        Contact
                    </div>
                    <div className="max-w-150 text-center text-lg text-text-secondary max-md:px-3.75 max-md:text-base">
                        Please don&apos;t hesitate to contact me if you have any
                        inquiries or if there are any opportunities you&apos;d
                        like to discuss.
                    </div>
                </div>
                <form
                    className="flex w-[95%] max-w-150 flex-col gap-3 rounded-2xl bg-card p-8 shadow-[0_4px_24px_rgba(23,92,230,0.15)]"
                    ref={form}
                    onSubmit={handleSubmit}
                    noValidate
                    aria-busy={isSubmitting}
                >
                    <div className="pb-1.5 text-2xl font-semibold text-text-primary">
                        Email Me 🚀
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
                            className:
                                "min-w-0 w-full rounded-xl border border-text-secondary bg-transparent px-4 py-3 text-lg text-text-primary outline-none focus:border-primary aria-invalid:border-red-500",
                        };
                        return (
                            <div
                                key={field.name}
                                className="flex flex-col gap-1.5"
                            >
                                <label htmlFor={field.name} className="sr-only">
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
                                        className="text-sm text-text-primary"
                                        role="alert"
                                    >
                                        {fieldErrors[field.name]}
                                    </p>
                                )}
                            </div>
                        );
                    })}
                    <button
                        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-none bg-(image:--portfolio-special-btn) px-4 py-3.25 text-lg font-semibold text-text-primary transition-transform duration-200 ease-in-out enabled:hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting && (
                            <span
                                aria-hidden="true"
                                className="size-5 animate-spin rounded-full border-2 border-current border-r-transparent"
                            />
                        )}
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
                    className="absolute! top-[85%]! left-1/2! -translate-x-1/2"
                />
            </div>
        </div>
    );
};

export default Contact;
