// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import { EXTRA_IDS } from "./extraSpecs";

describe("playground", () => {
  it.each([...EXTRA_IDS])("renders %s panel", (id) => {
    const { container, unmount } = render(<MemoryRouter initialEntries={[`/?component=${id}`]}><App /></MemoryRouter>);
    expect(screen.getAllByText(id).length).toBeGreaterThan(1); // tab + ctrl header
    expect(container.querySelector(".ctrl-body input, .ctrl-body select")).toBeTruthy();
    unmount();
  });
});

describe("playground search", () => {
  it("filters tabs", async () => {
    const { fireEvent } = await import("@testing-library/react");
    render(<MemoryRouter><App /></MemoryRouter>);
    fireEvent.change(screen.getByLabelText("Search components"), { target: { value: "owl" } });
    expect(screen.getAllByRole("tab").map((t) => t.textContent)).toEqual(["Owl"]);
    fireEvent.change(screen.getByLabelText("Search components"), { target: { value: "zzzz" } });
    expect(screen.queryAllByRole("tab")).toHaveLength(0);
  });
});
