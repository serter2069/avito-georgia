import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StateSection } from '../StateSection';

function PlanCard({ name, price, features, isPrimary }: { name: string; price: string; features: string[]; isPrimary?: boolean }) {
  return (
    <View className={`border rounded-lg p-4 mb-3 ${isPrimary ? 'border-primary bg-primary/5' : 'border-border'}`}>
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
  return (
    <View>
      <StateSection title="no_subscription">
        <View className="py-4">
          <Text className="text-text-primary text-lg font-bold mb-4">Premium подписка</Text>
          <PlanCard name="Premium" price="29.99 GEL/мес" features={['Безлимитные объявления', 'Значок Premium', 'Приоритет в поиске', 'Поддержка 24/7']} isPrimary />
        </View>
      </StateSection>

      <StateSection title="active_subscription">
        <View className="py-4">
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

      <StateSection title="loading">
        <View className="py-16 items-center">
          <ActivityIndicator size="large" color="#0A7B8A" />
        </View>
      </StateSection>

      <StateSection title="purchasing">
        <View className="py-16 items-center">
          <ActivityIndicator size="large" color="#0A7B8A" />
          <Text className="text-text-muted text-sm mt-3">Оформляем подписку...</Text>
        </View>
      </StateSection>
    </View>
  );
}
