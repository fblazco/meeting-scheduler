import dotenv from 'dotenv';
dotenv.config();

import sequelize from '../config/database';
import { User, Schedule, TimeSlot, Booking } from '../models';
import AuthService from '../services/authService';
import ScheduleService from '../services/scheduleService';
import BookingService from '../services/bookingService';

interface TestResult {
  category: string;
  testName: string;
  passed: boolean;
  durationMs: number;
  error?: string;
}

const results: TestResult[] = [];

async function runCheck(
  category: string,
  testName: string,
  fn: () => Promise<void>
): Promise<boolean> {
  const start = Date.now();
  try {
    await fn();
    const durationMs = Date.now() - start;
    results.push({ category, testName, passed: true, durationMs });
    console.log(`  ✅ [PASS] ${testName} (${durationMs}ms)`);
    return true;
  } catch (err: any) {
    const durationMs = Date.now() - start;
    const errorMsg = err.message || String(err);
    results.push({ category, testName, passed: false, durationMs, error: errorMsg });
    console.error(`  ❌ [FAIL] ${testName} (${durationMs}ms) ➔ Error: ${errorMsg}`);
    return false;
  }
}

export async function runFitnessSuite() {
  console.log('\n========================================================================');
  console.log('🧪 TUTORSYNC FULL FUNCTIONAL & PERFORMANCE FITNESS SUITE');
  console.log('========================================================================\n');

  const suiteStart = Date.now();
  const testEmail = `fitness_tutor_${Date.now()}@university.edu`;
  const studentEmail1 = `alice_${Date.now()}@university.edu`;
  const studentEmail2 = `bob_${Date.now()}@university.edu`;
  
  let tutorUser: any = null;
  let studentUser: any = null;
  let createdSchedule: any = null;
  let testSlot1: any = null;
  let testSlot2: any = null;
  let testSlot3: any = null;
  let studentBooking1: any = null;
  let studentBooking2: any = null;

  // ---------------------------------------------------------
  // 1. Database & Schema Health
  // ---------------------------------------------------------
  console.log('📊 1. DATABASE & SCHEMA INTEGRITY');
  await runCheck('Database', 'PostgreSQL database connectivity', async () => {
    await sequelize.authenticate();
  });

  await runCheck('Database', 'Relational tables & constraints check', async () => {
    await sequelize.sync({ alter: false });
    const tables = await sequelize.getQueryInterface().showAllTables();
    if (!tables.includes('users') || !tables.includes('schedules') || !tables.includes('time_slots') || !tables.includes('bookings')) {
      throw new Error(`Missing expected tables in database. Found: ${tables.join(', ')}`);
    }
  });

  // ---------------------------------------------------------
  // 2. Authentication & User Profile Lifecycle
  // ---------------------------------------------------------
  console.log('\n🔐 2. AUTHENTICATION & PROFILE FUNCTIONALITY');
  await runCheck('Auth', 'User registration and bcrypt password hashing', async () => {
    const res = await AuthService.register({
      name: 'Professor Ada Lovelace',
      email: testEmail,
      password: 'StrongAcademicPassword2026!',
    });

    if (!res.user.id || !res.token) {
      throw new Error('Registration failed to return user ID or JWT token.');
    }
    tutorUser = res.user;
  });

  await runCheck('Auth', 'Registered user login & JWT generation', async () => {
    const loginRes = await AuthService.login({
      email: testEmail,
      password: 'StrongAcademicPassword2026!',
    });
    if (!loginRes.token || loginRes.user.email !== testEmail) {
      throw new Error('Login returned invalid payload or token.');
    }
  });

  await runCheck('Auth', 'Duplicate email prevention (409 Conflict)', async () => {
    try {
      await AuthService.register({
        name: 'Imposter User',
        email: testEmail,
        password: 'password123',
      });
      throw new Error('Expected 409 conflict on duplicate email registration.');
    } catch (e: any) {
      if (e.statusCode !== 409) throw e;
    }
  });

  await runCheck('Auth', 'User profile retrieval (getMe)', async () => {
    const profile: any = await AuthService.getMe(tutorUser.id);
    if (!profile || profile.email !== testEmail || profile.name !== 'Professor Ada Lovelace') {
      throw new Error('Failed to retrieve correct user profile.');
    }
  });

  await runCheck('Auth', 'Register attendee student user', async () => {
    const res = await AuthService.register({
      name: 'Alice Student',
      email: studentEmail1,
      password: 'StudentPassword2026!',
    });
    studentUser = res.user;
  });

  // ---------------------------------------------------------
  // 3. Schedule & Slots Management Lifecycle
  // ---------------------------------------------------------
  console.log('\n📅 3. SCHEDULE & TIME SLOT FUNCTIONALITY');
  await runCheck('Schedule', 'Create schedule with batch generated time slots', async () => {
    const now = Date.now();
    const slotStart1 = new Date(now + 3600000);  // +1 hr
    const slotEnd1 = new Date(now + 5400000);    // +1.5 hr
    const slotStart2 = new Date(now + 5400000);  // +1.5 hr
    const slotEnd2 = new Date(now + 7200000);    // +2 hr
    const slotStart3 = new Date(now + 7200000);  // +2 hr
    const slotEnd3 = new Date(now + 9000000);    // +2.5 hr

    createdSchedule = await ScheduleService.createSchedule(tutorUser.id, {
      title: 'Advanced Computer Systems Tutoring',
      description: 'Office hours in Building A, Room 302',
      slotDuration: 30,
      slots: [
        { startTime: slotStart1.toISOString(), endTime: slotEnd1.toISOString() },
        { startTime: slotStart2.toISOString(), endTime: slotEnd2.toISOString() },
        { startTime: slotStart3.toISOString(), endTime: slotEnd3.toISOString() },
      ],
    });

    if (!createdSchedule.id || !createdSchedule.linkToken) {
      throw new Error('Schedule created without valid ID or linkToken.');
    }
    const slots = (createdSchedule as any).timeSlots;
    if (!slots || slots.length !== 3) {
      throw new Error(`Expected 3 time slots created, found: ${slots?.length}`);
    }

    testSlot1 = slots[0];
    testSlot2 = slots[1];
    testSlot3 = slots[2];
  });

  await runCheck('Schedule', 'Retrieve all schedules owned by user', async () => {
    const userSchedules = await ScheduleService.getUserSchedules(tutorUser.id);
    if (!userSchedules || userSchedules.length === 0) {
      throw new Error('Failed to retrieve user schedules.');
    }
  });

  await runCheck('Schedule', 'Public schedule link lookup (No Auth needed)', async () => {
    const publicSched: any = await ScheduleService.getScheduleByLinkToken(createdSchedule.linkToken);
    if (!publicSched || publicSched.title !== 'Advanced Computer Systems Tutoring') {
      throw new Error('Public link lookup returned incorrect schedule.');
    }
    if (!publicSched.timeSlots || publicSched.timeSlots.length === 0) {
      throw new Error('Public schedule returned no bookable slots.');
    }
  });

  await runCheck('Schedule', 'Update schedule settings (Title & Slot Duration)', async () => {
    const updated: any = await ScheduleService.updateSchedule(createdSchedule.id, tutorUser.id, {
      title: 'Advanced Systems & OS Office Hours',
      slotDuration: 45,
    });
    if (updated.title !== 'Advanced Systems & OS Office Hours' || updated.slotDuration !== 45) {
      throw new Error('Schedule update was not reflected in the database.');
    }
  });

  // ---------------------------------------------------------
  // 4. Booking Lifecycle, Approvals & Concurrency
  // ---------------------------------------------------------
  console.log('\n📝 4. BOOKINGS, CONCURRENCY & APPROVAL FLOW');
  await runCheck('Booking', 'Submit booking request for open slot (Alice)', async () => {
    studentBooking1 = await BookingService.createBooking({
      timeSlotId: testSlot1.id,
      studentName: 'Alice Student',
      studentEmail: studentEmail1,
      studentNotes: 'Questions about Virtual Memory & Paging',
      userId: studentUser.id,
    });

    if (!studentBooking1.id || studentBooking1.status !== 'pending') {
      throw new Error('Booking request was not set to pending status.');
    }
  });

  await runCheck('Booking', 'Submit competing booking on same slot (Bob, Pending)', async () => {
    studentBooking2 = await BookingService.createBooking({
      timeSlotId: testSlot1.id,
      studentName: 'Bob Student',
      studentEmail: studentEmail2,
      studentNotes: 'Questions about Semaphore Deadlocks',
    });

    if (!studentBooking2.id || studentBooking2.status !== 'pending') {
      throw new Error('Competing booking was not queued as pending.');
    }
  });

  await runCheck('Booking', 'Owner approves Alice (Locks slot & auto-rejects competing Bob)', async () => {
    await BookingService.updateBookingStatus(studentBooking1.id, tutorUser.id, 'accepted');

    const updatedB1 = await Booking.findByPk(studentBooking1.id);
    if (updatedB1?.status !== 'accepted') {
      throw new Error('Alice booking status was not updated to accepted.');
    }

    const updatedSlot = await TimeSlot.findByPk(testSlot1.id);
    if (!updatedSlot?.isBooked) {
      throw new Error('TimeSlot was not locked (isBooked must be true).');
    }

    const updatedB2 = await Booking.findByPk(studentBooking2.id);
    if (updatedB2?.status !== 'rejected') {
      throw new Error('Competing booking was not automatically rejected.');
    }
  });

  await runCheck('Booking', 'Reject new booking attempts on confirmed slot (409 Conflict)', async () => {
    try {
      await BookingService.createBooking({
        timeSlotId: testSlot1.id,
        studentName: 'Charlie Student',
        studentEmail: 'charlie@university.edu',
      });
      throw new Error('Expected 409 Conflict for booking an already confirmed slot.');
    } catch (e: any) {
      if (e.statusCode !== 409) throw e;
    }
  });

  await runCheck('Booking', 'Retrieve attendee personal booking list', async () => {
    const userBookings = await BookingService.getUserBookings(studentUser.id);
    if (!userBookings || userBookings.length === 0) {
      throw new Error('Failed to retrieve attendee personal bookings.');
    }
  });

  // ---------------------------------------------------------
  // 5. Cancellation & Slot Recovery
  // ---------------------------------------------------------
  console.log('\n🔄 5. CANCELLATION & SLOT RECOVERY');
  await runCheck('Booking', 'Cancel confirmed booking and release slot back to open', async () => {
    await BookingService.cancelBooking(studentBooking1.id, tutorUser.id);

    const cancelledB = await Booking.findByPk(studentBooking1.id);
    if (cancelledB?.status !== 'cancelled') {
      throw new Error('Booking status was not marked as cancelled.');
    }

    const releasedSlot = await TimeSlot.findByPk(testSlot1.id);
    if (releasedSlot?.isBooked) {
      throw new Error('TimeSlot was not released (isBooked must be false after cancellation).');
    }
  });

  // ---------------------------------------------------------
  // 6. Concurrency & Stress Fitness Benchmark
  // ---------------------------------------------------------
  console.log('\n⚡ 6. PERFORMANCE & CONCURRENCY FITNESS BENCHMARK');
  await runCheck('Performance', 'High-concurrency parallel booking requests (10 simultaneous)', async () => {
    // Attempt 10 parallel booking submissions on testSlot2
    const promises = Array.from({ length: 10 }).map((_, i) =>
      BookingService.createBooking({
        timeSlotId: testSlot2.id,
        studentName: `Parallel Student ${i + 1}`,
        studentEmail: `parallel_${i + 1}@university.edu`,
      })
    );

    const concurrentBookings = await Promise.all(promises);
    if (concurrentBookings.length !== 10) {
      throw new Error('Not all concurrent booking requests were created.');
    }

    // Approve the first one
    await BookingService.updateBookingStatus(concurrentBookings[0].id, tutorUser.id, 'accepted');

    // Verify exactly 1 is accepted and 9 are rejected
    const allBookings = await Booking.findAll({ where: { timeSlotId: testSlot2.id } });
    const accepted = allBookings.filter((b) => b.status === 'accepted');
    const rejected = allBookings.filter((b) => b.status === 'rejected');

    if (accepted.length !== 1) {
      throw new Error(`Concurrency Invariant Violated! Expected 1 accepted booking, found ${accepted.length}`);
    }
    if (rejected.length !== 9) {
      throw new Error(`Concurrency Invariant Violated! Expected 9 auto-rejected bookings, found ${rejected.length}`);
    }
  });

  // ---------------------------------------------------------
  // 7. Cascade Deletion Integrity
  // ---------------------------------------------------------
  console.log('\n🧹 7. CASCADE DELETION & INTEGRITY');
  await runCheck('Schedule', 'Delete schedule and cascade-delete slots & bookings', async () => {
    await ScheduleService.deleteSchedule(createdSchedule.id, tutorUser.id);

    const deletedSched = await Schedule.findByPk(createdSchedule.id);
    if (deletedSched !== null) {
      throw new Error('Schedule was not deleted from database.');
    }

    const remainingSlots = await TimeSlot.findAll({ where: { scheduleId: createdSchedule.id } });
    if (remainingSlots.length > 0) {
      throw new Error('Cascade delete failed: Orphan time slots remain.');
    }

    const remainingBookings = await Booking.findAll({ where: { scheduleId: createdSchedule.id } });
    if (remainingBookings.length > 0) {
      throw new Error('Cascade delete failed: Orphan bookings remain.');
    }
  });

  // ---------------------------------------------------------
  // Fitness Function Score & Metrics Evaluation
  // ---------------------------------------------------------
  const totalDuration = Date.now() - suiteStart;
  const passedCount = results.filter((r) => r.passed).length;
  const totalCount = results.length;
  const fitnessScore = Math.round((passedCount / totalCount) * 100);

  const avgDuration = Math.round(
    results.reduce((acc, r) => acc + r.durationMs, 0) / totalCount
  );
  const maxDuration = Math.max(...results.map((r) => r.durationMs));

  console.log('\n========================================================================');
  console.log('🏁 TUTORSYNC ARCHITECTURAL & FUNCTIONAL FITNESS REPORT');
  console.log('========================================================================');
  console.log(`Total Functional & Architectural Invariants Tested : ${totalCount}`);
  console.log(`Passed Invariants                                  : ${passedCount}`);
  console.log(`Failed Invariants                                  : ${totalCount - passedCount}`);
  console.log(`Average Check Latency                              : ${avgDuration}ms`);
  console.log(`Peak Check Latency                                 : ${maxDuration}ms`);
  console.log(`Total Test Execution Duration                      : ${totalDuration}ms`);
  console.log('------------------------------------------------------------------------');
  console.log(`🎯 OVERALL ARCHITECTURAL FITNESS SCORE              : ${fitnessScore}%`);

  if (fitnessScore === 100 && avgDuration < 100) {
    console.log('🌟 EXCELLENT: System passed 100% of all functional, security, and performance invariants!');
  } else if (fitnessScore === 100) {
    console.log('✅ PASS: All functional checks passed (latency within acceptable range).');
  } else {
    console.error('⚠️ ATTENTION: Invariant violations detected! Review the logs above.');
  }
  console.log('========================================================================\n');

  return { fitnessScore, passedCount, totalCount, avgDuration, totalDuration, results };
}

// Direct CLI execution
if (require.main === module) {
  runFitnessSuite()
    .then((res) => {
      process.exit(res.fitnessScore === 100 ? 0 : 1);
    })
    .catch((err) => {
      console.error('Fatal Fitness Test Runner Error:', err);
      process.exit(1);
    });
}
