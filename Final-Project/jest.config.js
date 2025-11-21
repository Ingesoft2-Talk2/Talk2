module.exports = {
  // Make sure you have the paths for your test files
  roots: ['<rootDir>/src'], 
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  
  // Key line for Prisma's mockup:

  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  
  
  preset: 'ts-jest', 
  testEnvironment: 'node',
  moduleNameMapper: {
    // This maps '@/' to the 'src/' folder within the project root
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  
};