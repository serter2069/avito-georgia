import { View, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StateSection } from '../StateSection';
import { SkeletonBlock } from '../SkeletonBlock';

export default function TermsStates() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const contentStyle = isDesktop ? { maxWidth: 960, alignSelf: 'center' as const, width: '100%' } : {};
  const containerStyle = isDesktop ? { maxWidth: 960, alignSelf: 'center' as const, width: '100%' } : {};


  return (
    <View>
      <StateSection title="DEFAULT">
        <View style={[{ minHeight: 844 }, contentStyle]} className="py-4">
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

      <StateSection title="LOADING">
        <View style={[{ minHeight: 844 }, contentStyle]} className="py-4">
          <SkeletonBlock width="55%" height={28} style={{ marginBottom: 12 }} />
          <SkeletonBlock width="40%" height={12} style={{ marginBottom: 24 }} />
          {[1,2,3,4].map(i => (
            <View key={i} style={{ marginBottom: 20 }}>
              <SkeletonBlock width="35%" height={18} style={{ marginBottom: 8 }} />
              <SkeletonBlock width="100%" height={14} style={{ marginBottom: 6 }} />
              <SkeletonBlock width="95%" height={14} style={{ marginBottom: 6 }} />
              <SkeletonBlock width="85%" height={14} />
            </View>
          ))}
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
              Не удалось загрузить страницу.
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
