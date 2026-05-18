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
        justifyContent: 'space-between', 
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
    loginButton: {
        backgroundColor: '#355E2B',
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
        marginBottom: 16,
        marginTop: 10, 
    },
    forgotPasswordButton: {
        backgroundColor: 'transparent',
        paddingVertical: 10,
        alignItems: 'center',
    },
    buttonText: {
        ...typography.body,
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    forgotPasswordText: {
        ...typography.body,
        color: '#8A8A8A',
        fontSize: 14,
        fontWeight: '500',
    },
    bottomSection: {
        width: '100%',
    },
    createAccountButton: {
        borderWidth: 1,
        borderColor: '#355E2B',
        borderRadius: 30,
        paddingVertical: 15,
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    createAccountText: {
        ...typography.body,
        color: '#355E2B',
        fontSize: 18,
        fontWeight: '600',
    }
});