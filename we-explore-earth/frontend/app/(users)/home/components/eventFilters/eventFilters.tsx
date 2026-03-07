import { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { Checkbox } from 'expo-checkbox';
import { Calendar } from 'react-native-calendars';
import Feather from '@expo/vector-icons/Feather';
import { Filter } from '@shared/types/filter';
import { filterStyles, calendarStyles } from './styles';

const RangeCalendar = () => {
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
        <Calendar
            markingType={'custom'}
            markedDates={getMarkedDates()}
            onDayPress={onDayPress}
            theme={{
                todayTextColor: calendarStyles.todayColor,
                arrowColor: calendarStyles.arrowColor,
            }}
        />
    );
};

function FilterSection(
    {
        header,
        options,
        selectedOptions,
        setSelectedOptions
    }
    :
    {
        header: string,
        options: string[],
        selectedOptions: Set<string>,
        setSelectedOptions: React.Dispatch<any>
    }
) {
    const handleReset = () => {
        setSelectedOptions(new Set());
    }

    return (
        <>
            {/** Filter header */}
            <View style={filterStyles.filterHeaderWrapper}>
                <Text style={filterStyles.filterHeader}>{header}</Text>
                <TouchableOpacity onPress={handleReset}>
                    <Text style={filterStyles.reset}>Reset</Text>
                </TouchableOpacity>
            </View>

            {/** Filter options */}
            {options.map((option, index) => 
                <FilterOption
                    key={index}
                    option={option}
                    selectedOptions={selectedOptions}
                    setSelectedOptions={setSelectedOptions}
                />
            )}
        </>
    )
}

function FilterOption(
    {
        option,
        selectedOptions,
        setSelectedOptions
    }
    :
    {
        option: string,
        selectedOptions: Set<string>,
        setSelectedOptions: React.Dispatch<any>
    }
){
    const handleCheck = () => {
        const updated = new Set(selectedOptions);
        // handle unchecking the box
        if(selectedOptions.has(option)) {
            updated.delete(option);
            setSelectedOptions(updated);
        }
        // handle checking the box
        else {
            updated.add(option);
            setSelectedOptions(updated);
        }
    }

    return(
        <View style={filterStyles.filterOptionWrapper}>
            <Text style={filterStyles.filterOption}>{option}</Text>
            <Checkbox
                value={selectedOptions.has(option)}
                onValueChange={handleCheck}
                color={selectedOptions.has(option) ? 'black' : 'mediumgrey'}
            />
        </View>
    )
}

