import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding 7 days of bulking data...\n');

  await prisma.dailyReport.deleteMany();
  await prisma.ingestLog.deleteMany();
  await prisma.hermesConversation.deleteMany();
  await prisma.workoutExercise.deleteMany();
  await prisma.workoutSession.deleteMany();
  await prisma.nutritionEntry.deleteMany();
  await prisma.recoveryLog.deleteMany();
  await prisma.bodyMeasurement.deleteMany();
  await prisma.supplementLog.deleteMany();
  await prisma.settings.deleteMany();

  // ── Settings ──
  await prisma.settings.create({
    data: {
      id: '00000000-0000-0000-0000-000000000001',
      height_cm: 175,
      target_weight_kg: 80,
      daily_calories: 3200,
      daily_protein_g: 180,
      daily_carbs_g: 400,
      daily_fat_g: 90,
      daily_fiber_g: 35,
      daily_water_ml: 3500,
      current_split: 'push_pull_legs',
      workout_days_per_week: 5,
    },
  });
  console.log('✅ Settings');

  // ── Nutrition ── 6 meals/day, 7 days
  const foodDiary: Array<{
    name: string; cal: number; p: number; c: number; f: number; fib: number; meal: string;
  }> = [
    // Day 1 — Monday July 1
    { name: 'Oatmeal Banana + Whey Protein', cal: 480, p: 38, c: 62, f: 10, fib: 7, meal: 'breakfast' },
    { name: 'Telur Rebus 3 butir + Roti Gandum', cal: 340, p: 24, c: 30, f: 14, fib: 4, meal: 'snack' },
    { name: 'Nasi + Ayam Goreng + Tempe + Sayur', cal: 820, p: 48, c: 90, f: 24, fib: 5, meal: 'lunch' },
    { name: 'Greek Yogurt + Granola + Madu', cal: 350, p: 20, c: 42, f: 12, fib: 3, meal: 'snack' },
    { name: 'Nasi + Ikan Salmon Panggang + Brokoli', cal: 720, p: 44, c: 68, f: 24, fib: 6, meal: 'dinner' },
    { name: 'Casein Shake + Almond + Pisang', cal: 380, p: 32, c: 30, f: 16, fib: 4, meal: 'snack' },
    // Day 2 — Tuesday July 2
    { name: 'Telur Orak-Arik 4 + Roti + Alpukat', cal: 460, p: 30, c: 32, f: 22, fib: 6, meal: 'breakfast' },
    { name: 'Protein Bar + Susu UHT', cal: 320, p: 26, c: 30, f: 10, fib: 3, meal: 'snack' },
    { name: 'Nasi + Daging Sapi Lada Hitam + Kentang', cal: 880, p: 52, c: 85, f: 28, fib: 4, meal: 'lunch' },
    { name: 'Roti Lapis Selai Kacang + Pisang', cal: 380, p: 14, c: 48, f: 18, fib: 5, meal: 'snack' },
    { name: 'Nasi Goreng Seafood + Telur Ceplok', cal: 750, p: 38, c: 78, f: 22, fib: 3, meal: 'dinner' },
    { name: 'Whey Protein + Oat + Susu', cal: 420, p: 36, c: 42, f: 10, fib: 4, meal: 'snack' },
    // Day 3 — Wednesday July 3
    { name: 'Pancake Protein + Madu + Berry', cal: 540, p: 34, c: 68, f: 14, fib: 5, meal: 'breakfast' },
    { name: 'Trail Mix + Greek Yogurt', cal: 290, p: 16, c: 26, f: 16, fib: 3, meal: 'snack' },
    { name: 'Nasi + Ikan Tongkol Sambal + Tempe', cal: 780, p: 50, c: 82, f: 22, fib: 6, meal: 'lunch' },
    { name: 'Smoothie Mangga + Whey', cal: 310, p: 26, c: 38, f: 4, fib: 3, meal: 'snack' },
    { name: 'Spaghetti Bolognese + Keju Parmesan', cal: 820, p: 40, c: 92, f: 28, fib: 5, meal: 'dinner' },
    { name: 'Susu Hangat + Madu + Casein', cal: 280, p: 28, c: 24, f: 6, fib: 0, meal: 'snack' },
    // Day 4 — Thursday July 4
    { name: 'Overnight Oats + Whey + Chia Seeds', cal: 450, p: 34, c: 55, f: 12, fib: 8, meal: 'breakfast' },
    { name: 'Roti Bakar + Telur + Keju', cal: 360, p: 22, c: 28, f: 18, fib: 2, meal: 'snack' },
    { name: 'Nasi Padang + Rendang Sapi + Daun Singkong', cal: 920, p: 46, c: 88, f: 36, fib: 5, meal: 'lunch' },
    { name: 'Dates + Almond + Greek Yogurt', cal: 310, p: 14, c: 38, f: 14, fib: 5, meal: 'snack' },
    { name: 'Nasi + Ayam Bakar Kecap + Cah Kangkung', cal: 680, p: 42, c: 70, f: 16, fib: 5, meal: 'dinner' },
    { name: 'Whey Shake + Susu Full Cream', cal: 340, p: 34, c: 28, f: 10, fib: 1, meal: 'snack' },
    // Day 5 — Friday July 5
    { name: 'Smoothie Bowl + Granola + Whey', cal: 470, p: 32, c: 58, f: 10, fib: 6, meal: 'breakfast' },
    { name: 'Hardboiled Eggs 3 + Crackers', cal: 300, p: 22, c: 20, f: 16, fib: 1, meal: 'snack' },
    { name: 'Nasi + Ayam Rica-Rica + Tahu Goreng', cal: 840, p: 54, c: 86, f: 24, fib: 4, meal: 'lunch' },
    { name: 'Protein Bar + Banana', cal: 320, p: 22, c: 36, f: 10, fib: 4, meal: 'snack' },
    { name: 'Nasi + Steak Sirloin + Mashed Potato', cal: 880, p: 56, c: 72, f: 30, fib: 4, meal: 'dinner' },
    { name: 'Casein + Almond Milk + Honey', cal: 260, p: 26, c: 20, f: 8, fib: 2, meal: 'snack' },
    // Day 6 — Saturday July 6
    { name: 'French Toast + Maple Syrup + Whey', cal: 560, p: 34, c: 68, f: 16, fib: 3, meal: 'breakfast' },
    { name: 'Edamame + Greek Yogurt', cal: 250, p: 20, c: 18, f: 12, fib: 5, meal: 'snack' },
    { name: 'Nasi + Gulai Ikan + Sayur Asem', cal: 760, p: 44, c: 84, f: 20, fib: 6, meal: 'lunch' },
    { name: 'Peanut Butter Sandwich + Milk', cal: 420, p: 18, c: 42, f: 22, fib: 4, meal: 'snack' },
    { name: 'Nasi + Bebek Goreng + Lalapan', cal: 860, p: 48, c: 76, f: 34, fib: 4, meal: 'dinner' },
    { name: 'Whey + Oats + Banana Shake', cal: 360, p: 32, c: 40, f: 8, fib: 3, meal: 'snack' },
    // Day 7 — Sunday July 7
    { name: 'Scrambled Eggs + Avocado Toast', cal: 480, p: 28, c: 34, f: 24, fib: 7, meal: 'breakfast' },
    { name: 'Trail Mix + Dried Fruits', cal: 280, p: 10, c: 34, f: 16, fib: 4, meal: 'snack' },
    { name: 'Nasi + Sop Buntut + Emping', cal: 790, p: 42, c: 80, f: 26, fib: 3, meal: 'lunch' },
    { name: 'Chocolate Milk + Protein Bar', cal: 340, p: 22, c: 38, f: 12, fib: 2, meal: 'snack' },
    { name: 'Nasi + Udang Saus Padang + Tumis Kangkung', cal: 700, p: 46, c: 70, f: 18, fib: 5, meal: 'dinner' },
    { name: 'Casein Shake + Almond', cal: 300, p: 28, c: 14, f: 16, fib: 3, meal: 'snack' },
  ];

  const sources = ['hermes', 'hermes', 'manual'];
  let idx = 0;
  for (let day = 1; day <= 7; day++) {
    const date = `2026-07-0${day}`;
    for (let m = 0; m < 6; m++) {
      const f = foodDiary[idx++]!;
      await prisma.nutritionEntry.create({
        data: {
          food_name: f.name,
          quantity: 1,
          calories: f.cal,
          protein_g: f.p,
          carbs_g: f.c,
          fat_g: f.f,
          fiber_g: f.fib,
          meal_time: f.meal,
          entry_date: new Date(date + 'T00:00:00.000Z'),
          source: sources[day % 3]!,
        },
      });
    }
  }
  console.log('✅ Nutrition: 42 meals across 7 days');

  // ── Workouts ── 5 sessions
  const workouts = [
    {
      date: '2026-07-01',
      split: 'push',
      duration_minutes: 65,
      notes: 'Bench press strength progressing. Nambah 2.5kg minggu ini.',
      exercises: [
        { name: 'Barbell Bench Press', weight_kg: 80, reps: 8, sets: 4 },
        { name: 'Incline Dumbbell Press', weight_kg: 28, reps: 10, sets: 3 },
        { name: 'Overhead Shoulder Press', weight_kg: 45, reps: 10, sets: 3 },
        { name: 'Lateral Raises', weight_kg: 12, reps: 15, sets: 4 },
        { name: 'Tricep Pushdowns (Cable)', weight_kg: 32, reps: 12, sets: 3 },
        { name: 'Dips (Bodyweight)', weight_kg: 0, reps: 12, sets: 3 },
      ],
    },
    {
      date: '2026-07-02',
      split: 'pull',
      duration_minutes: 55,
      notes: 'Deadlift form solid. Lat pulldown increase weight.',
      exercises: [
        { name: 'Deadlift', weight_kg: 120, reps: 6, sets: 4 },
        { name: 'Barbell Rows', weight_kg: 72, reps: 10, sets: 3 },
        { name: 'Lat Pulldowns', weight_kg: 68, reps: 12, sets: 3 },
        { name: 'Seated Cable Rows', weight_kg: 55, reps: 12, sets: 3 },
        { name: 'Face Pulls', weight_kg: 25, reps: 15, sets: 3 },
        { name: 'Barbell Curls', weight_kg: 30, reps: 12, sets: 3 },
        { name: 'Hammer Curls', weight_kg: 14, reps: 12, sets: 3 },
      ],
    },
    {
      date: '2026-07-03',
      split: 'legs',
      duration_minutes: 70,
      notes: 'Squat PR today. Leg press volume up. Hamstring tight.',
      exercises: [
        { name: 'Barbell Squat', weight_kg: 100, reps: 8, sets: 4 },
        { name: 'Romanian Deadlift', weight_kg: 90, reps: 10, sets: 3 },
        { name: 'Leg Press', weight_kg: 180, reps: 12, sets: 4 },
        { name: 'Leg Extensions', weight_kg: 68, reps: 15, sets: 3 },
        { name: 'Leg Curls', weight_kg: 45, reps: 12, sets: 3 },
        { name: 'Standing Calf Raises', weight_kg: 85, reps: 20, sets: 4 },
      ],
    },
    {
      date: '2026-07-05',
      split: 'push',
      duration_minutes: 60,
      notes: 'Shoulder press increase. Good pump.',
      exercises: [
        { name: 'Barbell Bench Press', weight_kg: 82.5, reps: 8, sets: 4 },
        { name: 'Incline Dumbbell Press', weight_kg: 30, reps: 10, sets: 3 },
        { name: 'Overhead Shoulder Press', weight_kg: 47.5, reps: 10, sets: 3 },
        { name: 'Lateral Raises', weight_kg: 12, reps: 15, sets: 4 },
        { name: 'Cable Flyes', weight_kg: 18, reps: 15, sets: 3 },
        { name: 'Skull Crushers', weight_kg: 30, reps: 12, sets: 3 },
        { name: 'Tricep Rope Pushdowns', weight_kg: 20, reps: 15, sets: 3 },
      ],
    },
    {
      date: '2026-07-07',
      split: 'pull',
      duration_minutes: 55,
      notes: 'Barbell row naik ke 75kg. Pull-up added.',
      exercises: [
        { name: 'Deadlift', weight_kg: 125, reps: 5, sets: 4 },
        { name: 'Barbell Rows', weight_kg: 75, reps: 10, sets: 3 },
        { name: 'Weighted Pull-Ups', weight_kg: 10, reps: 8, sets: 3 },
        { name: 'Lat Pulldowns', weight_kg: 70, reps: 12, sets: 3 },
        { name: 'Face Pulls', weight_kg: 27, reps: 15, sets: 3 },
        { name: 'EZ Bar Curls', weight_kg: 32, reps: 12, sets: 3 },
        { name: 'Preacher Curls', weight_kg: 25, reps: 12, sets: 3 },
      ],
    },
  ];

  for (const w of workouts) {
    await prisma.workoutSession.create({
      data: {
        date: new Date(w.date + 'T00:00:00.000Z'),
        split: w.split,
        duration_minutes: w.duration_minutes,
        notes: w.notes,
        source: w.date === '2026-07-03' || w.date === '2026-07-07' ? 'hermes' : 'manual',
        exercises: {
          create: w.exercises.map((e, i) => ({ ...e, order: i })),
        },
      },
    });
  }
  console.log('✅ Workouts: 5 sessions (35 exercises)');

  // ── Body Measurements ──
  const weights = [74.8, 74.5, 74.3, 74.9, 75.2, 74.7, 75.4];
  for (let i = 1; i <= 7; i++) {
    await prisma.bodyMeasurement.create({
      data: {
        date: new Date(`2026-07-0${i}T00:00:00.000Z`),
        morning_weight_kg: weights[i - 1]!,
        waist_cm: i < 3 ? 80.5 : i < 6 ? 80.2 : 80.0,
        source: 'hermes',
      },
    });
  }
  console.log('✅ Body: 7 days (74.3 → 75.4 kg)');

  // ── Recovery ──
  const recoveries = [
    { d: '2026-07-01', s: 7, e: 8, m: 'mild', n: 'Good sleep before push day' },
    { d: '2026-07-02', s: 6.5, e: 6, m: 'moderate', n: 'Kurang tidur, badan agak capek setelah pull day' },
    { d: '2026-07-03', s: 8, e: 9, m: 'none', n: 'Tidur nyenyak, siap leg day' },
    { d: '2026-07-04', s: 7, e: 7, m: 'severe', n: 'DOMS parah dari leg day, rest day total' },
    { d: '2026-07-05', s: 7.5, e: 8, m: 'mild', n: 'DOMS berkurang, push day lancar' },
    { d: '2026-07-06', s: 6, e: 6, m: 'moderate', n: 'Tidur larut, bangun capek. Rest day' },
    { d: '2026-07-07', s: 8, e: 9, m: 'none', n: 'Excellent recovery. Ready for heavy pull day' },
  ];

  for (const r of recoveries) {
    await prisma.recoveryLog.create({
      data: {
        date: new Date(r.d + 'T00:00:00.000Z'),
        sleep_hours: r.s,
        energy_level: r.e,
        muscle_soreness: r.m,
        notes: r.n,
        source: 'hermes',
      },
    });
  }
  console.log('✅ Recovery: 7 days');

  // ── Supplements ──
  for (let i = 1; i <= 7; i++) {
    await prisma.supplementLog.create({
      data: {
        date: new Date(`2026-07-0${i}T00:00:00.000Z`),
        creatine: true,
        whey_protein: true,
        fish_oil: i !== 2 && i !== 6,
        vitamin_d: i !== 3,
        extra: { zinc: i <= 5, magnesium: true, citrulline_malate: i % 2 === 1 },
        source: 'hermes',
      },
    });
  }
  console.log('✅ Supplements: 7 days');

  // ── AI Reports ──
  const dailyReports = [
    {
      d: '2026-07-01',
      nutrition_score: 92, workout_score: 90, recovery_score: 85, bulking_score: 82,
      content: `## Daily Report — July 1 (Monday)\n\n### Nutrition: 92/100\n✅ Calories: 3,090 / 3,200 — near target\n✅ Protein: 196g / 180g — exceeded\n⚠️ Fiber: 29g / 35g — slightly low, add more vegetables\n\n### Workout: 90/100\nPush day volume: 14,680 kg. Bench press progressing.\n\n### Recovery: 85/100\nSleep 7h. Energy 8/10. Mild soreness.\n\n### Bulking Score: 82/100\nWeight 74.8 kg. Stable start. Keep the momentum.`,
    },
    {
      d: '2026-07-03',
      nutrition_score: 88, workout_score: 95, recovery_score: 92, bulking_score: 78,
      content: `## Daily Report — July 3 (Wednesday)\n\n### Nutrition: 88/100\n✅ Calories: 3,020 / 3,200\n⚠️ Protein: 194g — good but watch intake spread\n\n### Workout: 95/100\nLeg day crushed. Squat 100kg progress. Volume personal best.\n\n### Recovery: 92/100\nSleep 8h. Energy 9/10. Excellent rest.\n\n### Bulking Score: 78/100\nWeight 74.3 kg. Slight dip. Possibly water weight fluctuation. Watch intake tomorrow.`,
    },
    {
      d: '2026-07-05',
      nutrition_score: 94, workout_score: 92, recovery_score: 88, bulking_score: 85,
      content: `## Daily Report — July 5 (Friday)\n\n### Nutrition: 94/100\n✅ Calories: 3,070 / 3,200 — consistent\n✅ Protein: 212g / 180g — excellent!\n\n### Workout: 92/100\nPush day volume up. Bench press 82.5kg. Shoulder press improving.\n\n### Recovery: 88/100\nSleep 7.5h. Energy 8/10. DOMS from legs subsiding.\n\n### Bulking Score: 85/100\nWeight 75.2 kg. Trending upward. Good progress this week.`,
    },
    {
      d: '2026-07-07',
      nutrition_score: 91, workout_score: 93, recovery_score: 90, bulking_score: 88,
      content: `## Weekly Summary — July 1-7\n\n### Nutrition Average: 91/100\nDaily avg: 3,010 kcal. Protein avg: 194g. Carb avg: 344g.\n\n### Workout: 5 sessions\nVolume increased across all lifts. Squat +5kg, bench +2.5kg, deadlift +5kg.\n\n### Recovery: Good pattern\nSleep avg: 7.1h. Two nights below 7h — improve consistency.\n\n### Weight Trend\n74.8 → 75.4 kg (+0.6kg in 7 days). Target pace on track.\n\n### Next Week Focus\n- Hit calorie target every day (missed 2 days)\n- Sleep 7h+ every night\n- Add 2.5kg to overhead press`,
    },
  ];

  for (const r of dailyReports) {
    await prisma.dailyReport.create({
      data: {
        date: new Date(r.d + 'T00:00:00.000Z'),
        content_md: r.content,
        nutrition_score: r.nutrition_score,
        workout_score: r.workout_score,
        recovery_score: r.recovery_score,
        bulking_score: r.bulking_score,
      },
    });
  }
  console.log('✅ Reports: 4 AI-generated reports');

  // ── Summary ──
  const counts = {
    nutrition: await prisma.nutritionEntry.count(),
    workouts: await prisma.workoutSession.count(),
    exercises: await prisma.workoutExercise.count(),
    body: await prisma.bodyMeasurement.count(),
    recovery: await prisma.recoveryLog.count(),
    supplements: await prisma.supplementLog.count(),
    reports: await prisma.dailyReport.count(),
  };

  console.log('\n📊 Seed Summary:');
  console.log(`   Nutrition Entries:  ${counts.nutrition}`);
  console.log(`   Workout Sessions:   ${counts.workouts}`);
  console.log(`   Workout Exercises:  ${counts.exercises}`);
  console.log(`   Body Measurements:  ${counts.body}`);
  console.log(`   Recovery Logs:      ${counts.recovery}`);
  console.log(`   Supplement Logs:    ${counts.supplements}`);
  console.log(`   Daily Reports:      ${counts.reports}`);

  const totalCal = await prisma.nutritionEntry.aggregate({ _sum: { calories: true } });
  console.log(`\n🔥 Total calories across 7 days: ${totalCal._sum.calories?.toLocaleString() ?? 0} kcal`);
  console.log('✅ Seeding complete!\n');
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
