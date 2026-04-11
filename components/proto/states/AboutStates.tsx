import { View, Text, useWindowDimensions, Platform } from 'react-native';
import { StateSection } from '../StateSection';
import { Feather } from '@expo/vector-icons';

export default function AboutStates() {
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
                </View>
          <View className="flex-row h-14 bg-white border-t border-border items-center">{[{i:"home",l:"Home"},{i:"plus-circle",l:"Post"},{i:"message-circle",l:"Chat"},{i:"user",l:"Profile"}].map(t=>(<View key={t.l} className="flex-1 items-center justify-center"><Feather name={t.i as any} size={20} color="#737373" /><Text className="text-[10px] text-text-muted">{t.l}</Text></View>))}</View>
        </View>
</StateSection>
    </View>
  );
}
