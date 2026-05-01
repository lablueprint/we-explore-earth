import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    filterHeaderWrapper:{
        marginTop: 24,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
    },
    filterHeader: {
        fontWeight: 700, /** bold */
        fontSize: 24,
    },
    reset: {
        color: 'mediumgrey',
        textDecorationLine: 'underline',
    },
    filterOptionContainer: {
        marginTop: 12,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    filterOptionTile: {
        width: '49%',
        height: 60,
        borderRadius: 12,
        justifyContent: 'center',
    },
    filterOption: {
        fontWeight: 600, /** semi-bold */
        fontSize: 16,
        textAlign: 'center',
    },
});