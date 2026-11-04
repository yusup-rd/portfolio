import { describe, expect, it } from "vitest";
import { contactSchema } from "../../src/components/Contact/contactSchema";

const valid = {
    from_email: "reader@example.com",
    from_name: "A Reader",
    subject: "Project inquiry",
    message: "I would like to discuss a project.",
};

describe("contact validation", () => {
    it("trims all fields before accepting a message", () => {
        const padded = Object.fromEntries(
            Object.entries(valid).map(([key, value]) => [key, `  ${value}  `]),
        );
        expect(contactSchema.parse(padded)).toEqual(valid);
    });

    it.each(["from_email", "from_name", "subject", "message"] as const)(
        "rejects whitespace-only %s",
        (field) => {
            const result = contactSchema.safeParse({
                ...valid,
                [field]: "   ",
            });
            expect(result.success).toBe(false);
            if (!result.success)
                expect(result.error.issues[0]?.path).toEqual([field]);
        },
    );

    it("rejects malformed email addresses", () => {
        expect(
            contactSchema.safeParse({ ...valid, from_email: "not-an-email" })
                .success,
        ).toBe(false);
    });

    it.each([
        ["from_name", 100],
        ["subject", 200],
        ["message", 5000],
    ] as const)(
        "accepts the %s limit and rejects an extra character",
        (field, limit) => {
            expect(
                contactSchema.safeParse({
                    ...valid,
                    [field]: "x".repeat(limit),
                }).success,
            ).toBe(true);
            expect(
                contactSchema.safeParse({
                    ...valid,
                    [field]: "x".repeat(limit + 1),
                }).success,
            ).toBe(false);
        },
    );
});
