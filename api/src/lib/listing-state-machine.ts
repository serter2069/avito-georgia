import { ListingStatus } from '@prisma/client';

// Allowed transitions for listing owners
const OWNER_TRANSITIONS: Record<string, ListingStatus[]> = {
  draft: ['pending_moderation'],           // owner submits for review
  pending_moderation: ['draft'],           // owner can withdraw back to draft
  rejected: ['pending_moderation'],        // owner re-submits after fixing
  active: ['sold', 'removed'],            // owner marks sold or removes
  expired: ['pending_moderation'],         // owner re-submits expired listing
};

// Allowed transitions for admins
const ADMIN_TRANSITIONS: Record<string, ListingStatus[]> = {
  pending_moderation: ['active', 'rejected'],  // admin approves or rejects
  active: ['removed', 'rejected'],              // admin can remove or reject active
  rejected: ['pending_moderation', 'active'],   // admin can re-queue or approve directly
  expired: ['active', 'removed'],               // admin can reactivate or remove expired
  sold: ['active'],                              // admin can reactivate sold
  removed: ['active', 'pending_moderation'],     // admin can restore removed listing
};

export function isValidOwnerTransition(from: ListingStatus, to: ListingStatus): boolean {
  return OWNER_TRANSITIONS[from]?.includes(to) ?? false;
}

export function isValidAdminTransition(from: ListingStatus, to: ListingStatus): boolean {
  return ADMIN_TRANSITIONS[from]?.includes(to) ?? false;
}

export function getOwnerAllowedTransitions(from: ListingStatus): ListingStatus[] {
  return OWNER_TRANSITIONS[from] || [];
}

export function getAdminAllowedTransitions(from: ListingStatus): ListingStatus[] {
  return ADMIN_TRANSITIONS[from] || [];
}

// All valid ListingStatus values for validation
export const ALL_LISTING_STATUSES: ListingStatus[] = [
  'draft', 'pending_moderation', 'active', 'sold', 'removed', 'rejected', 'expired',
];
