import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
  { slug: 'real-estate', name: 'Недвижимость' },
  { slug: 'transport', name: 'Транспорт' },
  { slug: 'jobs', name: 'Работа' },
  { slug: 'electronics', name: 'Электроника' },
  { slug: 'fashion', name: 'Одежда и мода' },
  { slug: 'home-garden', name: 'Для дома и сада' },
  { slug: 'pets', name: 'Животные' },
  { slug: 'services', name: 'Услуги' },
  { slug: 'hobbies', name: 'Хобби и отдых' },
  { slug: 'kids', name: 'Детские товары' },
];

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
      update: {},
      create: cat,
    });
  }

  console.log('Seed complete.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
