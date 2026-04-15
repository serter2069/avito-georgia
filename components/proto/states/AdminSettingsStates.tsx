import { View, Text, TextInput, TouchableOpacity, Switch,
  useWindowDimensions} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { StateSection } from '../StateSection';
import { SkeletonBlock, SkeletonRow, SkeletonCard } from '../SkeletonBlock';

export default function AdminSettingsStates() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const { width } = useWindowDimensions();

  const isDesktop = width >= 768;

  const containerStyle = isDesktop ? { maxWidth: 960, alignSelf: 'center' as const, width: '100%' } : {};


  return (
    <View>
      <StateSection title="DEFAULT">
        <View style={[{ minHeight: 844 }, containerStyle]} className="py-4">
          <Text className="text-text-primary text-lg font-bold mb-4">Настройки сайта</Text>
          <View className="mb-4">
            <Text className="text-text-secondary text-sm mb-1 font-medium">Название сайта</Text>
            <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary" value="Avito Georgia" editable={false} />
          </View>
          <View className="mb-4">
            <Text className="text-text-secondary text-sm mb-1 font-medium">Email поддержки</Text>
            <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary" value="support@avito.ge" editable={false} />
          </View>
          <View className="mb-4">
            <Text className="text-text-secondary text-sm mb-1 font-medium">Макс. фото на объявление</Text>
            <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary" value="10" editable={false} />
          </View>
          <View className="mb-4">
            <Text className="text-text-secondary text-sm mb-1 font-medium">Макс. объявлений на пользователя</Text>
            <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary" value="50" editable={false} />
          </View>
          <View className="mb-6">
            <Text className="text-text-secondary text-sm mb-1 font-medium">Срок жизни объявления (дни)</Text>
            <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary" value="30" editable={false} />
          </View>
          <View className="flex-row items-center justify-between bg-surface border border-border rounded-lg px-4 py-3 mb-6">
            <View className="flex-1">
              <Text className="text-text-primary text-sm font-medium">Режим обслуживания</Text>
              <Text className="text-text-muted text-xs mt-0.5">Сайт недоступен для пользователей</Text>
            </View>
            <Switch
              value={maintenanceMode}
              onValueChange={setMaintenanceMode}
              trackColor={{ false: '#D1D5DB', true: '#00AA6C' }}
              thumbColor="#ffffff"
            />
          </View>
          {maintenanceMode && (
            <View className="bg-warning/10 border border-warning/30 rounded-lg p-3 flex-row items-center gap-2 mb-4">
              <Feather name="alert-triangle" size={16} color="#f59e0b" />
              <Text className="text-warning text-sm flex-1">Сайт переведен в режим обслуживания</Text>
            </View>
          )}
          <TouchableOpacity className="bg-primary py-3 rounded-lg items-center">
            <Text className="text-white font-semibold">Сохранить</Text>
          </TouchableOpacity>
        </View>
      </StateSection>

      <StateSection title="LOADING">
        <View style={[{ minHeight: 844 }, containerStyle]} style={{ paddingVertical: 16 }}>
          <SkeletonBlock width={160} height={20} style={{ marginBottom: 24 }} />
          {[1, 2, 3, 4, 5].map(i => (
            <View key={i} style={{ marginBottom: 16 }}>
              <SkeletonBlock width={120} height={12} style={{ marginBottom: 6 }} />
              <SkeletonBlock height={44} radius={8} />
            </View>
          ))}
          <SkeletonBlock height={44} radius={8} style={{ marginTop: 8 }} />
        </View>
      </StateSection>

      <StateSection title="SAVING">
        <View style={[{ minHeight: 844 }, containerStyle]} className="py-4 opacity-50">
          <Text className="text-text-primary text-lg font-bold mb-4">Настройки сайта</Text>
          <View className="mb-4">
            <Text className="text-text-secondary text-sm mb-1 font-medium">Название сайта</Text>
            <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary" value="Avito Georgia" editable={false} />
          </View>
          <View className="mb-4">
            <Text className="text-text-secondary text-sm mb-1 font-medium">Макс. объявлений на пользователя</Text>
            <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary" value="50" editable={false} />
          </View>
          <View className="flex-row items-center justify-between bg-surface border border-border rounded-lg px-4 py-3 mb-6">
            <Text className="text-text-primary text-sm font-medium">Режим обслуживания</Text>
            <Switch value={false} trackColor={{ false: '#D1D5DB', true: '#00AA6C' }} thumbColor="#ffffff" />
          </View>
          <TouchableOpacity className="bg-primary py-3 rounded-lg items-center opacity-60">
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.4)' }} />
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontWeight: '600' }}>Сохранение...</Text>
            </View>
          </TouchableOpacity>
        </View>
      </StateSection>

      <StateSection title="SAVED">
        <View style={[{ minHeight: 844 }, containerStyle]} className="py-4">
          <View className="bg-success/10 border border-success/30 rounded-lg p-4 flex-row items-center gap-3 mb-4">
            <Feather name="check-circle" size={24} color="#2E7D30" />
            <Text className="text-success text-sm font-medium">Настройки сохранены</Text>
          </View>
          <View className="mb-4">
            <Text className="text-text-secondary text-sm mb-1 font-medium">Название сайта</Text>
            <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary" value="Avito Georgia" editable={false} />
          </View>
          <View className="mb-4">
            <Text className="text-text-secondary text-sm mb-1 font-medium">Макс. объявлений на пользователя</Text>
            <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary" value="50" editable={false} />
          </View>
          <View className="flex-row items-center justify-between bg-surface border border-border rounded-lg px-4 py-3 mb-6">
            <Text className="text-text-primary text-sm font-medium">Режим обслуживания</Text>
            <Switch value={false} trackColor={{ false: '#D1D5DB', true: '#00AA6C' }} thumbColor="#ffffff" />
          </View>
          <TouchableOpacity className="bg-primary py-3 rounded-lg items-center">
            <Text className="text-white font-semibold">Сохранить</Text>
          </TouchableOpacity>
        </View>
      </StateSection>
    </View>
  );
}
