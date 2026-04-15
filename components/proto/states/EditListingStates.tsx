import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Pressable, useWindowDimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StateSection } from '../StateSection';
import { SkeletonBlock, SkeletonRow, SkeletonCard } from '../SkeletonBlock';
import { mockListings, mockCategories, mockCategoryIcons, mockCities } from '../../../constants/protoMockData';

const C = {
  primary: '#0A7B8A',
  primaryBg: '#E8F4F8',
  white: '#FFFFFF',
  page: '#F2F8FA',
  text: '#0A2840',
  muted: '#6A8898',
  border: '#C8E0E8',
  error: '#C0392B',
  success: '#2E7D30',
};

const listing = mockListings[0];

export default function EditListingStates() {
  const [title, setTitle] = useState(listing.title);
  const [description, setDescription] = useState('Отличное состояние, один владелец. Полная комплектация, кожаный салон, навигация. Пробег 45 000 км.');
  const [price, setPrice] = useState(String(listing.price));
  const [phone, setPhone] = useState('+995 555 12 34 56');
  const [selectedCity, setSelectedCity] = useState(listing.city);
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const containerStyle = isDesktop ? { maxWidth: 960, alignSelf: 'center' as const, width: '100%' } : {};

  const existingPhotos = [
    `https://picsum.photos/seed/edit-photo1/400/300`,
    `https://picsum.photos/seed/edit-photo2/400/300`,
    `https://picsum.photos/seed/edit-photo3/400/300`,
  ];

  const FormContent = ({ editable }: { editable: boolean }) => (
    <View>
      {/* Category (locked) */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 13, fontWeight: '500', color: C.muted, marginBottom: 4 }}>Категория</Text>
        <View style={{
          backgroundColor: C.page, borderWidth: 1, borderColor: C.border,
          borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10,
          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Feather name={mockCategoryIcons[listing.category] as any || 'grid'} size={16} color={C.primary} />
            <Text style={{ fontSize: 15, color: C.muted }}>{listing.category}</Text>
          </View>
          <Feather name="lock" size={14} color={C.muted} />
        </View>
        <Text style={{ fontSize: 11, color: C.muted, marginTop: 4, fontStyle: 'italic' }}>Категорию нельзя изменить после публикации</Text>
      </View>

      {/* City */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 13, fontWeight: '500', color: C.muted, marginBottom: 4 }}>Город</Text>
        <View style={{
          backgroundColor: C.page, borderWidth: 1, borderColor: C.border,
          borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10,
          flexDirection: 'row', alignItems: 'center', gap: 6,
        }}>
          <Feather name="map-pin" size={14} color={C.primary} />
          <Text style={{ fontSize: 15, color: C.muted }}>{selectedCity}</Text>
        </View>
      </View>

      {/* Title */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 13, fontWeight: '500', color: C.muted, marginBottom: 4 }}>Заголовок</Text>
        <TextInput
          style={{
            backgroundColor: C.white, borderWidth: 1, borderColor: editable ? C.primary : C.border,
            borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, color: C.text,
          }}
          value={title}
          onChangeText={setTitle}
          editable={editable}
        />
      </View>

      {/* Description */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 13, fontWeight: '500', color: C.muted, marginBottom: 4 }}>Описание</Text>
        <TextInput
          style={{
            backgroundColor: C.white, borderWidth: 1, borderColor: editable ? C.primary : C.border,
            borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, color: C.text,
            height: 100, textAlignVertical: 'top',
          }}
          value={description}
          onChangeText={setDescription}
          multiline
          editable={editable}
        />
      </View>

      {/* Price */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 13, fontWeight: '500', color: C.muted, marginBottom: 4 }}>Цена</Text>
        <View style={{
          flexDirection: 'row', alignItems: 'center', gap: 8,
        }}>
          <TextInput
            style={{
              flex: 1, backgroundColor: C.white, borderWidth: 1, borderColor: editable ? C.primary : C.border,
              borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, color: C.text,
            }}
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            editable={editable}
          />
          <View style={{
            backgroundColor: C.primaryBg, borderWidth: 1, borderColor: C.border,
            borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10,
          }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: C.primary }}>GEL</Text>
          </View>
        </View>
      </View>

      {/* Phone */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 13, fontWeight: '500', color: C.muted, marginBottom: 4 }}>Телефон</Text>
        <TextInput
          style={{
            backgroundColor: C.white, borderWidth: 1, borderColor: editable ? C.primary : C.border,
            borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, color: C.text,
          }}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          editable={editable}
        />
      </View>
    </View>
  );

  return (
    <View>
      <StateSection title="LOADING_DATA">
        <View style={[{ minHeight: 844 }, containerStyle]}>
          <View style={{ paddingVertical: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Feather name="edit-3" size={20} color={C.primary} />
              <Text style={{ fontSize: 18, fontWeight: '700', color: C.text }}>Редактирование</Text>
            </View>
            <View style={{ gap: 16 }}>
              <SkeletonBlock width="100%" height={80} radius={8} />
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <SkeletonBlock width={100} height={80} radius={8} />
                <SkeletonBlock width={100} height={80} radius={8} />
                <SkeletonBlock width={100} height={80} radius={8} />
              </View>
              <SkeletonBlock width="40%" height={14} />
              <SkeletonBlock width="100%" height={44} radius={8} />
              <SkeletonBlock width="40%" height={14} />
              <SkeletonBlock width="100%" height={44} radius={8} />
              <SkeletonBlock width="40%" height={14} />
              <SkeletonBlock width="100%" height={80} radius={8} />
              <SkeletonBlock width="40%" height={14} />
              <SkeletonBlock width="100%" height={44} radius={8} />
            </View>
          </View>
        </View>
      </StateSection>

      <StateSection title="DEFAULT">
        <View style={[{ minHeight: 844 }, containerStyle]}>
          <View style={{ paddingVertical: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Feather name="edit-3" size={20} color={C.primary} />
              <Text style={{ fontSize: 18, fontWeight: '700', color: C.text }}>Редактирование</Text>
            </View>

            {/* Photos section */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 13, fontWeight: '500', color: C.muted, marginBottom: 8 }}>Фотографии ({existingPhotos.length}/10)</Text>
              <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                {existingPhotos.map((uri, idx) => (
                  <View key={idx} style={{ position: 'relative' }}>
                    <Image
                      source={{ uri }}
                      style={{ width: 100, height: 80, borderRadius: 8, backgroundColor: C.page }}
                      resizeMode="cover"
                    />
                    <Pressable style={{
                      position: 'absolute', top: 4, right: 4,
                      backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 10,
                      width: 20, height: 20, alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Feather name="x" size={10} color="#fff" />
                    </Pressable>
                    {idx === 0 && (
                      <View style={{
                        position: 'absolute', bottom: 4, left: 4,
                        backgroundColor: C.primary, borderRadius: 4,
                        paddingHorizontal: 4, paddingVertical: 1,
                      }}>
                        <Text style={{ fontSize: 8, color: '#fff', fontWeight: '600' }}>Главное</Text>
                      </View>
                    )}
                  </View>
                ))}
                <TouchableOpacity style={{
                  width: 100, height: 80, borderRadius: 8,
                  borderWidth: 2, borderColor: C.border, borderStyle: 'dashed',
                  alignItems: 'center', justifyContent: 'center',
                  backgroundColor: C.page,
                }}>
                  <Feather name="plus" size={24} color={C.muted} />
                  <Text style={{ fontSize: 9, color: C.muted, marginTop: 2 }}>Добавить</Text>
                </TouchableOpacity>
              </View>
            </View>

            <FormContent editable={true} />

            <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
              <TouchableOpacity
                style={{ flex: 1, borderWidth: 1, borderColor: C.border, paddingVertical: 12, borderRadius: 8, alignItems: 'center' }}
              >
                <Text style={{ fontWeight: '600', color: C.muted }}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flex: 1, backgroundColor: C.primary, paddingVertical: 12, borderRadius: 8, alignItems: 'center' }}
              >
                <Text style={{ fontWeight: '600', color: '#fff' }}>Сохранить</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </StateSection>

      <StateSection title="SAVING">
        <View style={[{ minHeight: 844, opacity: 0.6 }, containerStyle]}>
          <View style={{ paddingVertical: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Feather name="edit-3" size={20} color={C.primary} />
              <Text style={{ fontSize: 18, fontWeight: '700', color: C.text }}>Редактирование</Text>
            </View>

            {/* Photos */}
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
              {existingPhotos.slice(0, 2).map((uri, idx) => (
                <Image key={idx} source={{ uri }} style={{ width: 100, height: 80, borderRadius: 8, backgroundColor: C.page }} resizeMode="cover" />
              ))}
            </View>

            <FormContent editable={false} />
            <TouchableOpacity style={{ backgroundColor: C.primary, paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 8, opacity: 0.7 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.4)' }} />
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontWeight: '600' }}>Сохранение...</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </StateSection>

      <StateSection title="SUCCESS">
        <View style={[{ minHeight: 844 }, containerStyle]}>
          <View style={{ paddingVertical: 16 }}>
            <View style={{
              backgroundColor: 'rgba(46,125,48,0.08)', borderWidth: 1, borderColor: 'rgba(46,125,48,0.25)',
              borderRadius: 8, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16,
            }}>
              <Feather name="check-circle" size={20} color={C.success} />
              <View>
                <Text style={{ fontSize: 14, fontWeight: '600', color: C.success }}>Объявление сохранено</Text>
                <Text style={{ fontSize: 12, color: C.muted }}>Изменения отправлены на модерацию</Text>
              </View>
            </View>

            {/* Updated listing preview */}
            <View style={{
              backgroundColor: C.white, borderRadius: 12, borderWidth: 1, borderColor: C.border,
              overflow: 'hidden', marginBottom: 16,
            }}>
              <Image source={{ uri: existingPhotos[0] }} style={{ width: '100%', height: 160 }} resizeMode="cover" />
              <View style={{ padding: 12 }}>
                <Text style={{ fontSize: 17, fontWeight: '700', color: C.text, marginBottom: 4 }}>{title}</Text>
                <Text style={{ fontSize: 20, fontWeight: '800', color: C.primary, marginBottom: 4 }}>
                  {parseInt(price).toLocaleString()} GEL
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Feather name="map-pin" size={12} color={C.muted} />
                  <Text style={{ fontSize: 12, color: C.muted }}>{selectedCity}</Text>
                  <Feather name="tag" size={12} color={C.muted} style={{ marginLeft: 8 }} />
                  <Text style={{ fontSize: 12, color: C.muted }}>{listing.category}</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={{ backgroundColor: C.primary, paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginBottom: 8 }}
            >
              <Text style={{ fontWeight: '600', color: '#fff' }}>Мои объявления</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ borderWidth: 1, borderColor: C.border, paddingVertical: 12, borderRadius: 8, alignItems: 'center' }}
            >
              <Text style={{ fontWeight: '600', color: C.muted }}>На главную</Text>
            </TouchableOpacity>
          </View>
        </View>
      </StateSection>
    </View>
  );
}
