import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import { Layout } from "./Layout";

function Wrapper({ children }: { children: React.ReactNode }) {
  return <MemoryRouter>{children}</MemoryRouter>;
}

describe("Layout", () => {
  it("renders sidebar", () => {
    render(
      <Wrapper>
        <Layout>
          <div>content</div>
        </Layout>
      </Wrapper>
    );
    expect(screen.getByRole("navigation", { name: /docs navigation/i })).toBeInTheDocument();
  });

  it("renders children in main content area", () => {
    render(
      <Wrapper>
        <Layout>
          <div>hello world</div>
        </Layout>
      </Wrapper>
    );
    expect(screen.getByText("hello world")).toBeInTheDocument();
  });

  it("renders logo", () => {
    render(
      <Wrapper>
        <Layout>
          <div />
        </Layout>
      </Wrapper>
    );
    expect(screen.getAllByText(/own-the-canvas/i).length).toBeGreaterThan(0);
  });
});
