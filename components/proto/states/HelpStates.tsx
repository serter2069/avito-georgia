import { View, Text, TouchableOpacity, useWindowDimensions, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { StateSection } from '../StateSection';
import { mockFaqItems } from '../../../constants/protoMockData';

function FaqItem({ question, answer, forceExpanded }: { question: string; answer: string; forceExpanded?: boolean }) {
  const [expanded, setExpanded] = useState(forceExpanded ?? false);
  return (
    <View className="border-b border-border">
      <TouchableOpacity className="flex-row items-center justify-between py-4" onPress={() => setExpanded(!expanded)}>
        <Text className="text-text-primary text-base font-medium flex-1 mr-2">{question}</Text>
        <Feather name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color="#737373" />
      </TouchableOpacity>
      {expanded && (
        <Text className="text-text-secondary text-sm pb-4 leading-5">{answer}</Text>
      )}
    </View>
  );
}

export default function HelpStates() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const contentStyle = isDesktop ? { maxWidth: 800, alignSelf: 'center' as const, width: '100%' } : {};

  return (
    <View>
      <StateSection title="default">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>
          <View className="flex-row items-center justify-between h-14 px-4 bg-white border-b border-border"><Text className="text-primary text-lg font-bold">Avito Georgia</Text><View className="flex-row items-center gap-3"><Feather name="search" size={20} color="#737373" /><Feather name="bell" size={20} color="#737373" /></View></View>
          <View style={{ flex: 1 }}>

        <View style={contentStyle} className="py-4">
          <Text className="text-primary text-2xl font-bold mb-2">Помощь</Text>
          <Text className="text-text-muted text-sm mb-6">Часто задаваемые вопросы</Text>
          {mockFaqItems.map((item, i) => (
            <FaqItem key={i} question={item.question} answer={item.answer} />
          ))}
        </View>
                </View>
          <View className="flex-row h-14 bg-white border-t border-border items-center">{[{i:"home",l:"Home"},{i:"plus-circle",l:"Post"},{i:"message-circle",l:"Chat"},{i:"user",l:"Profile"}].map(t=>(<View key={t.l} className="flex-1 items-center justify-center"><Feather name={t.i as any} size={20} color="#737373" /><Text className="text-[10px] text-text-muted">{t.l}</Text></View>))}</View>
        </View>
</StateSection>

      <StateSection title="faq_expanded">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>
          <View className="flex-row items-center justify-between h-14 px-4 bg-white border-b border-border"><Text className="text-primary text-lg font-bold">Avito Georgia</Text><View className="flex-row items-center gap-3"><Feather name="search" size={20} color="#737373" /><Feather name="bell" size={20} color="#737373" /></View></View>
          <View style={{ flex: 1 }}>

        <View style={contentStyle} className="py-4">
          <Text className="text-primary text-2xl font-bold mb-2">Помощь</Text>
          <Text className="text-text-muted text-sm mb-6">Часто задаваемые вопросы</Text>
          {mockFaqItems.map((item, i) => (
            <FaqItem key={i} question={item.question} answer={item.answer} forceExpanded={i === 0} />
          ))}
        </View>
                </View>
          <View className="flex-row h-14 bg-white border-t border-border items-center">{[{i:"home",l:"Home"},{i:"plus-circle",l:"Post"},{i:"message-circle",l:"Chat"},{i:"user",l:"Profile"}].map(t=>(<View key={t.l} className="flex-1 items-center justify-center"><Feather name={t.i as any} size={20} color="#737373" /><Text className="text-[10px] text-text-muted">{t.l}</Text></View>))}</View>
        </View>
</StateSection>
    </View>
  );
}
