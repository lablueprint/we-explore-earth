import React from 'react';
import { View } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { dateRangeStyles, calendarStyles } from './styles';

// Configure 2-letter day names for calendar (e.g., 'Su', 'Mo', etc.)
LocaleConfig.locales['en'] = {
    monthNames: [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ],
    dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    dayNamesShort: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
};
LocaleConfig.defaultLocale = 'en';

function DateRangePickerModal (
    {
        startDate,
        endDate,
        setStartDate,
        setEndDate,
        setSelectedDate, // selected date option (not a date)
        setShowInvalidDateRangeMessage
    }
    :
    {
        startDate: Date | undefined,
        endDate: Date | undefined,
        setStartDate: React.Dispatch<Date | undefined>,
        setEndDate: React.Dispatch<Date | undefined>,
        setSelectedDate: React.Dispatch<string>,
        setShowInvalidDateRangeMessage: React.Dispatch<boolean>
    }
) {
    // For converting Date objects (e.g., `startDate`, `endDate`) to date strings (YYYY-MM-DD) wrt local timezone
    const getLocalDateString = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const onDayPress = (selectedDate: any) => {
        setSelectedDate('Custom');
        setShowInvalidDateRangeMessage(false);

        const { dateString } = selectedDate; // corresponds to the date the user tapped on the calendar

        // Create normalized Date object from date string with respect to local timezone
        const [year, month, day] = dateString.split('-').map(Number);
        const localDate = new Date(year, month - 1, day, 0, 0, 0, 0);

        // Reset range if no range is defined (default: 'Any date'), if range is defined, or if user picks a date before the start
        if ((!startDate && !endDate) || (startDate && endDate) || (startDate && dateString < getLocalDateString(startDate))) {
            setStartDate(localDate);
            setEndDate(undefined);
        } else {
            setEndDate(localDate);
        }
    };

    const getMarkedDates = () => {
        const marked: any = {}; // type MarkedDates: maps date strings in "YYYY-MM-DD" format to type MarkingProps (in imported Calendar component's docs)
        const startKey = startDate ? getLocalDateString(startDate) : '';
        const endKey = endDate ? getLocalDateString(endDate) : '';
        
        // Start and end dates are both selected
        if (startDate && endDate) {
            // Single date range
            if (startKey == endKey) {
                marked[startKey] = { customStyles: dateRangeStyles.singleDay };
            }
            // Multi date range
            else {
                // Fill in the gap between start and end
                const middleDate = new Date(startDate);
                while (middleDate < endDate!) {
                    middleDate.setDate(middleDate.getDate() + 1);
                    const middleKey = getLocalDateString(middleDate);
                    marked[middleKey] = { customStyles: dateRangeStyles.middleDay };
                }
                
                // Start and end date have unique styles
                marked[startKey] = { customStyles: dateRangeStyles.startDay };
                marked[endKey] = { customStyles: dateRangeStyles.endDay };
            }
        }
        // Only start date is selected
        else if (startDate) {
            marked[startKey] = { customStyles: dateRangeStyles.startDay };
        }
        
        return marked;
    };

    return (
        <View style={calendarStyles.wrapper}>
            <Calendar
                minDate={getLocalDateString(new Date())}
                markingType={'custom'}
                markedDates={getMarkedDates()}
                onDayPress={onDayPress}
                enableSwipeMonths={true}
                style={{
                    width: 322,
                }}
                theme={{
                    calendarBackground: '#F0F0F0',
                    arrowColor: '#888888', // arrows for switching between months
                    // for 'Month YYYY' at the top
                    textMonthFontFamily: 'HankenGrotesk-Regular',
                    textMonthFontSize: 16,
                    textMonthFontWeight: 500,
                    monthTextColor: '#181818',
                    // for day headers (e.g., 'Su', 'Mo', etc.)
                    textDayHeaderFontFamily: 'HankenGrotesk-Regular',
                    textDayHeaderFontSize: 10,
                    textDayHeaderFontWeight: 400,
                    textSectionTitleColor: '#181818',
                    // for each day of the month
                    textDayFontFamily: 'HankenGrotesk-Regular',
                    textDayFontSize: 12,
                    textDayFontWeight: 400,
                    todayTextColor: '#000000',
                    dayTextColor: '#000000', // for all non-disabled days excluding today
                    textDisabledColor: '#B2B2B2', // for disabled days (all days before current day)
                } as any}
            />
        </View>
    );
};

export default DateRangePickerModal;