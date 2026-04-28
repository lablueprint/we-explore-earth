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
    }
    :
    {
        startDate: Date,
        endDate: Date | undefined,
        setStartDate: React.Dispatch<any>,
        setEndDate: React.Dispatch<any>,
        setSelectedDate: React.Dispatch<any>,
    }
) {
    // TODO: When using this range, validate it. Must have a valid start and end date.
    // TODO: Disable selecting dates before the current day.

    // TODO: Replace status by checking existence of startDate and endDate? May fix bug where getMarkedDates is called twice every time the selected date option changes.
    const [status, setStatus] = useState({ start: true, end: !!endDate });

    useEffect(() => {
        setStatus({ start: true, end: !!endDate });  // to capture changes to selected date option filter
    }, [endDate])

    const onDayPress = (selectedDate: any) => {
        // TODO: bug: Any date -> Custom: next selected date should be start, not end date
        setSelectedDate('Custom');
        const { dateString } = selectedDate;

        // Reset range if range is defined or if user picks a date before the start
        if ((status.start && status.end) || dateString < startDate.toISOString().split('T')[0]) {
            setStartDate(new Date(dateString));
            setEndDate(undefined);
            setStatus({ start: true, end: false });
        } else {
            setEndDate(new Date(dateString));
            setStatus({ start: true, end: true });
        }
    };

    const getMarkedDates = () => {
        const marked: any = {}; // type MarkedDates: maps date strings in "YYYY-MM-DD" format to type MarkingProps (in imported Calendar component's docs)
        const startKey = startDate.toISOString().split('T')[0];
        const endKey = endDate?.toISOString().split('T')[0] || '';
        
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
                    const middleKey = middleDate.toISOString().split('T')[0];
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
        <View style={modalStyles.centeredView}>
            <View style={modalStyles.modalView}>
                <Calendar
                    markingType={'custom'}
                    markedDates={getMarkedDates()}
                    onDayPress={onDayPress}
                    theme={{
                        todayTextColor: calendarStyles.todayColor,
                        arrowColor: calendarStyles.arrowColor,
                    }}
                />
            </View>
        </View>
    );
};

export default DateRangePickerModal;