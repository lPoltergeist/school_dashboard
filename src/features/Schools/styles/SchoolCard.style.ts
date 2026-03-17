import { StyleSheet } from 'react-native';

export const CardStyles = StyleSheet.create({
  cardContainer: { marginBottom: 16 },
  schoolName: { fontSize: 20, fontWeight: '700', color: '#064E3B' },
  schoolAddress: { fontSize: 14, color: '#475569', marginTop: 4 },
  schoolBadge: {
    backgroundColor: '#ECFDF5',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 10,
  },
  cardHeader: { marginBottom: 16 },
  schoolBadgeText: { color: '#059669', fontSize: 12, fontWeight: '600' },
  cardActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    gap: 8,
    borderTopColor: '#F1F5F9',
    paddingTop: 16,
    marginTop: 16,
  },
  button: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  buttonPrimary: { backgroundColor: '#10B981' },
  buttonPrimaryText: { color: '#FFF', fontWeight: '700' },
  buttonSecondary: { backgroundColor: '#F1F5F9' },
  buttonSecondaryText: { color: '#475569', fontWeight: '700' },

  buttonDelete: { backgroundColor: '#FEF2F2' },
  buttonDeleteText: { color: '#EF4444', fontWeight: '700' },
});
