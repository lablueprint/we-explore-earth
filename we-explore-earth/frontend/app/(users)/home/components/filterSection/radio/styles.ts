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
    filterOptionWrapper: {
        marginTop: 12,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    filterOption: {
        fontWeight: 600, /** semi-bold */
        fontSize: 16,
    },
    radioButtonCircle: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 24,
        width: 24,
        borderRadius: 12,
        borderWidth: 3,
    },
    radioButtonInnerCircle: {
        height: 12,
        width: 12,
        borderRadius: 6,
        backgroundColor: '#285F00',
    },
});