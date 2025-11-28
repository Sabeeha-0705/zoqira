import { render, screen, fireEvent } from "@testing-library/react";
import Input from "../Input";

describe("Input component", () => {
  test("shows and hides password when toggle clicked", () => {
    const onChange = vi.fn();

    render(
      <Input
        type="password"
        value="secret"
        onChange={onChange}
        placeholder="Password"
      />
    );

    const input = screen.getByPlaceholderText("Password");
    expect(input).toHaveAttribute("type", "password");

    const toggle = screen.getByRole("button", {
      name: /Show password|Hide password/i,
    });
    expect(toggle).toBeInTheDocument();

    // Click to show
    fireEvent.click(toggle);
    expect(input).toHaveAttribute("type", "text");

    // Click to hide
    fireEvent.click(toggle);
    expect(input).toHaveAttribute("type", "password");
  });
});
