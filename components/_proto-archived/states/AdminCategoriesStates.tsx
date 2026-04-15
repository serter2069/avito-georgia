import { View, Text, TextInput, TouchableOpacity, ActivityIndicator,
  useWindowDimensions} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { StateSection } from '../StateSection';
import { mockCategoryIcons } from '../../../constants/protoMockData';

const categoryTree = [
  {
    id: 'transport',
    name: 'Транспорт',
    children: ['Легковые автомобили', 'Мотоциклы', 'Грузовики', 'Запчасти'],
  },
  {
    id: 'realty',
    name: 'Недвижимость',
    children: ['Квартиры', 'Дома', 'Коммерческая', 'Земля'],
  },
  {
    id: 'electronics',
    name: 'Электроника',
    children: ['Телефоны', 'Ноутбуки', 'Планшеты', 'Аксессуары'],
  },
  { id: 'clothes', name: 'Одежда', children: ['Мужская', 'Женская', 'Детская'] },
  { id: 'furniture', name: 'Мебель', children: ['Диваны', 'Столы', 'Кровати'] },
  { id: 'services', name: 'Услуги', children: ['Ремонт', 'Уборка', 'Красота'] },
  { id: 'jobs', name: 'Работа', children: ['Полная занятость', 'Подработка', 'Удалённо'] },
  { id: 'kids', name: 'Детское', children: ['Игрушки', 'Одежда', 'Коляски'] },
  { id: 'animals', name: 'Животные', children: ['Собаки', 'Кошки', 'Птицы'] },
  { id: 'hobby', name: 'Хобби', children: ['Спорт', 'Книги', 'Музыка'] },
];

function CategoryRow({ cat }: { cat: typeof categoryTree[0] }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <View className="border-b border-border">
      <TouchableOpacity className="flex-row items-center gap-3 py-3" onPress={() => setExpanded(!expanded)}>
        <View className="w-10 h-10 bg-surface rounded-lg items-center justify-center">
          <Feather name={mockCategoryIcons[cat.name] as any || 'grid'} size={18} color="#00AA6C" />
        </View>
        <Text className="text-text-primary text-base flex-1">{cat.name}</Text>
        <Text className="text-text-muted text-xs mr-2">{cat.children.length}</Text>
        <Feather name={expanded ? 'chevron-up' : 'chevron-down'} size={16} color="#737373" />
        <TouchableOpacity className="ml-2">
          <Feather name="edit-2" size={18} color="#737373" />
        </TouchableOpacity>
      </TouchableOpacity>
      {expanded && (
        <View className="pl-14 pb-2">
          {cat.children.map((child) => (
            <View key={child} className="flex-row items-center gap-2 py-1.5">
              <View className="w-1.5 h-1.5 bg-border rounded-full" />
              <Text className="text-text-secondary text-sm flex-1">{child}</Text>
              <TouchableOpacity className="mr-3">
                <Feather name="edit-2" size={14} color="#737373" />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity className="flex-row items-center gap-2 py-1.5 mt-1">
            <Feather name="plus" size={14} color="#00AA6C" />
            <Text className="text-primary text-sm">Добавить подкатегорию</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export default function AdminCategoriesStates() {  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const containerStyle = isDesktop ? { maxWidth: 960, alignSelf: 'center' as const, width: '100%' } : {};

  return (
    <View>
      <StateSection title="default">
        <View style={[{ minHeight: 844 }, containerStyle]}>
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-text-primary text-lg font-bold">Категории ({categoryTree.length})</Text>
            <TouchableOpacity className="bg-primary px-3 py-2 rounded-lg">
              <Text className="text-white text-sm font-semibold">Добавить</Text>
            </TouchableOpacity>
          </View>
          {categoryTree.map((cat) => (
            <CategoryRow key={cat.id} cat={cat} />
          ))}
        </View>
      </StateSection>

      <StateSection title="loading">
        <View style={[{ minHeight: 844 }, containerStyle]} className="py-16 items-center">
          <ActivityIndicator size="large" color="#00AA6C" />
        </View>
      </StateSection>

      <StateSection title="add_modal">
        <View style={[{ minHeight: 844 }, containerStyle]} className="bg-white border border-border rounded-lg p-4">
          <Text className="text-text-primary text-lg font-bold mb-4">Новая категория</Text>
          <View className="mb-3">
            <Text className="text-text-secondary text-sm mb-1 font-medium">Название (RU)</Text>
            <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary" placeholder="Электроника" placeholderTextColor="#737373" editable={false} />
          </View>
          <View className="mb-3">
            <Text className="text-text-secondary text-sm mb-1 font-medium">Название (KA)</Text>
            <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary" placeholder="ელექტრონიკა" placeholderTextColor="#737373" editable={false} />
          </View>
          <View className="mb-4">
            <Text className="text-text-secondary text-sm mb-1 font-medium">Название (EN)</Text>
            <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary" placeholder="Electronics" placeholderTextColor="#737373" editable={false} />
          </View>
          <View className="flex-row gap-3">
            <TouchableOpacity className="flex-1 border border-border py-3 rounded-lg items-center">
              <Text className="text-text-secondary font-semibold">Отмена</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-primary py-3 rounded-lg items-center">
              <Text className="text-white font-semibold">Добавить</Text>
            </TouchableOpacity>
          </View>
        </View>
      </StateSection>

      <StateSection title="edit_modal">
        <View style={[{ minHeight: 844 }, containerStyle]} className="bg-white border border-border rounded-lg p-4">
          <Text className="text-text-primary text-lg font-bold mb-1">Редактировать категорию</Text>
          <Text className="text-text-muted text-sm mb-4">Транспорт</Text>
          <View className="mb-3">
            <Text className="text-text-secondary text-sm mb-1 font-medium">Название (RU)</Text>
            <TextInput className="bg-surface border border-border-focus rounded-lg px-4 py-3 text-text-primary" value="Транспорт" editable={false} />
          </View>
          <View className="mb-3">
            <Text className="text-text-secondary text-sm mb-1 font-medium">Название (KA)</Text>
            <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary" value="ტრანსპორტი" editable={false} />
          </View>
          <View className="mb-4">
            <Text className="text-text-secondary text-sm mb-1 font-medium">Название (EN)</Text>
            <TextInput className="bg-surface border border-border rounded-lg px-4 py-3 text-text-primary" value="Transport" editable={false} />
          </View>
          <View className="flex-row gap-3">
            <TouchableOpacity className="flex-1 border border-border py-3 rounded-lg items-center">
              <Text className="text-text-secondary font-semibold">Отмена</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-primary py-3 rounded-lg items-center">
              <Text className="text-white font-semibold">Сохранить</Text>
            </TouchableOpacity>
          </View>
        </View>
      </StateSection>
    </View>
  );
}
