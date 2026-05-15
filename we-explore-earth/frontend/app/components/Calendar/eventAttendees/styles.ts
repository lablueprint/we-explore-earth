

import { StyleSheet } from "react-native";
import { typography } from '../../../../../shared/typography/typography';


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 30,
    backgroundColor: "#FFFFFF",
  },
  listCard: {
  backgroundColor: '#fff',
  borderRadius: 12,
  overflow: 'hidden',
  },

  header: {
    ...typography.h2,
    fontSize: 28,
    fontWeight: "400",
    textAlign: "center",
    marginBottom: 4,
    color: "#111",
  },

  subheading: {
    ...typography.h2,
    fontSize: 14,
    textAlign: "center",
    color: "#666",
    marginBottom: 18,
  },

  tabRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 50,
    marginBottom: 14,
  },

  tabText: {
     ...typography.body,
    fontSize: 15,
    fontWeight: "500",
    color: "#777",
    paddingBottom: 4,
   
  },

  tabTextActive: {
    ...typography.body,
    fontSize: 15,
    fontWeight: "500",
    color: "#13381f",
    paddingBottom: 4,
    textDecorationLine: "underline",
  },

  attendeeItem: {
    paddingVertical: 18,
    paddingHorizontal: 18,
    backgroundColor: "#EFEFEF",
    borderBottomWidth: 1,
    borderBottomColor: "#DADADA",
  },

  attendeeName: {

    ...typography.body,
    fontSize: 17,
    fontWeight: "500",
    color: "#222",
  },

  attendeeEmail: {
    ...typography.body,
    fontSize: 14,
    color: "#777",
    marginTop: 2,
    
  },


  sectionTitle: {
    ...typography.body,
    marginTop: 16,
    fontSize: 16,
    fontWeight: "500",
    
  },

  checkInButton: {
    ...typography.body,
    alignSelf: "flex-start",
    
  },

  item: {
    ...typography.body,
    fontSize: 18,
    padding: 10,
  },

  tab: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#F1F1F1",
    marginHorizontal: 10,
  },

  tabActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
searchWrapper: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#EFEFEF',
  borderRadius: 12,
  paddingHorizontal: 12,
  marginBottom: 14,
},
searchIcon: {
  marginRight: 8,
},
searchBar: {
  ...typography.body,
  flex: 1,
  height: 46,
  fontSize: 16,
},
});