import { useState, useEffect } from 'react';
import { Modal, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import FilterSectionCheckbox from '../filterSection/checkbox/filterSectionCheckbox';
import FilterSectionRadio from '../filterSection/radio/filterSectionRadio';
import FilterSectionTile from '../filterSection/tile/filterSectionTile';
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
    const dateOptions : Array<string> = ['Any date', 'Today', 'Tomorrow', 'This week', 'This weekend', 'Custom'];
    const [selectedDate, setSelectedDate] = useState<string>(dateOptions[0]);
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);

    const [categoryOptions, setCategoryOptions] = useState<Array<string>>([]);
    const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());

    const eventPriceOptions : Array<string> = ['Any price', 'Free events only', 'Up to $25', 'Up to $50']; // default option = first option
    const [selectedEventPrice, setSelectedEventPrice] = useState<string>(eventPriceOptions[0]);

    const [accommodationOptions, setAccommodationOptions] = useState<Array<string>>([]);
    const [selectedAccommodations, setSelectedAccommodations] = useState<Set<string>>(new Set());

    const [calendarVisible, setCalendarVisible] = useState<boolean>(false);

    const handleClear = () => {
        // Reset all filters: deselect all options or select default options
        setSelectedDate(dateOptions[0]);
        setSelectedCategories(new Set());
        setSelectedEventPrice(eventPriceOptions[0]);
        setSelectedAccommodations(new Set());
    }

    const handleSubmit = () => {
        const result: Filter = {}

        // ===========================================================================================
        // Date Filter
        // ===========================================================================================
        // valid date range selected
        if(startDate && endDate) {
            result.startDate = startDate;
            result.endDate = endDate;
        }

        // ===========================================================================================
        // Category Filter
        // ===========================================================================================
        // at least 1 category is selected
        if(selectedCategories && selectedCategories.size) {
            result.categories = [...selectedCategories];
        }

        // ===========================================================================================
        // Event Price Filter
        // ===========================================================================================
        // Convert selected event price option to numerical inclusive upper bound
        switch (selectedEventPrice) {
            case 'Free events only':
                result.maxEventPrice = 0;
                break;
            case 'Up to $25':
                result.maxEventPrice = 25;
                break;
            case 'Up to $50':
                result.maxEventPrice = 50;
                break;
            case 'Any price':
            default: // (default == any price)
                result.maxEventPrice = undefined;
                break;
        }
        
        // ===========================================================================================
        // Accommodation Filter
        // ===========================================================================================
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

    useEffect(() => {
        // Compute start and end dates.
        var newStartDate : Date = new Date();
        var newEndDate : Date | undefined = new Date();
        const today = new Date();

        switch (selectedDate) {
            case 'Today':  // startDate == endDate == current day
                break;
            case 'Tomorrow':  // startDate == endDate == next day
                newStartDate.setDate(today.getDate() + 1);
                newEndDate.setDate(today.getDate() + 1);
                break;
            case 'This week':  // Monday to Sunday of current week
                var day = today.getDay();
                newStartDate.setDate(today.getDate() - day + 1);    // Start of the week (Monday)
                newEndDate.setDate(today.getDate() + (6-day) + 1);  // End of the week (Sunday)
                break;
            case 'This weekend':  // Saturday to Sunday of current week
                var day = today.getDay();
                newStartDate.setDate(today.getDate() + (7-day-1));
                newEndDate.setDate(today.getDate() + (7-day));
                break;
            case 'Custom':
                setCalendarVisible(true);
                return;
            case 'Any date':  // startDate == current day, endDate == undefined (range = today and on)
            default:
                newEndDate = undefined;
                break;
        }

        newStartDate.setHours(0, 0, 0, 0);   // normalize start date
        newEndDate?.setHours(0, 0, 0, 0);    // normalize end date
        today.setHours(0, 0, 0, 0);          // normalize current date

        // lower bound = current date
        if(newStartDate < today) {
            newStartDate = today;
        }
        // end date will never precede current date

        setStartDate(newStartDate);
        setEndDate(newEndDate);
        // console.log(selectedDate, '  Start Date:', newStartDate.toDateString(), '  End Date:', newEndDate?.toDateString())
    }, [selectedDate]);

    return(
        <Modal
            visible={filterModalVisible}
            transparent={true}
            animationType='slide'
            onRequestClose={() => { setFilterModalVisible(false); }}
        >
            <ScrollView style={{flex: 1, backgroundColor: 'white', paddingTop: 80, paddingHorizontal: 20}}>
                <View style={styles.filterTitleCloseWrapper}>
                    <Text style={styles.filterTitle}>Filter</Text>
                    <TouchableOpacity onPress={() => { setFilterModalVisible(false); }}>
                        <AntDesign name="close" size={24} color="#181818" />
                    </TouchableOpacity>
                </View>
                
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
                <View style={styles.selectDateDateChipWrapper}>
                    {/** Button to toggle view of calendar */}
                    <TouchableOpacity
                        onPress={() => { setCalendarVisible(!calendarVisible); }}
                        style={styles.selectDateWrapper}
                    >
                        <Text style={styles.selectDateText}>Select a date</Text>
                        {calendarVisible ?
                            <Entypo name="chevron-thin-up" size={16} color="#000000" />
                        :
                            <Entypo name="chevron-thin-down" size={16} color="#000000" />
                        }
                    </TouchableOpacity>
                    {/** Display date chips only if calendar is visible */}
                    {calendarVisible &&
                        <View style={styles.dateChipContainer}>
                            {/** Display selected start date */}
                            <View style={styles.dateChipWrapper}>
                                <Text style={styles.dateChipText}>{startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) }</Text>
                            </View>
                            {/** Display selected end date */}
                            <View style={styles.dateChipWrapper}>
                                <Text style={styles.dateChipText}>{endDate?.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</Text>
                            </View>
                        </View>
                    }
                </View>
                {calendarVisible && 
                    <DateRangePickerModal
                        startDate={startDate}
                        endDate={endDate}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                        setSelectedDate={setSelectedDate}
                    />
                }

                {categoryOptions && categoryOptions.length >= 0 &&
                    <FilterSectionTile
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
                    <FilterSectionCheckbox
                        header='Accommodations'
                        options={accommodationOptions}
                        selectedOptions={selectedAccommodations}
                        setSelectedOptions={setSelectedAccommodations}
                    />
                }

                <View style={styles.clearSubmitWrapper}>
                    <TouchableOpacity onPress={handleClear}>
                        <Text style={styles.clearText}>Clear filters</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.submit}
                        onPress={handleSubmit}
                    >
                        <Text style={styles.submitText}>Apply filters</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </Modal>
    );
}

export default EventFiltersModal;