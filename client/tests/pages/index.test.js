import { render, screen, waitFor } from "@testing-library/react";
import Page from "pages/index";
import userEvent from "@testing-library/user-event";

test("renders inputs for Sass color variables", async () => {
  render(<Page />);
  const inputs = await screen.findAllByTestId("input-color");
  const names = inputs.map((input) => input.getAttribute("name"));

  expect(names).toMatchSnapshot();
});

test("supports importing, editing, and exporting tokens", async () => {
  render(<Page />);
  const iFrame = screen.getByTitle("Theme preview");
  const postMessageSpy = jest.spyOn(iFrame.contentWindow, "postMessage");

  // Toggle the "Import" panel
  userEvent.click(screen.getByRole("button", { name: "Import" }));
  userEvent.type(
    await screen.findByLabelText(/USWDS settings variables/),
    "$theme-color-primary: #ff0000;"
  );

  // Submit the imported token
  userEvent.click(screen.getByRole("button", { name: /Import & replace/ }));
  await waitFor(() => expect(postMessageSpy).toHaveBeenCalledTimes(1));

  // Open the "Editor" panel
  userEvent.click(screen.getByRole("button", { name: "Editor" }));
  // Expand the "Primary" color accordion
  userEvent.click(
    screen.getByRole("button", { name: "primary", expanded: false })
  );

  const primaryColorInput = screen.getByLabelText("primary");
  expect(primaryColorInput.value).toBe("#ff0000");

  // Change the token
  userEvent.clear(primaryColorInput);
  userEvent.type(primaryColorInput, "#112233");
  expect(primaryColorInput.value).toBe("#112233");
  await waitFor(() => expect(postMessageSpy).toHaveBeenCalledTimes(3));

  // Open the "Export" panel
  userEvent.click(screen.getByRole("button", { name: "Export" }));
  const exportedTokensElement = await screen.findByTestId("export-content");
  expect(exportedTokensElement).toHaveTextContent(
    "$theme-color-primary: #112233;"
  );
});

test("sends message to iFrame when token input changes", async () => {
  render(<Page />);

  const input = screen.getByLabelText("primary");
  const iFrame = screen.getByTitle("Theme preview");
  const postMessageSpy = jest.spyOn(iFrame.contentWindow, "postMessage");

  // Expand the "Primary" color accordion
  userEvent.click(
    screen.getByRole("button", { name: "primary", expanded: false })
  );

  userEvent.clear(input);
  userEvent.type(input, "#ff0000");

  await waitFor(async () => {
    expect(postMessageSpy).toHaveBeenCalledWith(
      {
        body: {
          "$theme-color-primary": "#ff0000",
        },
        name: "update_tokens",
      },
      "http://localhost"
    );
  });
});
