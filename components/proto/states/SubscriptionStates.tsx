import { View, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StateSection } from '../StateSection';
import { SkeletonBlock, SkeletonRow, SkeletonCard } from '../SkeletonBlock';

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
  const containerStyle = isDesktop ? { maxWidth: 960, alignSelf: 'center' as const, width: '100%' } : {};


  return (
    <View>
      <StateSection title="NO_SUBSCRIPTION">
        <View style={[{ minHeight: 844 }, containerStyle]} className="py-4">
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
      </StateSection>

      <StateSection title="ACTIVE_SUBSCRIPTION">
        <View className="py-4" style={[{ minHeight: 844 }, isDesktop ? { maxWidth: 960, alignSelf: 'center', width: '100%' } : undefined]}>
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
      </StateSection>

      <StateSection title="LOADING">
        <View style={[{ minHeight: 844 }, containerStyle]} style={{ paddingVertical: 16 }}>
          <SkeletonBlock width={180} height={20} style={{ marginBottom: 16 }} />
          {[1, 2].map(i => (
            <View key={i} style={{ borderRadius: 8, borderWidth: 1, borderColor: '#E8EDF0', padding: 16, marginBottom: 12, gap: 10 }}>
              <SkeletonBlock width={80} height={16} />
              <SkeletonBlock width={120} height={28} />
              {[1, 2, 3].map(j => (
                <View key={j} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <SkeletonBlock width={16} height={16} radius={8} />
                  <SkeletonBlock width="60%" height={12} />
                </View>
              ))}
              <SkeletonBlock height={40} radius={8} />
            </View>
          ))}
        </View>
      </StateSection>

      <StateSection title="PURCHASING">
        <View style={[{ minHeight: 844 }, containerStyle]} className="py-16 items-center">
          <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(0,170,108,0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <Feather name="award" size={28} color="#00AA6C" />
          </View>
          <Text style={{ color: '#1A1A1A', fontSize: 18, fontWeight: '700', marginBottom: 8 }}>Оформляем подписку...</Text>
          <Text style={{ color: '#737373', fontSize: 14 }}>Это займёт несколько секунд</Text>
          <View style={{ width: '50%', height: 4, backgroundColor: '#E8EDF0', borderRadius: 2, marginTop: 24, overflow: 'hidden' }}>
            <View style={{ width: '40%', height: 4, backgroundColor: '#00AA6C', borderRadius: 2 }} />
          </View>
        </View>
      </StateSection>

      <StateSection title="CANCEL_CONFIRM">
        <View style={[{ minHeight: 844 }, isDesktop ? { maxWidth: 480, alignSelf: 'center', width: '100%' } : undefined]} className="bg-white border border-border rounded-lg p-4">
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
      </StateSection>
    </View>
  );
}
