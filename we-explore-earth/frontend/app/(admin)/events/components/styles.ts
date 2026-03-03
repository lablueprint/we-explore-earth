import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    marginVertical: 15,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  submitButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginVertical: 15,
    backgroundColor: "#fff",
  },
  dollarSign: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    paddingLeft: 15,
  },
  priceInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    paddingLeft: 5,
  },
  // CategoryAccommodationSection styles
  categoryAccommodationContainer: {
    marginVertical: 15,
  },
  categoryAccommodationTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  categoryAccommodationButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  categoryAccommodationButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 8,
  },
  categoryAccommodationButtonText: {
    fontSize: 14,
    color: "#333",
  },
  categoryAccommodationBadge: {
    backgroundColor: "#007AFF",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  categoryAccommodationBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "85%",
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#333",
  },
  modalOptionsList: {
    maxHeight: 300,
  },
  modalOptionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#ddd",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  modalCheckboxChecked: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  modalCheckmark: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  modalOptionText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  modalCancelButtonText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
  },
  modalSaveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#007AFF",
  },
  modalSaveButtonText: {
    textAlign: "center",
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  
  imageButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginTop: 8,
  },

  removeImageText: {
    color: "#d00",
    marginTop: 6,
    textAlign: "center",
  },
});
