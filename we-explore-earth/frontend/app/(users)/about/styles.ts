import { StyleSheet } from 'react-native';
import { typography } from '../../../../shared/typography/typography';

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 20,
    },
    mainImage: {
        width: '100%',
        height: 220,
        borderRadius: 16,
        marginBottom: 24,
    },
    title: {
        ...typography.h1,
        fontSize: 32,
        color: '#0A1207',
        marginBottom: 12,
    },
    description: {
        ...typography.body,
        fontSize: 16,
        color: '#333333',
        marginBottom: 16,
    },
    tagsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40, 
    },
    tagText: {
        ...typography.body,
        fontSize: 14,
        color: '#8A8A8A',
    },
    sectionContainer: {
        borderTopWidth: 1,
        borderTopColor: '#E5E5E5', 
        paddingTop: 32, 
        marginBottom: 20,
    },
    sectionHeader: {
        ...typography.body,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#8A8A8A',
        marginBottom: 16,
    },
    sectionText: {
        ...typography.body,
        fontSize: 16,
        color: '#333333',
        lineHeight: 24,
        marginBottom: 20,
    },
    impactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    impactImage: {
        width: 140,
        height: 100,
        borderRadius: 12,
        marginRight: 16,
    },
    impactTextContainer: {
        flex: 1, 
        justifyContent: 'center',
    },
    impactNumber: {
        ...typography.body,
        fontSize: 20,
        color: '#333333',
        marginBottom: 4,
    },
    impactLabel: {
        ...typography.body,
        fontSize: 14,
        color: '#8A8A8A',
    }
});