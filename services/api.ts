
import { Booking, BookingStatus, Message, Property, PropertyStatus, User, UserRole } from "../types";
import { MOCK_PROPERTIES, MOCK_USERS, MOCK_MESSAGES } from "./mockData";

// Simulated LocalStorage Database Keys
const DB_USERS = 're_users';
const DB_PROPERTIES = 're_properties';
const DB_BOOKINGS = 're_bookings';
const DB_MESSAGES = 're_messages';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// Initialize DB
const initDB = () => {
  if (!localStorage.getItem(DB_USERS)) {
    localStorage.setItem(DB_USERS, JSON.stringify(MOCK_USERS));
  }
  if (!localStorage.getItem(DB_PROPERTIES)) {
    localStorage.setItem(DB_PROPERTIES, JSON.stringify(MOCK_PROPERTIES));
  }
  if (!localStorage.getItem(DB_BOOKINGS)) {
    localStorage.setItem(DB_BOOKINGS, JSON.stringify([]));
  }
  if (!localStorage.getItem(DB_MESSAGES)) {
    localStorage.setItem(DB_MESSAGES, JSON.stringify(MOCK_MESSAGES));
  }
};

initDB();

// --- Auth ---
export const login = async (email: string, role?: UserRole): Promise<User> => {
  await delay(500);
  const users: User[] = JSON.parse(localStorage.getItem(DB_USERS) || '[]');
  const normalizedEmail = email.trim().toLowerCase();
  
  // 1. Try to find existing user by email
  // The role is AUTOMATICALLY determined from the database for existing users.
  // The 'role' parameter passed to this function is ignored if the user exists.
  let user = users.find(u => u.email.toLowerCase() === normalizedEmail);
  
  if (user) {
    if (user.isBlocked) {
      throw new Error('Your account has been blocked by the administrator.');
    }
    return user;
  }

  // 2. If user does not exist, register them (Auto-registration)
  // We only use the passed 'role' parameter here for new registrations.
  // Default to USER if no role specified.
  const newRole = role || UserRole.USER;
  
  user = {
    id: Math.random().toString(36).substr(2, 9),
    name: normalizedEmail.split('@')[0],
    email: normalizedEmail,
    role: newRole,
    favorites: [],
    isBlocked: false
  };
  
  users.push(user);
  localStorage.setItem(DB_USERS, JSON.stringify(users));
  
  return user;
};

// --- Users & Admin ---
export const getUsers = async (): Promise<User[]> => {
  await delay(300);
  return JSON.parse(localStorage.getItem(DB_USERS) || '[]');
};

export const toggleFavorite = async (userId: string, propertyId: string): Promise<User> => {
  const users: User[] = JSON.parse(localStorage.getItem(DB_USERS) || '[]');
  const userIdx = users.findIndex(u => u.id === userId);
  if (userIdx === -1) throw new Error('User not found');

  const user = users[userIdx];
  if (user.favorites.includes(propertyId)) {
    user.favorites = user.favorites.filter(id => id !== propertyId);
  } else {
    user.favorites.push(propertyId);
  }
  
  users[userIdx] = user;
  localStorage.setItem(DB_USERS, JSON.stringify(users));
  return user;
};

export const toggleUserBlockStatus = async (userId: string): Promise<User> => {
  await delay(200);
  const users: User[] = JSON.parse(localStorage.getItem(DB_USERS) || '[]');
  const userIdx = users.findIndex(u => u.id === userId);
  if (userIdx === -1) throw new Error('User not found');

  // Toggle blocked status
  users[userIdx].isBlocked = !users[userIdx].isBlocked;
  
  localStorage.setItem(DB_USERS, JSON.stringify(users));
  return users[userIdx];
};

// --- Properties ---
export const getProperties = async (): Promise<Property[]> => {
  await delay(300);
  return JSON.parse(localStorage.getItem(DB_PROPERTIES) || '[]');
};

