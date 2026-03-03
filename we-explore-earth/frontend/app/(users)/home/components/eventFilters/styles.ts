import { StyleSheet } from 'react-native';

// Filter component styles
export const filterStyles = StyleSheet.create({
    filterTitle: {
        fontWeight: 700, /** bold */
        fontSize: 32,
    },
    filterHeaderWrapper:{
        marginTop: 24,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
    },
    filterHeader: {
        fontWeight: 700, /** bold */
        fontSize: 24,
    },
    reset: {
        color: 'mediumgrey',
        textDecorationLine: 'underline',
    },
    filterOptionWrapper: {
        marginTop: 12,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    filterOption: {
        fontWeight: 600, /** semi-bold */
        fontSize: 16,
    },
    submit: {
        marginTop: 24,
        padding: 4,
        borderRadius: 4,
        backgroundColor: 'lightgrey',
    },
    submitText: {
        textAlign: 'center',
        fontWeight: 700, /** bold */
        fontSize: 16,
        color: '#3c3b3b',
    },
    // TODO: Placeholder styles for (calendar picker) modal.
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        margin: 20,
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    // ---------------------------------------------
});

// Calendar picker styles (for the calendar picker, not its modal)

// TODO: Placeholder colors for calendar picker.
const SELECTED_EDGE_COLOR = '#50cebb';
const SELECTED_MIDDLE_COLOR = '#70d7c7';
const SELECTED_TEXT_COLOR = '#ffffff';
// ---------------------------------------------

const baseContainerStyle = {
    height: 34,
    width: 38,
    justifyContent: 'center',
    alignItems: 'center',
};

export const calendarStyles = {
    // TODO: Placeholder colors for calendar picker.
    todayColor: '#e67e22',
    arrowColor: '#000000',
    // ---------------------------------------------
    startDay: {
        container: {
            ...baseContainerStyle,
            backgroundColor: SELECTED_EDGE_COLOR,
            borderRadius: 0,
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
        },
        text: {
            color: SELECTED_TEXT_COLOR
        },
    },
    endDay: {
        container: {
            ...baseContainerStyle,
            backgroundColor: SELECTED_EDGE_COLOR,
            borderRadius: 0,
            borderTopRightRadius: 16,
            borderBottomRightRadius: 16,
        },
        text: {
            color: SELECTED_TEXT_COLOR
        },
    },
    singleDay: {
        container: {
            ...baseContainerStyle,
            backgroundColor: SELECTED_EDGE_COLOR,
            borderRadius: 16,
        },
        text: {
            color: SELECTED_TEXT_COLOR
        },
    },
    middleDay: {
        container: {
            ...baseContainerStyle,
            backgroundColor: SELECTED_MIDDLE_COLOR,
            borderRadius: 0,
        },
        text: {
            color: SELECTED_TEXT_COLOR
        },
    },
};