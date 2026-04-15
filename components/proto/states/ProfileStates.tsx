import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Pressable, useWindowDimensions, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StateSection } from '../StateSection';
import { SkeletonBlock, SkeletonRow, SkeletonCard } from '../SkeletonBlock';
import { mockUsers, mockCities } from '../../../constants/protoMockData';

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

const user = mockUsers[0];

function navTo(pageId: string) {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    window.open(`/proto/states/${pageId}`, '_self');
  }
}

export default function ProfileStates() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [selectedCity, setSelectedCity] = useState(user.city);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const containerStyle = isDesktop ? { maxWidth: 960, alignSelf: 'center' as const, width: '100%' } : {};

  const AvatarSection = () => (
    <View style={{ position: 'relative', marginBottom: 16 }}>
      <Image
        source={{ uri: user.avatar }}
        style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: C.page }}
      />
      {isEditing && (
        <TouchableOpacity style={{
          position: 'absolute', bottom: 0, right: 0,
          backgroundColor: C.primary, width: 32, height: 32, borderRadius: 16,
          alignItems: 'center', justifyContent: 'center',
          borderWidth: 2, borderColor: C.white,
        }}>
          <Feather name="camera" size={14} color="#fff" />
        </TouchableOpacity>
      )}
      {user.isPremium && !isEditing && (
        <View style={{
          position: 'absolute', top: -2, right: -2,
          backgroundColor: '#D4A017', paddingHorizontal: 6, paddingVertical: 2,
          borderRadius: 8, borderWidth: 1.5, borderColor: C.white,
        }}>
          <Text style={{ color: '#fff', fontSize: 8, fontWeight: '800', letterSpacing: 0.5 }}>PREMIUM</Text>
        </View>
      )}
    </View>
  );

  const FormField = ({ label, value, onChangeText, editable, icon, locked }: {
    label: string; value: string; onChangeText?: (t: string) => void;
    editable?: boolean; icon?: string; locked?: boolean;
  }) => (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontSize: 13, fontWeight: '500', color: C.muted, marginBottom: 4 }}>{label}</Text>
      <View style={{
        backgroundColor: locked ? `${C.page}` : C.white,
        borderWidth: 1, borderColor: isEditing && !locked ? C.primary : C.border,
        borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {locked ? (
          <>
            <Text style={{ fontSize: 15, color: C.muted }}>{value}</Text>
            <Feather name="lock" size={14} color={C.muted} />
          </>
        ) : (
          <TextInput
            style={{ flex: 1, fontSize: 15, color: C.text }}
            value={value}
            onChangeText={onChangeText}
            editable={editable !== false}
            autoFocus={false}
          />
        )}
      </View>
    </View>
  );

  const ProfileForm = () => (
    <View>
      <FormField label="Имя" value={name} onChangeText={setName} editable={isEditing} />
      <FormField label="Email" value={user.email} locked />
      <FormField label="Телефон" value={phone} onChangeText={setPhone} editable={isEditing} />

      {/* City selector */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 13, fontWeight: '500', color: C.muted, marginBottom: 4 }}>Город</Text>
        {isEditing ? (
          <View>
            <Pressable
              onPress={() => setShowCityPicker(!showCityPicker)}
              style={{
                backgroundColor: C.white, borderWidth: 1, borderColor: C.primary,
                borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10,
                flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
              }}
            >
              <Text style={{ fontSize: 15, color: C.text }}>{selectedCity}</Text>
              <Feather name="chevron-down" size={16} color={C.text} />
            </Pressable>
            {showCityPicker && (
              <View style={{
                backgroundColor: C.white, borderWidth: 1, borderColor: C.border,
                borderRadius: 8, marginTop: 4, overflow: 'hidden',
                shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1, shadowRadius: 8, elevation: 4,
              }}>
                {mockCities.map(city => (
                  <Pressable
                    key={city}
                    onPress={() => { setSelectedCity(city); setShowCityPicker(false); }}
                    style={{
                      paddingHorizontal: 12, paddingVertical: 10,
                      backgroundColor: selectedCity === city ? C.primaryBg : C.white,
                      borderBottomWidth: 1, borderBottomColor: C.border,
                    }}
                  >
                    <Text style={{
                      fontSize: 14, fontWeight: selectedCity === city ? '600' : '400',
                      color: selectedCity === city ? C.primary : C.text,
                    }}>{city}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        ) : (
          <View style={{
            backgroundColor: C.white, borderWidth: 1, borderColor: C.border,
            borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10,
          }}>
            <Text style={{ fontSize: 15, color: C.text }}>{selectedCity}</Text>
          </View>
        )}
      </View>

      {/* Registration date */}
      {!isEditing && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 }}>
          <Feather name="calendar" size={14} color={C.muted} />
          <Text style={{ fontSize: 12, color: C.muted }}>На платформе с {user.createdAt}</Text>
        </View>
      )}

      {/* Premium banner */}
      {!user.isPremium && !isEditing && (
        <Pressable
          onPress={() => navTo('subscription')}
          style={{
            backgroundColor: `linear-gradient(135deg, ${C.primaryBg}, #D4EDE8)`,
            borderWidth: 1, borderColor: C.primary,
            borderRadius: 12, padding: 16, marginBottom: 16,
            flexDirection: 'row', alignItems: 'center', gap: 12,
          }}
        >
          <View style={{
            width: 40, height: 40, borderRadius: 20,
            backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center',
          }}>
            <Feather name="award" size={20} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: C.text }}>Premium подписка</Text>
            <Text style={{ fontSize: 12, color: C.muted }}>Безлимитные объявления, приоритет в поиске</Text>
          </View>
          <Feather name="chevron-right" size={18} color={C.primary} />
        </Pressable>
      )}

      {isEditing ? (
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity
            style={{ flex: 1, borderWidth: 1, borderColor: C.border, paddingVertical: 12, borderRadius: 8, alignItems: 'center' }}
            onPress={() => setIsEditing(false)}
          >
            <Text style={{ fontWeight: '600', color: C.muted }}>Отмена</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flex: 1, backgroundColor: C.primary, paddingVertical: 12, borderRadius: 8, alignItems: 'center' }}
            onPress={() => setIsEditing(false)}
          >
            <Text style={{ fontWeight: '600', color: '#fff' }}>Сохранить</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={{ backgroundColor: C.primary, paddingVertical: 12, borderRadius: 8, alignItems: 'center' }}
          onPress={() => setIsEditing(true)}
        >
          <Text style={{ fontWeight: '600', color: '#fff' }}>Редактировать профиль</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View>
      <StateSection title="DEFAULT">
        <View style={[{ minHeight: 844 }, containerStyle]}>
          {isDesktop ? (
            <View style={{ paddingVertical: 16 }}>
              <View style={{ flexDirection: 'row', gap: 32 }}>
                <View style={{ width: 140, alignItems: 'center' }}>
                  <AvatarSection />
                  <Text style={{ fontSize: 18, fontWeight: '700', color: C.text, textAlign: 'center' }}>{user.name}</Text>
                  {user.isPremium && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                      <Feather name="award" size={14} color="#D4A017" />
                      <Text style={{ fontSize: 12, fontWeight: '600', color: '#D4A017' }}>Premium</Text>
                    </View>
                  )}
                </View>
                <View style={{ flex: 1, maxWidth: 480 }}>
                  <ProfileForm />
                </View>
              </View>
            </View>
          ) : (
            <View style={{ paddingVertical: 16, paddingHorizontal: 4, alignItems: 'center' }}>
              <AvatarSection />
              <Text style={{ fontSize: 18, fontWeight: '700', color: C.text, marginBottom: 4 }}>{user.name}</Text>
              {user.isPremium && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 12 }}>
                  <Feather name="award" size={14} color="#D4A017" />
                  <Text style={{ fontSize: 12, fontWeight: '600', color: '#D4A017' }}>Premium</Text>
                </View>
              )}
              <View style={{ width: '100%' }}>
                <ProfileForm />
              </View>
            </View>
          )}
        </View>
      </StateSection>

      <StateSection title="SAVING">
        <View style={[{ minHeight: 844 }, containerStyle]} style={{ minHeight: 844, opacity: 0.6 }}>
          <View style={{ paddingVertical: 16, alignItems: 'center' }}>
            <AvatarSection />
            <View style={{ width: '100%', marginTop: 12 }}>
              <FormField label="Имя" value={name} />
              <FormField label="Email" value={user.email} locked />
              <TouchableOpacity style={{ backgroundColor: C.primary, paddingVertical: 12, borderRadius: 8, alignItems: 'center', opacity: 0.7 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.4)' }} />
                  <Text style={{ color: 'rgba(255,255,255,0.8)', fontWeight: '600' }}>Сохранение...</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </StateSection>

      <StateSection title="SAVED">
        <View style={[{ minHeight: 844 }, containerStyle]}>
          <View style={{
            backgroundColor: 'rgba(46,125,48,0.08)', borderWidth: 1, borderColor: 'rgba(46,125,48,0.25)',
            borderRadius: 8, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16,
          }}>
            <Feather name="check-circle" size={20} color={C.success} />
            <Text style={{ fontSize: 14, fontWeight: '500', color: C.success }}>Профиль успешно сохранён</Text>
          </View>
          <View style={{ paddingVertical: 8, alignItems: 'center' }}>
            <AvatarSection />
            <View style={{ width: '100%', marginTop: 12 }}>
              <FormField label="Имя" value={name} />
              <FormField label="Город" value={selectedCity} />
              <FormField label="Email" value={user.email} locked />
            </View>
          </View>
        </View>
      </StateSection>

      <StateSection title="ERROR">
        <View style={[{ minHeight: 844 }, containerStyle]}>
          <View style={{
            backgroundColor: 'rgba(192,57,43,0.08)', borderWidth: 1, borderColor: 'rgba(192,57,43,0.25)',
            borderRadius: 8, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16,
          }}>
            <Feather name="alert-circle" size={20} color={C.error} />
            <Text style={{ fontSize: 14, fontWeight: '500', color: C.error }}>Ошибка сохранения. Попробуйте ещё раз.</Text>
          </View>
          <View style={{ paddingVertical: 8, alignItems: 'center' }}>
            <AvatarSection />
            <View style={{ width: '100%', marginTop: 12 }}>
              <ProfileForm />
            </View>
          </View>
        </View>
      </StateSection>
    </View>
  );
}
