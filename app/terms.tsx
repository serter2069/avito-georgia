import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { colors } from '../lib/colors';

export default function TermsScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← {t('back')}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{t('termsTitle')}</Text>
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>{t('terms1Title')}</Text>
        <Text style={styles.body}>{t('terms1Text')}</Text>

        <Text style={styles.sectionTitle}>{t('terms2Title')}</Text>
        <Text style={styles.body}>{t('terms2Text')}</Text>

        <Text style={styles.sectionTitle}>{t('terms3Title')}</Text>
        <Text style={styles.body}>{t('terms3Text')}</Text>

        <Text style={styles.sectionTitle}>{t('terms4Title')}</Text>
        <Text style={styles.body}>{t('terms4Text')}</Text>

        <Text style={styles.sectionTitle}>{t('terms5Title')}</Text>
        <Text style={styles.body}>{t('terms5Text')}</Text>

        <Text style={styles.updated}>{t('termsUpdated')}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderDefault,
  },
  backButton: {
    marginRight: 12,
  },
  backText: {
    color: colors.brandPrimary,
    fontSize: 16,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
  },
  body: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
  updated: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 32,
    fontStyle: 'italic',
  },
});
