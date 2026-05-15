import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import { typography } from '@shared/typography/typography';

function FilterOptionTile(
    {
        option,
        selectedOptions,
        setSelectedOptions
    }
    :
    {
        option: string,
        selectedOptions: Set<string>
        setSelectedOptions: React.Dispatch<Set<string>>
    }
) {
    const handleSelect = () => {
        const updated = new Set(selectedOptions);
        // handle deselecting the tile
        if (selectedOptions.has(option)) {
            updated.delete(option);
        }
        // handle selecting the tile
        else {
            updated.add(option);
        }
        setSelectedOptions(updated);
    }

    return (
        <TouchableOpacity
            onPress={handleSelect}
            style={[styles.filterOptionTile, {
                backgroundColor: selectedOptions.has(option) ? '#285F00' : '#EBEBEB',
                borderColor: selectedOptions.has(option) ? '#285F00' : '#E6E6E6'
            }]}
        >
            <Text style={[typography.body, styles.filterOption, {color: selectedOptions.has(option) ? '#DEDEDE' : '#333'}]}>{option}</Text>
        </TouchableOpacity>
    )
}

function FilterSectionTile(
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
                <Text style={[typography.h3, styles.filterHeader]}>{header}</Text>
                <TouchableOpacity onPress={handleReset}>
                    <Text style={[typography.body, styles.reset]}>Reset</Text>
                </TouchableOpacity>
            </View>
            
            {/** Filter options */}
            <View style={styles.filterOptionContainer}>
                {options.map((option, index) => 
                    <FilterOptionTile
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

export default FilterSectionTile;