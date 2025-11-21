// 1. Definition of the Mock object that simulates Prisma's functions
const mockPrisma = {
    user: { findUnique: jest.fn() },
    friendship: { 
        findFirst: jest.fn(), 
        create: jest.fn(), 
        update: jest.fn(), 
        delete: jest.fn(),
        findUnique: jest.fn(),
    },
};

// 2. Applying the Global Mock
// This replaces the '@/lib/prisma' module with our mock for ALL tests.
jest.mock('@/lib/prisma', () => ({ prisma: mockPrisma }));

// Export the mock so you can use it in your .spec.ts files
export { mockPrisma };