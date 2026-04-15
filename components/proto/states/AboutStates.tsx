import { View, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StateSection } from '../StateSection';
import { SkeletonBlock } from '../SkeletonBlock';

export default function AboutStates() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const contentStyle = isDesktop ? { maxWidth: 960, alignSelf: 'center' as const, width: '100%' } : {};
  const containerStyle = isDesktop ? { maxWidth: 960, alignSelf: 'center' as const, width: '100%' } : {};


  return (
    <View>
      <StateSection title="DEFAULT">
        <View style={[{ minHeight: 844 }, contentStyle]} className="py-4">
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

      <StateSection title="LOADING">
        <View style={[{ minHeight: 844 }, contentStyle]} className="py-4">
          <SkeletonBlock width="40%" height={28} style={{ marginBottom: 16 }} />
          <SkeletonBlock width="100%" height={14} style={{ marginBottom: 8 }} />
          <SkeletonBlock width="90%" height={14} style={{ marginBottom: 8 }} />
          <SkeletonBlock width="95%" height={14} style={{ marginBottom: 24 }} />
          <SkeletonBlock width="35%" height={20} style={{ marginBottom: 8 }} />
          <SkeletonBlock width="100%" height={14} style={{ marginBottom: 8 }} />
          <SkeletonBlock width="85%" height={14} style={{ marginBottom: 24 }} />
          <SkeletonBlock width="30%" height={20} style={{ marginBottom: 8 }} />
          <SkeletonBlock width="60%" height={14} style={{ marginBottom: 6 }} />
          <SkeletonBlock width="55%" height={14} style={{ marginBottom: 6 }} />
          <SkeletonBlock width="50%" height={14} />
        </View>
      </StateSection>

      <StateSection title="ERROR">
        <View style={[{ minHeight: 844 }, contentStyle]}>
          <View style={{ paddingVertical: 64, alignItems: 'center' }}>
            <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: '#FFEBEE', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <Feather name="wifi-off" size={32} color="#D32F2F" />
            </View>
            <Text style={{ color: '#1A1A1A', fontSize: 18, fontWeight: '700', marginBottom: 6 }}>Ошибка загрузки</Text>
            <Text style={{ color: '#737373', fontSize: 14, textAlign: 'center', maxWidth: 280, marginBottom: 20 }}>
              Не удалось загрузить страницу. Проверьте интернет-соединение.
            </Text>
            <TouchableOpacity style={{ backgroundColor: '#00AA6C', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10 }}>
              <Text style={{ color: '#fff', fontWeight: '600' }}>Повторить</Text>
            </TouchableOpacity>
          </View>
        </View>
      </StateSection>
    </View>
  );
}
