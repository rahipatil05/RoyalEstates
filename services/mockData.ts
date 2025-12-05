

import { Message, Property, PropertyStatus, PropertyType, User, UserRole } from "../types";

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'John Tenant',
    email: 'user@demo.com',
    role: UserRole.USER,
    favorites: [],
    isBlocked: false
  },
  {
    id: 'o1',
    name: 'Sarah Landlord',
    email: 'owner@demo.com',
    role: UserRole.OWNER,
    favorites: [],
    isBlocked: false
  },
  {
    id: 'o2',
    name: 'Mike Builder',
    email: 'builder@demo.com',
    role: UserRole.OWNER,
    favorites: [],
    isBlocked: false
  },
  {
    id: 'a1',
    name: 'Super Admin',
    email: 'admin@demo.com',
    role: UserRole.ADMIN,
    favorites: [],
    isBlocked: false
  }
];

export const MOCK_MESSAGES: Message[] = [
  {
    id: 'm1',
    senderId: 'u1',
    senderName: 'John Tenant',
    receiverId: 'o1',
    receiverName: 'Sarah Landlord',
    text: 'Is the apartment still available?',
    timestamp: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'm2',
    senderId: 'o1',
    senderName: 'Sarah Landlord',
    receiverId: 'u1',
    receiverName: 'John Tenant',
    text: 'Yes, it is! When would you like to view it?',
    timestamp: new Date(Date.now() - 82000000).toISOString()
  }
];

