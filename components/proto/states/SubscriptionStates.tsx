import { View, Text, TouchableOpacity, ActivityIndicator, useWindowDimensions, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StateSection } from '../StateSection';

function PlanCard({ name, price, features, isPrimary, isDesktop }: { name: string; price: string; features: string[]; isPrimary?: boolean; isDesktop?: boolean }) {
  return (
    <View className={`border rounded-lg p-4 ${isDesktop ? 'flex-1' : 'mb-3'} ${isPrimary ? 'border-primary bg-primary/5' : 'border-border'}`}>
      {isPrimary && <View className="bg-primary px-2 py-0.5 rounded-full self-start mb-2"><Text className="text-white text-[10px] font-medium">Популярный</Text></View>}
      <Text className="text-text-primary text-lg font-bold">{name}</Text>
      <Text className="text-primary text-2xl font-bold my-2">{price}</Text>
      {features.map((f, i) => (
        <View key={i} className="flex-row items-center gap-2 mb-1">
          <Feather name="check" size={16} color="#2E7D30" />
          <Text className="text-text-secondary text-sm">{f}</Text>
        </View>
      ))}
      <TouchableOpacity className={`py-3 rounded-lg items-center mt-3 ${isPrimary ? 'bg-primary' : 'border border-primary'}`}>
        <Text className={`font-semibold ${isPrimary ? 'text-white' : 'text-primary'}`}>Оформить</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function SubscriptionStates() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  return (
    <View>
      <StateSection title="no_subscription">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>
          <View className="flex-row items-center justify-between h-14 px-4 bg-white border-b border-border"><Text className="text-primary text-lg font-bold">Avito Georgia</Text><View className="flex-row items-center gap-3"><Feather name="search" size={20} color="#737373" /><Feather name="bell" size={20} color="#737373" /></View></View>
          <View style={{ flex: 1 }}>

        <View className="py-4">
          <Text className="text-text-primary text-lg font-bold mb-4">Premium подписка</Text>
          {isDesktop ? (
            <View className="flex-row gap-4">
              <PlanCard
                name="Basic"
                price="Бесплатно"
                features={['До 5 объявлений', 'Стандартное размещение', 'Email поддержка']}
                isDesktop
              />
              <PlanCard
                name="Premium"
                price="29.99 GEL/мес"
                features={['Безлимитные объявления', 'Значок Premium', 'Приоритет в поиске', 'Поддержка 24/7']}
                isPrimary
                isDesktop
              />
            </View>
          ) : (
            <PlanCard name="Premium" price="29.99 GEL/мес" features={['Безлимитные объявления', 'Значок Premium', 'Приоритет в поиске', 'Поддержка 24/7']} isPrimary />
          )}
        </View>
                </View>
          <View className="flex-row h-14 bg-white border-t border-border items-center">{[{i:"home",l:"Home"},{i:"plus-circle",l:"Post"},{i:"message-circle",l:"Chat"},{i:"user",l:"Profile"}].map(t=>(<View key={t.l} className="flex-1 items-center justify-center"><Feather name={t.i as any} size={20} color="#737373" /><Text className="text-[10px] text-text-muted">{t.l}</Text></View>))}</View>
        </View>
</StateSection>

      <StateSection title="active_subscription">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>
          <View className="flex-row items-center justify-between h-14 px-4 bg-white border-b border-border"><Text className="text-primary text-lg font-bold">Avito Georgia</Text><View className="flex-row items-center gap-3"><Feather name="search" size={20} color="#737373" /><Feather name="bell" size={20} color="#737373" /></View></View>
          <View style={{ flex: 1 }}>

        <View className="py-4" style={isDesktop ? { maxWidth: 560, alignSelf: 'center', width: '100%' } : undefined}>
          <View className="bg-primary/10 border border-primary rounded-lg p-4 mb-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-primary text-lg font-bold">Premium</Text>
              <View className="bg-success/20 px-2 py-0.5 rounded-full">
                <Text className="text-success text-xs font-medium">Активна</Text>
              </View>
            </View>
            <Text className="text-text-secondary text-sm">29.99 GEL/мес</Text>
            <Text className="text-text-muted text-xs mt-1">Следующее списание: 15 мая 2026</Text>
          </View>
          <TouchableOpacity className="border border-error py-3 rounded-lg items-center">
            <Text className="text-error font-semibold">Отменить подписку</Text>
          </TouchableOpacity>
        </View>
                </View>
          <View className="flex-row h-14 bg-white border-t border-border items-center">{[{i:"home",l:"Home"},{i:"plus-circle",l:"Post"},{i:"message-circle",l:"Chat"},{i:"user",l:"Profile"}].map(t=>(<View key={t.l} className="flex-1 items-center justify-center"><Feather name={t.i as any} size={20} color="#737373" /><Text className="text-[10px] text-text-muted">{t.l}</Text></View>))}</View>
        </View>
</StateSection>

      <StateSection title="loading">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>
          <View className="flex-row items-center justify-between h-14 px-4 bg-white border-b border-border"><Text className="text-primary text-lg font-bold">Avito Georgia</Text><View className="flex-row items-center gap-3"><Feather name="search" size={20} color="#737373" /><Feather name="bell" size={20} color="#737373" /></View></View>
          <View style={{ flex: 1 }}>

        <View className="py-16 items-center">
          <ActivityIndicator size="large" color="#00AA6C" />
        </View>
                </View>
          <View className="flex-row h-14 bg-white border-t border-border items-center">{[{i:"home",l:"Home"},{i:"plus-circle",l:"Post"},{i:"message-circle",l:"Chat"},{i:"user",l:"Profile"}].map(t=>(<View key={t.l} className="flex-1 items-center justify-center"><Feather name={t.i as any} size={20} color="#737373" /><Text className="text-[10px] text-text-muted">{t.l}</Text></View>))}</View>
        </View>
</StateSection>

      <StateSection title="purchasing">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>
          <View className="flex-row items-center justify-between h-14 px-4 bg-white border-b border-border"><Text className="text-primary text-lg font-bold">Avito Georgia</Text><View className="flex-row items-center gap-3"><Feather name="search" size={20} color="#737373" /><Feather name="bell" size={20} color="#737373" /></View></View>
          <View style={{ flex: 1 }}>

        <View className="py-16 items-center">
          <ActivityIndicator size="large" color="#00AA6C" />
          <Text className="text-text-muted text-sm mt-3">Оформляем подписку...</Text>
        </View>
                </View>
          <View className="flex-row h-14 bg-white border-t border-border items-center">{[{i:"home",l:"Home"},{i:"plus-circle",l:"Post"},{i:"message-circle",l:"Chat"},{i:"user",l:"Profile"}].map(t=>(<View key={t.l} className="flex-1 items-center justify-center"><Feather name={t.i as any} size={20} color="#737373" /><Text className="text-[10px] text-text-muted">{t.l}</Text></View>))}</View>
        </View>
</StateSection>

      <StateSection title="cancel_confirm">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>
          <View className="flex-row items-center justify-between h-14 px-4 bg-white border-b border-border"><Text className="text-primary text-lg font-bold">Avito Georgia</Text><View className="flex-row items-center gap-3"><Feather name="search" size={20} color="#737373" /><Feather name="bell" size={20} color="#737373" /></View></View>
          <View style={{ flex: 1 }}>

        <View style={isDesktop ? { maxWidth: 480, alignSelf: 'center', width: '100%' } : undefined} className="bg-white border border-border rounded-lg p-4">
          <View className="items-center mb-4">
            <Feather name="alert-triangle" size={48} color="#C0392B" />
            <Text className="text-text-primary text-lg font-bold mt-2">Отменить подписку?</Text>
            <Text className="text-text-muted text-sm text-center mt-2">Доступ к Premium истечёт 15 мая 2026. После этого аккаунт перейдёт на тариф Basic.</Text>
          </View>
          <View className="flex-row gap-3">
            <TouchableOpacity className="flex-1 border border-border py-3 rounded-lg items-center">
              <Text className="text-text-secondary font-semibold">Оставить</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-error py-3 rounded-lg items-center">
              <Text className="text-white font-semibold">Отменить</Text>
            </TouchableOpacity>
          </View>
        </View>
                </View>
          <View className="flex-row h-14 bg-white border-t border-border items-center">{[{i:"home",l:"Home"},{i:"plus-circle",l:"Post"},{i:"message-circle",l:"Chat"},{i:"user",l:"Profile"}].map(t=>(<View key={t.l} className="flex-1 items-center justify-center"><Feather name={t.i as any} size={20} color="#737373" /><Text className="text-[10px] text-text-muted">{t.l}</Text></View>))}</View>
        </View>
</StateSection>
    </View>
  );
}
