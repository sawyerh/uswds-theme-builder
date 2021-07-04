import Page from "pages/index";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";

describe("Index page", () => {
  it("shows Editor panel by default", () => {
    render(<Page />);
  });
});