export const MOCK_PROPERTIES: Property[] = [
  {
    id: 'p1',
    ownerId: 'o1',
    ownerName: 'Sarah Landlord',
    title: 'Luxury Apartment near RPD Cross',
    description: 'A beautiful 2BHK in the heart of Tilakwadi with a gym and pool access. Close to colleges and shopping centers.',
    type: PropertyType.FLAT_2BHK,
    rent: 15000,
    location: 'Tilakwadi, Belgaum',
    amenities: ['Gym', 'Pool', 'Parking', 'WiFi', 'Concierge'],
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    status: PropertyStatus.APPROVED,
    createdAt: new Date().toISOString()
  },
  {
    id: 'p2',
    ownerId: 'o1',
    ownerName: 'Sarah Landlord',
    title: 'Cozy Villa in Hindwadi',
    description: 'Perfect for families, this villa offers a large backyard, quiet neighborhood, and proximity to schools.',
    type: PropertyType.VILLA,
    rent: 25000,
    location: 'Hindwadi, Belgaum',
    amenities: ['Garden', 'Garage', 'Pet Friendly', 'Fireplace'],
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
    status: PropertyStatus.PENDING,
    createdAt: new Date().toISOString()
  },
  {
    id: 'p3',
    ownerId: 'o2',
    ownerName: 'Mike Builder',
    title: 'Modern Studio in Camp',
    description: 'High ceilings, large windows, and modern design. Ideal for young professionals working in the city center.',
    type: PropertyType.FLAT_1BHK,
    rent: 12000,
    location: 'Camp, Belgaum',
    amenities: ['AC', 'Smart Home', 'Roof Access', 'Elevator'],
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    status: PropertyStatus.APPROVED,
    createdAt: new Date().toISOString()
  },
  {
    id: 'p4',
    ownerId: 'o2',
    ownerName: 'Mike Builder',
    title: 'Spacious Bungalow',
    description: 'A serene home in the quiet lanes of Sadashiv Nagar. Includes a private garden.',
    type: PropertyType.VILLA,
    rent: 30000,
    location: 'Sadashiv Nagar, Belgaum',
    amenities: ['Garden', 'Patio', 'Fireplace', 'Furnished'],
    image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80',
    status: PropertyStatus.APPROVED,
    createdAt: new Date().toISOString()
  },
  {
    id: 'p5',
    ownerId: 'o1',
    ownerName: 'Sarah Landlord',
    title: 'High-rise Flat at Club Road',
    description: 'Spacious 3 bedroom apartment with stunning city views and premium finishes.',
    type: PropertyType.APARTMENT,
    rent: 22000,
    location: 'Club Road, Belgaum',
    amenities: ['Elevator', 'Concierge', 'Gym', 'Balcony'],
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    status: PropertyStatus.APPROVED,
    createdAt: new Date().toISOString()
  },
  {
    id: 'p6',
    ownerId: 'o2',
    ownerName: 'Mike Builder',
    title: 'Student Flat near VTU',
    description: 'Affordable, compact, and close to the university campus. Great community vibe.',
    type: PropertyType.FLAT_1BHK,
    rent: 8000,
    location: 'Machhe, Belgaum',
    amenities: ['WiFi', 'Study Area', 'Shared Laundry', 'Bicycle Parking'],
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
    status: PropertyStatus.APPROVED,
    createdAt: new Date().toISOString()
  },
  {
    id: 'p7',
    ownerId: 'o1',
    ownerName: 'Sarah Landlord',
    title: 'Family Home in Bhagya Nagar',
    description: 'A lovely place to raise a family with spacious rooms and a maintained garden.',
    type: PropertyType.VILLA,
    rent: 18000,
    location: 'Bhagya Nagar, Belgaum',
    amenities: ['Garden', 'Parking', 'Near School', 'Playground'],
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?auto=format&fit=crop&w=800&q=80',
    status: PropertyStatus.APPROVED,
    createdAt: new Date().toISOString()
  },
  {
    id: 'p8',
    ownerId: 'o2',
    ownerName: 'Mike Builder',
    title: 'Executive Suite at Congress Road',
    description: 'Luxury living for business travelers. Fully serviced with cleaning included.',
    type: PropertyType.APARTMENT,
    rent: 28000,
    location: 'Congress Road, Belgaum',
    amenities: ['Conference Room', 'Valet', 'Spa', 'Housekeeping'],
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    status: PropertyStatus.PENDING,
    createdAt: new Date().toISOString()
  },
  {
    id: 'p9',
    ownerId: 'o1',
    ownerName: 'Sarah Landlord',
    title: 'Minimalist Condo',
    description: 'Clean lines and modern design in Shivbasav Nagar. Walking distance to parks.',
    type: PropertyType.FLAT_1BHK,
    rent: 11000,
    location: 'Shivbasav Nagar, Belgaum',
    amenities: ['Security', 'Balcony', 'Modern Kitchen', 'Smart Lock'],
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80',
    status: PropertyStatus.APPROVED,
    createdAt: new Date().toISOString()
  },
  {
    id: 'p10',
    ownerId: 'o2',
    ownerName: 'Mike Builder',
    title: 'Traditional House in Shahapur',
    description: 'Charming renovated house in the historic Shahapur area. Original features preserved.',
    type: PropertyType.APARTMENT,
    rent: 14000,
    location: 'Shahapur, Belgaum',
    amenities: ['Classic Architecture', 'Central Heating', 'Library', 'Courtyard'],
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80',
    status: PropertyStatus.APPROVED,
    createdAt: new Date().toISOString()
  },
  {
    id: 'p11',
    ownerId: 'o1',
    ownerName: 'Sarah Landlord',
    title: 'Penthouse near Chennamma Circle',
    description: 'Top floor luxury with private elevator and panoramic city views.',
    type: PropertyType.APARTMENT,
    rent: 35000,
    location: 'Chennamma Circle, Belgaum',
    amenities: ['Private Pool', 'Helipad Access', 'Smart Home', 'Butler Service'],
    image: 'https://images.unsplash.com/photo-1512918760532-3ed8629b9919?auto=format&fit=crop&w=800&q=80',
    status: PropertyStatus.APPROVED,
    createdAt: new Date().toISOString()
  },
  {
    id: 'p12',
    ownerId: 'o2',
    ownerName: 'Mike Builder',
    title: 'Budget Friendly 2BHK in Vadgaon',
    description: 'Clean and spacious apartment perfect for small families or roommates.',
    type: PropertyType.FLAT_2BHK,
    rent: 9000,
    location: 'Vadgaon, Belgaum',
    amenities: ['Parking', 'Near Bus Stop', 'Security'],
    image: 'https://images.unsplash.com/photo-1484154218962-a1c00207bf9a?auto=format&fit=crop&w=800&q=80',
    status: PropertyStatus.APPROVED,
    createdAt: new Date().toISOString()
  },
  {
    id: 'p13',
    ownerId: 'o1',
    ownerName: 'Sarah Landlord',
    title: 'Farmhouse near Rakaskop',
    description: 'Peaceful retreat near the dam. Ideal for weekend getaways or quiet living.',
    type: PropertyType.VILLA,
    rent: 20000,
    location: 'Rakaskop Road, Belgaum',
    amenities: ['Nature View', 'Boathouse', 'Fireplace', 'Garden'],
    image: 'https://images.unsplash.com/photo-1464146072230-91cabc968266?auto=format&fit=crop&w=800&q=80',
    status: PropertyStatus.APPROVED,
    createdAt: new Date().toISOString()
  },
  {
    id: 'p14',
    ownerId: 'o2',
    ownerName: 'Mike Builder',
    title: 'Modern Pad in Hanuman Nagar',
    description: 'Compact, efficient, and located in a peaceful residential area.',
    type: PropertyType.FLAT_1BHK,
    rent: 10000,
    location: 'Hanuman Nagar, Belgaum',
    amenities: ['Gym', 'Rooftop Bar', 'Coworking Space'],
    image: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=800&q=80',
    status: PropertyStatus.APPROVED,
    createdAt: new Date().toISOString()
  },
  {
    id: 'p15',
    ownerId: 'o1',
    ownerName: 'Sarah Landlord',
    title: 'Premium Villa in Udyambag',
    description: 'Massive 4 bedroom house with a large pool and backyard for kids.',
    type: PropertyType.VILLA,
    rent: 32000,
    location: 'Udyambag, Belgaum',
    amenities: ['Pool', 'Home Theater', 'Gym', 'Guesthouse'],
    image: 'https://images.unsplash.com/photo-1600596542815-e495e91f71a5?auto=format&fit=crop&w=800&q=80',
    status: PropertyStatus.APPROVED,
    createdAt: new Date().toISOString()
  }
];
