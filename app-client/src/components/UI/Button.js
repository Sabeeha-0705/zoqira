import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../theme";

const Button = ({
  title,
  variant = "primary",
  onPress,
  style,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[disabled && styles.disabled, style]}
      onPress={!disabled ? onPress : undefined}
      activeOpacity={disabled ? 1 : 0.88}
    >
      {variant === "primary" ? (
        <LinearGradient
          colors={["#295BFF", "#4A8CFF"]}
          start={[0, 0]}
          end={[1, 1]}
          style={[styles.primary]}
        >
          <Text style={styles.text}>{title}</Text>
        </LinearGradient>
      ) : (
        <View style={[styles.secondary, style]}>
          <Text style={[styles.text, styles.secondaryText]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  primary: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#295BFF",
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
  },
  disabled: {
    opacity: 0.6,
  },
  secondary: {
    backgroundColor: "transparent",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  text: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 16,
  },
  secondaryText: {
    color: COLORS.primary,
  },
});

export default Button;
