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