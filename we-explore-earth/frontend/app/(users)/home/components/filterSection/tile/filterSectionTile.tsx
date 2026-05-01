import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';

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
            style={[styles.filterOptionTile, {backgroundColor: selectedOptions.has(option) ? '#285F00' : '#EBEBEB'}]}
        >
            <Text style={[styles.filterOption, {color: selectedOptions.has(option) ? '#DEDEDE' : '#000000'}]}>{option}</Text>
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
                <Text style={styles.filterHeader}>{header}</Text>
                <TouchableOpacity onPress={handleReset}>
                    <Text style={styles.reset}>Reset</Text>
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