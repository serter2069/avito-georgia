import { View, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StateSection } from '../StateSection';
import { SkeletonBlock } from '../SkeletonBlock';

export default function PrivacyStates() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const contentStyle = isDesktop ? { maxWidth: 960, alignSelf: 'center' as const, width: '100%' } : {};
  const containerStyle = isDesktop ? { maxWidth: 960, alignSelf: 'center' as const, width: '100%' } : {};


  return (
    <View>
      <StateSection title="DEFAULT">
        <View style={[{ minHeight: 844 }, contentStyle]} className="py-4">
          <Text className="text-primary text-2xl font-bold mb-4">Политика конфиденциальности</Text>
          <Text className="text-text-muted text-sm mb-4">Последнее обновление: 1 апреля 2026</Text>

          <Text className="text-text-secondary text-lg font-semibold mb-2">1. Сбор данных</Text>
          <Text className="text-text-primary text-base leading-6 mb-4">
            Мы собираем только те данные, которые необходимы для работы сервиса: email, имя, номер телефона, город проживания.
          </Text>

          <Text className="text-text-secondary text-lg font-semibold mb-2">2. Использование данных</Text>
          <Text className="text-text-primary text-base leading-6 mb-4">
            Ваши данные используются для идентификации, связи между покупателями и продавцами, отправки уведомлений о событиях на платформе.
          </Text>

          <Text className="text-text-secondary text-lg font-semibold mb-2">3. Хранение данных</Text>
          <Text className="text-text-primary text-base leading-6 mb-4">
            Данные хранятся на защищённых серверах в Европе. Мы применяем стандартные практики шифрования и защиты данных.
          </Text>

          <Text className="text-text-secondary text-lg font-semibold mb-2">4. Ваши права</Text>
          <Text className="text-text-primary text-base leading-6">
            Вы можете запросить удаление своих данных через настройки аккаунта или написав на support@avito.ge.
          </Text>
        </View>
      </StateSection>

      <StateSection title="LOADING">
        <View style={[{ minHeight: 844 }, contentStyle]} className="py-4">
          <SkeletonBlock width="60%" height={28} style={{ marginBottom: 12 }} />
          <SkeletonBlock width="40%" height={12} style={{ marginBottom: 24 }} />
          {[1,2,3,4].map(i => (
            <View key={i} style={{ marginBottom: 20 }}>
              <SkeletonBlock width="30%" height={18} style={{ marginBottom: 8 }} />
              <SkeletonBlock width="100%" height={14} style={{ marginBottom: 6 }} />
              <SkeletonBlock width="90%" height={14} style={{ marginBottom: 6 }} />
              <SkeletonBlock width="80%" height={14} />
            </View>
          ))}
        </View>
      </StateSection>

      <StateSection title="ERROR">
        <View style={[{ minHeight: 844 }, contentStyle]}>
          <View style={{ paddingVertical: 64, alignItems: 'center' }}>
            <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: '#FFEBEE', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <Feather name="wifi-off" size={32} color="#D32F2F" />
            </View>
            <Text style={{ color: '#1A1A1A', fontSize: 18, fontWeight: '700', marginBottom: 6 }}>Ошибка загрузки</Text>
            <Text style={{ color: '#737373', fontSize: 14, textAlign: 'center', maxWidth: 280, marginBottom: 20 }}>
              Не удалось загрузить страницу.
            </Text>
            <TouchableOpacity style={{ backgroundColor: '#00AA6C', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10 }}>
              <Text style={{ color: '#fff', fontWeight: '600' }}>Повторить</Text>
            </TouchableOpacity>
          </View>
        </View>
      </StateSection>
    </View>
  );
}
