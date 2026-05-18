import { StyleSheet } from "react-native";
import { typography } from "@shared/typography/typography";

export const styles = StyleSheet.create({
  container: {
    gap: 12,
    marginTop: 32,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    padding: 16,
    gap: 16,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#EDEDED",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  profileInfo: {
    flex: 1,
    gap: 6,
  },
  name: {
    ...typography.smaller_h1,
  },
  adminBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#1D6400",
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 999,
  },
  adminBadgeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  sectionLabel: {
    fontSize: 13,
    color: "#9A9A9A",
    letterSpacing: 0.5,
    marginTop: 12,
    marginBottom: 4,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 14,
  },
  rowTextContainer: {
    flex: 1,
  },
  rowLabel: {
    ...typography.body,
    fontSize: 13,
    color: "#9A9A9A",
    marginBottom: 2,
  },
  rowValue: {
    ...typography.body,
  },
  toggleLabel: {
    fontSize: 16,
    color: "#1A1A1A",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E5E5",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 4,
    marginBottom: 4,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },
  editButtonText: {
    color: "#1A1A1A",
    fontSize: 14,
    fontWeight: "500",
  },
});
