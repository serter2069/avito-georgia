import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Head from 'expo-router/head';
import { useTranslation } from 'react-i18next';
import { colors } from '../lib/colors';

export default function NotFoundScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <>
      <Head>
        <title>404 — {t('nothingFound')} | Авито Грузия</title>
      </Head>
      <View style={styles.container}>
        <Text style={styles.code}>404</Text>
        <Text style={styles.title}>{t('nothingFound')}</Text>
        <Text style={styles.subtitle}>{t('tryDifferentSearch')}</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.replace('/')}>
          <Text style={styles.buttonText}>{t('goHome')}</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 430,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 24,
  },
  code: {
    fontSize: 80,
    fontWeight: '700',
    color: colors.brandPrimary,
    lineHeight: 88,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 8,
    textAlign: 'center',
  },
  button: {
    marginTop: 32,
    backgroundColor: colors.brandPrimary,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
