import { View, Text, useWindowDimensions, Platform } from 'react-native';
import { StateSection } from '../StateSection';
import { Feather } from '@expo/vector-icons';

export default function PrivacyStates() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const contentStyle = isDesktop ? { maxWidth: 800, alignSelf: 'center' as const, width: '100%' } : {};

  return (
    <View>
      <StateSection title="default">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>
          <View className="flex-row items-center justify-between h-14 px-4 bg-white border-b border-border"><Text className="text-primary text-lg font-bold">Avito Georgia</Text><View className="flex-row items-center gap-3"><Feather name="search" size={20} color="#737373" /><Feather name="bell" size={20} color="#737373" /></View></View>
          <View style={{ flex: 1 }}>

        <View style={contentStyle} className="py-4">
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
                </View>
          <View className="flex-row h-14 bg-white border-t border-border items-center">{[{i:"home",l:"Home"},{i:"plus-circle",l:"Post"},{i:"message-circle",l:"Chat"},{i:"user",l:"Profile"}].map(t=>(<View key={t.l} className="flex-1 items-center justify-center"><Feather name={t.i as any} size={20} color="#737373" /><Text className="text-[10px] text-text-muted">{t.l}</Text></View>))}</View>
        </View>
</StateSection>
    </View>
  );
}
