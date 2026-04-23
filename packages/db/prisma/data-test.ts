import { PrismaClient } from '@mezon-tutors/db';

const prisma = new PrismaClient();

async function main() {
  console.log('--- START ADDING TEST DATA ---');

  const userId = '7dcb31dd-cfb2-4e4f-a407-ea3614ac6fdc';

  console.log(`Finding tutor with user ID: ${userId}`);

  const tutor = await prisma.tutorProfile.findUnique({
    where: { userId },
  });

  if (!tutor) {
    console.error('Tutor not found in database!');
    process.exit(1);
  }

  console.log(`Found tutor profile ID: ${tutor.id}`);

  console.log('Cleaning up existing availability...');
  await prisma.tutorAvailability.deleteMany({
    where: { tutorId: tutor.id },
  });

  console.log('Adding diverse availability slots...');

  const availabilitySlots = [
    { dayOfWeek: 0, startTime: '08:00', endTime: '08:30' },
    { dayOfWeek: 0, startTime: '09:00', endTime: '09:30' },
    { dayOfWeek: 0, startTime: '10:00', endTime: '10:30' },
    { dayOfWeek: 0, startTime: '10:30', endTime: '11:00' },

    { dayOfWeek: 1, startTime: '19:00', endTime: '19:30' },
    { dayOfWeek: 1, startTime: '20:00', endTime: '20:30' },
    { dayOfWeek: 1, startTime: '21:00', endTime: '21:30' },

    { dayOfWeek: 2, startTime: '08:00', endTime: '08:30' },
    { dayOfWeek: 2, startTime: '09:00', endTime: '09:30' },
    { dayOfWeek: 2, startTime: '10:30', endTime: '11:00' },
    { dayOfWeek: 2, startTime: '11:00', endTime: '11:30' },
    { dayOfWeek: 2, startTime: '12:00', endTime: '12:30' },
    { dayOfWeek: 2, startTime: '13:30', endTime: '14:00' },
    { dayOfWeek: 2, startTime: '14:30', endTime: '15:00' },
    { dayOfWeek: 2, startTime: '19:00', endTime: '19:30' },
    { dayOfWeek: 2, startTime: '20:00', endTime: '20:30' },
    { dayOfWeek: 2, startTime: '21:00', endTime: '21:30' },

    { dayOfWeek: 3, startTime: '12:00', endTime: '12:30' },
    { dayOfWeek: 3, startTime: '13:00', endTime: '13:30' },
    { dayOfWeek: 3, startTime: '13:30', endTime: '14:00' },
    { dayOfWeek: 3, startTime: '14:30', endTime: '15:00' },

    { dayOfWeek: 4, startTime: '08:00', endTime: '08:30' },
    { dayOfWeek: 4, startTime: '09:00', endTime: '09:30' },
    { dayOfWeek: 4, startTime: '10:00', endTime: '10:30' },
    { dayOfWeek: 4, startTime: '11:00', endTime: '11:30' },
    { dayOfWeek: 4, startTime: '19:00', endTime: '19:30' },
    { dayOfWeek: 4, startTime: '20:00', endTime: '20:30' },

    { dayOfWeek: 5, startTime: '19:00', endTime: '19:30' },
    { dayOfWeek: 5, startTime: '21:00', endTime: '21:30' },

    { dayOfWeek: 6, startTime: '08:00', endTime: '08:30' },
    { dayOfWeek: 6, startTime: '09:00', endTime: '09:30' },
    { dayOfWeek: 6, startTime: '10:00', endTime: '10:30' },
    { dayOfWeek: 6, startTime: '10:30', endTime: '11:00' },
    { dayOfWeek: 6, startTime: '11:00', endTime: '11:30' },
    { dayOfWeek: 6, startTime: '12:00', endTime: '12:30' },
    { dayOfWeek: 6, startTime: '13:00', endTime: '13:30' },
    { dayOfWeek: 6, startTime: '14:00', endTime: '14:30' },
    { dayOfWeek: 6, startTime: '19:00', endTime: '19:30' },
    { dayOfWeek: 6, startTime: '20:00', endTime: '20:30' },
    { dayOfWeek: 6, startTime: '21:00', endTime: '21:30' },
  ];

  for (const slot of availabilitySlots) {
    await prisma.tutorAvailability.create({
      data: {
        tutorId: tutor.id,
        ...slot,
        isActive: true,
      },
    });
  }

  console.log(`Added ${availabilitySlots.length} availability slots for tutor ${tutor.id}`);
  console.log('--- TEST DATA ADDED SUCCESSFULLY ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
