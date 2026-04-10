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
    const writeClipboard = () => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }).catch(() => fallbackCopy());
      } else {
        fallbackCopy();
      }
    };
    const fallbackCopy = () => {
      const el = document.createElement('textarea');
      el.value = text;
      el.style.cssText = 'position:fixed;opacity:0;top:0;left:0;';
      document.body.appendChild(el);
      el.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } catch (e) {
        // silent fail
      }
      document.body.removeChild(el);
    };
    writeClipboard();
  }, [title]);

  return (
    <View style={{
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#E0E0E0',
      borderRadius: 12,
      overflow: 'hidden',
    }}>
      {/* Badge header */}
      <View style={{
        backgroundColor: '#F4F4F4',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        paddingHorizontal: 12,
        paddingVertical: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Text style={{
          color: '#00AA6C',
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
