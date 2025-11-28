import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import RegisterScreen from "../RegisterScreen";

jest.mock("../../context/AuthContext", () => ({
  useAuth: () => ({ register: jest.fn(() => Promise.resolve()) }),
}));

describe("RegisterScreen", () => {
  test("shows strength meter and rule checks when typing password", async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(
      <RegisterScreen />
    );

    const passwordInput = getByPlaceholderText("Password");
    fireEvent.changeText(passwordInput, "abc");
    expect(queryByText(/Too short|Very weak/)).toBeTruthy();

    fireEvent.changeText(passwordInput, "P@ssw0rd123");
    await waitFor(() => expect(getByText(/Strong|Good/)).toBeTruthy());
    expect(getByText(/At least 8 characters/)).toBeTruthy();
  });
});
