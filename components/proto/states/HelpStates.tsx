import { View, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
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

  const contentStyle = isDesktop ? { maxWidth: 960, alignSelf: 'center' as const, width: '100%' } : {};
  const containerStyle = isDesktop ? { maxWidth: 960, alignSelf: 'center' as const, width: '100%' } : {};


  return (
    <View>
      <StateSection title="default">
        <View style={[{ minHeight: 844 }, contentStyle]} className="py-4">
          <Text className="text-primary text-2xl font-bold mb-2">Помощь</Text>
          <Text className="text-text-muted text-sm mb-6">Часто задаваемые вопросы</Text>
          {mockFaqItems.map((item, i) => (
            <FaqItem key={i} question={item.question} answer={item.answer} />
          ))}
        </View>
      </StateSection>

      <StateSection title="faq_expanded">
        <View style={[{ minHeight: 844 }, contentStyle]} className="py-4">
          <Text className="text-primary text-2xl font-bold mb-2">Помощь</Text>
          <Text className="text-text-muted text-sm mb-6">Часто задаваемые вопросы</Text>
          {mockFaqItems.map((item, i) => (
            <FaqItem key={i} question={item.question} answer={item.answer} forceExpanded={i === 0} />
          ))}
        </View>
      </StateSection>
    </View>
  );
}
