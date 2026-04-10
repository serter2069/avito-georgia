import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { StateSection } from '../StateSection';
import { protoMeta } from '../../../constants/protoMeta';
import { pageRegistry } from '../../../constants/pageRegistry';

function getProgressStats() {
  const total = pageRegistry.length;
  const approved = pageRegistry.filter((p) => (p.qaScore ?? 0) >= 9 && (p.qaCycles ?? 0) >= 5).length;
  const review = pageRegistry.filter((p) => (p.qaCycles ?? 0) > 0 && (p.qaCycles ?? 0) < 5).length;
  const proto = total - approved - review;
  return { total, approved, review, proto };
}

export default function OverviewStates() {
  const stats = getProgressStats();
  const progressPct = stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0;

  return (
    <StateSection title="PROJECT_OVERVIEW">
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24, gap: 32 }}>
        {/* Header */}
        <View style={{ backgroundColor: '#0A7B8A', padding: 24, borderRadius: 12 }}>
          <Text style={{ color: 'white', fontSize: 28, fontWeight: 'bold' }}>
            {protoMeta.project}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, marginTop: 4 }}>
            {protoMeta.description}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 8 }}>
            {protoMeta.stack}
          </Text>
        </View>

        {/* Roles */}
        <View>
          <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12, color: '#111' }}>
            Roles
          </Text>
          {protoMeta.roles.map((role) => (
            <View
              key={role.id}
              style={{
                backgroundColor: '#F9FAFB',
                borderRadius: 8,
                padding: 16,
                marginBottom: 8,
                borderLeftWidth: 3,
                borderLeftColor: '#0A7B8A',
              }}
            >
              <Text style={{ fontWeight: '600', color: '#111' }}>{role.title}</Text>
              <Text style={{ color: '#6B7280', marginTop: 4, fontSize: 13 }}>{role.description}</Text>
            </View>
          ))}
        </View>

        {/* Scenarios */}
        <View>
          <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12, color: '#111' }}>
            Scenarios
          </Text>
          {protoMeta.scenarios.map((scenario) => (
            <View
              key={scenario.id}
              style={{
                backgroundColor: '#F9FAFB',
                borderRadius: 8,
                padding: 16,
                marginBottom: 8,
              }}
            >
              <Text style={{ fontWeight: '600', color: '#0A7B8A' }}>
                {scenario.id}: {scenario.title}
              </Text>
              <Text style={{ color: '#374151', marginTop: 4, fontSize: 13 }}>
                {scenario.steps[0]}
              </Text>
              <Text style={{ color: '#9CA3AF', marginTop: 4, fontSize: 12 }}>
                Roles: {scenario.roles.join(', ')}
              </Text>
            </View>
          ))}
        </View>

        {/* Progress */}
        <View style={{ backgroundColor: '#F9FAFB', borderRadius: 8, padding: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 8, color: '#111' }}>
            Prototyping Progress
          </Text>
          <Text style={{ color: '#374151' }}>
            {stats.total} pages | {stats.approved} approved | {stats.proto} proto | {stats.review} review
          </Text>
          <View
            style={{
              height: 8,
              backgroundColor: '#E5E7EB',
              borderRadius: 4,
              marginTop: 12,
            }}
          >
            <View
              style={{
                height: 8,
                width: `${Math.max(progressPct, 1)}%`,
                backgroundColor: '#0A7B8A',
                borderRadius: 4,
              }}
            />
          </View>
          <Text style={{ color: '#9CA3AF', fontSize: 12, marginTop: 6 }}>
            {progressPct}% approved (target: 5 QA cycles each)
          </Text>
        </View>
      </ScrollView>
    </StateSection>
  );
}
