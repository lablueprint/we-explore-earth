import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  homeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },

  upcoming: {
    fontWeight: "bold",
    fontSize: 36,
    color: "black",
  },

  filterButtonWrapper: {
    padding: 6,
    borderWidth: 1,
    borderRadius: 24,
    borderColor: "#DEDEDE",
  },

  filterButtonText: {
    fontWeight: "600",
    fontSize: 24,
    color: "grey",
  },
});