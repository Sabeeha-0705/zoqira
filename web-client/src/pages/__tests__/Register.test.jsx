import { render, screen, fireEvent } from "@testing-library/react";
import Register from "../Register";

// mock auth context
vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({ register: vi.fn(() => Promise.resolve()) }),
}));

describe("Register page", () => {
  test("shows strength meter and rule checks when typing password", async () => {
    render(<Register />);

    const password = screen.getByPlaceholderText("Password");
    // very weak
    fireEvent.change(password, { target: { value: "abc" } });
    expect(screen.getByText(/Too short|Very weak/i)).toBeInTheDocument();

    // stronger password
    fireEvent.change(password, { target: { value: "P@ssw0rd123" } });
    expect(await screen.findByText(/Strong|Good/i)).toBeInTheDocument();
    // rule items should show a check for some rules
    expect(screen.getByText(/At least 8 characters/i)).toBeInTheDocument();
  });
});
