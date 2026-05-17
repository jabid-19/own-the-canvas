import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CodeBlock } from "./CodeBlock";

describe("CodeBlock", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the code string", () => {
    render(<CodeBlock code="npm install own-the-canvas" />);
    expect(screen.getByText(/npm install own-the-canvas/)).toBeInTheDocument();
  });

  it("shows copy button", () => {
    render(<CodeBlock code="const x = 1" />);
    expect(screen.getByRole("button", { name: /copy/i })).toBeInTheDocument();
  });

  it("triggers clipboard write on click and shows Copied! feedback", async () => {
    const spy = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue(undefined);
    render(<CodeBlock code="hello world" />);
    // Use fireEvent to bypass userEvent virtual clipboard
    fireEvent.click(screen.getByRole("button", { name: /copy/i }));
    expect(spy).toHaveBeenCalledWith("hello world");
    // wait for state update
    expect(await screen.findByRole("button", { name: /copied/i })).toBeInTheDocument();
  });

  it("renders language label when provided", () => {
    render(<CodeBlock code="x" language="bash" />);
    expect(screen.getByText("bash")).toBeInTheDocument();
  });
});
