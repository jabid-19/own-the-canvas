import { render, screen } from "@testing-library/react";
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

  it("renders 48 component cards", () => {
    render(<Wrapper />);
    const cards = screen.getAllByTestId("component-card");
    expect(cards).toHaveLength(48);
  });

  it("renders install command", () => {
    render(<Wrapper />);
    expect(screen.getAllByText(/npm install own-the-canvas/i).length).toBeGreaterThan(0);
  });

  it("has Get Started link", () => {
    render(<Wrapper />);
    expect(screen.getByRole("link", { name: /get started/i })).toBeInTheDocument();
  });

  it("has View Playground link", () => {
    render(<Wrapper />);
    expect(screen.getByRole("link", { name: /playground/i })).toBeInTheDocument();
  });
});
