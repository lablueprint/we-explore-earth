import { StyleSheet } from "react-native";
import { typography } from "@shared/typography/typography";

export const styles = StyleSheet.create({
  logoutCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    marginTop: 8,
    paddingVertical: 18,
    marginBottom: 85,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutText: {
    ...typography.h3,
    color: "#C8102E",
  },
});
