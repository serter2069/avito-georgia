import { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, useWindowDimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StateSection } from '../StateSection';

const languageLabels: Record<'ru' | 'ka' | 'en', string> = {
  ru: 'Русский',
  ka: 'ქართული',
  en: 'English',
};

export default function SettingsStates() {
  const [language, setLanguage] = useState<'ru' | 'ka' | 'en'>('ru');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const cycleLanguage = () => {
    const order: Array<'ru' | 'ka' | 'en'> = ['ru', 'ka', 'en'];
    const idx = order.indexOf(language);
    setLanguage(order[(idx + 1) % order.length]);
  };
  const containerStyle = isDesktop ? { maxWidth: 960, alignSelf: 'center' as const, width: '100%' } : {};


  return (
    <View>
      <StateSection title="default">
        <View style={[{ minHeight: 844 }, isDesktop ? { maxWidth: 960, alignSelf: 'center', width: '100%' } : undefined]} className="py-4">
          <View className="mb-4">
            <Text className="text-text-secondary text-sm mb-1 font-medium">Язык</Text>
            <TouchableOpacity
              className="bg-surface border border-border rounded-lg px-4 py-3 flex-row items-center justify-between"
              onPress={cycleLanguage}
            >
              <Text className="text-text-primary">{languageLabels[language]}</Text>
              <Feather name="chevron-down" size={16} color="#737373" />
            </TouchableOpacity>
          </View>
          <View className="flex-row items-center justify-between py-3 border-b border-border mb-4">
            <Text className="text-text-primary text-base">Push-уведомления</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ true: '#00AA6C', false: '#E0E0E0' }}
            />
          </View>
          <View className="flex-row items-center justify-between py-3 border-b border-border mb-6">
            <Text className="text-text-primary text-base">Email-уведомления</Text>
            <Switch
              value={emailNotifications}
              onValueChange={setEmailNotifications}
              trackColor={{ true: '#00AA6C', false: '#E0E0E0' }}
            />
          </View>
          <TouchableOpacity className="bg-error py-3 rounded-lg items-center mb-3">
            <Text className="text-white font-semibold">Удалить аккаунт</Text>
          </TouchableOpacity>
          <TouchableOpacity className="border border-primary py-3 rounded-lg items-center">
            <Text className="text-primary font-semibold">Выйти</Text>
          </TouchableOpacity>
        </View>
      </StateSection>

      <StateSection title="delete_confirm_alert">
        <View style={[{ minHeight: 844 }, isDesktop ? { maxWidth: 480, alignSelf: 'center', width: '100%' } : undefined]} className="bg-white border border-border rounded-lg p-4">
          <View className="items-center mb-4">
            <Feather name="alert-triangle" size={48} color="#C0392B" />
            <Text className="text-text-primary text-lg font-bold mt-2">Удалить аккаунт?</Text>
            <Text className="text-text-muted text-sm text-center mt-2">Все ваши данные, объявления и сообщения будут безвозвратно удалены.</Text>
          </View>
          <View className="flex-row gap-3">
            <TouchableOpacity className="flex-1 border border-border py-3 rounded-lg items-center">
              <Text className="text-text-secondary font-semibold">Отмена</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-error py-3 rounded-lg items-center">
              <Text className="text-white font-semibold">Удалить</Text>
            </TouchableOpacity>
          </View>
        </View>
      </StateSection>

      <StateSection title="logout_confirm">
        <View style={[{ minHeight: 844 }, isDesktop ? { maxWidth: 480, alignSelf: 'center', width: '100%' } : undefined]} className="bg-white border border-border rounded-lg p-4">
          <View className="items-center mb-4">
            <Feather name="log-out" size={48} color="#00AA6C" />
            <Text className="text-text-primary text-lg font-bold mt-2">Выйти из аккаунта?</Text>
            <Text className="text-text-muted text-sm text-center mt-2">Вы будете отключены от аккаунта на этом устройстве.</Text>
          </View>
          <View className="flex-row gap-3">
            <TouchableOpacity className="flex-1 border border-border py-3 rounded-lg items-center">
              <Text className="text-text-secondary font-semibold">Отмена</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-primary py-3 rounded-lg items-center">
              <Text className="text-white font-semibold">Выйти</Text>
            </TouchableOpacity>
          </View>
        </View>
      </StateSection>
    </View>
  );
}
