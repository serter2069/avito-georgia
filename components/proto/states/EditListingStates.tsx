import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, useWindowDimensions, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StateSection } from '../StateSection';

export default function EditListingStates() {
  const [title, setTitle] = useState('Toyota Camry 2020, 2.5L');
  const [description, setDescription] = useState('Отличное состояние, один владелец.');
  const [price, setPrice] = useState('28500');
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  return (
    <View>
      <StateSection title="loading_data">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>
          <View className="flex-row items-center justify-between h-14 px-4 bg-white border-b border-border"><Text className="text-primary text-lg font-bold">Avito Georgia</Text><View className="flex-row items-center gap-3"><Feather name="search" size={20} color="#737373" /><Feather name="bell" size={20} color="#737373" /></View></View>
          <View style={{ flex: 1 }}>

        <View className="py-16 items-center">
          <ActivityIndicator size="large" color="#00AA6C" />
          <Text className="text-text-muted text-sm mt-3">Загрузка данных...</Text>
        </View>
                </View>
          <View className="flex-row h-14 bg-white border-t border-border items-center">{[{i:"home",l:"Home"},{i:"plus-circle",l:"Post"},{i:"message-circle",l:"Chat"},{i:"user",l:"Profile"}].map(t=>(<View key={t.l} className="flex-1 items-center justify-center"><Feather name={t.i as any} size={20} color="#737373" /><Text className="text-[10px] text-text-muted">{t.l}</Text></View>))}</View>
        </View>
</StateSection>

      <StateSection title="default">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>
          <View className="flex-row items-center justify-between h-14 px-4 bg-white border-b border-border"><Text className="text-primary text-lg font-bold">Avito Georgia</Text><View className="flex-row items-center gap-3"><Feather name="search" size={20} color="#737373" /><Feather name="bell" size={20} color="#737373" /></View></View>
          <View style={{ flex: 1 }}>

        <View style={isDesktop ? { maxWidth: 640, alignSelf: 'center', width: '100%' } : undefined} className="py-4">
          <View className="mb-4">
            <Text className="text-text-secondary text-sm mb-1 font-medium">Заголовок</Text>
            <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary" value={title} onChangeText={setTitle} />
          </View>
          <View className="mb-4">
            <Text className="text-text-secondary text-sm mb-1 font-medium">Описание</Text>
            <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary h-24" value={description} onChangeText={setDescription} multiline />
          </View>
          <View className="mb-4">
            <Text className="text-text-secondary text-sm mb-1 font-medium">Цена</Text>
            <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary" value={price} onChangeText={setPrice} keyboardType="numeric" />
          </View>
          <View className="mb-4">
            <Text className="text-text-secondary text-sm mb-1 font-medium">Фотографии</Text>
            <View className="flex-row gap-3">
              <View className="w-20 h-20 bg-surface border border-border rounded-lg items-center justify-center">
                <Feather name="image" size={24} color="#00AA6C" />
              </View>
              <View className="w-20 h-20 bg-surface border-2 border-dashed border-border rounded-lg items-center justify-center">
                <Feather name="plus" size={24} color="#737373" />
              </View>
            </View>
          </View>
          <TouchableOpacity className="bg-primary py-3 rounded-lg items-center" onPress={() => {}}>
            <Text className="text-white font-semibold">Сохранить</Text>
          </TouchableOpacity>
        </View>
                </View>
          <View className="flex-row h-14 bg-white border-t border-border items-center">{[{i:"home",l:"Home"},{i:"plus-circle",l:"Post"},{i:"message-circle",l:"Chat"},{i:"user",l:"Profile"}].map(t=>(<View key={t.l} className="flex-1 items-center justify-center"><Feather name={t.i as any} size={20} color="#737373" /><Text className="text-[10px] text-text-muted">{t.l}</Text></View>))}</View>
        </View>
</StateSection>

      <StateSection title="saving">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>
          <View className="flex-row items-center justify-between h-14 px-4 bg-white border-b border-border"><Text className="text-primary text-lg font-bold">Avito Georgia</Text><View className="flex-row items-center gap-3"><Feather name="search" size={20} color="#737373" /><Feather name="bell" size={20} color="#737373" /></View></View>
          <View style={{ flex: 1 }}>

        <View style={isDesktop ? { maxWidth: 640, alignSelf: 'center', width: '100%' } : undefined} className="py-4 opacity-50">
          <View className="mb-4">
            <Text className="text-text-secondary text-sm mb-1 font-medium">Заголовок</Text>
            <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary" value={title} editable={false} />
          </View>
          <TouchableOpacity className="bg-primary py-3 rounded-lg items-center">
            <ActivityIndicator color="#ffffff" />
          </TouchableOpacity>
        </View>
                </View>
          <View className="flex-row h-14 bg-white border-t border-border items-center">{[{i:"home",l:"Home"},{i:"plus-circle",l:"Post"},{i:"message-circle",l:"Chat"},{i:"user",l:"Profile"}].map(t=>(<View key={t.l} className="flex-1 items-center justify-center"><Feather name={t.i as any} size={20} color="#737373" /><Text className="text-[10px] text-text-muted">{t.l}</Text></View>))}</View>
        </View>
</StateSection>

      <StateSection title="success">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>
          <View className="flex-row items-center justify-between h-14 px-4 bg-white border-b border-border"><Text className="text-primary text-lg font-bold">Avito Georgia</Text><View className="flex-row items-center gap-3"><Feather name="search" size={20} color="#737373" /><Feather name="bell" size={20} color="#737373" /></View></View>
          <View style={{ flex: 1 }}>

        <View style={isDesktop ? { maxWidth: 640, alignSelf: 'center', width: '100%' } : undefined} className="py-4">
          <View className="bg-success/10 border border-success/30 rounded-lg p-4 flex-row items-center gap-3 mb-4">
            <Feather name="check-circle" size={24} color="#2E7D30" />
            <Text className="text-success text-sm font-medium">Объявление успешно сохранено</Text>
          </View>
          <View className="mb-4">
            <Text className="text-text-secondary text-sm mb-1 font-medium">Заголовок</Text>
            <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary" value={title} onChangeText={setTitle} />
          </View>
          <TouchableOpacity className="bg-primary py-3 rounded-lg items-center" onPress={() => {}}>
            <Text className="text-white font-semibold">Сохранить</Text>
          </TouchableOpacity>
        </View>
                </View>
          <View className="flex-row h-14 bg-white border-t border-border items-center">{[{i:"home",l:"Home"},{i:"plus-circle",l:"Post"},{i:"message-circle",l:"Chat"},{i:"user",l:"Profile"}].map(t=>(<View key={t.l} className="flex-1 items-center justify-center"><Feather name={t.i as any} size={20} color="#737373" /><Text className="text-[10px] text-text-muted">{t.l}</Text></View>))}</View>
        </View>
</StateSection>
    </View>
  );
}
