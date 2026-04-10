import { useState, useCallback } from 'react';
import { View, Text, Platform, Pressable } from 'react-native';
import type { ReactNode } from 'react';

interface StateSectionProps {
  title: string;
  children: ReactNode;
}

export function StateSection({ title, children }: StateSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (Platform.OS !== 'web') return;
    const url = window.location.href;
    const pageSlug = url.split('/proto/states/')[1]?.split('?')[0] ?? url;
    const text = `Page: ${pageSlug}\nState: ${title}\nURL: ${url}`;
    const write = () => {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }).catch(() => {
        try {
          const el = document.createElement('textarea');
          el.value = text;
          document.body.appendChild(el);
          el.select();
          document.execCommand('copy');
          document.body.removeChild(el);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {}
      });
    };
    write();
  }, [title]);

  return (
    <View style={{
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#C8E0E8',
      borderRadius: 12,
      overflow: 'hidden',
    }}>
      {/* Badge header */}
      <View style={{
        backgroundColor: '#E8F4F8',
        borderBottomWidth: 1,
        borderBottomColor: '#C8E0E8',
        paddingHorizontal: 12,
        paddingVertical: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Text style={{
          color: '#0A7B8A',
          fontSize: 12,
          fontWeight: '600',
        }}>
          {title}
        </Text>
        {Platform.OS === 'web' && (
          <Pressable onPress={handleCopy} style={{
            backgroundColor: copied ? '#D1FAE5' : '#CBD5E1',
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 4,
          }}>
            <Text style={{
              fontSize: 10,
              color: copied ? '#065F46' : '#475569',
              fontWeight: '500',
            }}>
              {copied ? 'Copied!' : 'Copy'}
            </Text>
          </Pressable>
        )}
      </View>

      {/* Content */}
      <View style={{ padding: 16 }}>
        {children}
      </View>
    </View>
  );
}
