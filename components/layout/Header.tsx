import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'ru', label: 'RU' },
  { code: 'en', label: 'EN' },
  { code: 'ka', label: 'KA' },
] as const;

interface HeaderProps {
  title?: string;
  showLanguageSwitcher?: boolean;
}

export function Header({ title, showLanguageSwitcher = true }: HeaderProps) {
  const { t, i18n } = useTranslation();

  const switchLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <View className="bg-dark-secondary border-b border-border px-4 py-3 flex-row items-center justify-between">
      <Text className="text-text-primary text-lg font-bold">
        {title || 'Avito Georgia'}
      </Text>

      {showLanguageSwitcher && (
        <View className="flex-row gap-1">
          {LANGUAGES.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              className={`px-2 py-1 rounded-md ${
                i18n.language === lang.code
                  ? 'bg-primary'
                  : 'bg-surface'
              }`}
              onPress={() => switchLanguage(lang.code)}
            >
              <Text
                className={`text-xs font-semibold ${
                  i18n.language === lang.code
                    ? 'text-white'
                    : 'text-text-secondary'
                }`}
              >
                {lang.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
