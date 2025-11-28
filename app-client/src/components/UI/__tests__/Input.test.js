import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import Input from "../Input";

describe("Mobile Input", () => {
  test("toggles password visibility", () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText, getByText } = render(
      <Input
        placeholder="Password"
        value="secret"
        onChangeText={onChangeText}
        secureTextEntry
      />
    );

    const input = getByPlaceholderText("Password");
    // secureTextEntry should start true
    expect(input.props.secureTextEntry).toBe(true);

    const toggle = getByText("Show");
    fireEvent.press(toggle);
    // After pressing, the text should change to Hide
    expect(getByText("Hide")).toBeTruthy();
  });
});
