import React, { useState } from 'react';
import { View, Text, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Button, Card, Input, Avatar, Badge, EmptyState, ErrorState, LoadingState } from '../components/ui';
import { colors, spacing, typography, radius } from '../lib/theme';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: spacing.lg }}>
      <Text className="text-xs font-bold uppercase tracking-wider" style={{ color: colors.textSecondary, marginBottom: spacing.sm }}>
        {title}
      </Text>
      {children}
    </View>
  );
}

function ColorSwatch({ name, hex }: { name: string; hex: string }) {
  return (
    <View className="flex-row items-center" style={{ gap: spacing.sm, marginBottom: spacing.sm }}>
      <View className="rounded-lg" style={{ width: 36, height: 36, backgroundColor: hex, borderWidth: 1, borderColor: '#E5E5E5' }} />
      <View>
        <Text className="text-sm font-semibold" style={{ color: colors.text }}>{name}</Text>
        <Text className="text-xs" style={{ color: colors.textSecondary }}>{hex}</Text>
      </View>
    </View>
  );
}

export default function BrandPage() {
  const [inputVal, setInputVal] = useState('');
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.background }}>
    <Stack.Screen options={{ headerShown: true, title: 'Design System' }} />
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.md, maxWidth: 430, alignSelf: 'center', width: '100%' }}
    >
      <Text className="text-xl font-bold mb-0.5" style={{ color: colors.text }}>Avito Georgia</Text>
      <Text className="text-sm mb-6" style={{ color: colors.textSecondary }}>Design System</Text>

      {/* Brand Colors */}
      <Section title="Brand (6)">
        <View className="flex-row flex-wrap" style={{ gap: spacing.md }}>
          <View style={{ flex: 1, minWidth: 130 }}>
            <ColorSwatch name="Primary" hex={colors.primary} />
            <ColorSwatch name="Accent" hex={colors.accent} />
            <ColorSwatch name="Background" hex={colors.background} />
          </View>
          <View style={{ flex: 1, minWidth: 130 }}>
            <ColorSwatch name="Surface" hex={colors.surface} />
            <ColorSwatch name="Text" hex={colors.text} />
            <ColorSwatch name="Text Secondary" hex={colors.textSecondary} />
          </View>
        </View>
      </Section>

      {/* Semantic Colors */}
      <Section title="Semantic (3)">
        <View className="flex-row flex-wrap" style={{ gap: spacing.md }}>
          <ColorSwatch name="Error" hex={colors.error} />
          <ColorSwatch name="Success" hex={colors.success} />
          <ColorSwatch name="Warning" hex={colors.warning} />
        </View>
      </Section>

      {/* Typography */}
      <Section title="Typography">
        <View style={{ gap: spacing.sm }}>
          <Text className={typography.h1} style={{ color: colors.text }}>Heading 1</Text>
          <Text className={typography.h2} style={{ color: colors.text }}>Heading 2</Text>
          <Text className={typography.h3} style={{ color: colors.text }}>Heading 3</Text>
          <Text className={typography.body} style={{ color: colors.text }}>Body text</Text>
          <Text className={typography.caption}>Caption</Text>
          <Text className={typography.small}>Small</Text>
        </View>
      </Section>

      {/* Spacing */}
      <Section title="Spacing">
        {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map(key => (
          <View key={key} className="flex-row items-center" style={{ gap: spacing.sm, marginBottom: spacing.xs }}>
            <View className="rounded-sm" style={{ width: spacing[key], height: 14, backgroundColor: colors.primary }} />
            <Text className="text-sm" style={{ color: colors.text }}>{key}: {spacing[key]}px</Text>
          </View>
        ))}
      </Section>

      {/* Buttons */}
      <Section title="Buttons">
        <View style={{ gap: spacing.sm }}>
          <Button variant="primary" label="Primary" onPress={() => {}} />
          <Button variant="secondary" label="Secondary" onPress={() => {}} />
          <Button variant="destructive" label="Delete" onPress={() => {}} />
          <Button variant="primary" label="Loading" onPress={() => {}} loading />
          <Button variant="primary" label="Disabled" onPress={() => {}} disabled />
        </View>
      </Section>

      {/* Card */}
      <Section title="Card">
        <View style={{ gap: spacing.sm }}>
          <Card>
            <Text className="font-semibold" style={{ color: colors.text }}>Default</Text>
            <Text className="text-sm" style={{ color: colors.textSecondary }}>Shadow + border</Text>
          </Card>
          <Card variant="outlined">
            <Text className="font-semibold" style={{ color: colors.text }}>Outlined</Text>
            <Text className="text-sm" style={{ color: colors.textSecondary }}>Border only</Text>
          </Card>
        </View>
      </Section>

      {/* Input */}
      <Section title="Input">
        <Input label="Email" placeholder="Enter email..." value={inputVal} onChangeText={setInputVal} />
      </Section>

      {/* Avatar */}
      <Section title="Avatar">
        <View className="flex-row items-center" style={{ gap: spacing.md }}>
          <Avatar size="sm" name="John Doe" />
          <Avatar size="md" name="Anna K" />
          <Avatar size="lg" name="G N" />
        </View>
      </Section>

      {/* Badge */}
      <Section title="Badge">
        <View className="flex-row flex-wrap" style={{ gap: spacing.sm }}>
          <Badge variant="success" label="Active" />
          <Badge variant="error" label="Sold" />
          <Badge variant="warning" label="Pending" />
          <Badge variant="info" label="New" />
        </View>
      </Section>

      {/* States */}
      <Section title="Empty State">
        <EmptyState title="No listings yet" subtitle="Create your first listing to get started" actionLabel="Create" onAction={() => {}} />
      </Section>

      <Section title="Loading">
        <LoadingState variant="skeleton" lines={3} />
      </Section>

      {/* Radius */}
      <Section title="Radius">
        <View className="flex-row flex-wrap" style={{ gap: spacing.sm }}>
          {(['sm', 'md', 'lg', 'xl', 'full'] as const).map(key => (
            <View key={key} className={`${radius[key]} items-center justify-center`} style={{ width: 48, height: 48, backgroundColor: colors.surface, borderWidth: 1, borderColor: '#E5E5E5' }}>
              <Text className="text-xs" style={{ color: colors.textSecondary }}>{key}</Text>
            </View>
          ))}
        </View>
      </Section>
    </ScrollView>
    </SafeAreaView>
  );
}
