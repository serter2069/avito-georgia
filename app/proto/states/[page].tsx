import React from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getPage } from '../../../constants/pageRegistry';
import { ProtoLayout } from '../../../components/proto/ProtoLayout';

import OverviewStates from '../../../components/proto/states/OverviewStates';
import BrandStates from '../../../components/proto/states/BrandStates';
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
import MessagesListStates from '../../../components/proto/states/MessagesListStates';
import ChatThreadStates from '../../../components/proto/states/ChatThreadStates';
import FavoritesStates from '../../../components/proto/states/FavoritesStates';
import NotificationsStates from '../../../components/proto/states/NotificationsStates';
import ProfileStates from '../../../components/proto/states/ProfileStates';
import SettingsStates from '../../../components/proto/states/SettingsStates';
import PaymentHistoryStates from '../../../components/proto/states/PaymentHistoryStates';
import SubscriptionStates from '../../../components/proto/states/SubscriptionStates';
import PromoteListingStates from '../../../components/proto/states/PromoteListingStates';
import PromotionSuccessStates from '../../../components/proto/states/PromotionSuccessStates';
import PromotionCancelledStates from '../../../components/proto/states/PromotionCancelledStates';
import SlotSuccessStates from '../../../components/proto/states/SlotSuccessStates';
import AdminDashboardStates from '../../../components/proto/states/AdminDashboardStates';
import AdminUsersStates from '../../../components/proto/states/AdminUsersStates';
import AdminModerationStates from '../../../components/proto/states/AdminModerationStates';
import AdminCategoriesStates from '../../../components/proto/states/AdminCategoriesStates';
import AdminReportsStates from '../../../components/proto/states/AdminReportsStates';
import AdminPaymentsStates from '../../../components/proto/states/AdminPaymentsStates';
import AdminSettingsStates from '../../../components/proto/states/AdminSettingsStates';
import AboutStates from '../../../components/proto/states/AboutStates';
import HelpStates from '../../../components/proto/states/HelpStates';
import PrivacyStates from '../../../components/proto/states/PrivacyStates';
import TermsStates from '../../../components/proto/states/TermsStates';

const stateComponents: Record<string, React.ComponentType> = {
  'overview': OverviewStates,
  'brand': BrandStates,
  'auth-email': AuthEmailStates,
  'auth-otp': AuthOtpStates,
  'onboarding': OnboardingStates,
  'homepage': HomepageStates,
  'listings-feed': ListingsFeedStates,
  'listing-detail': ListingDetailStates,
  'search': SearchStates,
  'map-view': MapViewStates,
  'seller-profile': SellerProfileStates,
  'my-listings': MyListingsStates,
  'create-listing': CreateListingStates,
  'edit-listing': EditListingStates,
  'messages-list': MessagesListStates,
  'chat-thread': ChatThreadStates,
  'favorites': FavoritesStates,
  'notifications': NotificationsStates,
  'profile': ProfileStates,
  'settings': SettingsStates,
  'payment-history': PaymentHistoryStates,
  'subscription': SubscriptionStates,
  'promote-listing': PromoteListingStates,
  'promotion-success': PromotionSuccessStates,
  'promotion-cancelled': PromotionCancelledStates,
  'slot-success': SlotSuccessStates,
  'admin-dashboard': AdminDashboardStates,
  'admin-users': AdminUsersStates,
  'admin-moderation': AdminModerationStates,
  'admin-categories': AdminCategoriesStates,
  'admin-reports': AdminReportsStates,
  'admin-payments': AdminPaymentsStates,
  'admin-settings': AdminSettingsStates,
  'about': AboutStates,
  'help': HelpStates,
  'privacy': PrivacyStates,
  'terms': TermsStates,
};

export default function ProtoStatesPage() {
  const { page } = useLocalSearchParams<{ page: string }>();
  const protoPage = getPage(page);

  if (!protoPage) {
    return (
      <View className="flex-1 bg-surface items-center justify-center">
        <Text className="text-error text-lg font-semibold">Page not found: {page}</Text>
      </View>
    );
  }

  const Component = stateComponents[page];

  if (!Component) {
    return (
      <View className="flex-1 bg-surface items-center justify-center">
        <Text className="text-error text-lg font-semibold">Component not found: {page}</Text>
      </View>
    );
  }

  return (
    <ProtoLayout pagId={protoPage.id} title={protoPage.title} route={protoPage.route}>
      <Component />
    </ProtoLayout>
  );
}
