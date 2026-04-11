import { View, Text, useWindowDimensions, Platform } from 'react-native';
import { StateSection } from '../StateSection';
import { Feather } from '@expo/vector-icons';

export default function TermsStates() {
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
                </View>
          <View className="flex-row h-14 bg-white border-t border-border items-center">{[{i:"home",l:"Home"},{i:"plus-circle",l:"Post"},{i:"message-circle",l:"Chat"},{i:"user",l:"Profile"}].map(t=>(<View key={t.l} className="flex-1 items-center justify-center"><Feather name={t.i as any} size={20} color="#737373" /><Text className="text-[10px] text-text-muted">{t.l}</Text></View>))}</View>
        </View>
</StateSection>
    </View>
  );
}
