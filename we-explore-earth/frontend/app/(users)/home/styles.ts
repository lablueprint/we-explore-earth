import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    homeHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    upcoming: {
        fontWeight: 'bold',
        fontSize: 36,
        color: 'black',
    },
    filterButtonWrapper: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 8,
        paddingHorizontal: 16,
        paddingVertical: 4,
        borderWidth: 2,
        borderRadius: 8,
        borderColor: 'mediumgrey',
    },
    filterButtonText: {
        fontWeight: 'semibold',
        fontSize: 24,
        color: 'grey',
    },
});