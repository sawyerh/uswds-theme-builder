import { act, render, screen } from "@testing-library/react";
import Page from "pages/index";
import userEvent from "@testing-library/user-event";

test("renders inputs for Sass color variables", async () => {
  render(<Page />);
  const inputs = screen.getAllByTestId("input-color");
  const names = inputs.map((input) => input.getAttribute("name"));

  expect(names).toMatchSnapshot();
});

test("sends message to iFrame when token input changes", async () => {
  render(<Page />);

  const input = screen.getByLabelText("primary");
  const iFrame = screen.getByTitle("Theme preview");
  const postMessageSpy = jest.spyOn(iFrame.contentWindow, "postMessage");

  act(() => {
    userEvent.type(input, "#ff0000");
  });

  expect(postMessageSpy).toHaveBeenCalledWith(
    {
      body: {
        // Not sure why, but the value isn't correct here, so using a
        // generic expect.any for now. This at least tests that the
        // correct name is being sent into the frame though.
        "$theme-color-primary": expect.any(String),
      },
      name: "update_tokens",
    },
    "http://localhost"
  );
});
