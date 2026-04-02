import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';

export interface CustomField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'range';
  options?: string[];
}

export type FilterValues = Record<string, string>;

interface CategoryFiltersProps {
  customFields: CustomField[];
  values: FilterValues;
  onChange: (values: FilterValues) => void;
}

// Render a row of select chips for a single-select field
function SelectField({
  field,
  value,
  onChange,
}: {
  field: CustomField;
  value: string;
  onChange: (v: string) => void;
}) {
  const { t } = useTranslation();
  return (
    <View className="gap-1">
      <Text className="text-text-muted text-xs px-1">{t(field.label)}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2"
      >
        {(field.options || []).map((opt) => {
          const active = value === opt;
          return (
            <TouchableOpacity
              key={opt}
              className={`px-3 py-1.5 rounded-full border ${
                active ? 'bg-primary border-primary' : 'border-border'
              }`}
              onPress={() => onChange(active ? '' : opt)}
            >
              <Text
                className={`text-xs font-medium ${
                  active ? 'text-white' : 'text-text-secondary'
                }`}
              >
                {t(`cf_${field.name}_${opt}`, { defaultValue: opt })}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

// Render a single numeric/text input
function TextField({
  field,
  value,
  onChange,
}: {
  field: CustomField;
  value: string;
  onChange: (v: string) => void;
}) {
  const { t } = useTranslation();
  return (
    <View className="flex-1 gap-1">
      <Text className="text-text-muted text-xs px-1">{t(field.label)}</Text>
      <TextInput
        className="bg-surface border border-border rounded-lg px-3 py-2.5 text-text-primary text-sm"
        placeholder={t(field.label)}
        placeholderTextColor="#64748b"
        value={value}
        onChangeText={onChange}
        keyboardType={field.type === 'number' ? 'numeric' : 'default'}
      />
    </View>
  );
}

// Pair min/max fields side by side (e.g. yearMin + yearMax, areaMin + areaMax)
function RangePair({
  minField,
  maxField,
  values,
  onChange,
}: {
  minField: CustomField;
  maxField: CustomField;
  values: FilterValues;
  onChange: (name: string, v: string) => void;
}) {
  const { t } = useTranslation();
  // Derive a shared label from the min field name (e.g. "yearMin" -> "year")
  const baseKey = minField.name.replace(/Min$/, '');
  return (
    <View className="gap-1">
      <Text className="text-text-muted text-xs px-1">{t(`cf_range_${baseKey}`, { defaultValue: t(baseKey, { defaultValue: baseKey }) })}</Text>
      <View className="flex-row gap-2">
        <View className="flex-1">
          <TextInput
            className="bg-surface border border-border rounded-lg px-3 py-2.5 text-text-primary text-sm"
            placeholder={t('from')}
            placeholderTextColor="#64748b"
            value={values[minField.name] || ''}
            onChangeText={(v) => onChange(minField.name, v)}
            keyboardType="numeric"
          />
        </View>
        <View className="flex-1">
          <TextInput
            className="bg-surface border border-border rounded-lg px-3 py-2.5 text-text-primary text-sm"
            placeholder={t('to')}
            placeholderTextColor="#64748b"
            value={values[maxField.name] || ''}
            onChangeText={(v) => onChange(maxField.name, v)}
            keyboardType="numeric"
          />
        </View>
      </View>
    </View>
  );
}

export function CategoryFilters({ customFields, values, onChange }: CategoryFiltersProps) {
  const setField = (name: string, value: string) => {
    onChange({ ...values, [name]: value });
  };

  // Find paired range fields (e.g. yearMin + yearMax, areaMin + areaMax)
  const pairedNames = new Set<string>();
  const renderedFields: JSX.Element[] = [];

  let i = 0;
  while (i < customFields.length) {
    const field = customFields[i];

    // Check if this is a Min field and the next is the matching Max
    if (
      field.type === 'number' &&
      field.name.endsWith('Min') &&
      i + 1 < customFields.length &&
      customFields[i + 1].name === field.name.replace('Min', 'Max')
    ) {
      const maxField = customFields[i + 1];
      pairedNames.add(field.name);
      pairedNames.add(maxField.name);
      renderedFields.push(
        <RangePair
          key={field.name}
          minField={field}
          maxField={maxField}
          values={values}
          onChange={setField}
        />
      );
      i += 2;
      continue;
    }

    // Skip if already paired
    if (pairedNames.has(field.name)) {
      i++;
      continue;
    }

    if (field.type === 'select') {
      renderedFields.push(
        <SelectField
          key={field.name}
          field={field}
          value={values[field.name] || ''}
          onChange={(v) => setField(field.name, v)}
        />
      );
    } else {
      renderedFields.push(
        <View key={field.name}>
          <TextField
            field={field}
            value={values[field.name] || ''}
            onChange={(v) => setField(field.name, v)}
          />
        </View>
      );
    }

    i++;
  }

  if (renderedFields.length === 0) return null;

  return (
    <View className="px-4 pb-3 gap-3">
      {renderedFields}
    </View>
  );
}
