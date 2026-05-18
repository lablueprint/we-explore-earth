import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    cardContainer: {
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 16,
        padding: 20,
        backgroundColor: '#FFFFFF',
        marginBottom: 32, 
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    title: {
        fontSize: 20,
        color: '#0A1207',
    },
    description: {
        fontSize: 14,
        color: '#8A8A8A',
        lineHeight: 20,
        marginBottom: 20,
    },
    buttonContainer: {
        backgroundColor: '#2D5A1B',
        borderRadius: 100, 
        paddingVertical: 14,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonIconImage: {
        width: 20,
        height: 20,
        marginRight: 8,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    }
});