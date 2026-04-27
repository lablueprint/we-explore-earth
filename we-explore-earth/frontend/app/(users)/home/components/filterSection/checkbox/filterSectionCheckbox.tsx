import { View, Text, TouchableOpacity } from 'react-native';
import { Checkbox } from 'expo-checkbox';
import { styles } from './styles';

function FilterOptionCheckbox(
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
) {
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
        <View style={styles.filterOptionWrapper}>
            <Text style={styles.filterOption}>{option}</Text>
            <Checkbox
                value={selectedOptions.has(option)}
                onValueChange={handleCheck}
                color={selectedOptions.has(option) ? 'black' : 'mediumgrey'}
            />
        </View>
    )
}

function FilterSectionCheckbox(
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
            <View style={styles.filterHeaderWrapper}>
                <Text style={styles.filterHeader}>{header}</Text>
                <TouchableOpacity onPress={handleReset}>
                    <Text style={styles.reset}>Reset</Text>
                </TouchableOpacity>
            </View>

            {/** Filter options */}
            {options.map((option, index) => 
                <FilterOptionCheckbox
                    key={index}
                    option={option}
                    selectedOptions={selectedOptions}
                    setSelectedOptions={setSelectedOptions}
                />
            )}
        </>
    )
}

export default FilterSectionCheckbox;