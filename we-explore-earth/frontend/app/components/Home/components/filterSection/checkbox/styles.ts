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
    },
    filterOptionWrapper: {
        marginTop: 8,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});