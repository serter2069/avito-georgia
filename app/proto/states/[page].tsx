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
import ReviewsStates from '../../../components/proto/states/ReviewsStates';
import MyListingsStates from '../../../components/proto/states/MyListingsStates';
import CreateListingStates from '../../../components/proto/states/CreateListingStates';
import EditListingStates from '../../../components/proto/states/EditListingStates';
import ListingExpiredStates from '../../../components/proto/states/ListingExpiredStates';
import ChatThreadStates from '../../../components/proto/states/ChatThreadStates';
import MessagesListStates from '../../../components/proto/states/MessagesListStates';
import FavoritesStates from '../../../components/proto/states/FavoritesStates';
import PaymentStates from '../../../components/proto/states/PaymentStates';
import PaymentHistoryStates from '../../../components/proto/states/PaymentHistoryStates';
import ProfileStates from '../../../components/proto/states/ProfileStates';
import SettingsStates from '../../../components/proto/states/SettingsStates';
import {
  AboutStates,
  HelpStates,
  PrivacyStates,
  TermsStates,
} from '../../../components/proto/states/LegalStates';

const stateComponents: Record<string, React.ComponentType> = {
  'design-system':   DesignSystemStates,
  'auth-email':      AuthEmailStates,
  'auth-otp':        AuthOtpStates,
  'onboarding':      OnboardingStates,
  'homepage':        HomepageStates,
  'listings-feed':   ListingsFeedStates,
  'listing-detail':  ListingDetailStates,
  'search':          SearchStates,
  'map-view':        MapViewStates,
  'seller-profile':  SellerProfileStates,
  'reviews':         ReviewsStates,
  'my-listings':     MyListingsStates,
  'create-listing':  CreateListingStates,
  'edit-listing':    EditListingStates,
  'listing-expired': ListingExpiredStates,
  'chat-thread':     ChatThreadStates,
  'messages-list':   MessagesListStates,
  'favorites':       FavoritesStates,
  'payment':         PaymentStates,
  'payment-history': PaymentHistoryStates,
  'profile':         ProfileStates,
  'settings':        SettingsStates,
  'about':           AboutStates,
  'help':            HelpStates,
  'privacy':         PrivacyStates,
  'terms':           TermsStates,
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
