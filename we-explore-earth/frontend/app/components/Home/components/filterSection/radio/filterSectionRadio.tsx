import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import { typography } from '@shared/typography/typography';

function CustomRadioButton (
    { 
        selected,
        onPress
    }
    :
    {
        selected: boolean,
        onPress: any
    }
) {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.radioButtonCircle, {borderColor: selected ? '#285F00' : '#CDCDCD'}]}
        >
            {selected && <View style={styles.radioButtonInnerCircle} />}
        </TouchableOpacity>
    )
}

function FilterOptionRadio(
    {
        option,
        selectedOption,
        setSelectedOption
    }
    :
    {
        option: string,
        selectedOption: string,
        setSelectedOption: React.Dispatch<any>
    }
) {
    return(
        <View style={styles.filterOptionWrapper}>
            <Text style={typography.body}>{option}</Text>
            <CustomRadioButton
                selected={option === selectedOption}
                onPress={() => { setSelectedOption(option) }}
            />
        </View>
    )
}

function FilterSectionRadio(
    {
        header,
        defaultOption,
        options,
        selectedOption,
        setSelectedOption
    }
    :
    {
        header: string,
        defaultOption: string,
        options: string[],
        selectedOption: string,
        setSelectedOption: React.Dispatch<any>
    }
) {
    const handleReset = () => {
        setSelectedOption(defaultOption);
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
                    <FilterOptionRadio
                        key={index}
                        option={option}
                        selectedOption={selectedOption}
                        setSelectedOption={setSelectedOption}
                    />
                )}
            </View>
        </>
    )
}

export default FilterSectionRadio;