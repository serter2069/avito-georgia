import { View, Text } from 'react-native';
import { StateSection } from '../StateSection';

export default function AboutStates() {
  return (
    <View>
      <StateSection title="default">
        <View className="py-4">
          <Text className="text-primary text-2xl font-bold mb-4">О нас</Text>
          <Text className="text-text-primary text-base leading-6 mb-4">
            Avito Georgia — это современная доска объявлений для жителей Грузии. Мы помогаем людям покупать и продавать товары и услуги быстро и безопасно.
          </Text>
          <Text className="text-text-secondary text-lg font-semibold mb-2">Наша миссия</Text>
          <Text className="text-text-primary text-base leading-6 mb-4">
            Создать удобную и безопасную платформу для торговли между людьми в Грузии. Мы верим, что каждый должен иметь возможность легко найти нужный товар или продать ненужный.
          </Text>
          <Text className="text-text-secondary text-lg font-semibold mb-2">Контакты</Text>
          <Text className="text-text-primary text-base leading-6 mb-1">Email: support@avito.ge</Text>
          <Text className="text-text-primary text-base leading-6 mb-1">Телефон: +995 32 200 00 00</Text>
          <Text className="text-text-primary text-base leading-6">Адрес: Тбилиси, пр. Руставели 42</Text>
        </View>
      </StateSection>
    </View>
  );
}
