import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../lib/colors';

export default function AboutScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Назад</Text>
        </TouchableOpacity>
        <Text style={styles.title}>О сервисе</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.body}>
          Avito Georgia — доска объявлений для Грузии. Покупайте и продавайте товары, недвижимость, транспорт и услуги.
        </Text>
      </View>
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
  content: {
    padding: 16,
  },
  body: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
});
