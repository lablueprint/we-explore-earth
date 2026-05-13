import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: "5%",
    height: 60,
    borderRadius: 100,
    overflow: "hidden",
    padding: 4,
    backgroundColor: "transparent",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
  tabBarIcon: {
    width: 54,
    height: 47,
  },
  tabBarBlur: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 100,
  },
  bubbleIconFocused: {
    backgroundColor: "#355E2B",
    borderRadius: 100,
    width: 54,
    height: 47,
    justifyContent: "center",
    alignItems: "center",
  },
});
