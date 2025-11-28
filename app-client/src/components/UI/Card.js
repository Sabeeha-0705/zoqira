import React from "react";
import { View, StyleSheet } from "react-native";
import { COLORS, STYLES } from "../../theme";

const Card = ({ children, style }) => (
  <View style={[styles.card, style]}>{children}</View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: STYLES.radius,
    padding: 16,
    shadowColor: STYLES.dropShadow.shadowColor,
    shadowOpacity: STYLES.dropShadow.shadowOpacity,
    shadowOffset: STYLES.dropShadow.shadowOffset,
    shadowRadius: STYLES.dropShadow.shadowRadius,
    elevation: STYLES.dropShadow.elevation,
  },
});

export default Card;
