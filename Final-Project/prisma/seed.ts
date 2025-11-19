import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting seed');

    // Clear existing data
    await prisma.userAuditLog.deleteMany();
    await prisma.participant.deleteMany();
    await prisma.meeting.deleteMany();
    await prisma.user.deleteMany();

    console.log('Creating users');

  // Create User 1 - Host
const user1 = await prisma.user.create({
    data: {
    clerkId: 'clerk_user1_abc123',
    email: 'alice@example.com',
    name: 'Alice Johnson',
    imageUrl: 'https://i.pravatar.cc/150?img=1',
    },
});

  // Create User 2 - Attendee
const user2 = await prisma.user.create({
data: {
    clerkId: 'clerk_user2_def456',
    email: 'bob@example.com',
    name: 'Bob Smith',
    imageUrl: 'https://i.pravatar.cc/150?img=2',
},
});

  // Create User 3 - Attendee
const user3 = await prisma.user.create({
data: {
    clerkId: 'clerk_user3_ghi789',
    email: 'charlie@example.com',
    name: 'Charlie Davis',
    imageUrl: 'https://i.pravatar.cc/150?img=3',
},
});

console.log('Updating user email (creating audit log)');

// Update User 2's email
const oldEmail = user2.email;
const updatedUser2 = await prisma.user.update({
where: { id: user2.id },
data: { email: 'bob.smith@newdomain.com' },
});

  // Create audit log for email change
await prisma.userAuditLog.create({
data: {
    userId: user2.id,
    action: 'UPDATE_EMAIL',
    changedBy: user2.id, // Self-changed
    details: {
    oldEmail: oldEmail,
    newEmail: updatedUser2.email,
    },
},
});

console.log('Creating meetings');

// Create Meeting 1 - SCHEDULED
const meeting1 = await prisma.meeting.create({
    data: {
        title: 'Team Planning Meeting',
        description: 'Q4 planning and roadmap discussion',
        code: 'MEET001',
        status: 'SCHEDULED',
        hostId: user1.id,
        startsAt: new Date('2025-11-20T10:00:00Z'),
    },
});

  // Create Meeting 2 - LIVE
const meeting2 = await prisma.meeting.create({
    data: {
        title: 'Daily Standup',
        description: 'Quick sync on progress',
        code: 'MEET002',
        status: 'LIVE',
        hostId: user1.id,
        startsAt: new Date('2025-11-18T09:00:00Z'),
},
});

  // Create Meeting 3 - COMPLETED
const meeting3 = await prisma.meeting.create({
    data: {
        title: 'Retrospective',
        description: 'Sprint review and retrospective',
        code: 'MEET003',
        status: 'COMPLETED',
        hostId: user2.id,
        startsAt: new Date('2025-11-15T14:00:00Z'),
        endedAt: new Date('2025-11-15T15:30:00Z'),
},
});

console.log('Adding participants');

  // Meeting 1 participants (scheduled)
await prisma.participant.create({
    data: {
        meetingId: meeting1.id,
        userId: user1.id,
        role: 'HOST',
    },
});

await prisma.participant.create({
    data: {
        meetingId: meeting1.id,
        userId: user2.id,
        role: 'ATTENDEE',
    },
});

await prisma.participant.create({
    data: {
        meetingId: meeting1.id,
        userId: user3.id,
        role: 'ATTENDEE',
    },
});

// Meeting 2 participants (live)
await prisma.participant.create({
    data: {
        meetingId: meeting2.id,
        userId: user1.id,
        role: 'HOST',
    },
});

await prisma.participant.create({
    data: {
        meetingId: meeting2.id,
        userId: user2.id,
        role: 'ATTENDEE',
    },
});

// Meeting 3 participants (completed)
await prisma.participant.create({
    data: {
        meetingId: meeting3.id,
        userId: user2.id,
        role: 'HOST',
    },
});

await prisma.participant.create({
    data: {
        meetingId: meeting3.id,
        userId: user3.id,
        role: 'ATTENDEE',
    },
});

console.log(' Creating additional audit logs');

// User 1 profile update
await prisma.userAuditLog.create({
    data: {
        userId: user1.id,
        action: 'PROFILE_UPDATE',
        changedBy: user1.id,
        details: {
        field: 'imageUrl',
        oldValue: null,
        newValue: user1.imageUrl,
        },
    },
});

// User 3 name change
await prisma.userAuditLog.create({
    data: {
        userId: user3.id,
        action: 'PROFILE_UPDATE',
        changedBy: user3.id,
        details: {
        field: 'name',
        oldValue: 'Charlie D.',
        newValue: 'Charlie Davis',
        },
    },
});

console.log('Seed completed successfully!');
console.log(' Summary:');
console.log(`- ${3} users created`);
console.log(`- ${3} meetings created`);
console.log(`- ${7} participants added`);
console.log(`- ${3} audit log entries created`);
console.log(' Users:');
console.log(`  - Alice (${user1.email}) - Hosting 2 meetings`);
console.log(`  - Bob (${updatedUser2.email}) - Email updated, hosting 1 meeting`);
console.log(`  - Charlie (${user3.email}) - Attending 2 meetings`);
}

main()
.catch((e) => {
console.error(' Error during seed:', e);
process.exit(1);
})
.finally(async () => {
await prisma.$disconnect();
});