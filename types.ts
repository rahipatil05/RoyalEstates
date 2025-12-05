
export enum UserRole {
  ADMIN = 'admin',
  OWNER = 'owner',
  USER = 'user'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  favorites: string[]; // Property IDs
  isBlocked?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  receiverName: string; // Cached for UI display
  senderName: string;   // Cached for UI display
  text: string;
  timestamp: string;
}

export enum PropertyType {
  FLAT_1BHK = '1BHK',
  FLAT_2BHK = '2BHK',
  VILLA = 'Villa',
  APARTMENT = 'Apartment'
}

export enum PropertyStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export interface Property {
  id: string;
  ownerId: string;
  ownerName: string; // For display convenience
  title: string;
  description: string;
  type: PropertyType;
  rent: number;
  location: string;
  amenities: string[];
  image: string;
  status: PropertyStatus;
  createdAt: string;
}

export enum BookingStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export interface Booking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  userId: string;
  userName: string;
  ownerId: string;
  date: string;
  status: BookingStatus;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}
