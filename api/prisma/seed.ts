import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * TEST PERSONAS
 * =============
 * alice@test.ge  — admin (Alice Admin)
 *   • Has 1 active listing + 1 pending_moderation listing (for admin test panel)
 *   • OTP: 000000
 *
 * bob@test.ge    — regular user (Bob Seller)
 *   • Has 8 active + 2 sold + 1 expired + 1 pending_moderation + 1 draft + 1 rejected = 14 listings
 *   • Has promotions on his active listings
 *   • Has payments (completed + pending)
 *   • Has received a review from Carol on a sold listing
 *   • OTP: 000000
 *
 * carol@test.ge  — regular user (Carol Buyer)
 *   • Has 3 active + 1 pending_moderation + 1 removed = 5 listings
 *   • Wrote a review on bob's sold PS5 listing
 *   • Has notifications (new_message, price_drop, moderation_update)
 *   • OTP: 000000
 *
 * THREADS
 * =======
 * Thread 1: Carol ↔ Bob — about "iPhone 14 Pro 256GB" (listing thread)
 * Thread 2: Bob ↔ Carol — about "Dyson V11 vacuum cleaner" (listing thread)
 * Thread 3: Carol ↔ Bob — SOLD listing "PlayStation 5" (thread for review flow)
 * Thread 4: Carol ↔ Bob — DIRECT DM (no listing, UC-20)
 *
 * PAYMENTS & PROMOTIONS (UC-08/UC-29)
 * ====================================
 * Payment 1: Bob, top_7d on iPhone listing — completed
 * Payment 2: Bob, highlight on MacBook listing — pending
 * Payment 3: Carol, top_3d on Dyson listing — completed
 *
 * REVIEWS (UC-15)
 * ===============
 * Carol reviews Bob for sold "PlayStation 5" listing — rating 5
 *
 * NOTIFICATIONS (UC-17)
 * =====================
 * Carol: new_message, price_drop, moderation_update
 */

const cities = [
  { id: 'tbilisi', name: 'Tbilisi', nameRu: 'Тбилиси', nameEn: 'Tbilisi', nameKa: 'თბილისი', lat: 41.6938, lng: 44.8015 },
  { id: 'batumi', name: 'Batumi', nameRu: 'Батуми', nameEn: 'Batumi', nameKa: 'ბათუმი', lat: 41.6417, lng: 41.6333 },
  { id: 'kutaisi', name: 'Kutaisi', nameRu: 'Кутаиси', nameEn: 'Kutaisi', nameKa: 'ქუთაისი', lat: 42.2679, lng: 42.7181 },
  { id: 'rustavi', name: 'Rustavi', nameRu: 'Рустави', nameEn: 'Rustavi', nameKa: 'რუსთავი', lat: 41.5494, lng: 45.0144 },
  { id: 'zugdidi', name: 'Zugdidi', nameRu: 'Зугдиди', nameEn: 'Zugdidi', nameKa: 'ზუგდიდი', lat: 42.5088, lng: 41.8708 },
  { id: 'gori', name: 'Gori', nameRu: 'Гори', nameEn: 'Gori', nameKa: 'გორი', lat: 41.9858, lng: 44.1119 },
  { id: 'poti', name: 'Poti', nameRu: 'Поти', nameEn: 'Poti', nameKa: 'ფოთი', lat: 42.1500, lng: 41.6667 },
  { id: 'kobuleti', name: 'Kobuleti', nameRu: 'Кобулети', nameEn: 'Kobuleti', nameKa: 'ქობულეთი', lat: 41.8200, lng: 41.7800 },
  { id: 'telavi', name: 'Telavi', nameRu: 'Телави', nameEn: 'Telavi', nameKa: 'თელავი', lat: 41.9169, lng: 45.4736 },
  { id: 'akhaltsikhe', name: 'Akhaltsikhe', nameRu: 'Ахалцихе', nameEn: 'Akhaltsikhe', nameKa: 'ახალციხე', lat: 41.6394, lng: 42.9839 },
  { id: 'mtskheta', name: 'Mtskheta', nameRu: 'Мцхета', nameEn: 'Mtskheta', nameKa: 'მცხეთა', lat: 41.8452, lng: 44.7200 },
];

