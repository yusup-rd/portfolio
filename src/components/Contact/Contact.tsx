import type { FormEvent } from "react";
import React from "react";

import emailjs from "@emailjs/browser";
import { Snackbar } from "@mui/material";
import { useRef } from "react";

const Contact = () => {
    const [open, setOpen] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const form = useRef<HTMLFormElement>(null);
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formElement = form.current;
        const {
            VITE_EMAILJS_SERVICE_ID: serviceId,
            VITE_EMAILJS_TEMPLATE_ID: templateId,
            VITE_EMAILJS_PUBLIC_KEY: publicKey,
        } = import.meta.env;
        if (!formElement || !serviceId || !templateId || !publicKey) {
            setError("Contact form is not configured. Please try again later.");
            return;
        }
        setError(null);
        emailjs
            .sendForm(serviceId, templateId, formElement, { publicKey })
            .then(
                () => {
                    setOpen(true);
                    formElement.reset();
                },
                () => {
                    setError("Email could not be sent. Please try again.");
                },
            );
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
                >
                    <div className="pb-1.5 text-2xl font-semibold text-text-primary">
                        Email Me 🚀
                    </div>
                    <input
                        className="min-w-0 flex-1 rounded-xl border border-text-secondary bg-transparent px-4 py-3 text-lg text-text-primary outline-none focus:border-primary"
                        placeholder="Your Email"
                        name="from_email"
                        type="email"
                        required
                    />
                    <input
                        className="min-w-0 flex-1 rounded-xl border border-text-secondary bg-transparent px-4 py-3 text-lg text-text-primary outline-none focus:border-primary"
                        placeholder="Your Name"
                        name="from_name"
                        required
                    />
                    <input
                        className="min-w-0 flex-1 rounded-xl border border-text-secondary bg-transparent px-4 py-3 text-lg text-text-primary outline-none focus:border-primary"
                        placeholder="Subject"
                        name="subject"
                        required
                    />
                    <div className="flex flex-col gap-3.5">
                        <textarea
                            className="min-w-0 flex-1 resize-none rounded-xl border border-text-secondary bg-transparent px-4 py-3 text-lg text-text-primary outline-none focus:border-primary"
                            placeholder="Message"
                            rows={4}
                            name="message"
                            required
                        />
                        <input
                            className="w-full cursor-pointer rounded-xl border-none bg-(image:--portfolio-special-btn) px-4 py-3.25 text-center text-lg font-semibold text-text-primary no-underline transition-all duration-200 ease-in-out hover:scale-[1.02]"
                            type="submit"
                            value="Send"
                        />
                    </div>
                </form>
                {error && <p role="alert">{error}</p>}
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
