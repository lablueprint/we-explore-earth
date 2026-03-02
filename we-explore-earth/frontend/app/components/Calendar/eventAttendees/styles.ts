import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  subheading: {
    color: "#000000ff",
    marginBottom: 12,
    fontSize: 18,
    textAlign: "center",
  },
  sectionTitle: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "500",
  },
 attendeeItem: {
  padding: 10,
  marginBottom: 10,
  borderWidth: 1,
  borderColor: "#686869",      
  backgroundColor: "#f0f5fa", 
  borderRadius: 6,

},
  attendeeName: {
    fontSize: 18,
    fontWeight: "bold",
  },

  attendeeUsername: {
    fontSize: 14,
  },

  attendeeEmail: {
    fontSize: 14,
  },

 checkInButton: {
  alignSelf: "flex-start",
},


  searchBar: {
    height: 40,
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  item: {
    fontSize: 18,
    padding: 10,
  },

tabRow: {
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  gap: 60, // <-- space between tabs
  marginTop: 12,
  marginBottom: 12,
},

tab: {
  paddingVertical: 10,
  paddingHorizontal: 30,  // gives them width
  borderRadius: 8,
  alignItems: "center",
  backgroundColor: "#f1f1f1",
  marginHorizontal: 10,   // spacing between tabs
},

tabActive: {
  backgroundColor: "#ffffff",
  shadowColor: "#000",
  shadowOpacity: 0.08,
  shadowRadius: 4,
  elevation: 2,
},

tabText: {
  fontSize: 14,
  fontWeight: "600",
  color: "#666",
},

tabTextActive: {
  color: "#111",
  fontWeight: "bold",
  textDecorationLine: "underline",
},
});