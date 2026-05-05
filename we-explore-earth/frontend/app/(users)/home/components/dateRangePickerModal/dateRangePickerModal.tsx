import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { calendarStyles, modalStyles } from './styles';

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
    // TODO: Replace status by checking existence of startDate and endDate? May fix bug where getMarkedDates is called twice every time the selected date option changes.
    const [status, setStatus] = useState({ start: !!startDate, end: !!endDate });

    // For converting Date objects (e.g., `startDate`, `endDate`) to date strings (YYYY-MM-DD) wrt local timezone
    const getLocalDateString = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        setStatus({ start: !!startDate, end: !!endDate });  // to capture changes to selected date option filter
    }, [startDate, endDate])

    const onDayPress = (selectedDate: any) => {
        setSelectedDate('Custom');
        setShowInvalidDateRangeMessage(false);

        const { dateString } = selectedDate; // corresponds to the date the user tapped on the calendar

        // Create normalized Date object from date string with respect to local timezone
        const [year, month, day] = dateString.split('-').map(Number);
        const localDate = new Date(year, month - 1, day, 0, 0, 0, 0);

        // Reset range if no range is defined (default: 'Any date'), if range is defined, or if user picks a date before the start
        if ((!status.start && !status.end) || (status.start && status.end) || dateString < getLocalDateString(startDate)) {
            setStartDate(localDate);
            setEndDate(undefined);
            setStatus({ start: true, end: false });
        } else {
            setEndDate(localDate);
            setStatus({ start: true, end: true });
        }
    };

    const getMarkedDates = () => {
        const marked: any = {}; // type MarkedDates: maps date strings in "YYYY-MM-DD" format to type MarkingProps (in imported Calendar component's docs)
        const startKey = startDate ? getLocalDateString(startDate) : '';
        const endKey = endDate ? getLocalDateString(endDate) : '';
        
        // Start and end dates are both selected
        if (status.start && status.end) {
            // Single date range
            if (startKey == endKey) {
                marked[startKey] = { customStyles: calendarStyles.singleDay };
            }
            // Multi date range
            else {
                // Fill in the gap between start and end
                const middleDate = new Date(startDate);
                while (middleDate < endDate!) {
                    middleDate.setDate(middleDate.getDate() + 1);
                    const middleKey = getLocalDateString(middleDate);
                    marked[middleKey] = { customStyles: calendarStyles.middleDay };
                }
                
                // Start and end date have unique styles
                marked[startKey] = { customStyles: calendarStyles.startDay };
                marked[endKey] = { customStyles: calendarStyles.endDay };
            }
        }
        // Only start date is selected
        else if (status.start) {
            marked[startKey] = { customStyles: calendarStyles.startDay };
        }
        
        return marked;
    };

    return (
        <View style={modalStyles.wrapper}>
            <Calendar
                minDate={getLocalDateString(new Date())}
                markingType={'custom'}
                markedDates={getMarkedDates()}
                onDayPress={onDayPress}
                theme={{
                    calendarBackground: '#F0F0F0',
                    todayTextColor: calendarStyles.todayColor,
                    arrowColor: calendarStyles.arrowColor,
                }}
            />
        </View>
    );
};

export default DateRangePickerModal;