import { useState, useEffect } from 'react';
import { Modal, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import FilterSection from '../filterSection/filterSection';
import FilterSectionRadio from '../filterSectionRadio/filterSectionRadio';
import DateRangePickerModal from '../dateRangePickerModal/dateRangePickerModal';
import { Filter } from '@shared/types/filter';
import { styles } from './styles';

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
    const dateOptions : Array<string> = ['Any date', 'Today', 'Tomorrow', 'This week', 'This weekend'];
    const [selectedDate, setSelectedDate] = useState<string>(dateOptions[0]);

    const [categoryOptions, setCategoryOptions] = useState<Array<string>>([]);
    const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());

    const eventPriceOptions : Array<string> = ['Any price', 'Free events only', 'Up to $25', 'Up to $50']; // default option = first option
    const [selectedEventPrice, setSelectedEventPrice] = useState<string>(eventPriceOptions[0]);

    const [accommodationOptions, setAccommodationOptions] = useState<Array<string>>([]);
    const [selectedAccommodations, setSelectedAccommodations] = useState<Set<string>>(new Set());

    const [calendarVisible, setCalendarVisible] = useState<boolean>(false);

    const handleSubmit = () => {
        // Compute start and end dates.
        const startDate : Date = new Date();
        var endDate : Date | undefined = new Date();
        const today = new Date();

        switch (selectedDate) {
            case 'Any date':  // startDate == current day, endDate == undefined (range = today and on)
                endDate = undefined;
                break;
            case 'Today':  // startDate == endDate == current day
                break;
            case 'Tomorrow':  // startDate == endDate == next day
                startDate.setDate(today.getDate() + 1);
                endDate.setDate(today.getDate() + 1);
                break;
            case 'This week':  // Monday to Sunday of current week
                var day = today.getDay();
                startDate.setDate(today.getDate() - day + 1);    // Start of the week (Monday)
                endDate.setDate(today.getDate() + (6-day) + 1);  // End of the week (Sunday)
                break;
            case 'This weekend':  // Saturday to Sunday of current week
                var day = today.getDay();
                startDate.setDate(today.getDate() + (7-day-1));
                endDate.setDate(today.getDate() + (7-day));
                break;
            default:
                break;
        }

        const result: Filter = {}
        // valid date range selected
        console.log(selectedDate, '  Start Date:', startDate.toDateString(), '  End Date:', endDate?.toDateString())
        if(startDate && endDate) {
            result.startDate = startDate;
            result.startDate.setHours(0, 0, 0, 0);  // normalize start date
            result.endDate = endDate;
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
        // 1 event price option selected at all times (default = any price)
        result.eventPrice = selectedEventPrice;
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
            <ScrollView style={{flex: 1, backgroundColor: 'white', paddingTop: 80, paddingHorizontal: 20}}>
                <Text style={styles.filterTitle}>Filter</Text>
                
                {dateOptions && dateOptions.length >= 0 &&
                    <FilterSectionRadio
                        header='Date'
                        defaultOption={dateOptions[0]}
                        options={dateOptions}
                        selectedOption={selectedDate}
                        setSelectedOption={setSelectedDate}
                    />
                }

                {/** Calendar Picker Modal */}
                <View style={styles.filterOptionWrapper}>
                    <Text style={styles.filterOption}>Choose a date range</Text>
                    <TouchableOpacity onPress={() => { setCalendarVisible(true); }}>
                        <Feather name='chevron-right' size={24} color='black' />
                    </TouchableOpacity>
                </View>
                <DateRangePickerModal
                    calendarVisible={calendarVisible}
                    setCalendarVisible={setCalendarVisible}
                />

                {categoryOptions && categoryOptions.length >= 0 &&
                    <FilterSection
                        header='Categories'
                        options={categoryOptions}
                        selectedOptions={selectedCategories}
                        setSelectedOptions={setSelectedCategories}
                    />
                }

                {eventPriceOptions && eventPriceOptions.length >= 0 &&
                    <FilterSectionRadio
                        header='Event Price'
                        defaultOption={eventPriceOptions[0]}
                        options={eventPriceOptions}
                        selectedOption={selectedEventPrice}
                        setSelectedOption={setSelectedEventPrice}
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
                    style={styles.submit}
                    onPress={handleSubmit}
                >
                    <Text style={styles.submitText}>Submit</Text>
                </TouchableOpacity>
            </ScrollView>
        </Modal>
    );
}

export default EventFiltersModal;