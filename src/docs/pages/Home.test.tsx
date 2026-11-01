import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import { HelmetProvider } from "react-helmet-async";
import { Home } from "./Home";

function Wrapper() {
  return (
    <HelmetProvider>
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    </HelmetProvider>
  );
}

describe("Home", () => {
  it("renders hero heading", () => {
    render(<Wrapper />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("renders 60 component cards", () => {
    render(<Wrapper />);
    const cards = screen.getAllByTestId("component-card");
    expect(cards).toHaveLength(60);
  });

  it("renders install command", () => {
    render(<Wrapper />);
    expect(screen.getAllByText(/npm install own-the-canvas/i).length).toBeGreaterThan(0);
  });

  // Scoped to the hero: role queries over all 60 cards are slow enough to time out.
  const hero = (container: HTMLElement) => within(container.querySelector<HTMLElement>(".home-hero")!);

  it("has Get Started link", () => {
    const { container } = render(<Wrapper />);
    expect(hero(container).getByRole("link", { name: /get started/i })).toBeInTheDocument();
  });

  it("has View Playground link", () => {
    const { container } = render(<Wrapper />);
    expect(hero(container).getByRole("link", { name: /playground/i })).toBeInTheDocument();
  });
});
