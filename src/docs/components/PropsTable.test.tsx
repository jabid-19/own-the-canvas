import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PropsTable } from "./PropsTable";

const props = [
  { name: "color", type: "string", default: '"#00ff41"', description: "Character color" },
  { name: "speed", type: "number", default: "1", description: "Animation speed" },
];

describe("PropsTable", () => {
  it("renders all prop rows", () => {
    render(<PropsTable props={props} />);
    expect(screen.getByText("color")).toBeInTheDocument();
    expect(screen.getByText("speed")).toBeInTheDocument();
  });

  it("renders type column", () => {
    render(<PropsTable props={props} />);
    expect(screen.getAllByText("string").length).toBeGreaterThan(0);
    expect(screen.getAllByText("number").length).toBeGreaterThan(0);
  });

  it("renders default column values", () => {
    render(<PropsTable props={props} />);
    expect(screen.getByText('"#00ff41"')).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("renders description column", () => {
    render(<PropsTable props={props} />);
    expect(screen.getByText("Character color")).toBeInTheDocument();
  });

  it("has table column headers", () => {
    render(<PropsTable props={props} />);
    expect(screen.getByText(/prop/i)).toBeInTheDocument();
    expect(screen.getByText(/type/i)).toBeInTheDocument();
    expect(screen.getByText(/default/i)).toBeInTheDocument();
  });
});
