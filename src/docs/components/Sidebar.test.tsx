import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import { Sidebar } from "./Sidebar";

function Wrapper({ path = "/" }: { path?: string }) {
  return (
    <MemoryRouter initialEntries={[path]}>
      <Sidebar />
    </MemoryRouter>
  );
}

const componentNames = [
  "MatrixRain",
  "ParticleField",
  "Starfield",
  "FireEffect",
  "AudioVisualizer",
  "Confetti",
  "DragonCursor",
  "NoiseGradient",
  "PixelDissolve",
  "KoiPond",
];

describe("Sidebar", () => {
  it("renders all 10 component nav links", () => {
    render(<Wrapper />);
    for (const name of componentNames) {
      expect(screen.getByRole("link", { name })).toBeInTheDocument();
    }
  });

  it("renders Getting Started section links", () => {
    render(<Wrapper />);
    expect(screen.getByRole("link", { name: /introduction/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /installation/i })).toBeInTheDocument();
  });

  it("renders Playground link", () => {
    render(<Wrapper />);
    expect(screen.getByRole("link", { name: /playground/i })).toBeInTheDocument();
  });

  it("marks the active route link", () => {
    render(<Wrapper path="/overview" />);
    const link = screen.getByRole("link", { name: /installation/i });
    expect(link).toHaveAttribute("aria-current", "page");
  });
});
