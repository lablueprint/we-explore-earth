import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    marginTop:30,
    marginLeft: 10,
    marginRight: 10,
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 48,
  },
  pageTitle: {
    marginBottom: 28,
    marginTop: 4,
  },
  label: {
    fontFamily: "HankenGrotesk-Regular",
    fontSize: 14,
    color: "#888",
    marginBottom: 6,
  },
  selectRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e8e8e8",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 15,
    marginBottom: 20,
  },
  selectText: {
    fontFamily: "HankenGrotesk-Regular",
    fontSize: 16,
    color: "#1a1a1a",
  },
  placeholderText: {
    fontFamily: "HankenGrotesk-Regular",
    fontSize: 16,
    color: "#bbb",
  },
  dropdownWrap: {
    marginTop: -16,
    marginBottom: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e8e8e8",
    borderRadius: 12,
    overflow: "hidden",
    maxHeight: 220,
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: "#e8e8e8",
  },
  dropdownSearch: {
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    fontSize: 15,
    fontFamily: "HankenGrotesk-Regular",
    color: "#1a1a1a",
  },
  dropdownScroll: {
    flexGrow: 0,
  },
  dropdownRow: {
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dropdownRowText: {
    fontFamily: "HankenGrotesk-Regular",
    fontSize: 16,
    color: "#1a1a1a",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e8e8e8",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 16,
    fontFamily: "HankenGrotesk-Regular",
    color: "#1a1a1a",
    marginBottom: 20,
  },
  textArea: {
    height: 130,
    textAlignVertical: "top",
  },
  sendButton: {
    backgroundColor: "#3d5a1a",
    borderRadius: 32,
    paddingVertical: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 4,
  },
  sendButtonDisabled: {
    backgroundColor: "#A2A2A2",
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
    fontFamily: "HankenGrotesk-Regular",
  },
  modalConfirmButton: {
    backgroundColor: "#3d5a1a",
  },
});

export const modalStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
    alignItems: "baseline",
  },
  emphasis: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  muted: {
    fontSize: 16,
    color: "#666",
    flexShrink: 1,
  },
  previewSection: {
    marginTop: 20,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 10,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
  },
  previewBody: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
    lineHeight: 22,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    gap: 12,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
});
