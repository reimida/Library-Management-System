import { ILibrary } from '../src/models/Library';

export const createTestLibraryData = (overrides = {}): Partial<ILibrary> => ({
  name: 'Test Library',
  libraryCode: 'TEST001',
  address: {
    street: '123 Test St',
    city: 'Test City',
    state: 'Test State',
    postalCode: '12345',
    country: 'Test Country'
  },
  operatingHours: {
    monday: { open: '09:00', close: '17:00' },
    tuesday: { open: '09:00', close: '17:00' },
    wednesday: { open: '09:00', close: '17:00' },
    thursday: { open: '09:00', close: '17:00' },
    friday: { open: '09:00', close: '17:00' }
  },
  contactPhone: '+1234567890',
  contactEmail: 'test@library.com',
  totalSeats: 100,
  isActive: true,
  ...overrides
}); 