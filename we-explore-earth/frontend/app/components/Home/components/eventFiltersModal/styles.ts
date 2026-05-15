import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    filterTitleCloseWrapper: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
        gap: 4,
        alignItems: 'center',
        height: 32,
    },
    dateChipContainer: {
        gap: 12,
    },
    dateChipWrapper: {
        width: 124,
        height: 32,
        borderWidth: 1,
        borderRadius: 100,
        borderColor: '#DEDEDE',
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
    },
    dateChipText: {
        textAlign: 'center',
    },
    clearSubmitWrapper: {
        marginTop: 52,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    clearText: {
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
        color: '#FFFFFF',
    },
    invalidDateRangeMessage: {
        paddingTop: 4,
        textAlign: 'right',
        color: 'red',
    },
    bottom: {
        marginBottom: 64,
    },
});