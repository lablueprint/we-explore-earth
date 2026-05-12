import { StyleSheet } from 'react-native';

// Date range styles (for calendar that's imported from 'react-native-calendar')
const SELECTED_BACKGROUND_COLOR = '#D6E6CB';
const SELECTED_EDGE_BORDER_RADIUS = 50;
const SELECTED_EDGE_CIRCLE_COLOR = '#507C30';
const SELECTED_EDGE_TEXT_COLOR = '#FCFCFC';
const SELECTED_MIDDLE_TEXT_COLOR = '#2B2E29';

/* 
 * Width of the calendar is 322, so each day has a width of 46 (322 / 7).
 * Middle days have a background that spans the entire width.
 * Edge days have a background that spans 70% of the width.
 */
const RANGE_DAY_WIDTH = 46;
const SELECTED_EDGE_BACKGROUND_WIDTH = Math.round(RANGE_DAY_WIDTH * 0.7);
const EDGE_PADDING = RANGE_DAY_WIDTH - SELECTED_EDGE_BACKGROUND_WIDTH;

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
    startDay: {
        container: {
            ...baseContainerStyle,
            borderTopLeftRadius: SELECTED_EDGE_BORDER_RADIUS,
            borderBottomLeftRadius: SELECTED_EDGE_BORDER_RADIUS,
            marginRight: -EDGE_PADDING,  // Shifts background to the right so that the circle overlay can be on the left edge of the day
        },
        text: {
            ...edgeCircleStyle,
            marginRight: EDGE_PADDING, // Shifts text (day number) to the left so that the text does not shift with the container and remains centered with the day of the week 
        }
    },
    endDay: {
        container: {
            ...baseContainerStyle,
            borderTopRightRadius: SELECTED_EDGE_BORDER_RADIUS,
            borderBottomRightRadius: SELECTED_EDGE_BORDER_RADIUS,
            marginLeft: -EDGE_PADDING,  // Shifts background to the left so that the circle overlay can be on the right edge of the day
        },
        text: {
            ...edgeCircleStyle,
            marginLeft: EDGE_PADDING,  // Shifts text (day number) to the right so that the text does not shift with the container and remains centered with the day of the week
        }
    },
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
    middleDay: {
        container: {
            ...baseContainerStyle,
        },
        text: {
            color: SELECTED_MIDDLE_TEXT_COLOR,
        }
    },
};

// Modal styles (parent container of the calendar)
export const calendarStyles = StyleSheet.create({
    wrapper: {
        marginTop: 12,
        padding: 16,
        width: 354,
        alignSelf: 'center',
        backgroundColor: '#F0F0F0',
        borderWidth: 1,
        borderRadius: 20,
        borderColor: '#DEDEDE',
        elevation: 5,
    },
})