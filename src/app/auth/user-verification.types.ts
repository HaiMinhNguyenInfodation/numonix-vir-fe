/**
 * Numonix Open API user/tenant users response and verification result types.
 */

export interface NumonixRole {
  id: string;
  tenantId: string;
  name: string;
  shortName: string;
  required: boolean;
  permissions: string[];
}

export interface NumonixUser {
  id: string;
  tenantId: string;
  emailAddress: string;
  firstName?: string;
  lastName?: string;
  mobileTelephoneNumber?: string;
  domainUserAccount?: string;
  profilePictureURL?: string;
  status?: string;
  created?: string;
  roles: NumonixRole[];
  isdeleted?: boolean;
  iscalllegalhold?: boolean;
  isPlaybackReasonEnable?: boolean;
}

export interface NumonixUsersApiResponse {
  item1: NumonixUser[];
  item2?: { recordCount?: number };
}

export type VerificationFailureReason = 'no_match' | 'no_login' | 'no_call_view' | 'error';

export interface VerificationResult {
  allowed: boolean;
  canViewReports: boolean;
  reason?: VerificationFailureReason;
}
