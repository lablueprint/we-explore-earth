import { StyleSheet } from "react-native";

import { typography } from '../../../../../shared/typography/typography';

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(248, 249, 247, 1)',
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 24,
    paddingHorizontal: 8,
  },
  
  backArrow: {
    fontSize: 20,
    color: '#2F6B0C',
    fontWeight: '600',
  },

  backText: {
    fontSize: 18,
    color: "#2F6B0C",
    fontWeight: "500",
  },

  imagePlaceholder: {
    width: '100%',
    height: 240,
    borderRadius: 24,
    backgroundColor: '#E6E7E3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  
  imagePlaceholderText: {
    color: '#9A9A94',
    fontSize: 16,
  },

  editButton: {
    borderWidth: 1,
    borderColor: "#2F6B0C",
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  
  editButtonText: {
    color: "#2F6B0C",
    fontSize: 17,
    fontWeight: "700",
  },

  title: {
    fontFamily: "PlayfairDisplay_400Regular",
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: -0.8,
    color: "#1D1D1B",
    marginBottom: 18,
  },

  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 28,
  },

  tagPill: {
    borderWidth: 1,
    borderColor: "#D7D5CF",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#F7F6F2",
  },

  tagText: {
    fontSize: 16,
    color: "#64645F",
  },

  accommodationPill: {
    borderWidth: 1,
    borderColor: "#B7D6A8",
    backgroundColor: "#EAF4E4",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  categoryPill: {
    borderWidth: 1,
    borderColor: "#D7D5CF",
    backgroundColor: "#F7F6F2",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 18,
  },

  infoIcon: {
    fontSize: 22,
    marginRight: 12,
    lineHeight: 24,
  },

  infoTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#1D1D1B",
    marginBottom: 2,
  },

  infoSub: {
    fontSize: 16,
    color: "#7A7A73",
  },

  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
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
    fontSize: 18,
    color: "#2C2C28",
  },

  viewAll: {
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
    fontSize: 15,
    color: "#9A9A94",
    marginBottom: 10,
  },
  
  infoCardText: {
    fontSize: 18,
    color: "#1D1D1B",
    fontWeight: "400",
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
    fontSize: 17,
    lineHeight: 29,
    color: "#262622",
    marginBottom: 14,
  },

  scrollContent: {
    paddingBottom: 80,
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
  
});