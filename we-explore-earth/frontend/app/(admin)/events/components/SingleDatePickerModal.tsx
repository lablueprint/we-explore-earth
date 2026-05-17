import React from 'react';
import { Modal, Pressable } from 'react-native';
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

function SingleDatePickerModal (
    {
        date,
        setDate,
        calendarVisible,
        setCalendarVisible,
        minDate
    }
    :
    {
        date: Date,
        setDate: React.Dispatch<Date>,
        calendarVisible: boolean,
        setCalendarVisible: React.Dispatch<boolean>,
        minDate?: Date
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
        const { dateString } = selectedDate; // corresponds to the date the user tapped on the calendar

        // Create normalized Date object from date string with respect to local timezone
        const [year, month, day] = dateString.split('-').map(Number);
        const localDate = new Date(year, month - 1, day, 0, 0, 0, 0);

        // Set date to the date the user tapped on the calendar
        setDate(localDate);
        setCalendarVisible(false);
    };

    const getMarkedDates = () => {
        const marked: any = {}; // type MarkedDates: maps date strings in "YYYY-MM-DD" format to type MarkingProps (in imported Calendar component's docs)
        const key = getLocalDateString(date);
        marked[key] = { customStyles: dateRangeStyles.singleDay };        
        return marked;
    };

    return (
        <Modal
            transparent={true}
            animationType='fade'
            visible={calendarVisible}
            onRequestClose={() => setCalendarVisible(false)}
        >
            <Pressable style={calendarStyles.centeredView} onPress={() => setCalendarVisible(false)}>
                <Pressable style={calendarStyles.modalView}>
                    <Calendar
                        minDate={minDate ? getLocalDateString(minDate) : getLocalDateString(new Date())}
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
                            // if there is no minDate, then today is the minDate
                            // if today is on or after minDate, then today is enabled and colored black; otherwise, today is disabled and colored gray
                            todayTextColor: !minDate || (getLocalDateString(new Date()) >= getLocalDateString(minDate)) ? '#000000' : '#B2B2B2',
                            dayTextColor: '#000000', // for all non-disabled days excluding today
                            textDisabledColor: '#B2B2B2', // for disabled days (all days before current day)
                        }}
                    />
                </Pressable>
            </Pressable>
        </Modal>
    );
};

export default SingleDatePickerModal;