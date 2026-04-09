export type ProtoPage = {
  id: string;
  pagId: string;
  title: string;
  group: string;
  route: string;
  states: string[];
  roles: string[];
  status: 'proto' | 'approved';
};

export const protoPages: ProtoPage[] = [
  // Auth
  { id: 'auth-email', pagId: 'PAG-001', title: 'Email Login', group: 'Auth', route: '/(auth)', states: ['default', 'validation_error', 'loading'], roles: ['PUBLIC'], status: 'proto' },
  { id: 'auth-otp', pagId: 'PAG-002', title: 'OTP Verification', group: 'Auth', route: '/(auth)/otp', states: ['default', 'error', 'loading', 'resend_available', 'captcha_required'], roles: ['PUBLIC'], status: 'proto' },

  // Onboarding
  { id: 'onboarding', pagId: 'PAG-003', title: 'Onboarding', group: 'Onboarding', route: '/onboarding', states: ['default', 'validation_error', 'loading', 'city_picker_open'], roles: ['USER'], status: 'proto' },

  // Public
  { id: 'homepage', pagId: 'PAG-010', title: 'Homepage', group: 'Public', route: '/', states: ['default', 'loading_listings', 'empty_listings', 'guest_cta', 'user_cta'], roles: ['PUBLIC', 'USER'], status: 'proto' },
  { id: 'listings-feed', pagId: 'PAG-011', title: 'Listings Feed', group: 'Public', route: '/listings', states: ['default', 'loading', 'empty', 'filtered_empty'], roles: ['PUBLIC', 'USER'], status: 'proto' },
  { id: 'listing-detail', pagId: 'PAG-012', title: 'Listing Detail', group: 'Public', route: '/listings/[id]', states: ['default', 'loading', 'error_not_found', 'phone_revealed', 'report_modal_open'], roles: ['PUBLIC', 'USER'], status: 'proto' },
  { id: 'search', pagId: 'PAG-013', title: 'Search', group: 'Public', route: '/search', states: ['default', 'loading', 'empty', 'filtered_empty', 'map_view'], roles: ['PUBLIC', 'USER'], status: 'proto' },
  { id: 'map-view', pagId: 'PAG-014', title: 'Map View', group: 'Public', route: '/search?view=map', states: ['coming_soon'], roles: ['PUBLIC', 'USER'], status: 'proto' },
  { id: 'seller-profile', pagId: 'PAG-015', title: 'Seller Profile', group: 'Public', route: '/users/[id]', states: ['default', 'loading', 'empty_listings'], roles: ['PUBLIC', 'USER'], status: 'proto' },

  // My Listings
  { id: 'my-listings', pagId: 'PAG-020', title: 'My Listings', group: 'My Listings', route: '/my/listings', states: ['default', 'empty', 'loading', 'confirm_delete_modal'], roles: ['USER'], status: 'proto' },
  { id: 'create-listing', pagId: 'PAG-021', title: 'Create Listing', group: 'My Listings', route: '/my/listings/create', states: ['step1_category', 'step2_city', 'step3_details', 'step4_photos', 'submitting', 'error'], roles: ['USER'], status: 'proto' },
  { id: 'edit-listing', pagId: 'PAG-022', title: 'Edit Listing', group: 'My Listings', route: '/my/listings/[id]/edit', states: ['loading_data', 'default', 'saving', 'success'], roles: ['USER'], status: 'proto' },

  // Dashboard
  { id: 'messages-list', pagId: 'PAG-030', title: 'Messages List', group: 'Dashboard', route: '/dashboard/messages', states: ['default', 'loading', 'empty'], roles: ['USER'], status: 'proto' },
  { id: 'chat-thread', pagId: 'PAG-031', title: 'Chat Thread', group: 'Dashboard', route: '/dashboard/messages/[id]', states: ['default', 'loading', 'empty', 'sending'], roles: ['USER'], status: 'proto' },
  { id: 'favorites', pagId: 'PAG-032', title: 'Favorites', group: 'Dashboard', route: '/dashboard/favorites', states: ['default', 'loading', 'empty'], roles: ['USER'], status: 'proto' },
  { id: 'notifications', pagId: 'PAG-033', title: 'Notifications', group: 'Dashboard', route: '/dashboard/notifications', states: ['default', 'loading', 'empty'], roles: ['USER'], status: 'proto' },
  { id: 'profile', pagId: 'PAG-034', title: 'Profile', group: 'Dashboard', route: '/dashboard/profile', states: ['default', 'saving', 'saved', 'error'], roles: ['USER'], status: 'proto' },
  { id: 'settings', pagId: 'PAG-035', title: 'Settings', group: 'Dashboard', route: '/dashboard/settings', states: ['default', 'delete_confirm_alert'], roles: ['USER'], status: 'proto' },
  { id: 'payment-history', pagId: 'PAG-036', title: 'Payment History', group: 'Dashboard', route: '/dashboard/payments', states: ['default', 'loading', 'empty'], roles: ['USER'], status: 'proto' },
  { id: 'subscription', pagId: 'PAG-037', title: 'Premium Subscription', group: 'Dashboard', route: '/dashboard/subscription', states: ['no_subscription', 'active_subscription', 'loading', 'purchasing'], roles: ['USER'], status: 'proto' },

  // Promotions
  { id: 'promote-listing', pagId: 'PAG-040', title: 'Promote Listing', group: 'Promotions', route: '/promotions/promote', states: ['default', 'loading', 'purchasing'], roles: ['USER'], status: 'proto' },
  { id: 'promotion-success', pagId: 'PAG-041', title: 'Promotion Success', group: 'Promotions', route: '/promotions/success', states: ['success'], roles: ['USER'], status: 'proto' },
  { id: 'promotion-cancelled', pagId: 'PAG-042', title: 'Promotion Cancelled', group: 'Promotions', route: '/promotions/cancelled', states: ['cancelled'], roles: ['USER'], status: 'proto' },
  { id: 'slot-success', pagId: 'PAG-043', title: 'Listing Slot Success', group: 'Promotions', route: '/promotions/slot-success', states: ['restoring', 'submitting', 'done', 'error'], roles: ['USER'], status: 'proto' },

  // Admin
  { id: 'admin-dashboard', pagId: 'PAG-050', title: 'Admin Dashboard', group: 'Admin', route: '/admin', states: ['default', 'loading'], roles: ['ADMIN'], status: 'proto' },
  { id: 'admin-users', pagId: 'PAG-051', title: 'Admin Users', group: 'Admin', route: '/admin/users', states: ['default', 'loading', 'search_results'], roles: ['ADMIN'], status: 'proto' },
  { id: 'admin-moderation', pagId: 'PAG-052', title: 'Admin Moderation', group: 'Admin', route: '/admin/moderation', states: ['default', 'loading', 'empty_queue', 'reject_reason_modal'], roles: ['ADMIN'], status: 'proto' },
  { id: 'admin-categories', pagId: 'PAG-053', title: 'Admin Categories', group: 'Admin', route: '/admin/categories', states: ['default', 'loading', 'add_modal'], roles: ['ADMIN'], status: 'proto' },
  { id: 'admin-reports', pagId: 'PAG-054', title: 'Admin Reports', group: 'Admin', route: '/admin/reports', states: ['default', 'loading', 'empty'], roles: ['ADMIN'], status: 'proto' },
  { id: 'admin-payments', pagId: 'PAG-055', title: 'Admin Payments', group: 'Admin', route: '/admin/payments', states: ['default', 'loading', 'empty'], roles: ['ADMIN'], status: 'proto' },
  { id: 'admin-settings', pagId: 'PAG-056', title: 'Admin Settings', group: 'Admin', route: '/admin/settings', states: ['default', 'loading', 'saving', 'saved'], roles: ['ADMIN'], status: 'proto' },

  // Static
  { id: 'about', pagId: 'PAG-060', title: 'About', group: 'Static', route: '/about', states: ['default'], roles: ['PUBLIC'], status: 'proto' },
  { id: 'help', pagId: 'PAG-061', title: 'Help', group: 'Static', route: '/help', states: ['default', 'faq_expanded'], roles: ['PUBLIC'], status: 'proto' },
  { id: 'privacy', pagId: 'PAG-062', title: 'Privacy Policy', group: 'Static', route: '/privacy', states: ['default'], roles: ['PUBLIC'], status: 'proto' },
  { id: 'terms', pagId: 'PAG-063', title: 'Terms of Service', group: 'Static', route: '/terms', states: ['default'], roles: ['PUBLIC'], status: 'proto' },
];

export const protoGroups = [...new Set(protoPages.map((p) => p.group))];

export function getProtoPage(id: string): ProtoPage | undefined {
  return protoPages.find((p) => p.id === id);
}
