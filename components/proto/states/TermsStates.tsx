import { View, Text } from 'react-native';
import { StateSection } from '../StateSection';

export default function TermsStates() {
  return (
    <View>
      <StateSection title="default">
        <View className="py-4">
          <Text className="text-primary text-2xl font-bold mb-4">Условия использования</Text>
          <Text className="text-text-muted text-sm mb-4">Последнее обновление: 1 апреля 2026</Text>

          <Text className="text-text-secondary text-lg font-semibold mb-2">1. Общие положения</Text>
          <Text className="text-text-primary text-base leading-6 mb-4">
            Используя платформу Avito Georgia, вы соглашаетесь с данными условиями. Платформа предназначена для размещения объявлений о продаже товаров и услуг.
          </Text>

          <Text className="text-text-secondary text-lg font-semibold mb-2">2. Правила размещения</Text>
          <Text className="text-text-primary text-base leading-6 mb-4">
            Запрещено размещать объявления о незаконных товарах и услугах, контрафактной продукции, оружии, наркотиках. Все объявления проходят модерацию.
          </Text>

          <Text className="text-text-secondary text-lg font-semibold mb-2">3. Ответственность</Text>
          <Text className="text-text-primary text-base leading-6 mb-4">
            Платформа не несёт ответственности за качество товаров и услуг, предлагаемых пользователями. Все сделки совершаются между пользователями напрямую.
          </Text>

          <Text className="text-text-secondary text-lg font-semibold mb-2">4. Блокировка</Text>
          <Text className="text-text-primary text-base leading-6">
            Администрация вправе заблокировать аккаунт за нарушение правил без предварительного уведомления.
          </Text>
        </View>
      </StateSection>
    </View>
  );
}
