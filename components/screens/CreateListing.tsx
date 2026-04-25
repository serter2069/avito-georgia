import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, useWindowDimensions, Image, Platform } from 'react-native';
import BottomNav from '../BottomNav';
import { apiFetch } from '../../lib/api';

const C = {
  green: '#00AA6C',
  greenBg: '#E8F9F2',
  white: '#FFFFFF',
  text: '#1A1A1A',
  muted: '#9E9E9E',
  border: '#E8E8E8',
  page: '#F5F5F5',
  error: '#D32F2F',
};

interface Category { id: string; name: string; slug: string; }
interface City { id: string; name: string; }

interface FormState {
  title: string;
  desc: string;
  price: string;
  categoryId: string;
  cityId: string;
}

export interface CreateListingProps {
  onSubmit: (data: {
    title: string;
    price: string;
    categoryId: string;
    cityId: string;
    description?: string;
    selectedFiles?: File[];
  }) => void;
  loading?: boolean;
  error?: string;
}

function StepIndicator({ step }: { step: number }) {
  const steps = ['Фото', 'Описание', 'Цена и контакты'];
  return (
    <View style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border, backgroundColor: C.white }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        {steps.map((label, i) => {
          const num = i + 1;
          const active = num === step;
          const done = num < step;
          return (
            <React.Fragment key={num}>
              <View style={{ alignItems: 'center' }}>
                <View style={{
                  width: 26, height: 26, borderRadius: 13,
                  backgroundColor: done || active ? C.green : C.border,
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Text style={{ color: done || active ? C.white : C.muted, fontSize: 12, fontWeight: '700' }}>
                    {done ? '✓' : String(num)}
                  </Text>
                </View>
                <Text style={{ fontSize: 12, color: active ? C.green : C.muted, marginTop: 3, fontWeight: active ? '600' : '400' }}>
                  {label}
                </Text>
              </View>
              {i < steps.length - 1 && (
                <View style={{ flex: 1, height: 2, backgroundColor: done ? C.green : C.border, marginHorizontal: 4, marginBottom: 16 }} />
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
}

function FieldLabel({ text }: { text: string }) {
  return <Text style={{ fontSize: 13, fontWeight: '600', color: C.text, marginBottom: 6 }}>{text}</Text>;
}

// --- STEP 1: Фото ---
function Step1({ onNext, selectedFiles, onFilesChange }: {
  onNext: () => void;
  selectedFiles: File[];
  onFilesChange: (files: File[]) => void;
}) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 640;
  const fileInputRef = useRef<any>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  // Revoke old object URLs on unmount
  useEffect(() => {
    return () => { previews.forEach(url => URL.revokeObjectURL(url)); };
  }, [previews]);

  const handleFileChange = (e: any) => {
    const files: File[] = Array.from(e.target.files as FileList);
    if (!files.length) return;
    // Combine with existing, cap at 10
    const combined = [...selectedFiles, ...files].slice(0, 10);
    onFilesChange(combined);
    const newPreviews = combined.map(f => URL.createObjectURL(f));
    setPreviews(newPreviews);
  };

  const removePhoto = (idx: number) => {
    URL.revokeObjectURL(previews[idx]);
    const newFiles = selectedFiles.filter((_, i) => i !== idx);
    const newPreviews = previews.filter((_, i) => i !== idx);
    onFilesChange(newFiles);
    setPreviews(newPreviews);
  };

  const photoArea = (
    <View style={{ padding: 16 }}>
      {/* Hidden native file input (web only) */}
      {Platform.OS === 'web' && (
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      )}

      {previews.length === 0 ? (
        <Pressable
          onPress={() => fileInputRef.current?.click()}
          style={{
            borderWidth: 2, borderStyle: 'dashed', borderColor: C.border, borderRadius: 10,
            paddingVertical: 48, alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 32, color: C.muted, marginBottom: 8 }}>+</Text>
          <Text style={{ fontSize: 15, fontWeight: '600', color: C.green }}>Добавить фото</Text>
          <Text style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>до 10 фотографий</Text>
        </Pressable>
      ) : (
        <View>
          <Text style={{ fontSize: 13, fontWeight: '600', color: C.text, marginBottom: 10 }}>
            Фото ({previews.length}/10)
          </Text>
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            {previews.map((uri, i) => (
              <View key={i} style={{ position: 'relative' }}>
                <Image
                  source={{ uri }}
                  style={{ width: 90, height: 90, borderRadius: 8 }}
                />
                <Pressable
                  onPress={() => removePhoto(i)}
                  style={{
                    position: 'absolute', top: -6, right: -6,
                    width: 24, height: 24, borderRadius: 12,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Text style={{ color: C.white, fontSize: 12, fontWeight: '700', lineHeight: 16 }}>✕</Text>
                </Pressable>
              </View>
            ))}
            {previews.length < 10 && (
              <Pressable
                onPress={() => fileInputRef.current?.click()}
                style={{
                  width: 90, height: 90, borderRadius: 8, borderWidth: 2,
                  borderStyle: 'dashed', borderColor: C.border,
                  alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 26, color: C.green }}>+</Text>
              </Pressable>
            )}
          </View>
        </View>
      )}

      <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'flex-end' }}>
        <Pressable onPress={onNext} style={{ backgroundColor: C.green, borderRadius: 8, paddingHorizontal: 32, paddingVertical: 12 }}>
          <Text style={{ color: C.white, fontWeight: '700', fontSize: 15 }}>Далее</Text>
        </Pressable>
      </View>
    </View>
  );

  if (isDesktop) {
    return (
      <View style={{ flexDirection: 'row', gap: 24 }}>
        <View style={{ flex: 2 }}>{photoArea}</View>
        <View style={{ flex: 1, padding: 16, paddingLeft: 0 }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: C.text, marginBottom: 10 }}>Предпросмотр</Text>
          {previews[0] && (
            <Image source={{ uri: previews[0] }} style={{ width: '100%', height: 160, borderRadius: 8 }} />
          )}
        </View>
      </View>
    );
  }
  return photoArea;
}

// --- STEP 2: Описание ---
function Step2({
  onNext, onBack, form, setForm, categories, cities, loadingMeta,
}: {
  onNext: () => void;
  onBack: () => void;
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  categories: Category[];
  cities: City[];
  loadingMeta: boolean;
}) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 640;

  const formEl = (
    <View style={{ padding: 16, gap: 14 }}>
      <View>
        <FieldLabel text="Заголовок" />
        <View style={{ borderWidth: 1, borderColor: C.border, borderRadius: 8 }}>
          <TextInput
            value={form.title}
            onChangeText={v => setForm(f => ({ ...f, title: v }))}
            placeholder="Что продаёте?"
            placeholderTextColor={C.muted}
            style={{ borderWidth: 0, backgroundColor: 'transparent', paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, color: C.text, outlineWidth: 0 } as any}
          />
        </View>
      </View>

      {/* Category select */}
      <View style={{ marginBottom: 4 }}>
        <FieldLabel text="Категория" />
        {loadingMeta ? (
          <ActivityIndicator size="small" color={C.green} />
        ) : (
          <View style={{ borderWidth: 1, borderColor: C.border, borderRadius: 8, backgroundColor: C.white, overflow: 'hidden' }}>
            {categories.map((cat, idx) => (
              <Pressable
                key={cat.id}
                onPress={() => setForm(f => ({ ...f, categoryId: cat.id }))}
                style={{
                  flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                  paddingHorizontal: 12, paddingVertical: 10,
                  borderBottomWidth: idx < categories.length - 1 ? 1 : 0,
                  borderBottomColor: C.border,
                  backgroundColor: form.categoryId === cat.id ? C.greenBg : C.white,
                }}
              >
                <Text style={{ fontSize: 15, color: C.text }}>{cat.name}</Text>
                {form.categoryId === cat.id && <Text style={{ color: C.green }}>✓</Text>}
              </Pressable>
            ))}
          </View>
        )}
      </View>

      <View>
        <FieldLabel text="Описание" />
        <View style={{ borderWidth: 1, borderColor: C.border, borderRadius: 8 }}>
          <TextInput
            value={form.desc}
            onChangeText={v => setForm(f => ({ ...f, desc: v }))}
            placeholder="Опишите товар подробнее..."
            placeholderTextColor={C.muted}
            multiline
            numberOfLines={4}
            style={{ borderWidth: 0, backgroundColor: 'transparent', paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, color: C.text, outlineWidth: 0, minHeight: 100, textAlignVertical: 'top' } as any}
          />
        </View>
      </View>

      {/* City select */}
      <View style={{ marginBottom: 4 }}>
        <FieldLabel text="Город" />
        {loadingMeta ? (
          <ActivityIndicator size="small" color={C.green} />
        ) : (
          <View style={{ borderWidth: 1, borderColor: C.border, borderRadius: 8, backgroundColor: C.white, overflow: 'hidden' }}>
            {cities.map((city, idx) => (
              <Pressable
                key={city.id}
                onPress={() => setForm(f => ({ ...f, cityId: city.id }))}
                style={{
                  flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                  paddingHorizontal: 12, paddingVertical: 10,
                  borderBottomWidth: idx < cities.length - 1 ? 1 : 0,
                  borderBottomColor: C.border,
                  backgroundColor: form.cityId === city.id ? C.greenBg : C.white,
                }}
              >
                <Text style={{ fontSize: 15, color: C.text }}>{city.name}</Text>
                {form.cityId === city.id && <Text style={{ color: C.green }}>✓</Text>}
              </Pressable>
            ))}
          </View>
        )}
      </View>

      <View style={{ flexDirection: 'row', gap: 10, marginTop: 6 }}>
        <Pressable onPress={onBack} style={{ flex: 1, borderWidth: 1, borderColor: C.border, borderRadius: 8, paddingVertical: 12, alignItems: 'center' }}>
          <Text style={{ fontSize: 15, fontWeight: '600', color: C.muted }}>Назад</Text>
        </Pressable>
        <Pressable onPress={onNext} style={{ flex: 2, backgroundColor: C.green, borderRadius: 8, paddingVertical: 12, alignItems: 'center' }}>
          <Text style={{ color: C.white, fontWeight: '700', fontSize: 15 }}>Далее</Text>
        </Pressable>
      </View>
    </View>
  );

  if (isDesktop) {
    return (
      <View style={{ flexDirection: 'row', gap: 24 }}>
        <View style={{ flex: 2 }}>{formEl}</View>
        <View style={{ flex: 1, padding: 16, paddingLeft: 0 }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: C.text, marginBottom: 10 }}>Предпросмотр</Text>
        </View>
      </View>
    );
  }
  return formEl;
}

// --- STEP 3: Цена и контакты ---
function Step3({
  onBack, form, setForm, onSubmit, loading, error,
}: {
  onBack: () => void;
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  onSubmit: () => void;
  loading?: boolean;
  error?: string;
}) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 640;

  const formEl = (
    <View style={{ padding: 16, gap: 14 }}>
      <View>
        <FieldLabel text="Цена" />
        <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: C.border, borderRadius: 8, paddingHorizontal: 12 }}>
          <TextInput
            value={form.price}
            onChangeText={v => setForm(f => ({ ...f, price: v }))}
            placeholder="0"
            placeholderTextColor={C.muted}
            keyboardType="numeric"
            style={{ flex: 1, fontSize: 15, color: C.text, paddingVertical: 10, borderWidth: 0, backgroundColor: 'transparent', outlineWidth: 0 } as any}
          />
          <Text style={{ fontSize: 16, fontWeight: '600', color: C.text }}>₾</Text>
        </View>
      </View>

      {error ? (
        <Text style={{ fontSize: 13, color: C.error, textAlign: 'center' }}>{error}</Text>
      ) : null}

      <View style={{ flexDirection: 'row', gap: 10, marginTop: 6 }}>
        <Pressable onPress={onBack} disabled={loading} style={{ flex: 1, borderWidth: 1, borderColor: C.border, borderRadius: 8, paddingVertical: 12, alignItems: 'center' }}>
          <Text style={{ fontSize: 15, fontWeight: '600', color: C.muted }}>Назад</Text>
        </Pressable>
        <Pressable
          onPress={onSubmit}
          disabled={loading}
          style={{ flex: 2, backgroundColor: C.green, borderRadius: 8, paddingVertical: 12, alignItems: 'center', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? (
            <ActivityIndicator color={C.white} size="small" />
          ) : (
            <Text style={{ color: C.white, fontWeight: '700', fontSize: 15 }}>Опубликовать</Text>
          )}
        </Pressable>
      </View>
    </View>
  );

  if (isDesktop) {
    return (
      <View style={{ flexDirection: 'row', gap: 24 }}>
        <View style={{ flex: 2 }}>{formEl}</View>
        <View style={{ flex: 1, padding: 16, paddingLeft: 0 }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: C.text, marginBottom: 10 }}>Предпросмотр</Text>
        </View>
      </View>
    );
  }
  return formEl;
}

function CreateListingInteractive({ onSubmit, loading, error }: CreateListingProps) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>({ title: '', desc: '', price: '', categoryId: '', cityId: '' });
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loadingMeta, setLoadingMeta] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { width } = useWindowDimensions();
  const isDesktop = width >= 640;

  useEffect(() => {
    setLoadingMeta(true);
    Promise.all([
      apiFetch('/categories').then(r => setCategories(r.categories ?? [])),
      apiFetch('/cities').then(r => setCities(r.cities ?? [])),
    ])
      .catch(console.error)
      .finally(() => setLoadingMeta(false));
  }, []);

  const handleSubmit = () => {
    onSubmit({
      title: form.title,
      price: form.price,
      categoryId: form.categoryId,
      cityId: form.cityId,
      description: form.desc || undefined,
      selectedFiles,
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.white }}>
      <StepIndicator step={step} />
      {step === 1 && (
        <Step1
          onNext={() => setStep(2)}
          selectedFiles={selectedFiles}
          onFilesChange={setSelectedFiles}
        />
      )}
      {step === 2 && (
        <Step2
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
          form={form}
          setForm={setForm}
          categories={categories}
          cities={cities}
          loadingMeta={loadingMeta}
        />
      )}
      {step === 3 && (
        <Step3
          onBack={() => setStep(2)}
          form={form}
          setForm={setForm}
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
        />
      )}
      {!isDesktop && <BottomNav active="post" />}
    </View>
  );
}

export { CreateListingInteractive };
export default CreateListingInteractive;
