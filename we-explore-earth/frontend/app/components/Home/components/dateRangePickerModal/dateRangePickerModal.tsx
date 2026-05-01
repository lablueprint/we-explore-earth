import { useState } from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { calendarStyles, modalStyles } from './styles';

function DateRangePickerModal (
    {
        calendarVisible,
        setCalendarVisible
    }
    :
    {
        calendarVisible: boolean,
        setCalendarVisible: React.Dispatch<any>
    }
) {
    // TODO: When using this range, validate it. Must have a valid start and end date.
    // TODO: Disable selecting dates before the current day.
    // TODO: Disable submit button if the date range is invalid!
    const [range, setRange] = useState({ start: '', end: '' });

    const onDayPress = (day: any) => {
        const { dateString } = day;

        // Reset range if range is defined or if user picks a date before the start
        if (!range.start || (range.start && range.end) || dateString < range.start) {
            setRange({ start: dateString, end: '' });
        } else {
            setRange({ ...range, end: dateString });
        }
    };

    const getMarkedDates = () => {
        const marked: any = {}; // type MarkedDates: maps strings to type MarkingProps (in imported Calendar component's docs)
        
        // Start and end dates are both selected
        if (range.start && range.end) {
            // Single date range
            if (range.start == range.end) {
                marked[range.start] = { customStyles: calendarStyles.singleDay };
            }
            // Multi date range
            else {
                marked[range.start] = { customStyles: calendarStyles.startDay };
                marked[range.end] = { customStyles: calendarStyles.endDay };
                
                // Fill in the gap between start and end
                let start = new Date(range.start);
                let end = new Date(range.end);
                while (start < end) {
                    start.setDate(start.getDate() + 1);
                    const dateString = start.toISOString().split('T')[0];
                    if (dateString !== range.end) {
                        marked[dateString] = { customStyles: calendarStyles.middleDay };
                    }
                }
            }
        }
        // Only start date is selected
        else if (range.start) {
            marked[range.start] = { customStyles: calendarStyles.startDay };
        }

        return marked;
    };

    return (
        <Modal
            animationType='slide'
            transparent={true}
            visible={calendarVisible}
            onRequestClose={() => { setCalendarVisible(false); }}
        >
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
                    {/** TODO: Placeholder text with placeholder style for closing calendar picker. */}
                    <TouchableOpacity onPress={() => { setCalendarVisible(false); }} style={modalStyles.submit}>
                        <Text style={modalStyles.submitText}>Set date range</Text>
                    </TouchableOpacity>
                    {/** -------------------------------------------------------------------------- */}
                </View>
            </View>
        </Modal>
    );
};

export default DateRangePickerModal;