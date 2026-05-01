import { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import FilterSection from '../filterSection/filterSection';
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
                <Text style={styles.filterTitle}>Filter</Text>
                
                {dateOptions && dateOptions.length >= 0 &&
                    <FilterSection
                        header='Date'
                        options={dateOptions}
                        selectedOptions={selectedDates}
                        setSelectedOptions={setSelectedDates}
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
            </View>
        </Modal>
    );
}

export default EventFiltersModal;