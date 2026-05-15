import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    filterHeaderWrapper:{
        marginTop: 36,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
    },
    filterHeader: {
        textTransform: 'uppercase',
    },
    reset: {
        textDecorationLine: 'underline',
    },
    filterOptionContainer: {
        marginTop: 8,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
    },
    filterOptionTile: {
        width: '49%',
        height: 60,
        borderWidth: 1,
        borderRadius: 12,
        justifyContent: 'center',
    },
    filterOption: {
        textAlign: 'center',
    },
});