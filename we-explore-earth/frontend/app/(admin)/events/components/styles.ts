import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9F7",
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
    borderWidth: 0,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#ededed",
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

  divider: {
  height: 1,
  backgroundColor: "#DADADA",
  marginVertical: 16, 
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
    backgroundColor: "#185526",
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


  coverContainer: {
  width: "100%",
  height: 220,
  borderRadius: 24,
  overflow: "hidden",
  backgroundColor: "#E9E9E9",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 16,
},

coverImage: {
  width: "100%",
  height: "100%",
},

editButton: {
  position: "absolute",
  right: 12,
  bottom: 12,
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: "#F3F3F3",
  justifyContent: "center",
  alignItems: "center",
},

//SUBMIT
launchButton: {
  backgroundColor: "#1D6400",
  width: "100%",
  height: 64,
  borderRadius: 32,
  justifyContent: "center",
  alignItems: "center",
  alignSelf: "flex-start",
  marginLeft: 0,
  marginTop: 30,
},

launchButtonText: {
  color: "white",
  fontSize: 24,
  fontWeight: "400",
  fontFamily: 'HankenGrotesk-Regular',
  lineHeight: 24,
  
},


//Price

priceContainer: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#E5E5E5",
  borderRadius: 12,
  marginVertical: 15,
  paddingHorizontal: 16,
  marginBottom: 16,
  height: 56,
},
  priceInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    paddingLeft: 5,
    color: "#6B6B6B",
  },

    dollarSign: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B6B6B",
    paddingLeft: 15,
  },


  //DATE

  dateCard: {
  backgroundColor: "#ededed",
  borderRadius: 14,
  paddingHorizontal: 18,
  paddingVertical: 18,
  marginBottom: 16,
  position: "relative",
},

timezonePill: {
  position: "absolute",
  top: 10,
  right: 16,
  borderWidth: 1,
  borderColor: "#d0d0d0",
  backgroundColor: "#fff",
  borderRadius: 14,
  paddingHorizontal: 10,
  paddingVertical: 4,
},

timezoneText: {
  fontSize: 11,
  color: "#8A8A8A",
},

dateGrid: {
  flexDirection: "row",
  alignItems: "center",
  marginTop: 5,
},

timeline: {
  width: 18,
  alignItems: "center",
  marginRight: 14,
},

dot: {
  width: 8,
  height: 8,
  borderRadius: 4,
  backgroundColor: "#A8A8A8",
},

dottedLine: {
  height: 34,
  borderLeftWidth: 1,
  borderStyle: "dotted",
  borderColor: "#A8A8A8",
},

dateLabels: {
  gap: 28,
  marginRight: 24,
},

dateColumn: {
  gap: 28,
  flex: 1,
},

timeColumn: {
  gap: 28,
  flex: 1,
},

dateLabel: {
  fontSize: 13,
  color: "#8A8A8A",
},

dateText: {
  fontSize: 13,
  color: "#8A8A8A",
},

//Icons

inputWithIcon: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#ededed",
  borderRadius: 12,
  paddingHorizontal: 16,
  marginBottom: 16,
},

inputInsideIcon: {
  flex: 1,
  backgroundColor: "transparent", // removes double box
  marginBottom: 0,                // removes extra spacing
  paddingVertical: 14,            // keep same feel
  paddingHorizontal: 10,
},

textAreaWithIcon: {
  flexDirection: "row",
  alignItems: "flex-start",
  backgroundColor: "#ededed",
  borderRadius: 12,
  paddingHorizontal: 16,
  paddingTop: 14,
  marginBottom: 16,
},

descriptionInput: {
  minHeight: 110,
  textAlignVertical: "top",
},

//TAGS
tagPill: {
  backgroundColor: "#245c00", // green
  borderRadius: 16,
  paddingHorizontal: 10,
  paddingVertical: 4,
  marginRight: 6,
  marginBottom: 6,
  alignSelf: "flex-start",
},

tagText: {
  color: "white",
  fontSize: 13,
},

tagContainer: {
  flexDirection: "row",   
  flexWrap: "wrap",       
  marginTop: 6,
},

});




