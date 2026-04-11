import React from 'react';
import { View, Text, ScrollView, StyleSheet, Platform } from 'react-native';

export default function OverviewStates() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Avito Georgia</Text>
        <Text style={styles.subtitle}>Classified ads marketplace for Georgia (like Avito)</Text>

        <Text style={styles.sectionTitle}>Roles</Text>
        <Text style={styles.item}>Guest -- browse listings, search, view details</Text>
        <Text style={styles.item}>User (Client) -- create/manage listings, chat, favorites, profile</Text>
        <Text style={styles.item}>Premium User -- unlimited listings, priority in search, badge</Text>
        <Text style={styles.item}>Admin -- moderation, user management, categories, reports, payments</Text>

        <Text style={styles.sectionTitle}>Pages</Text>
        <Text style={styles.groupTitle}>Auth</Text>
        <Text style={styles.item}>Email Login, OTP Verification</Text>

        <Text style={styles.groupTitle}>Onboarding</Text>
        <Text style={styles.item}>Name, City, Phone</Text>

        <Text style={styles.groupTitle}>Public</Text>
        <Text style={styles.item}>Homepage, Listings Feed, Listing Detail, Search, Map View, Seller Profile</Text>

        <Text style={styles.groupTitle}>My Listings</Text>
        <Text style={styles.item}>My Listings, Create Listing, Edit Listing</Text>

        <Text style={styles.groupTitle}>Dashboard</Text>
        <Text style={styles.item}>Messages, Chat, Favorites, Notifications, Profile, Settings, Payments, Subscription</Text>

        <Text style={styles.groupTitle}>Promotions</Text>
        <Text style={styles.item}>Promote Listing, Payment Success/Cancelled, Slot Success</Text>

        <Text style={styles.groupTitle}>Admin</Text>
        <Text style={styles.item}>Dashboard, Users, Moderation, Categories, Reports, Payments, Settings</Text>

        <Text style={styles.groupTitle}>Static</Text>
        <Text style={styles.item}>About, Help, Privacy Policy, Terms of Service</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { minHeight: Platform.OS === 'web' ? ('100vh' as any) : 844, backgroundColor: '#fff' },
  content: { padding: 32, maxWidth: 600 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 32 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12, marginTop: 24 },
  groupTitle: { fontSize: 14, fontWeight: '600', color: '#444', marginTop: 12, marginBottom: 4 },
  item: { fontSize: 14, color: '#555', marginBottom: 4, paddingLeft: 12 },
});
