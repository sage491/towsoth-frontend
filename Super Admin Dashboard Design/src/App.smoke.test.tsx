import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  it("renders the top bar branding and default dashboard", () => {
    render(<App />);

    expect(screen.getByText("Towsoth Edu")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });
});
