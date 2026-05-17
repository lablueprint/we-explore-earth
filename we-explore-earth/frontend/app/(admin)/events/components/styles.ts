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
    marginBottom: 16,
    marginTop: 16,
    textAlign: "center",
    color: "#333",
    fontFamily: 'HankenGrotesk-Regular',
    lineHeight: 24,
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
    backgroundColor: "#1D6400",
    borderColor: "#023107",
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
    fontFamily: 'HankenGrotesk-Regular',
    lineHeight: 24,
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
    fontFamily: 'HankenGrotesk-Regular',
    lineHeight: 24,
  },
  modalSaveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#1D6400",
  },
  modalSaveButtonText: {
    textAlign: "center",
    fontSize: 16,
    color: "#fff",
    fontFamily: 'HankenGrotesk-Regular',
    lineHeight: 24,
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
    color: "rgb(21, 87, 1)",
    marginTop: 2,
    marginBottom: 16,
    textAlign: "center",
    fontFamily: 'HankenGrotesk-Regular',
    fontSize: 16,
    lineHeight: 24,
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
  color: "#6B6B6B",
  fontFamily: 'HankenGrotesk-Regular',
},

dateText: {
  fontSize: 13,
  color: "#6B6B6B",
},

iosPickerModalRoot: {
  flex: 1,
  justifyContent: "flex-end",
  backgroundColor: "transparent",
},
iosPickerDismissTouch: {
  flex: 1,
},
iosPickerSheet: {
  backgroundColor: "#fff",
  borderTopLeftRadius: 14,
  borderTopRightRadius: 14,
  paddingBottom: 28,
  overflow: "hidden",
},
iosPickerDoneRow: {
  flexDirection: "row",
  justifyContent: "flex-end",
  alignItems: "center",
  paddingHorizontal: 16,
  paddingVertical: 10,
  borderBottomWidth: StyleSheet.hairlineWidth,
  borderBottomColor: "#DADADA",
},
iosPickerDoneText: {
  fontSize: 17,
  color: "#185526",
  fontWeight: "600",
  fontFamily: "HankenGrotesk-Regular",
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
  backgroundColor: "transparent",
  marginBottom: 0,
  paddingVertical: 16,
  paddingHorizontal: 8,
  fontSize: 16,
},

iconContainer: {
  width: 28,
  alignItems: "center",
  justifyContent: "center",
},

iconContainerTop: {
  width: 28,
  alignItems: "center",
  marginTop: 2,
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

// FOR SINGLE DATE PICKER MODAL (for selecting start and end date in event form)

// Date range styles (for calendar that's imported from 'react-native-calendar')
const SELECTED_BACKGROUND_COLOR = '#D6E6CB';
const SELECTED_EDGE_BORDER_RADIUS = 50;
const SELECTED_EDGE_CIRCLE_COLOR = '#507C30';
const SELECTED_EDGE_TEXT_COLOR = '#FCFCFC';

/* 
 * Width of the calendar is 322, so each day has a width of 46 (322 / 7).
 * Middle days have a background that spans the entire width.
 * Edge days have a background that spans 70% of the width.
 */
const RANGE_DAY_WIDTH = 46;
const SELECTED_EDGE_BACKGROUND_WIDTH = Math.round(RANGE_DAY_WIDTH * 0.7);

// Base container style for all selected days. Start dates, end dates, and single dates override some of these styles.
const baseContainerStyle = {
  width: RANGE_DAY_WIDTH,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: SELECTED_BACKGROUND_COLOR,
  borderRadius: 0,
};

// Edge days are indicated with a dark green circle overlay.
const edgeCircleStyle = {
  color: SELECTED_EDGE_TEXT_COLOR,
  backgroundColor: SELECTED_EDGE_CIRCLE_COLOR,
  borderRadius: SELECTED_EDGE_BORDER_RADIUS,
  width: 26,
  height: 26,
  lineHeight: 26,
  textAlign: 'center',
}

export const dateRangeStyles = {
  singleDay: {
    container: {
      ...baseContainerStyle,
      width: SELECTED_EDGE_BACKGROUND_WIDTH,
      borderRadius: SELECTED_EDGE_BORDER_RADIUS,
    },
    text: {
      ...edgeCircleStyle,
    }
  },
};

// Modal styles (parent container of the calendar)
export const calendarStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    padding: 16,
    width: 354,
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#DEDEDE',
    elevation: 5,
  },
})