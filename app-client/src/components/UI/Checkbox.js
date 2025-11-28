import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "../../theme";

const Checkbox = ({ label, checked, onToggle }) => (
  <TouchableOpacity
    style={styles.row}
    onPress={() => onToggle && onToggle(!checked)}
  >
    <View style={[styles.box, checked && styles.boxChecked]}>
      {checked && <Text style={styles.check}>✓</Text>}
    </View>
    <Text style={styles.label}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  box: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(41,91,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  boxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  check: { color: "#fff", fontWeight: "700" },
  label: { color: COLORS.muted, marginLeft: 8 },
});

export default Checkbox;