export const getPropertyById = async (id: string): Promise<Property | undefined> => {
  await delay(200);
  const props: Property[] = JSON.parse(localStorage.getItem(DB_PROPERTIES) || '[]');
  return props.find(p => p.id === id);
};

export const addProperty = async (property: Omit<Property, 'id' | 'createdAt' | 'status' | 'ownerName'>, owner: User): Promise<void> => {
  await delay(500);
  const props: Property[] = JSON.parse(localStorage.getItem(DB_PROPERTIES) || '[]');
  const newProp: Property = {
    ...property,
    id: Math.random().toString(36).substr(2, 9),
    status: PropertyStatus.PENDING,
    createdAt: new Date().toISOString(),
    ownerId: owner.id,
    ownerName: owner.name
  };
  props.push(newProp);
  localStorage.setItem(DB_PROPERTIES, JSON.stringify(props));
};

export const updatePropertyStatus = async (id: string, status: PropertyStatus): Promise<void> => {
  await delay(300);
  const props: Property[] = JSON.parse(localStorage.getItem(DB_PROPERTIES) || '[]');
  const index = props.findIndex(p => p.id === id);
  if (index !== -1) {
    props[index].status = status;
    localStorage.setItem(DB_PROPERTIES, JSON.stringify(props));
  }
};

// --- Bookings ---
export const createBooking = async (property: Property, user: User, date: string): Promise<void> => {
  await delay(400);
  const bookings: Booking[] = JSON.parse(localStorage.getItem(DB_BOOKINGS) || '[]');
  bookings.push({
    id: Math.random().toString(36).substr(2, 9),
    propertyId: property.id,
    propertyTitle: property.title,
    userId: user.id,
    userName: user.name,
    ownerId: property.ownerId,
    date,
    status: BookingStatus.PENDING
  });
  localStorage.setItem(DB_BOOKINGS, JSON.stringify(bookings));
};

export const getBookings = async (): Promise<Booking[]> => {
  await delay(300);
  return JSON.parse(localStorage.getItem(DB_BOOKINGS) || '[]');
};

export const updateBookingStatus = async (id: string, status: BookingStatus): Promise<void> => {
  await delay(300);
  const bookings: Booking[] = JSON.parse(localStorage.getItem(DB_BOOKINGS) || '[]');
  const idx = bookings.findIndex(b => b.id === id);
  if (idx !== -1) {
    bookings[idx].status = status;
    localStorage.setItem(DB_BOOKINGS, JSON.stringify(bookings));
  }
};

// --- Messages ---
export const getMessages = async (userId: string): Promise<Message[]> => {
  await delay(200);
  const allMessages: Message[] = JSON.parse(localStorage.getItem(DB_MESSAGES) || '[]');
  return allMessages.filter(m => m.senderId === userId || m.receiverId === userId);
};

export const sendMessage = async (sender: User, receiverId: string, text: string): Promise<Message> => {
  await delay(200);
  const messages: Message[] = JSON.parse(localStorage.getItem(DB_MESSAGES) || '[]');
  const users: User[] = JSON.parse(localStorage.getItem(DB_USERS) || '[]');
  const receiver = users.find(u => u.id === receiverId);

  const newMessage: Message = {
    id: Math.random().toString(36).substr(2, 9),
    senderId: sender.id,
    senderName: sender.name,
    receiverId: receiverId,
    receiverName: receiver ? receiver.name : 'Unknown User',
    text,
    timestamp: new Date().toISOString()
  };

  messages.push(newMessage);
  localStorage.setItem(DB_MESSAGES, JSON.stringify(messages));
  return newMessage;
};

// --- Stats for Admin ---
export const getAdminStats = async () => {
  const users = await getUsers();
  const properties = await getProperties();
  const bookings = await getBookings();
  
  return {
    totalUsers: users.length,
    totalOwners: users.filter(u => u.role === UserRole.OWNER).length,
    totalProperties: properties.length,
    pendingProperties: properties.filter(p => p.status === PropertyStatus.PENDING).length,
    totalBookings: bookings.length
  };
};
