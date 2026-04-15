import { useState } from 'react';
import { View, Text, TouchableOpacity,
  useWindowDimensions} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StateSection } from '../StateSection';
import { SkeletonBlock, SkeletonRow, SkeletonCard } from '../SkeletonBlock';

function PackageCard({
  name, price, description, icon, color, selected, onSelect,
}: {
  name: string; price: string; description: string; icon: string; color: string;
  selected: boolean; onSelect: () => void;
}) {
  return (
    <View className={`border rounded-lg p-4 mb-3 ${selected ? 'border-primary bg-primary/10' : 'border-border'}`}>
      <View className="flex-row items-center gap-3 mb-2">
        <View className="w-10 h-10 bg-surface rounded-lg items-center justify-center">
          <Feather name={icon as any} size={20} color={color} />
        </View>
        <View className="flex-1">
          <Text className="text-text-primary text-base font-bold">{name}</Text>
          <Text className="text-text-muted text-xs">{description}</Text>
        </View>
        <Text className="text-primary text-lg font-bold">{price}</Text>
      </View>
      <TouchableOpacity
        className={`py-2.5 rounded-lg items-center mt-2 ${selected ? 'bg-primary' : 'bg-surface border border-primary'}`}
        onPress={onSelect}
      >
        <Text className={`font-semibold text-sm ${selected ? 'text-white' : 'text-primary'}`}>
          {selected ? 'Выбрано' : 'Продвинуть'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default function PromoteListingStates() {
  const [selected, setSelected] = useState<string | null>(null);
  const { width } = useWindowDimensions();

  const isDesktop = width >= 768;

  const containerStyle = isDesktop ? { maxWidth: 960, alignSelf: 'center' as const, width: '100%' } : {};


  return (
    <View>
      <StateSection title="DEFAULT">
        <View style={[{ minHeight: 844 }, containerStyle]} className="py-4">
          <Text className="text-text-primary text-lg font-bold mb-4">Продвижение объявления</Text>
          <PackageCard name="1 день" price="2.99 GEL" description="Поднятие в топ на 1 день" icon="trending-up" color="#00AA6C"
            selected={selected === 'day1'} onSelect={() => setSelected(selected === 'day1' ? null : 'day1')} />
          <PackageCard name="3 дня" price="6.99 GEL" description="Поднятие в топ на 3 дня" icon="star" color="#f59e0b"
            selected={selected === 'day3'} onSelect={() => setSelected(selected === 'day3' ? null : 'day3')} />
          <PackageCard name="7 дней" price="12.99 GEL" description="Поднятие в топ на 7 дней" icon="award" color="#2E7D30"
            selected={selected === 'day7'} onSelect={() => setSelected(selected === 'day7' ? null : 'day7')} />
        </View>
      </StateSection>

      <StateSection title="LOADING">
        <View style={[{ minHeight: 844 }, containerStyle]} style={{ paddingVertical: 16 }}>
          <SkeletonBlock width={200} height={20} style={{ marginBottom: 16 }} />
          {[1, 2, 3].map(i => (
            <View key={i} style={{ borderRadius: 8, borderWidth: 1, borderColor: '#E8EDF0', padding: 16, marginBottom: 12, gap: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <SkeletonBlock width={40} height={40} radius={8} />
                <View style={{ flex: 1, gap: 6 }}>
                  <SkeletonBlock width="40%" height={16} />
                  <SkeletonBlock width="60%" height={10} />
                </View>
                <SkeletonBlock width={70} height={20} />
              </View>
              <SkeletonBlock height={36} radius={8} />
            </View>
          ))}
        </View>
      </StateSection>

      <StateSection title="PURCHASING">
        <View style={[{ minHeight: 844 }, containerStyle]} className="py-16 items-center">
          <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(0,170,108,0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <Feather name="credit-card" size={28} color="#00AA6C" />
          </View>
          <Text style={{ color: '#1A1A1A', fontSize: 18, fontWeight: '700', marginBottom: 8 }}>Обработка платежа...</Text>
          <Text style={{ color: '#737373', fontSize: 14 }}>Пожалуйста, подождите</Text>
          <View style={{ width: '50%', height: 4, backgroundColor: '#E8EDF0', borderRadius: 2, marginTop: 24, overflow: 'hidden' }}>
            <View style={{ width: '60%', height: 4, backgroundColor: '#00AA6C', borderRadius: 2 }} />
          </View>
        </View>
      </StateSection>

      <StateSection title="ERROR">
        <View style={[{ minHeight: 844 }, containerStyle]} className="py-12 items-center px-4">
          <View className="w-16 h-16 rounded-full bg-error/10 items-center justify-center mb-2">
            <Feather name="alert-circle" size={40} color="#ef4444" />
          </View>
          <Text className="text-text-primary text-xl font-bold mt-4">Ошибка оплаты</Text>
          <Text className="text-text-muted text-sm mt-2 text-center">Платёж отклонён банком. Проверьте данные карты и попробуйте снова.</Text>
          <View className="bg-error/10 border border-error/30 rounded-lg p-3 mt-4 w-full">
            <Text className="text-error text-xs text-center">Код ошибки: insufficient_funds</Text>
          </View>
          <TouchableOpacity className="bg-primary py-3 px-6 rounded-lg mt-6 w-full items-center" onPress={() => {}}>
            <Text className="text-white font-semibold">Попробовать снова</Text>
          </TouchableOpacity>
          <TouchableOpacity className="border border-border py-3 px-6 rounded-lg mt-3 w-full items-center" onPress={() => {}}>
            <Text className="text-text-secondary font-semibold">Отмена</Text>
          </TouchableOpacity>
        </View>
      </StateSection>
    </View>
  );
}
