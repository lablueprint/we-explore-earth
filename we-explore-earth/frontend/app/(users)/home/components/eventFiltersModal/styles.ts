import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    filterTitleCloseWrapper: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    filterTitle: {
        fontWeight: 700, /** bold */
        fontSize: 32,
    },
    selectDateDateChipWrapper: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    selectDateWrapper: {
        display: 'flex',
        flexDirection: 'row',
        gap: 6,
        alignItems: 'center',
        height: 32,
    },
    selectDateText: {
        fontWeight: 400,
        fontSize: 16,
    },
    dateChipContainer: {
        gap: 6,
    },
    dateChipWrapper: {
        width: 115,
        height: 32,
        borderWidth: 1,
        borderRadius: 100,
        borderColor: '#DEDEDE',
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
    },
    dateChipText: {
        fontSize: 14,
        color: '#000000',
        textAlign: 'center',
    },
    clearSubmitWrapper: {
        marginTop: 52,
        marginBottom: 64,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    clearText: {
        fontSize: 16,
        color: '#181818',
        textDecorationLine: 'underline',
    },
    submit: {
        justifyContent: 'center',
        width: 120,
        height: 35,
        padding: 4,
        borderRadius: 100,
        backgroundColor: '#285F00',
    },
    submitText: {
        textAlign: 'center',
        fontWeight: 700, /** bold */
        fontSize: 16,
        color: '#FFFFFF',
    },
});