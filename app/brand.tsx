import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
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
      <View className="rounded-lg" style={{ width: 40, height: 40, backgroundColor: hex, borderWidth: 1, borderColor: '#E0E0E0' }} />
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
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={{ padding: spacing.md, maxWidth: 480, alignSelf: 'center' }}>
      {/* Header */}
      <Text className="text-2xl font-bold mb-1" style={{ color: colors.text }}>Avito Georgia — Design System</Text>
      <Text className="text-sm mb-6" style={{ color: colors.textSecondary }}>Teal Batumi marketplace theme</Text>

      {/* Colors — Brand */}
      <Section title="Brand Colors (6)">
        <View className="flex-row flex-wrap" style={{ gap: spacing.md }}>
          <View style={{ flex: 1, minWidth: 140 }}>
            <ColorSwatch name="Primary" hex={colors.primary} />
            <ColorSwatch name="Accent" hex={colors.accent} />
            <ColorSwatch name="Background" hex={colors.background} />
          </View>
          <View style={{ flex: 1, minWidth: 140 }}>
            <ColorSwatch name="Surface" hex={colors.surface} />
            <ColorSwatch name="Text" hex={colors.text} />
            <ColorSwatch name="Text Secondary" hex={colors.textSecondary} />
          </View>
        </View>
      </Section>

      {/* Colors — Semantic */}
      <Section title="Semantic Colors (3)">
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
          <Text className={typography.body} style={{ color: colors.text }}>Body text — regular paragraph</Text>
          <Text className={typography.caption}>Caption — secondary info</Text>
          <Text className={typography.small}>Small — subtle hints</Text>
        </View>
      </Section>

      {/* Spacing */}
      <Section title="Spacing">
        {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map(key => (
          <View key={key} className="flex-row items-center" style={{ gap: spacing.sm, marginBottom: spacing.xs }}>
            <View className="rounded-sm" style={{ width: spacing[key], height: 16, backgroundColor: colors.primary }} />
            <Text className="text-sm" style={{ color: colors.text }}>{key}: {spacing[key]}px</Text>
          </View>
        ))}
      </Section>

      {/* Buttons */}
      <Section title="Buttons">
        <View style={{ gap: spacing.sm }}>
          <Button variant="primary" label="Primary Action" onPress={() => {}} />
          <Button variant="secondary" label="Secondary" onPress={() => {}} />
          <Button variant="destructive" label="Delete" onPress={() => {}} />
          <Button variant="primary" label="Loading..." onPress={() => {}} loading />
          <Button variant="primary" label="Disabled" onPress={() => {}} disabled />
          <Button variant="primary" label="Full Width" onPress={() => {}} fullWidth />
        </View>
      </Section>

      {/* Card */}
      <Section title="Card">
        <View style={{ gap: spacing.sm }}>
          <Card>
            <Text className="font-semibold" style={{ color: colors.text }}>Default Card</Text>
            <Text className="text-sm" style={{ color: colors.textSecondary }}>With shadow and border</Text>
          </Card>
          <Card variant="outlined">
            <Text className="font-semibold" style={{ color: colors.text }}>Outlined Card</Text>
            <Text className="text-sm" style={{ color: colors.textSecondary }}>Border only, no shadow</Text>
          </Card>
        </View>
      </Section>

      {/* Input */}
      <Section title="Input">
        <View style={{ gap: spacing.md }}>
          <Input label="Email" placeholder="Enter email..." value={inputVal} onChangeText={setInputVal} />
          <Input label="With Error" placeholder="..." value="" onChangeText={() => {}} error="This field is required" />
          <Input label="Password" placeholder="..." value="" onChangeText={() => {}} secureTextEntry />
        </View>
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
          <Badge variant="success" label="Large" size="md" />
        </View>
      </Section>

      {/* States */}
      <Section title="States">
        <View style={{ gap: spacing.md }}>
          <EmptyState icon="📦" title="No listings yet" subtitle="Create your first listing to get started" actionLabel="Create" onAction={() => {}} />
          <ErrorState message="Network error" onRetry={() => {}} />
          <LoadingState variant="spinner" />
          <Card>
            <Text className="text-sm font-semibold mb-2" style={{ color: colors.text }}>Skeleton</Text>
            <LoadingState variant="skeleton" lines={4} />
          </Card>
        </View>
      </Section>

      {/* Radius */}
      <Section title="Radius">
        <View className="flex-row flex-wrap" style={{ gap: spacing.sm }}>
          {(['sm', 'md', 'lg', 'xl', 'full'] as const).map(key => (
            <View key={key} className={`${radius[key]} items-center justify-center`} style={{ width: 56, height: 56, backgroundColor: colors.surface, borderWidth: 1, borderColor: '#C8E0E8' }}>
              <Text className="text-xs" style={{ color: colors.textSecondary }}>{key}</Text>
            </View>
          ))}
        </View>
      </Section>
    </ScrollView>
  );
}
