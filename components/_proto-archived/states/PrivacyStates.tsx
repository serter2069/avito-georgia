import { View, Text, useWindowDimensions } from 'react-native';
import { StateSection } from '../StateSection';

export default function PrivacyStates() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const contentStyle = isDesktop ? { maxWidth: 960, alignSelf: 'center' as const, width: '100%' } : {};
  const containerStyle = isDesktop ? { maxWidth: 960, alignSelf: 'center' as const, width: '100%' } : {};


  return (
    <View>
      <StateSection title="default">
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
    </View>
  );
}