function EventFiltersModal(
    {
        setFilters,
        filterModalVisible,
        setFilterModalVisible,
    }
    :
    {
        setFilters: React.Dispatch<any>,
        filterModalVisible: boolean,
        setFilterModalVisible: React.Dispatch<any>
    }
) {
    const [dateOptions, _] = useState<Array<string>>(['Today', 'Tomorrow', 'This Week', 'This Month']);
    const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());

    const [categoryOptions, setCategoryOptions] = useState<Array<string>>([]);
    const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());

    const [accommodationOptions, setAccommodationOptions] = useState<Array<string>>([]);
    const [selectedAccommodations, setSelectedAccommodations] = useState<Set<string>>(new Set());

    const [calendarVisible, setCalendarVisible] = useState<boolean>(false);

    const handleSubmit = () => {
        // Compute start and end dates.
        let startDate : Date | undefined = undefined;
        let endDate : Date | undefined = undefined;
        const today = new Date();

        selectedDates.forEach((option) => {
            let newStartDate : Date = new Date();
            let newEndDate : Date = new Date();
            switch (option) {
                case 'Today':
                    break;
                case 'Tomorrow':
                    newStartDate.setDate(today.getDate() + 1);
                    newEndDate.setDate(today.getDate() + 1);
                    break;
                case 'This Week':
                    const day = today.getDay();
                    newStartDate.setDate(today.getDate() - day);    // Start of the week (Sunday)
                    newEndDate.setDate(today.getDate() + (6-day));  // End of the week (Saturday)
                    break;
                case 'This Month':
                    newStartDate.setDate(1);            // First day of the month
                    const numberOfDays = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
                    newEndDate.setDate(numberOfDays);   // Last day of the month
                default:
                    break;
            }
            startDate = startDate ? new Date(Math.min(startDate.getTime(), newStartDate.getTime())) : newStartDate;
            endDate = endDate ? new Date(Math.max(endDate.getTime(), newEndDate.getTime())) : newEndDate;
        })

        const result: Filter = {}
        // valid date range selected
        if(startDate && endDate) {
            result.startDate = startDate as Date;
            result.startDate.setHours(0, 0, 0, 0);  // normalize start date
            result.endDate = endDate as Date;
            result.endDate.setHours(0, 0, 0, 0);    // normalize end date

            today.setHours(0, 0, 0, 0); // normalize current date

            // lower bound = current date
            if(result.startDate < today) {
                result.startDate = today;
            }
            // end date will never precede current date
        }
        // at least 1 category is selected
        if(selectedCategories && selectedCategories.size) {
            result.categories = [...selectedCategories];
        }
        // at least 1 accommodation is selected
        if(selectedAccommodations && selectedAccommodations.size) {
            result.accommodations = [...selectedAccommodations];
        }
        setFilters(result);

        setFilterModalVisible(false); // close filter panel
    }

    async function retrieveCategories() {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/config/categories`, { method: 'GET' });
            const data = await response.json();

            if(!response.ok) {
                throw new Error(data.error || "Failed to fetch categories");
            }

            setCategoryOptions(Array.isArray(data.category) ? data.category : []);
        }
        catch (error: any) {
            console.log(error instanceof Error ? error.message : "Failed to fetch categories");
        }
    }

    async function retrieveAccommodations() {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/config/accommodations`, { method: 'GET' });
            const data = await response.json();

            if(!response.ok) {
                throw new Error(data.error || "Failed to fetch accommodations");
            }
            setAccommodationOptions(Array.isArray(data.accommodation) ? data.accommodation : []);
        }
        catch (error: any) {
            console.log(error instanceof Error ? error.message : "Failed to fetch accommodations");
        }
    }

    useEffect(() => {        
        retrieveCategories();       // grab categories from backend
        retrieveAccommodations();   // grab accommodations from backend
    }, []);

    return(
        <Modal
            visible={filterModalVisible}
            transparent={true}
            animationType='slide'
            onRequestClose={() => { setFilterModalVisible(false); }}
        >
            <View style={{flex: 1, backgroundColor: 'white', paddingTop: 80, paddingHorizontal: 20}}>
                <Text style={filterStyles.filterTitle}>Filter</Text>
                
                {dateOptions && dateOptions.length >= 0 &&
                    <FilterSection
                        header='Date'
                        options={dateOptions}
                        selectedOptions={selectedDates}
                        setSelectedOptions={setSelectedDates}
                    />
                }

                {/** Calendar Picker Modal */}
                <View style={filterStyles.filterOptionWrapper}>
                    <Text style={filterStyles.filterOption}>Choose a date range</Text>
                    <TouchableOpacity onPress={() => { setCalendarVisible(true); }}>
                        <Feather name='chevron-right' size={24} color='black' />
                    </TouchableOpacity>
                </View>

                <Modal
                    animationType='slide'
                    transparent={true}
                    visible={calendarVisible}
                    onRequestClose={() => { setCalendarVisible(false); }}
                >
                    <View style={filterStyles.centeredView}>
                        <View style={filterStyles.modalView}>
                            <RangeCalendar/>
                            {/** TODO: Placeholder text with placeholder style for closing calendar picker. */}
                            <TouchableOpacity onPress={() => { setCalendarVisible(false); }} style={filterStyles.submit}>
                                <Text style={filterStyles.submitText}>Set date range</Text>
                            </TouchableOpacity>
                            {/** -------------------------------------------------------------------------- */}
                        </View>
                    </View>
                </Modal>

                {categoryOptions && categoryOptions.length >= 0 &&
                    <FilterSection
                        header='Categories'
                        options={categoryOptions}
                        selectedOptions={selectedCategories}
                        setSelectedOptions={setSelectedCategories}
                    />
                }

                {accommodationOptions && accommodationOptions.length >= 0 &&
                    <FilterSection
                        header='Accommodations'
                        options={accommodationOptions}
                        selectedOptions={selectedAccommodations}
                        setSelectedOptions={setSelectedAccommodations}
                    />
                }

                <TouchableOpacity
                    style={filterStyles.submit}
                    onPress={handleSubmit}
                >
                    <Text style={filterStyles.submitText}>Submit</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
}

export default EventFiltersModal;