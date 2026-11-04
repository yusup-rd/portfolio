import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Projects from "../../src/components/Projects/Projects";

const titles = () =>
    screen
        .getAllByRole("heading", { level: 3 })
        .map((heading) => heading.textContent);

describe("project collection", () => {
    it("starts with selected work and restores it after exploring categories", async () => {
        const user = userEvent.setup();
        render(<Projects setOpenModal={vi.fn()} />);
        expect(titles()).toEqual(["Qalb", "Tangle", "Real-time Chat"]);
        await user.click(
            screen.getByRole("button", { name: "Explore all projects" }),
        );
        expect(titles()).toHaveLength(8);
        expect(titles().slice(0, 3)).toEqual([
            "Qalb",
            "Real-time Chat",
            "Tangle",
        ]);
        await user.click(screen.getByRole("radio", { name: "Mobile" }));
        await waitFor(() => expect(titles()).toEqual(["Qalb", "Habit Master"]));
        expect(screen.getByRole("status")).toHaveTextContent(
            "2 projects shown. mobile selected.",
        );
        await user.click(
            screen.getByRole("button", { name: "Show selected work" }),
        );
        await waitFor(() =>
            expect(titles()).toEqual(["Qalb", "Tangle", "Real-time Chat"]),
        );
        expect(screen.queryByRole("radiogroup")).not.toBeInTheDocument();
    });

    it("sorts a filtered collection by title using the keyboard", async () => {
        const user = userEvent.setup();
        render(<Projects setOpenModal={vi.fn()} />);
        await user.click(
            screen.getByRole("button", { name: "Explore all projects" }),
        );
        await user.click(screen.getByRole("radio", { name: "Backend" }));
        await waitFor(() =>
            expect(titles()).toEqual([
                "Book Inventory API",
                "Online Bookstore System",
            ]),
        );
        await user.click(screen.getByRole("radio", { name: "Mobile" }));
        await waitFor(() => expect(titles()).toEqual(["Qalb", "Habit Master"]));
        const select = screen.getByRole("combobox", { name: "Sort by" });
        select.focus();
        await user.keyboard("{Enter}");
        expect(
            await screen.findByRole("option", { name: "Title" }),
        ).toBeInTheDocument();
        await user.keyboard("{ArrowDown}{Enter}");
        await waitFor(() => expect(titles()).toEqual(["Habit Master", "Qalb"]));
        expect(screen.getByRole("status")).toHaveTextContent(
            "Sorted by title.",
        );
    });

    it("opens the chosen project with its actual data", async () => {
        const user = userEvent.setup();
        const setOpenModal = vi.fn();
        render(<Projects setOpenModal={setOpenModal} />);
        await user.click(
            screen.getByRole("button", { name: /^Tangle application preview/ }),
        );
        expect(setOpenModal).toHaveBeenCalledWith(
            expect.objectContaining({
                state: true,
                project: expect.objectContaining({ title: "Tangle" }),
            }),
        );
    });
});
