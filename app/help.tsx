import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { colors } from '../lib/colors';

export default function HelpScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const faqs = [
    { q: 'helpQ1', a: 'helpA1' },
    { q: 'helpQ2', a: 'helpA2' },
    { q: 'helpQ3', a: 'helpA3' },
    { q: 'helpQ4', a: 'helpA4' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← {t('back')}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{t('help')}</Text>
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.intro}>{t('helpIntro')}</Text>
        {faqs.map((item) => (
          <View key={item.q} style={styles.faqItem}>
            <Text style={styles.question}>{t(item.q)}</Text>
            <Text style={styles.answer}>{t(item.a)}</Text>
          </View>
        ))}
        <Text style={styles.sectionTitle}>{t('helpContactTitle')}</Text>
        <Text style={styles.body}>{t('helpContactText')}</Text>
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
  intro: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  faqItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: colors.bgSecondary,
    borderRadius: 8,
  },
  question: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
  },
  answer: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 8,
  },
  body: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
});
