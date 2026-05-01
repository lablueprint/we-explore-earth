import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    filterTitle: {
        fontWeight: 700, /** bold */
        fontSize: 32,
    },
    filterOptionWrapper: {
        marginTop: 12,
        display: 'flex',
        flexDirection: 'row',
        gap: 6,
        alignItems: 'center',
    },
    filterOption: {
        fontWeight: 600, /** semi-bold */
        fontSize: 16,
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