const tbilisiDistricts = [
  'Vake', 'Saburtalo', 'Didube', 'Nadzaladevi',
  'Gldani', 'Isani', 'Samgori', 'Chughureti',
  'Mtatsminda', 'Krtsanisi',
];

const batumiDistricts = [
  'Old Batumi', 'New Boulevard', 'Goneli', 'Bagrationi', 'Makhinjauri',
];

const categories = [
  { slug: 'real-estate', name: 'Real Estate',       nameEn: 'Real Estate',       nameRu: 'Недвижимость',    nameKa: 'უძრავი ქონება' },
  { slug: 'transport',   name: 'Transport',          nameEn: 'Transport',          nameRu: 'Транспорт',       nameKa: 'ტრანსპორტი' },
  { slug: 'jobs',        name: 'Jobs',               nameEn: 'Jobs',               nameRu: 'Работа',          nameKa: 'სამუშაო' },
  { slug: 'electronics', name: 'Electronics',        nameEn: 'Electronics',        nameRu: 'Электроника',     nameKa: 'ელექტრონიკა' },
  { slug: 'fashion',     name: 'Fashion & Clothing', nameEn: 'Fashion & Clothing', nameRu: 'Одежда и мода',   nameKa: 'ტანსაცმელი და მოდა' },
  { slug: 'home-garden', name: 'Home & Garden',      nameEn: 'Home & Garden',      nameRu: 'Для дома и сада', nameKa: 'სახლი და ბაღი' },
  { slug: 'pets',        name: 'Pets',               nameEn: 'Pets',               nameRu: 'Животные',        nameKa: 'შინაური ცხოველები' },
  { slug: 'services',    name: 'Services',           nameEn: 'Services',           nameRu: 'Услуги',          nameKa: 'მომსახურება' },
  { slug: 'hobbies',     name: 'Hobbies & Leisure',  nameEn: 'Hobbies & Leisure',  nameRu: 'Хобби и отдых',   nameKa: 'ჰობი და დასვენება' },
  { slug: 'kids',        name: 'Kids & Baby',        nameEn: 'Kids & Baby',        nameRu: 'Детские товары',  nameKa: 'საბავშვო საქონელი' },
];

async function upsertListing(data: {
  title: string;
  userId: string;
  categoryId: string;
  cityId: string;
  description?: string;
  price?: number;
  currency?: string;
  status: 'draft' | 'pending_moderation' | 'active' | 'sold' | 'removed' | 'rejected' | 'expired';
  activatedAt?: Date;
  expiresAt?: Date;
  rejectionReason?: string;
}) {
  const existing = await prisma.listing.findFirst({
    where: { title: data.title, userId: data.userId },
  });
  if (existing) return existing;
  return prisma.listing.create({ data });
}

