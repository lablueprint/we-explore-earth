import { StyleSheet } from "react-native";
import { typography } from "../../../../../shared/typography/typography";

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(248, 249, 247, 1)",
  },

  sheet: {
    flex: 1,
    backgroundColor: "#F7F6F2",
    paddingHorizontal: 24,
    paddingTop: 18,
    marginTop: 18,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 24,
    paddingHorizontal: 8,
  },

  backArrow: {
    fontSize: 20,
    color: "#2F6B0C",
    fontWeight: "600",
  },

  backText: {
    ...typography.body,
    fontSize: 18,
    color: "#2F6B0C",
  },

  imagePlaceholder: {
    width: "100%",
    height: 240,
    borderRadius: 24,
    backgroundColor: "#E6E7E3",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    overflow: "hidden",
    position: "relative",
  },

  imagePlaceholderText: {
    ...typography.body,
    color: "#9A9A94",
  },

  editButton: {
    borderWidth: 1,
    backgroundColor: "rgba(40, 95, 0, 1)",
    borderColor: "rgba(40, 95, 0, 1)",
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  editButtonText: {
    ...typography.body,
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },

  title: {
    ...typography.h1,
    marginBottom: 18,
  },

  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 28,
    marginTop: 7,
  },

  tagPill: {
    borderWidth: 0.8,
    borderColor: "#D7D5CF",
    backgroundColor: "#F5F5F5",
    borderRadius: 7,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },

  tagText: {
    ...typography.body,
    fontSize: 13,
    color: "#64645F",
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 18,
    gap: 10,
  },

  infoIcon: {
    fontSize: 22,
    marginRight: 12,
    lineHeight: 24,
  },

  infoTitle: {
    ...typography.body,
    fontSize: 18,
    color: "#1D1D1B",
  },

  infoSub: {
    ...typography.body,
    fontSize: 16,
    color: "#7A7A73",
  },

  sectionLabel: {
    ...typography.h3,
    color: "#A1A19A",
    marginTop: 22,
    marginBottom: 10,
  },

  attendeeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  attendeeCount: {
    ...typography.body,
    fontSize: 18,
    color: "#2C2C28",
  },

  viewAll: {
    ...typography.body,
    fontSize: 16,
    color: "#A7A7A0",
  },

  avatarRow: {
    flexDirection: "row",
    marginBottom: 24,
  },

  infoCardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },

  infoCard: {
    backgroundColor: "#F0F0ED",
    borderWidth: 1,
    borderColor: "#D9D8D3",
    borderRadius: 18,
    paddingHorizontal: 22,
    paddingVertical: 18,
    marginBottom: 14,
  },

  infoCardLabel: {
    ...typography.body,
    fontSize: 15,
    color: "#9A9A94",
    marginBottom: 10,
  },

  infoCardText: {
    ...typography.body,
    fontSize: 18,
    color: "#1D1D1B",
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#C8C8C2",
    marginRight: 8,
  },

  rsvpButton: {
    backgroundColor: "#2F6B0C",
    borderRadius: 999,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },

  rsvpButtonText: {
    ...typography.body,
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },

  divider: {
    height: 1,
    backgroundColor: "#D9D8D3",
    marginBottom: 24,
  },

  body: {
    ...typography.body,
    fontSize: 17,
    lineHeight: 29,
    color: "#262622",
    marginBottom: 14,
  },

  scrollContent: {
    paddingBottom: 80,
  },

  editButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  editButtonIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },

  viewAllButton: {
    paddingVertical: 4,
    paddingHorizontal: 4,
  },

  logisticsIcon: {
    width: 16,
    height: 16,
    resizeMode: "contain",
    marginTop: 2,
  },

  logisticsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 10,
  },

  closeButton: {
    marginTop: 20,
    padding: 10,
    marginRight: 16,
    borderRadius: 6,
    alignSelf: "flex-end",
  },

  modalView: {
    marginTop: 20,
  },

  eventFullButton: {
    backgroundColor: "#979292",
    borderRadius: 999,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
    overflow: "hidden",
  },

  eventFullText: {
    ...typography.body,
    color: "#f8ebeb",
    fontSize: 18,
    fontWeight: "700",
  },
});