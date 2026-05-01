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
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 2,
    borderRadius: 8,
    borderColor: "mediumgrey",
  },

  filterButtonText: {
    fontWeight: "600",
    fontSize: 24,
    color: "grey",
  },
});