async function main() {
  console.log('Seeding cities...');
  for (const city of cities) {
    await prisma.city.upsert({
      where: { id: city.id },
      update: {},
      create: city,
    });
  }

  console.log('Seeding Tbilisi districts...');
  for (const districtName of tbilisiDistricts) {
    const existing = await prisma.district.findFirst({
      where: { name: districtName, cityId: 'tbilisi' },
    });
    if (!existing) {
      await prisma.district.create({ data: { name: districtName, cityId: 'tbilisi' } });
    }
  }

  console.log('Seeding Batumi districts...');
  for (const districtName of batumiDistricts) {
    const existing = await prisma.district.findFirst({
      where: { name: districtName, cityId: 'batumi' },
    });
    if (!existing) {
      await prisma.district.create({ data: { name: districtName, cityId: 'batumi' } });
    }
  }

  console.log('Seeding categories...');
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, nameEn: cat.nameEn, nameRu: cat.nameRu, nameKa: cat.nameKa },
      create: cat,
    });
  }

  // --- Look up category IDs ---
  const catElectronics = await prisma.category.findUnique({ where: { slug: 'electronics' } });
  const catTransport   = await prisma.category.findUnique({ where: { slug: 'transport' } });
  const catRealEstate  = await prisma.category.findUnique({ where: { slug: 'real-estate' } });
  const catFashion     = await prisma.category.findUnique({ where: { slug: 'fashion' } });
  const catHomeGarden  = await prisma.category.findUnique({ where: { slug: 'home-garden' } });

  if (!catElectronics || !catTransport || !catRealEstate || !catFashion || !catHomeGarden) {
    throw new Error('Required categories not found after seeding');
  }

  // --- Seed personas ---
  console.log('Seeding personas...');

  const now = new Date();
  const oneYearFromNow = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const alice = await prisma.user.upsert({
    where: { email: 'alice@test.ge' },
    update: {},
    create: {
      email: 'alice@test.ge',
      name: 'Alice Admin',
      role: 'admin',
      city: 'Tbilisi',
      isOnboarded: true,
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: 'bob@test.ge' },
    update: {},
    create: {
      email: 'bob@test.ge',
      name: 'Bob Seller',
      role: 'user',
      city: 'Batumi',
      isOnboarded: true,
    },
  });

  const carol = await prisma.user.upsert({
    where: { email: 'carol@test.ge' },
    update: {},
    create: {
      email: 'carol@test.ge',
      name: 'Carol Buyer',
      role: 'user',
      city: 'Tbilisi',
      isOnboarded: true,
    },
  });

  // --- Seed OTP codes (000000 dev code for each user) ---
  console.log('Seeding OTP codes...');

  for (const { email, userId } of [
    { email: alice.email, userId: alice.id },
    { email: bob.email,   userId: bob.id },
    { email: carol.email, userId: carol.id },
  ]) {
    const existingOtp = await prisma.otpCode.findFirst({
      where: { email, code: '000000', used: false },
    });
    if (!existingOtp) {
      await prisma.otpCode.create({
        data: {
          email,
          code: '000000',
          expiresAt: oneYearFromNow,
          used: false,
          userId,
        },
      });
    }
  }

  // --- Seed Bob's listings (14 total) ---
  console.log('Seeding Bob listings...');

  const bobActive1 = await upsertListing({
    title: 'iPhone 14 Pro 256GB',
    description: 'Excellent condition, no scratches, comes with original box and charger.',
    price: 2500,
    currency: 'GEL',
    status: 'active',
    userId: bob.id,
    categoryId: catElectronics.id,
    cityId: 'batumi',
    activatedAt: now,
    expiresAt: thirtyDaysFromNow,
  });

  const bobActive2 = await upsertListing({
    title: 'Samsung Galaxy S23 Ultra',
    description: 'Used for 6 months, perfect working condition. Includes case and screen protector.',
    price: 3200,
    currency: 'GEL',
    status: 'active',
    userId: bob.id,
    categoryId: catElectronics.id,
    cityId: 'batumi',
    activatedAt: now,
    expiresAt: thirtyDaysFromNow,
  });

  const bobActive3 = await upsertListing({
    title: 'Toyota Camry 2019',
    description: 'Low mileage, well maintained, full service history available.',
    price: 45000,
    currency: 'GEL',
    status: 'active',
    userId: bob.id,
    categoryId: catTransport.id,
    cityId: 'batumi',
    activatedAt: now,
    expiresAt: thirtyDaysFromNow,
  });

  const bobActive4 = await upsertListing({
    title: '2-bedroom apartment in Batumi center',
    description: 'Renovated apartment, 65 sqm, 5th floor, sea view. All utilities included.',
    price: 120000,
    currency: 'GEL',
    status: 'active',
    userId: bob.id,
    categoryId: catRealEstate.id,
    cityId: 'batumi',
    activatedAt: now,
    expiresAt: thirtyDaysFromNow,
  });

  const bobActive5 = await upsertListing({
    title: 'Leather jacket, size L',
    description: 'Genuine leather, worn twice. Black color, excellent condition.',
    price: 350,
    currency: 'GEL',
    status: 'active',
    userId: bob.id,
    categoryId: catFashion.id,
    cityId: 'batumi',
    activatedAt: now,
    expiresAt: thirtyDaysFromNow,
  });

  const bobActive6 = await upsertListing({
    title: 'Garden furniture set',
    description: 'Outdoor table + 4 chairs, metal frame with cushions, good condition.',
    price: 800,
    currency: 'GEL',
    status: 'active',
    userId: bob.id,
    categoryId: catHomeGarden.id,
    cityId: 'batumi',
    activatedAt: now,
    expiresAt: thirtyDaysFromNow,
  });

  const bobActive7 = await upsertListing({
    title: 'MacBook Pro 14" M2',
    description: 'Space grey, 16GB RAM, 512GB SSD. Apple Care until 2025.',
    price: 4800,
    currency: 'GEL',
    status: 'active',
    userId: bob.id,
    categoryId: catElectronics.id,
    cityId: 'batumi',
    activatedAt: now,
    expiresAt: thirtyDaysFromNow,
  });

  const bobActive8 = await upsertListing({
    title: 'Honda CB500 motorcycle 2021',
    description: 'Low mileage, serviced, comes with helmet and riding gear.',
    price: 18000,
    currency: 'GEL',
    status: 'active',
    userId: bob.id,
    categoryId: catTransport.id,
    cityId: 'batumi',
    activatedAt: now,
    expiresAt: thirtyDaysFromNow,
  });

  // Sold listing used for the review flow (UC-15): Carol bought PS5 from Bob
  const bobSoldPs5 = await upsertListing({
    title: 'PlayStation 5 with controller',
    description: 'Sold. PS5 disc edition, 2 controllers, 5 games included.',
    price: 2200,
    currency: 'GEL',
    status: 'sold',
    userId: bob.id,
    categoryId: catElectronics.id,
    cityId: 'batumi',
    activatedAt: sevenDaysAgo,
    expiresAt: thirtyDaysFromNow,
  });

  await upsertListing({
    title: 'Ford Focus 2016 (sold)',
    description: 'Sold. Manual transmission, well maintained.',
    price: 22000,
    currency: 'GEL',
    status: 'sold',
    userId: bob.id,
    categoryId: catTransport.id,
    cityId: 'batumi',
  });

  await upsertListing({
    title: 'Winter jacket collection (expired)',
    description: 'Various winter jackets, sizes S-XL.',
    price: 150,
    currency: 'GEL',
    status: 'expired',
    userId: bob.id,
    categoryId: catFashion.id,
    cityId: 'batumi',
    activatedAt: new Date(now.getTime() - 37 * 24 * 60 * 60 * 1000),
    expiresAt: sevenDaysAgo,
  });

  await upsertListing({
    title: 'Vintage bicycle for sale',
    description: 'Awaiting review. Classic Soviet-era bicycle, fully restored.',
    price: 500,
    currency: 'GEL',
    status: 'pending_moderation',
    userId: bob.id,
    categoryId: catTransport.id,
    cityId: 'batumi',
  });

  await upsertListing({
    title: 'Office desk and chair (draft)',
    description: 'Draft listing. Will add photos soon.',
    price: 600,
    currency: 'GEL',
    status: 'draft',
    userId: bob.id,
    categoryId: catHomeGarden.id,
    cityId: 'batumi',
  });

  await upsertListing({
    title: 'Counterfeit goods listing (rejected)',
    description: 'This listing was rejected by moderation.',
    price: 50,
    currency: 'GEL',
    status: 'rejected',
    userId: bob.id,
    categoryId: catFashion.id,
    cityId: 'batumi',
    rejectionReason: 'Content violates community guidelines',
  });

  // --- Seed Carol's listings (5 total) ---
  console.log('Seeding Carol listings...');

  const carolActive1 = await upsertListing({
    title: 'Dyson V11 vacuum cleaner',
    description: 'Like new, used 3 times. Comes with all attachments.',
    price: 1200,
    currency: 'GEL',
    status: 'active',
    userId: carol.id,
    categoryId: catHomeGarden.id,
    cityId: 'tbilisi',
    activatedAt: now,
    expiresAt: thirtyDaysFromNow,
  });

  await upsertListing({
    title: 'Women\'s designer handbag',
    description: 'Authentic brand bag, lightly used, dust bag included.',
    price: 950,
    currency: 'GEL',
    status: 'active',
    userId: carol.id,
    categoryId: catFashion.id,
    cityId: 'tbilisi',
    activatedAt: now,
    expiresAt: thirtyDaysFromNow,
  });

  await upsertListing({
    title: 'iPad Air 5th gen 64GB WiFi',
    description: 'Barely used, pristine condition. Smart folio cover included.',
    price: 1800,
    currency: 'GEL',
    status: 'active',
    userId: carol.id,
    categoryId: catElectronics.id,
    cityId: 'tbilisi',
    activatedAt: now,
    expiresAt: thirtyDaysFromNow,
  });

  await upsertListing({
    title: 'Studio apartment for rent Tbilisi',
    description: 'Awaiting review. Short-term rental available from next month.',
    price: 1500,
    currency: 'GEL',
    status: 'pending_moderation',
    userId: carol.id,
    categoryId: catRealEstate.id,
    cityId: 'tbilisi',
  });

  await upsertListing({
    title: 'Old sofa (removed)',
    description: 'This listing was removed by the owner.',
    price: 200,
    currency: 'GEL',
    status: 'removed',
    userId: carol.id,
    categoryId: catHomeGarden.id,
    cityId: 'tbilisi',
  });

  // --- Seed Alice's listings ---
  console.log('Seeding Alice listings...');

  await upsertListing({
    title: 'Admin test listing — do not remove',
    description: 'Internal test listing created by admin account.',
    price: 1,
    currency: 'GEL',
    status: 'active',
    userId: alice.id,
    categoryId: catElectronics.id,
    cityId: 'tbilisi',
    activatedAt: now,
    expiresAt: thirtyDaysFromNow,
  });

  // Admin has a pending_moderation listing so admin panel shows it for self-testing
  await upsertListing({
    title: 'Admin pending moderation test listing',
    description: 'Used by admin to test the moderation panel. Do not approve or reject.',
    price: 99,
    currency: 'GEL',
    status: 'pending_moderation',
    userId: alice.id,
    categoryId: catElectronics.id,
    cityId: 'tbilisi',
  });

  // --- Seed threads and messages ---
  console.log('Seeding threads...');

  // Thread 1: carol asks about bob's first active listing
  let thread1 = await prisma.thread.findFirst({
    where: { listingId: bobActive1.id },
  });
  if (!thread1) {
    thread1 = await prisma.thread.create({
      data: {
        listingId: bobActive1.id,
        participants: {
          create: [
            { userId: carol.id },
            { userId: bob.id },
          ],
        },
      },
    });
    await prisma.message.createMany({
      data: [
        { threadId: thread1.id, senderId: carol.id, text: 'Is this still available?' },
        { threadId: thread1.id, senderId: bob.id,   text: 'Yes, it is!' },
        { threadId: thread1.id, senderId: carol.id, text: 'Great, can we meet tomorrow?' },
      ],
    });
  }

  // Thread 2: bob asks about carol's first active listing
  let thread2 = await prisma.thread.findFirst({
    where: { listingId: carolActive1.id },
  });
  if (!thread2) {
    thread2 = await prisma.thread.create({
      data: {
        listingId: carolActive1.id,
        participants: {
          create: [
            { userId: bob.id },
            { userId: carol.id },
          ],
        },
      },
    });
    await prisma.message.createMany({
      data: [
        { threadId: thread2.id, senderId: bob.id,   text: "What's the condition?" },
        { threadId: thread2.id, senderId: carol.id, text: 'Like new, barely used' },
      ],
    });
  }

  // Thread 3: sold listing thread — carol was a participant in bob's PS5 sale (UC-15: review flow)
  let thread3 = await prisma.thread.findFirst({
    where: { listingId: bobSoldPs5.id },
  });
  if (!thread3) {
    thread3 = await prisma.thread.create({
      data: {
        listingId: bobSoldPs5.id,
        participants: {
          create: [
            { userId: carol.id },
            { userId: bob.id },
          ],
        },
      },
    });
    await prisma.message.createMany({
      data: [
        { threadId: thread3.id, senderId: carol.id, text: 'Hi, is the PS5 still available?' },
        { threadId: thread3.id, senderId: bob.id,   text: 'Yes, come pick it up today.' },
        { threadId: thread3.id, senderId: carol.id, text: 'Deal! I will come at 6pm.' },
        { threadId: thread3.id, senderId: bob.id,   text: 'Great, see you then.' },
      ],
    });
  }

  // Thread 4: direct DM between Carol and Bob without a listing (UC-20)
  // participant1Id/participant2Id sorted alphabetically for uniqueness
  const dmP1 = alice.id < bob.id ? alice.id : bob.id;
  const dmP2 = alice.id < bob.id ? bob.id : alice.id;
  let thread4 = await prisma.thread.findFirst({
    where: { participant1Id: dmP1, participant2Id: dmP2 },
  });
  if (!thread4) {
    thread4 = await prisma.thread.create({
      data: {
        listingId: null,
        participant1Id: dmP1,
        participant2Id: dmP2,
        participants: {
          create: [
            { userId: alice.id },
            { userId: bob.id },
          ],
        },
      },
    });
    await prisma.message.createMany({
      data: [
        { threadId: thread4.id, senderId: alice.id, text: 'Hey Bob, this is Alice from admin. Just checking in.' },
        { threadId: thread4.id, senderId: bob.id,   text: 'Hi Alice! Everything is fine, thanks.' },
      ],
    });
  }

  // --- Seed favorites ---
  console.log('Seeding favorites...');

  // carol favorites bob's first 3 active listings
  for (const listing of [bobActive1, bobActive2, bobActive3]) {
    await prisma.favorite.upsert({
      where: { userId_listingId: { userId: carol.id, listingId: listing.id } },
      update: {},
      create: { userId: carol.id, listingId: listing.id },
    });
  }

  // bob favorites carol's first active listing
  await prisma.favorite.upsert({
    where: { userId_listingId: { userId: bob.id, listingId: carolActive1.id } },
    update: {},
    create: { userId: bob.id, listingId: carolActive1.id },
  });

  // --- Seed Review (UC-15): carol reviews bob for the sold PS5 listing ---
  console.log('Seeding review...');

  const existingReview = await prisma.review.findUnique({
    where: { authorId_listingId: { authorId: carol.id, listingId: bobSoldPs5.id } },
  });
  if (!existingReview) {
    await prisma.review.create({
      data: {
        listingId: bobSoldPs5.id,
        authorId: carol.id,
        sellerId: bob.id,
        rating: 5,
        text: 'Great seller! The PS5 was exactly as described. Fast response, smooth transaction. Highly recommend.',
      },
    });
  }

  // --- Seed Payments (UC-08/UC-29) ---
  console.log('Seeding payments...');

  // Payment 1: Bob paid for top_7d promotion on iPhone 14 Pro — completed
  const existingPayment1 = await prisma.payment.findFirst({
    where: { userId: bob.id, listingId: bobActive1.id, promotionType: 'top_7d' },
  });
  if (!existingPayment1) {
    await prisma.payment.create({
      data: {
        userId: bob.id,
        listingId: bobActive1.id,
        amount: 15.00,
        currency: 'GEL',
        status: 'completed',
        provider: 'stripe',
        externalId: 'pi_test_iphone_top7d_001',
        promotionType: 'top_7d',
      },
    });
  }

  // Payment 2: Bob has a pending payment for highlight on MacBook
  const existingPayment2 = await prisma.payment.findFirst({
    where: { userId: bob.id, listingId: bobActive7.id, promotionType: 'highlight' },
  });
  if (!existingPayment2) {
    await prisma.payment.create({
      data: {
        userId: bob.id,
        listingId: bobActive7.id,
        amount: 8.00,
        currency: 'GEL',
        status: 'pending',
        provider: 'stripe',
        externalId: 'pi_test_macbook_highlight_002',
        promotionType: 'highlight',
      },
    });
  }

  // Payment 3: Carol paid for top_3d promotion on Dyson — completed
  const existingPayment3 = await prisma.payment.findFirst({
    where: { userId: carol.id, listingId: carolActive1.id, promotionType: 'top_3d' },
  });
  if (!existingPayment3) {
    await prisma.payment.create({
      data: {
        userId: carol.id,
        listingId: carolActive1.id,
        amount: 9.00,
        currency: 'GEL',
        status: 'completed',
        provider: 'stripe',
        externalId: 'pi_test_dyson_top3d_003',
        promotionType: 'top_3d',
      },
    });
  }

  // --- Seed Promotions (UC-29) ---
  console.log('Seeding promotions...');

  // Promotion 1: Bob's iPhone 14 Pro has active top_7d promotion
  const existingPromo1 = await prisma.promotion.findFirst({
    where: { userId: bob.id, listingId: bobActive1.id, promotionType: 'top_7d' },
  });
  if (!existingPromo1) {
    await prisma.promotion.create({
      data: {
        userId: bob.id,
        listingId: bobActive1.id,
        promotionType: 'top_7d',
        isActive: true,
        expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      },
    });
  }

  // Promotion 2: Carol's Dyson has active top_3d promotion
  const existingPromo2 = await prisma.promotion.findFirst({
    where: { userId: carol.id, listingId: carolActive1.id, promotionType: 'top_3d' },
  });
  if (!existingPromo2) {
    await prisma.promotion.create({
      data: {
        userId: carol.id,
        listingId: carolActive1.id,
        promotionType: 'top_3d',
        isActive: true,
        expiresAt: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
      },
    });
  }

  // --- Seed Notifications (UC-17) for carol ---
  console.log('Seeding notifications...');

  // Notification 1: new_message — someone replied to carol's listing
  const existingNotif1 = await prisma.notification.findFirst({
    where: { userId: carol.id, type: 'new_message', listingId: carolActive1.id },
  });
  if (!existingNotif1) {
    await prisma.notification.create({
      data: {
        userId: carol.id,
        type: 'new_message',
        listingId: carolActive1.id,
        payload: { threadId: thread2?.id ?? '', senderName: 'Bob Seller', preview: "What's the condition?" },
        read: false,
      },
    });
  }

  // Notification 2: price_drop — bob dropped price on iPhone 14 Pro (carol has it favorited)
  const existingNotif2 = await prisma.notification.findFirst({
    where: { userId: carol.id, type: 'price_drop', listingId: bobActive1.id },
  });
  if (!existingNotif2) {
    await prisma.notification.create({
      data: {
        userId: carol.id,
        type: 'price_drop',
        listingId: bobActive1.id,
        payload: { oldPrice: 2800, newPrice: 2500, currency: 'GEL', title: 'iPhone 14 Pro 256GB' },
        read: false,
      },
    });
  }

  // Notification 3: moderation_update — carol's listing was reviewed by moderation
  const existingNotif3 = await prisma.notification.findFirst({
    where: { userId: carol.id, type: 'moderation_update' },
  });
  if (!existingNotif3) {
    await prisma.notification.create({
      data: {
        userId: carol.id,
        type: 'moderation_update',
        listingId: null,
        payload: { status: 'approved', listingTitle: 'Dyson V11 vacuum cleaner', message: 'Your listing has been approved and is now live.' },
        read: true,
      },
    });
  }

  console.log('');
  console.log('=== Seed complete ===');
  console.log('');
  console.log('PERSONAS:');
  console.log('  alice@test.ge  — admin  (OTP: 000000)');
  console.log('  bob@test.ge    — user   (OTP: 000000) — seller');
  console.log('  carol@test.ge  — user   (OTP: 000000) — buyer');
  console.log('');
  console.log('LISTINGS:');
  console.log('  Bob:   8 active + 2 sold + 1 expired + 1 pending_moderation + 1 draft + 1 rejected = 14');
  console.log('  Carol: 3 active + 1 pending_moderation + 1 removed = 5');
  console.log('  Alice: 1 active + 1 pending_moderation = 2');
  console.log('  Total: 21');
  console.log('');
  console.log('THREADS:');
  console.log('  Thread 1: Carol <-> Bob (iPhone 14 listing)');
  console.log('  Thread 2: Bob <-> Carol (Dyson listing)');
  console.log('  Thread 3: Carol <-> Bob (PS5 SOLD listing — review flow)');
  console.log('  Thread 4: Alice <-> Bob (direct DM, no listing — UC-20)');
  console.log('');
  console.log('EXTRAS:');
  console.log('  Reviews: 1 (Carol -> Bob, PS5, rating 5)');
  console.log('  Payments: 3 (completed, pending, completed)');
  console.log('  Promotions: 2 (top_7d on iPhone, top_3d on Dyson)');
  console.log('  Notifications: 3 for Carol (new_message, price_drop, moderation_update)');
  console.log('  Favorites: 4 (Carol favorites 3 Bob listings, Bob favorites Dyson)');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
