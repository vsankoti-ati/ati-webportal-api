// Interface for user information extracted from Azure AD token
export interface UserInfo {
  userId: string;
  email: string;
  name?: string;
  roles: string[];
  tenantId: string;
  appId: string;
  objectId: string;
  preferredUsername?: string;
  [key: string]: any; // Allow additional claims
}