import { View, Text, TouchableOpacity } from 'react-native';
import { Checkbox } from 'expo-checkbox';
import { styles } from './styles';
import { typography } from '@shared/typography/typography';

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
        setSelectedOptions: React.Dispatch<Set<string>>
    }
) {
    const handleCheck = () => {
        const updated = new Set(selectedOptions);
        // handle unchecking the box
        if(selectedOptions.has(option)) {
            updated.delete(option);
        }
        // handle checking the box
        else {
            updated.add(option);
        }
        setSelectedOptions(updated);
    }

    return(
        <View style={styles.filterOptionWrapper}>
            <Text style={typography.body}>{option}</Text>
            <Checkbox
                value={selectedOptions.has(option)}
                onValueChange={handleCheck}
                color={selectedOptions.has(option) ? '#285F00' : '#D9D9D9'}
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
        setSelectedOptions: React.Dispatch<Set<string>>
    }
) {
    const handleReset = () => {
        setSelectedOptions(new Set());
    }

    return (
        <>
            {/** Filter header */}
            <View style={styles.filterHeaderWrapper}>
                <Text style={[typography.h2, styles.filterHeader]}>{header}</Text>
                <TouchableOpacity onPress={handleReset}>
                    <Text style={[typography.body, styles.reset]}>Reset</Text>
                </TouchableOpacity>
            </View>

            {/** Filter options */}
            <View style={styles.filterOptionContainer}>
                {options.map((option, index) => 
                    <FilterOptionCheckbox
                        key={index}
                        option={option}
                        selectedOptions={selectedOptions}
                        setSelectedOptions={setSelectedOptions}
                    />
                )}
            </View>
        </>
    )
}

export default FilterSectionCheckbox;