import { z } from "zod";

export const contactSchema = z.object({
    from_email: z
        .string()
        .trim()
        .min(1, "Enter your email address.")
        .max(254, "Email must be 254 characters or fewer.")
        .pipe(z.email("Enter a valid email address.")),
    from_name: z
        .string()
        .trim()
        .min(1, "Enter your name.")
        .max(100, "Name must be 100 characters or fewer."),
    subject: z
        .string()
        .trim()
        .min(1, "Enter a subject.")
        .max(200, "Subject must be 200 characters or fewer."),
    message: z
        .string()
        .trim()
        .min(1, "Enter a message.")
        .max(5000, "Message must be 5,000 characters or fewer."),
});

export type ContactValues = z.infer<typeof contactSchema>;
export type ContactErrors = Partial<Record<keyof ContactValues, string>>;
