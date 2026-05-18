import { StyleSheet } from 'react-native';
import { typography } from '../../../../shared/typography/typography';

export const styles = StyleSheet.create({
    fullBackground: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    safeArea: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        paddingHorizontal: 24,
        paddingTop: 80,
        paddingBottom: 40,
        justifyContent: 'center',
    },
    topSection: {
        width: '100%',
    },
    title: {
        ...typography.h1,
        fontSize: 42,
        lineHeight: 46,
        color: '#0A1207',
        marginBottom: 8,
    },
    subtitle: {
        ...typography.body,
        fontSize: 16,
        color: '#8A8A8A',
        marginBottom: 40,
    },
    input: {
        borderWidth: 1,
        borderColor: '#C0C0C0',
        borderRadius: 30,
        padding: 15,
        marginBottom: 15,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    resetPasswordButton: {
        backgroundColor: '#355E2B',
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        ...typography.body,
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
});
