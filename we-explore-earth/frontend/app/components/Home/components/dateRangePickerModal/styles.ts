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

/* TODO: Modal styles (placeholder)
* - Widen the calendar
* - Distinguish disabled dates from each month's extra dates
*/
export const modalStyles = StyleSheet.create({
    wrapper: {
        marginTop: 12,
        padding: 16,
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
        borderWidth: 1,
        borderRadius: 20,
        borderColor: '#DEDEDE',
        elevation: 5,
    },
})