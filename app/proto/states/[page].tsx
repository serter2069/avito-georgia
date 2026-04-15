import React from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import DesignSystemStates from '../../../components/proto/states/DesignSystemStates';
import AuthEmailStates from '../../../components/proto/states/AuthEmailStates';
import AuthOtpStates from '../../../components/proto/states/AuthOtpStates';
import OnboardingStates from '../../../components/proto/states/OnboardingStates';
import HomepageStates from '../../../components/proto/states/HomepageStates';
import ListingsFeedStates from '../../../components/proto/states/ListingsFeedStates';
import ListingDetailStates from '../../../components/proto/states/ListingDetailStates';
import SearchStates from '../../../components/proto/states/SearchStates';
import MapViewStates from '../../../components/proto/states/MapViewStates';
import SellerProfileStates from '../../../components/proto/states/SellerProfileStates';
import MyListingsStates from '../../../components/proto/states/MyListingsStates';
import CreateListingStates from '../../../components/proto/states/CreateListingStates';
import EditListingStates from '../../../components/proto/states/EditListingStates';
import ChatThreadStates from '../../../components/proto/states/ChatThreadStates';
import MessagesListStates from '../../../components/proto/states/MessagesListStates';
import FavoritesStates from '../../../components/proto/states/FavoritesStates';
import NotificationsStates from '../../../components/proto/states/NotificationsStates';
import ProfileStates from '../../../components/proto/states/ProfileStates';
import SettingsStates from '../../../components/proto/states/SettingsStates';
import SubscriptionStates from '../../../components/proto/states/SubscriptionStates';
import PaymentHistoryStates from '../../../components/proto/states/PaymentHistoryStates';
import PromoteListingStates from '../../../components/proto/states/PromoteListingStates';
import PromotionSuccessStates, {
  PromotionCancelledStates,
  SlotSuccessStates,
} from '../../../components/proto/states/PromotionResultStates';
import AdminDashboardStates from '../../../components/proto/states/AdminDashboardStates';
import AdminModerationStates from '../../../components/proto/states/AdminModerationStates';
import AdminUsersStates, {
  AdminCategoriesStates,
} from '../../../components/proto/states/AdminUsersStates';
import {
  AboutStates,
  HelpStates,
  PrivacyStates,
  TermsStates,
} from '../../../components/proto/states/LegalStates';

const stateComponents: Record<string, React.ComponentType> = {
  'design-system':       DesignSystemStates,
  'auth-email':          AuthEmailStates,
  'auth-otp':            AuthOtpStates,
  'onboarding':          OnboardingStates,
  'homepage':            HomepageStates,
  'listings-feed':       ListingsFeedStates,
  'listing-detail':      ListingDetailStates,
  'search':              SearchStates,
  'map-view':            MapViewStates,
  'seller-profile':      SellerProfileStates,
  'my-listings':         MyListingsStates,
  'create-listing':      CreateListingStates,
  'edit-listing':        EditListingStates,
  'chat-thread':         ChatThreadStates,
  'messages-list':       MessagesListStates,
  'favorites':           FavoritesStates,
  'notifications':       NotificationsStates,
  'profile':             ProfileStates,
  'settings':            SettingsStates,
  'subscription':        SubscriptionStates,
  'payment-history':     PaymentHistoryStates,
  'promote-listing':     PromoteListingStates,
  'promotion-success':   PromotionSuccessStates,
  'promotion-cancelled': PromotionCancelledStates,
  'slot-success':        SlotSuccessStates,
  'admin-dashboard':     AdminDashboardStates,
  'admin-moderation':    AdminModerationStates,
  'admin-users':         AdminUsersStates,
  'admin-categories':    AdminCategoriesStates,
  'about':               AboutStates,
  'help':                HelpStates,
  'privacy':             PrivacyStates,
  'terms':               TermsStates,
};

export default function ProtoStatesPage() {
  const { page } = useLocalSearchParams<{ page: string }>();
  const Component = stateComponents[page];

  if (!Component) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#e03131', fontSize: 16 }}>Not found: {page}</Text>
      </View>
    );
  }

  return <Component />;
}
