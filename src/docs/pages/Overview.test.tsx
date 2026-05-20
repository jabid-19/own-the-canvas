import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import { HelmetProvider } from "react-helmet-async";
import { Overview } from "./Overview";

function Wrapper() {
  return (
    <HelmetProvider>
      <MemoryRouter>
        <Overview />
      </MemoryRouter>
    </HelmetProvider>
  );
}

describe("Overview", () => {
  it("renders installation heading", () => {
    render(<Wrapper />);
    expect(screen.getByRole("heading", { name: /installation/i })).toBeInTheDocument();
  });

  it("renders npm install command", () => {
    render(<Wrapper />);
    expect(screen.getAllByText(/npm install own-the-canvas/i).length).toBeGreaterThan(0);
  });

  it("renders quick start section", () => {
    render(<Wrapper />);
    expect(screen.getByRole("heading", { name: /quick start/i })).toBeInTheDocument();
  });

  it("renders peer dependencies table", () => {
    render(<Wrapper />);
    // table has code elements for react and react-dom
    const codeTags = screen.getAllByRole("cell");
    const cellTexts = codeTags.map((el) => el.textContent);
    expect(cellTexts.some((t) => t?.includes("react"))).toBe(true);
    expect(cellTexts.some((t) => t?.includes("react-dom"))).toBe(true);
  });

  it("renders TypeScript section heading", () => {
    render(<Wrapper />);
    expect(screen.getByRole("heading", { name: /typescript/i })).toBeInTheDocument();
  });
});
