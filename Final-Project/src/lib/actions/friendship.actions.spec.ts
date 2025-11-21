// Imports the Prisma mock that was globally configured and mocked in src/setupTests.ts
import { mockPrisma } from '../../setupTests'; 

import { 
  sendFriendRequest, 
  acceptFriendRequest, 
  blockUser, 
  removeFriend 
} from './friendship.actions'; 

// --- Constant Definitions for Testing ---
const USER_A_ID = 'user_A';
const USER_B_ID = 'user_B';
const USER_B_EMAIL = 'userb@talk2.com';
const FRIENDSHIP_ID = 'friendship_id_1';
const EXISTING_FRIENDSHIP_ID = 'old_friendship_id'; // Used for blockUser test

describe('Friendship Actions Logic (Unit Tests)', () => {

  beforeEach(() => {
    // Clears the call history of the mocks before each test
    jest.clearAllMocks(); 
    
    // Default configuration: Target user B always exists.
    mockPrisma.user.findUnique.mockResolvedValue({ id: USER_B_ID, email: USER_B_EMAIL });
    
    // Set a clean default for friendship finds
    mockPrisma.friendship.findUnique.mockResolvedValue(null);
    mockPrisma.friendship.findFirst.mockResolvedValue(null);
  });

  // ==========================================================
  // 1. sendFriendRequest Tests (Passing)
  // ==========================================================

  it('Should create a friendship request with PENDING status if no prior relationship exists', async () => {
    mockPrisma.friendship.findFirst.mockResolvedValue(null);
    await sendFriendRequest(USER_A_ID, USER_B_EMAIL);
    expect(mockPrisma.friendship.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          requesterId: USER_A_ID,
          addresseeId: USER_B_ID,
          status: "PENDING",
        },
      }),
    );
  });

  it('Should throw an error if the target user has already blocked the requester', async () => {
    mockPrisma.friendship.findFirst.mockResolvedValue({ status: "BLOCKED" }); 
    await expect(sendFriendRequest(USER_A_ID, USER_B_EMAIL)).rejects.toThrow(
      "Unable to send request" 
    );
    expect(mockPrisma.friendship.create).not.toHaveBeenCalled();
  });
  
  it('Should throw an error if the friendship is already in ACCEPTED status', async () => {
    mockPrisma.friendship.findFirst.mockResolvedValue({ status: "ACCEPTED" }); 
    await expect(sendFriendRequest(USER_A_ID, USER_B_EMAIL)).rejects.toThrow(
      "You are already friends"
    );
    expect(mockPrisma.friendship.create).not.toHaveBeenCalled();
  });

  // ==========================================================
  // 2. acceptFriendRequest Tests (Passing)
  // ==========================================================

  it('Should update status to ACCEPTED if the current user is the addressee', async () => {
    mockPrisma.friendship.findUnique.mockResolvedValue({
      id: FRIENDSHIP_ID,
      addresseeId: USER_B_ID, 
      requesterId: USER_A_ID,
      status: "PENDING",
    });

    await acceptFriendRequest(FRIENDSHIP_ID, USER_B_ID); 

    expect(mockPrisma.friendship.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: FRIENDSHIP_ID },
        data: { status: "ACCEPTED", acceptedAt: expect.any(Date) },
      }),
    );
  });
  
  it('Should throw an Unauthorized error if a third party attempts to accept the request', async () => {
    mockPrisma.friendship.findUnique.mockResolvedValue({
      id: FRIENDSHIP_ID,
      addresseeId: USER_B_ID,
      status: "PENDING",
    });

    const INTRUDER_ID = 'user_C';
    await expect(acceptFriendRequest(FRIENDSHIP_ID, INTRUDER_ID)).rejects.toThrow("Unauthorized");
    expect(mockPrisma.friendship.update).not.toHaveBeenCalled();
  });
  
  // ==========================================================
  // 3. blockUser Tests (Passing)
  // ==========================================================

  it('Should delete the existing relationship (if any) and create a new BLOCKED record', async () => {
    
    mockPrisma.friendship.findFirst.mockResolvedValue({ id: EXISTING_FRIENDSHIP_ID, status: "ACCEPTED" }); 

    await blockUser(USER_A_ID, USER_B_ID); 

    expect(mockPrisma.friendship.delete).toHaveBeenCalledWith({ where: { id: EXISTING_FRIENDSHIP_ID } });
    
    expect(mockPrisma.friendship.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          requesterId: USER_A_ID, 
          addresseeId: USER_B_ID,
          status: "BLOCKED",
        },
      }),
    );
  });
  
  // ==========================================================
  // 4. removeFriend Tests (Final Fix)
  // ==========================================================

  it('Should delete the friendship record if the relationship is ACCEPTED', async () => {
    // SETUP 1: Force findUnique to return the ACCEPTED record once.
    mockPrisma.friendship.findUnique.mockResolvedValueOnce({
      id: FRIENDSHIP_ID,
      status: "ACCEPTED",
    });
    // SETUP 2: Force the delete call to return a result (to resolve the promise).
    mockPrisma.friendship.delete.mockResolvedValueOnce({});

    // The function resolves successfully (returns void/undefined)
    await expect(removeFriend(FRIENDSHIP_ID, USER_A_ID)).resolves.toBeUndefined();

    // ASSERT: 'delete' is called to remove the friendship
    expect(mockPrisma.friendship.delete).toHaveBeenCalledWith({ where: { id: FRIENDSHIP_ID } });
  });
  
  it('Should not throw an error and resolve if the record is not of type ACCEPTED', async () => {
    // SETUP: Force findUnique to return the PENDING record once.
    mockPrisma.friendship.findUnique.mockResolvedValueOnce({
      id: FRIENDSHIP_ID,
      status: "PENDING",
    });

    // We expect the function to resolve to undefined and not call delete.
    await expect(removeFriend(FRIENDSHIP_ID, USER_A_ID)).resolves.toBeUndefined();
    
    // ASSERT: Deletion attempt should NOT be made.
    expect(mockPrisma.friendship.delete).not.toHaveBeenCalled();
  });
});