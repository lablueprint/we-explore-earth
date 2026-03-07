import { StyleSheet } from 'react-native';

// Calendar styles (not the modal)

// TODO: Placeholder colors for calendar.
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
    // TODO: Placeholder colors for calendar.
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

// TODO: Modal styles (placeholder)
export const modalStyles = StyleSheet.create({
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
})