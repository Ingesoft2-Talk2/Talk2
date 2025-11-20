import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient();

async function main() {
    console.log('Starting seed...');


await prisma.friendship.deleteMany(); 
await prisma.auditLog.deleteMany();
await prisma.callParticipant.deleteMany();
await prisma.message.deleteMany();
await prisma.invitation.deleteMany();
await prisma.call.deleteMany();
await prisma.room.deleteMany();
await prisma.profile.deleteMany();
await prisma.user.deleteMany();

console.log('Creating users and profiles...');

  // Create User 1 - Host (Alice)
const user1 = await prisma.user.create({
    data: {
      clerkId: 'user_2abc123', // REQUIRED FIELD ADDED
        email: 'alice@example.com',
        isActive: true,
        profile: {
            create: {
            displayName: 'Alice Johnson',
            avatarUrl: 'https://i.pravatar.cc/150?img=1',
            }
        }
    },
    include: { profile: true }
});

  // Create User 2 - Attendee (Bob)
const user2 = await prisma.user.create({
    data: {
      clerkId: 'user_2def456', // REQUIRED FIELD ADDED
        email: 'bob@example.com',
        isActive: true,
        profile: {
            create: {
            displayName: 'Bob Smith',
            avatarUrl: 'https://i.pravatar.cc/150?img=2',
            }
        }
    },
    include: { profile: true }
});

  // Create User 3 - Attendee (Charlie)
const user3 = await prisma.user.create({
    data: {
      clerkId: 'user_2ghi789', // REQUIRED FIELD ADDED
        email: 'charlie@example.com',
        isActive: true,
        profile: {
            create: {
            displayName: 'Charlie Davis',
            avatarUrl: 'https://i.pravatar.cc/150?img=3',
            }
        }
    },
    include: { profile: true }
});

console.log('Updating user email (creating audit log)...');

  // Update User 2's email
const oldEmail = user2.email;
const updatedUser2 = await prisma.user.update({
    where: { id: user2.id },
    data: { email: 'bob.smith@newdomain.com' },
});

  // Create audit log for email change
await prisma.auditLog.create({
        data: {
        userId: user2.id,
        action: 'UPDATE_EMAIL',
        details: {
            oldEmail: oldEmail,
            newEmail: updatedUser2.email,
        },
    },
});

console.log('Creating rooms and calls...');

  // --- Meeting 1: SCHEDULED ---
  // In new schema: Create a Room, then a Call inside it
const room1 = await prisma.room.create({
    data: {
        ownerId: user1.id,
        name: 'Team Planning Room',
        slug: 'MEET001', // Using slug as the code
        calls: {
            create: {
            hostUserId: user1.id,
            status: 'SCHEDULED',
            startedAt: new Date('2025-11-20T10:00:00Z'),
            }
        }
    },
    include: { calls: true }
});
  const call1 = room1.calls[0]; // Get the call created above

  // --- Meeting 2: LIVE (ONGOING) ---
const room2 = await prisma.room.create({
    data: {
        ownerId: user1.id,
        name: 'Daily Standup Room',
        slug: 'MEET002',
        calls: {
            create: {
            hostUserId: user1.id,
            status: 'ONGOING', // Live
            startedAt: new Date('2025-11-18T09:00:00Z'),
            }
        }
    },
    include: { calls: true }
});
const call2 = room2.calls[0];

  // --- Meeting 3: COMPLETED ---
const room3 = await prisma.room.create({
    data: {
        ownerId: user2.id,
        name: 'Retrospective Room',
        slug: 'MEET003',
        calls: {
            create: {
            hostUserId: user2.id,
            status: 'ENDED',
            startedAt: new Date('2025-11-15T14:00:00Z'),
            endedAt: new Date('2025-11-15T15:30:00Z'),
            }
        }
    },
    include: { calls: true }
});
const call3 = room3.calls[0];

console.log('Adding participants...');

  // Meeting 1 Participants
await prisma.callParticipant.createMany({
    data: [
        { callId: call1.id, userId: user1.id, roleInCall: 'HOST' },
        { callId: call1.id, userId: user2.id, roleInCall: 'GUEST' },
        { callId: call1.id, userId: user3.id, roleInCall: 'GUEST' },
        ]
});

  // Meeting 2 Participants
await prisma.callParticipant.createMany({
    data: [
        { callId: call2.id, userId: user1.id, roleInCall: 'HOST' },
        { callId: call2.id, userId: user2.id, roleInCall: 'GUEST' },
        ]
});

  // Meeting 3 Participants
await prisma.callParticipant.createMany({
    data: [
        { callId: call3.id, userId: user2.id, roleInCall: 'HOST' },
        { callId: call3.id, userId: user3.id, roleInCall: 'GUEST' },
        ]
});

console.log('Creating friends...');
  // Alice sends request to Bob (PENDING)
await prisma.friendship.create({
    data: {
        requesterId: user1.id,
        addresseeId: user2.id,
        status: 'PENDING'
        }
});

console.log('Seed completed successfully!');
}

main()
.catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
})
.finally(async () => {
    await prisma.$disconnect();
});