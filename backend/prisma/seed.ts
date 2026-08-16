import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Resetting and Seeding PricePilot Database...');

  // Clean existing data
  await prisma.recentlyViewed.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.review.deleteMany();
  await prisma.priceHistory.deleteMany();
  await prisma.price.deleteMany();
  await prisma.product.deleteMany();
  await prisma.store.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned existing database tables.');

  // 1. Create Users
  const passwordHash = await bcrypt.hash('Admin@123', 10);
  const userPasswordHash = await bcrypt.hash('User@123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'PricePilot Administrator',
      email: 'admin@pricepilot.com',
      passwordHash,
      role: 'ADMIN',
    },
  });

  const demoUser = await prisma.user.create({
    data: {
      name: 'Aarav Sharma',
      email: 'user@pricepilot.com',
      passwordHash: userPasswordHash,
      role: 'USER',
    },
  });

  const reviewer2 = await prisma.user.create({
    data: {
      name: 'Priya Patel',
      email: 'priya@example.com',
      passwordHash: userPasswordHash,
      role: 'USER',
    },
  });

  const reviewer3 = await prisma.user.create({
    data: {
      name: 'Rohan Verma',
      email: 'rohan@example.com',
      passwordHash: userPasswordHash,
      role: 'USER',
    },
  });

  console.log('✅ Created initial Users (Admin & Demo Users)');

  // 2. Create Categories
  const categoriesData = [
    {
      name: 'Smartphones',
      slug: 'smartphones',
      description: 'Latest flagship & budget smartphones with advanced cameras & OLED displays',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Laptops',
      slug: 'laptops',
      description: 'High performance ultrabooks, gaming laptops, and productivity notebooks',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Audio & Headphones',
      slug: 'audio-headphones',
      description: 'Wireless noise-canceling headphones, TWS earbuds, and studio monitors',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Smartwatches',
      slug: 'smartwatches',
      description: 'Fitness trackers, GPS smartwatches, and health monitoring wearables',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Tablets',
      slug: 'tablets',
      description: 'Versatile tablets for digital illustration, reading, and portable entertainment',
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Gaming Consoles',
      slug: 'gaming-consoles',
      description: 'Next-gen gaming consoles, handhelds, and VR gear',
      image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const categoriesMap: Record<string, string> = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat });
    categoriesMap[cat.slug] = created.id;
  }
  console.log(`✅ Created ${categoriesData.length} Categories`);

  // 3. Create Brands
  const brandsData = [
    { name: 'Apple', slug: 'apple', logo: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=200&q=80' },
    { name: 'Samsung', slug: 'samsung', logo: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=200&q=80' },
    { name: 'Sony', slug: 'sony', logo: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=200&q=80' },
    { name: 'Dell', slug: 'dell', logo: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=200&q=80' },
    { name: 'Lenovo', slug: 'lenovo', logo: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=200&q=80' },
    { name: 'OnePlus', slug: 'oneplus', logo: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=200&q=80' },
    { name: 'Asus', slug: 'asus', logo: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=200&q=80' },
    { name: 'Bose', slug: 'bose', logo: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=200&q=80' },
    { name: 'LG', slug: 'lg', logo: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=200&q=80' },
    { name: 'Xiaomi', slug: 'xiaomi', logo: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=200&q=80' },
  ];

  const brandsMap: Record<string, string> = {};
  for (const b of brandsData) {
    const created = await prisma.brand.create({ data: b });
    brandsMap[b.slug] = created.id;
  }
  console.log(`✅ Created ${brandsData.length} Brands`);

  // 4. Create Stores (Nashik Locations)
  const storesData = [
    {
      name: 'TechWorld Hub Nashik',
      website: 'https://techworld.example.com',
      logo: 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?auto=format&fit=crop&w=200&q=80',
      address: 'College Road, Near Archies Gallery',
      city: 'Nashik',
      latitude: 20.0063,
      longitude: 73.7645,
      rating: 4.8,
    },
    {
      name: 'Croma Retail Nashik',
      website: 'https://croma.example.com',
      logo: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=200&q=80',
      address: 'Nashik City Centre Mall, Untwadi',
      city: 'Nashik',
      latitude: 19.9872,
      longitude: 73.7661,
      rating: 4.6,
    },
    {
      name: 'Reliance Digital Nashik',
      website: 'https://reliancedigital.example.com',
      logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=200&q=80',
      address: 'Opposite BYK College, Thatte Nagar',
      city: 'Nashik',
      latitude: 20.0018,
      longitude: 73.7682,
      rating: 4.5,
    },
    {
      name: 'Vijay Sales Nashik',
      website: 'https://vijaysales.example.com',
      logo: 'https://images.unsplash.com/photo-1556742049-0a67d5196924?auto=format&fit=crop&w=200&q=80',
      address: 'Gangapur Road, Near KTHM Circle',
      city: 'Nashik',
      latitude: 20.0125,
      longitude: 73.7719,
      rating: 4.4,
    },
    {
      name: 'Amazon India Express Nashik',
      website: 'https://amazon.in',
      logo: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?auto=format&fit=crop&w=200&q=80',
      address: 'Satpur MIDC Logistics Hub',
      city: 'Nashik',
      latitude: 19.9861,
      longitude: 73.7314,
      rating: 4.9,
    },
  ];

  const createdStores = [];
  for (const st of storesData) {
    const created = await prisma.store.create({ data: st });
    createdStores.push(created);
  }
  console.log(`✅ Created ${createdStores.length} Stores`);

  // 5. Products Data
  const productsData = [
    // SMARTPHONES (1-7)
    {
      name: 'Samsung Galaxy S25 Ultra 5G',
      slug: 'samsung-galaxy-s25-ultra-5g',
      description: 'The ultimate flagship smartphone with Snapdragon 8 Elite, 200MP Quad Camera, Integrated S-Pen, and Dynamic AMOLED 2X display.',
      brandSlug: 'samsung',
      categorySlug: 'smartphones',
      image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
      reviewCount: 42,
      specifications: {
        display: '6.8" Quad HD+ Dynamic AMOLED 2X, 120Hz',
        processor: 'Snapdragon 8 Elite (3nm)',
        ram: '12 GB LPDDR5X',
        storage: '256 GB UFS 4.0',
        battery: '5000 mAh, 45W Fast Charging',
        camera: '200MP Main + 50MP Periscope (5x) + 50MP Ultra-wide + 10MP Telephoto',
        operatingSystem: 'One UI 7.0 (Android 15)',
        '5G': 'Yes',
      },
      basePrice: 129999,
    },
    {
      name: 'Apple iPhone 16 Pro Max',
      slug: 'apple-iphone-16-pro-max',
      description: 'Apple flagship with Grade 5 Titanium chassis, A18 Pro chip, 48MP Fusion camera system, and industry-leading battery life.',
      brandSlug: 'apple',
      categorySlug: 'smartphones',
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
      reviewCount: 58,
      specifications: {
        display: '6.9" Super Retina XDR OLED, ProMotion 120Hz',
        processor: 'Apple A18 Pro (3nm)',
        ram: '8 GB',
        storage: '256 GB NVMe',
        battery: '4685 mAh, MagSafe Wireless Charging',
        camera: '48MP Fusion + 48MP Ultra-wide + 12MP 5x Telephoto',
        operatingSystem: 'iOS 18',
        '5G': 'Yes',
      },
      basePrice: 144900,
    },
    {
      name: 'OnePlus 13 5G',
      slug: 'oneplus-13-5g',
      description: 'Flagship killer performance featuring Snapdragon 8 Elite, Hasselblad 4th Gen camera, 6000mAh Glacier Battery, and 100W SUPERVOOC.',
      brandSlug: 'oneplus',
      categorySlug: 'smartphones',
      image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80',
      rating: 4.6,
      reviewCount: 35,
      specifications: {
        display: '6.82" 2K 120Hz LTPO AMOLED',
        processor: 'Snapdragon 8 Elite',
        ram: '16 GB',
        storage: '512 GB',
        battery: '6000 mAh, 100W Wired + 50W Wireless',
        camera: '50MP Hasselblad Main + 50MP Periscope + 50MP Ultra-wide',
        operatingSystem: 'OxygenOS 15 (Android 15)',
        '5G': 'Yes',
      },
      basePrice: 69999,
    },
    {
      name: 'Xiaomi 14 Ultra',
      slug: 'xiaomi-14-ultra',
      description: 'Leica Quad-camera masterpiece with 1-inch sensor, stepless variable aperture, and WQHD+ 120Hz LTPO AMOLED display.',
      brandSlug: 'xiaomi',
      categorySlug: 'smartphones',
      image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
      rating: 4.7,
      reviewCount: 29,
      specifications: {
        display: '6.73" WQHD+ AMOLED 120Hz',
        processor: 'Snapdragon 8 Gen 3',
        ram: '16 GB',
        storage: '512 GB',
        battery: '5000 mAh, 90W HyperCharge',
        camera: '50MP 1" Leica Main + 50MP Telephoto + 50MP Periscope + 50MP Ultra-wide',
        operatingSystem: 'Xiaomi HyperOS (Android 14)',
        '5G': 'Yes',
      },
      basePrice: 99999,
    },
    {
      name: 'Samsung Galaxy S24 FE 5G',
      slug: 'samsung-galaxy-s24-fe-5g',
      description: 'Fan Edition smartphone bringing premium Galaxy AI, Exynos 2400e processor, and 50MP triple camera system.',
      brandSlug: 'samsung',
      categorySlug: 'smartphones',
      image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80',
      rating: 4.4,
      reviewCount: 19,
      specifications: {
        display: '6.7" Dynamic AMOLED 2X 120Hz',
        processor: 'Exynos 2400e (4nm)',
        ram: '8 GB',
        storage: '128 GB',
        battery: '4700 mAh',
        camera: '50MP Main + 12MP Ultra-wide + 8MP Telephoto',
        operatingSystem: 'One UI 6.1 (Android 14)',
        '5G': 'Yes',
      },
      basePrice: 59999,
    },
    {
      name: 'Apple iPhone 15',
      slug: 'apple-iphone-15',
      description: 'Dynamic Island, 48MP main camera with 2x Telephoto, durable color-infused glass, and USB-C connectivity.',
      brandSlug: 'apple',
      categorySlug: 'smartphones',
      image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80',
      rating: 4.7,
      reviewCount: 64,
      specifications: {
        display: '6.1" Super Retina XDR OLED',
        processor: 'Apple A16 Bionic',
        ram: '6 GB',
        storage: '128 GB',
        battery: '3349 mAh',
        camera: '48MP Main + 12MP Ultra-wide',
        operatingSystem: 'iOS 17',
        '5G': 'Yes',
      },
      basePrice: 65900,
    },
    {
      name: 'OnePlus Nord 4 5G',
      slug: 'oneplus-nord-4-5g',
      description: 'Sleek metal unibody smartphone powered by Snapdragon 7+ Gen 3 and 100W SUPERVOOC fast charging.',
      brandSlug: 'oneplus',
      categorySlug: 'smartphones',
      image: 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?auto=format&fit=crop&w=800&q=80',
      rating: 4.5,
      reviewCount: 22,
      specifications: {
        display: '6.74" 1.5K AMOLED 120Hz',
        processor: 'Snapdragon 7+ Gen 3',
        ram: '8 GB',
        storage: '256 GB',
        battery: '5500 mAh, 100W',
        camera: '50MP Sony LYT-600 + 8MP Ultra-wide',
        operatingSystem: 'OxygenOS 14 (Android 14)',
        '5G': 'Yes',
      },
      basePrice: 32999,
    },

    // LAPTOPS (8-14)
    {
      name: 'Apple MacBook Pro 16" M4 Max',
      slug: 'apple-macbook-pro-16-m4-max',
      description: 'Pro performance machine with M4 Max 16-Core CPU, 40-Core GPU, Liquid Retina XDR display, and 24 hours of battery life.',
      brandSlug: 'apple',
      categorySlug: 'laptops',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
      reviewCount: 31,
      specifications: {
        processor: 'Apple M4 Max (16 CPU / 40 GPU)',
        ram: '36 GB Unified Memory',
        storage: '1 TB SSD',
        display: '16.2" Liquid Retina XDR (3456x2234), 120Hz ProMotion',
        graphics: 'Integrated 40-Core GPU',
        battery: 'Up to 24 Hours, 140W USB-C',
        weight: '2.14 kg',
      },
      basePrice: 349900,
    },
    {
      name: 'Dell XPS 16 Laptop (2024)',
      slug: 'dell-xps-16-laptop-2024',
      description: 'Futuristic aluminum design featuring Intel Core Ultra 9 processor, 4K+ OLED touch screen, and NVIDIA RTX 4070 graphics.',
      brandSlug: 'dell',
      categorySlug: 'laptops',
      image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
      rating: 4.7,
      reviewCount: 18,
      specifications: {
        processor: 'Intel Core Ultra 9 185H',
        ram: '32 GB LPDDR5X',
        storage: '1 TB PCIe Gen4 SSD',
        display: '16.3" 4K+ (3840x2400) OLED Touch 90Hz',
        graphics: 'NVIDIA GeForce RTX 4070 8GB',
        battery: '99.5 Whr',
        weight: '2.13 kg',
      },
      basePrice: 289990,
    },
    {
      name: 'Lenovo Legion Pro 7i Gen 9',
      slug: 'lenovo-legion-pro-7i-gen-9',
      description: 'Uncompromised gaming beast with Intel Core i9-14900HX, RTX 4090 16GB, Coldfront 5.0 cooling, and 240Hz WQXGA display.',
      brandSlug: 'lenovo',
      categorySlug: 'laptops',
      image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
      reviewCount: 26,
      specifications: {
        processor: 'Intel Core i9-14900HX',
        ram: '32 GB DDR5 5600MHz',
        storage: '2 TB NVMe Gen4 SSD',
        display: '16" WQXGA (2560x1600) IPS 240Hz, G-Sync',
        graphics: 'NVIDIA GeForce RTX 4090 16GB GDDR6',
        battery: '99.9 Whr',
        weight: '2.8 kg',
      },
      basePrice: 324990,
    },
    {
      name: 'Asus ROG Zephyrus G16 (2024)',
      slug: 'asus-rog-zephyrus-g16-2024',
      description: 'Ultra-thin CNC aluminum gaming notebook with ROG Nebula OLED 240Hz display and Intel Core Ultra 7 processor.',
      brandSlug: 'asus',
      categorySlug: 'laptops',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
      rating: 4.7,
      reviewCount: 24,
      specifications: {
        processor: 'Intel Core Ultra 7 155H',
        ram: '16 GB LPDDR5X',
        storage: '1 TB SSD',
        display: '16" 2.5K OLED 240Hz 0.2ms',
        graphics: 'NVIDIA GeForce RTX 4060 8GB',
        battery: '90 Whr',
        weight: '1.85 kg',
      },
      basePrice: 189990,
    },
    {
      name: 'Apple MacBook Air 15" M3',
      slug: 'apple-macbook-air-15-m3',
      description: 'Lean, mean M3 machine with 15.3" Liquid Retina display, silent fanless design, and up to 18 hours battery.',
      brandSlug: 'apple',
      categorySlug: 'laptops',
      image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
      reviewCount: 45,
      specifications: {
        processor: 'Apple M3 (8 CPU / 10 GPU)',
        ram: '16 GB Unified Memory',
        storage: '512 GB SSD',
        display: '15.3" Liquid Retina Display (2880x1864)',
        graphics: 'Integrated 10-Core GPU',
        battery: 'Up to 18 Hours',
        weight: '1.51 kg',
      },
      basePrice: 154900,
    },
    {
      name: 'Dell Inspiron 14 Plus (Snapdragon X Plus)',
      slug: 'dell-inspiron-14-plus-snapdragon-x-plus',
      description: 'Next-gen Copilot+ PC featuring Snapdragon X Plus, multi-day battery life, and AI-powered performance.',
      brandSlug: 'dell',
      categorySlug: 'laptops',
      image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=800&q=80',
      rating: 4.3,
      reviewCount: 15,
      specifications: {
        processor: 'Snapdragon X Plus X1P-64-100',
        ram: '16 GB LPDDR5X',
        storage: '512 GB SSD',
        display: '14" QHD+ (2560x1600) IPS 16:10',
        graphics: 'Qualcomm Adreno GPU',
        battery: '54 Whr, 21 hrs battery',
        weight: '1.44 kg',
      },
      basePrice: 94990,
    },
    {
      name: 'Lenovo Yoga Slim 7i Aura Edition',
      slug: 'lenovo-yoga-slim-7i-aura-edition',
      description: 'Co-engineered with Intel, featuring Core Ultra 7 (Series 2), ultra-narrow bezel 2.8K OLED screen, and lightweight chassis.',
      brandSlug: 'lenovo',
      categorySlug: 'laptops',
      image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=80',
      rating: 4.6,
      reviewCount: 14,
      specifications: {
        processor: 'Intel Core Ultra 7 258V',
        ram: '32 GB LPDDR5X',
        storage: '1 TB SSD',
        display: '15.3" 2.8K (2880x1800) OLED 120Hz',
        graphics: 'Intel Arc Graphics 140V',
        battery: '70 Whr',
        weight: '1.53 kg',
      },
      basePrice: 139990,
    },

    // AUDIO & HEADPHONES (15-20)
    {
      name: 'Sony WH-1000XM5 Wireless Headphones',
      slug: 'sony-wh-1000xm5-wireless-headphones',
      description: 'Industry-leading Active Noise Cancellation with 8 microphones, Auto NC Optimizer, and up to 30-hour battery life.',
      brandSlug: 'sony',
      categorySlug: 'audio-headphones',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
      reviewCount: 88,
      specifications: {
        driverSize: '30mm Carbon Fiber Driver',
        batteryLife: '30 Hours with ANC ON',
        noiseCancellation: 'HD Noise Canceling Processor QN1',
        connectivity: 'Bluetooth 5.2, LDAC, AAC, SBC',
        weight: '250 g',
        features: 'Speak-to-Chat, Quick Attention, Multipoint Connection',
      },
      basePrice: 29990,
    },
    {
      name: 'Bose QuietComfort Ultra Headphones',
      slug: 'bose-quietcomfort-ultra-headphones',
      description: 'World-class active noise cancellation paired with Bose Immersive Audio spatial sound positioning.',
      brandSlug: 'bose',
      categorySlug: 'audio-headphones',
      image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
      rating: 4.7,
      reviewCount: 52,
      specifications: {
        driverSize: 'Custom High Performance Driver',
        batteryLife: '24 Hours (18 Hours in Immersive Audio)',
        noiseCancellation: 'Quiet & Aware Modes + CustomTune',
        connectivity: 'Bluetooth 5.3, Snapdragon Sound',
        weight: '252 g',
        features: 'Bose Immersive Spatial Audio, CustomTune Calibration',
      },
      basePrice: 35900,
    },
    {
      name: 'Apple AirPods Max (USB-C)',
      slug: 'apple-airpods-max-usb-c',
      description: 'Over-ear spatial audio bliss with custom acoustic design, Apple H1 chips, and lossless audio support via USB-C.',
      brandSlug: 'apple',
      categorySlug: 'audio-headphones',
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80',
      rating: 4.6,
      reviewCount: 60,
      specifications: {
        driverSize: 'Apple-designed Dynamic Driver',
        batteryLife: '20 Hours with ANC / Spatial Audio',
        noiseCancellation: 'Active Noise Cancellation + Transparency Mode',
        connectivity: 'Bluetooth 5.0, USB-C Audio',
        weight: '384.8 g',
        features: 'Personalized Spatial Audio, Digital Crown Control',
      },
      basePrice: 59900,
    },
    {
      name: 'Sony WF-1000XM5 TWS Earbuds',
      slug: 'sony-wf-1000xm5-tws-earbuds',
      description: 'The best noise canceling earbuds featuring Dynamic Driver X, dual processors, and crystal-clear call performance.',
      brandSlug: 'sony',
      categorySlug: 'audio-headphones',
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
      rating: 4.6,
      reviewCount: 41,
      specifications: {
        driverSize: '8.4mm Dynamic Driver X',
        batteryLife: '8 Hours (24 Hours with Case)',
        noiseCancellation: 'Integrated Processor V2 + QN2e',
        connectivity: 'Bluetooth 5.3, LDAC, Hi-Res Wireless',
        weight: '5.9 g per earbud',
        features: 'Head tracking, IPX4 Water Resistance',
      },
      basePrice: 21990,
    },
    {
      name: 'Bose QuietComfort Earbuds II',
      slug: 'bose-quietcomfort-earbuds-ii',
      description: 'Personalized noise cancellation and sound engineered specifically to match the unique shape of your ear canal.',
      brandSlug: 'bose',
      categorySlug: 'audio-headphones',
      image: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80',
      rating: 4.5,
      reviewCount: 38,
      specifications: {
        driverSize: 'High-excursion Transducer',
        batteryLife: '6 Hours (24 Hours total)',
        noiseCancellation: 'CustomTune Technology ANC',
        connectivity: 'Bluetooth 5.3',
        weight: '6.2 g per earbud',
        features: 'Adjustable EQ, Fit Kit, IPX4 rating',
      },
      basePrice: 19990,
    },
    {
      name: 'OnePlus Buds Pro 3',
      slug: 'oneplus-buds-pro-3',
      description: 'Dual drivers co-created with Dynaudio, 50dB Smart Adaptive Noise Cancellation, and LHDC 5.0 wireless audio.',
      brandSlug: 'oneplus',
      categorySlug: 'audio-headphones',
      image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=800&q=80',
      rating: 4.5,
      reviewCount: 27,
      specifications: {
        driverSize: '11mm Woofer + 6mm Tweeter Dual Drivers',
        batteryLife: 'Up to 43 Hours total with case',
        noiseCancellation: '50dB Real-time Adaptive ANC',
        connectivity: 'Bluetooth 5.4, LHDC 5.0',
        weight: '5.3 g per earbud',
        features: 'Spatial Audio with Head Tracking, Google Fast Pair',
      },
      basePrice: 11999,
    },

    // SMARTWATCHES (21-25)
    {
      name: 'Apple Watch Ultra 2 (GPS + Cellular)',
      slug: 'apple-watch-ultra-2',
      description: 'The ultimate sports and adventure watch with 3000 nits display, S9 SiP, Double Tap gesture, and precision dual-frequency GPS.',
      brandSlug: 'apple',
      categorySlug: 'smartwatches',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
      reviewCount: 39,
      specifications: {
        display: '49mm Titanium Case, Always-On Retina 3000 nits',
        processor: 'Apple S9 SiP',
        batteryLife: '36 Hours (Up to 72 Hours in Low Power Mode)',
        sensors: 'ECG, Blood Oxygen, Depth Gauge, Water Temp, Temperature Sense',
        waterResistance: '100m Water Resistant, EN13319 Dive certified',
        connectivity: 'GPS (L1+L5), LTE Cellular, Bluetooth 5.3',
      },
      basePrice: 89900,
    },
    {
      name: 'Samsung Galaxy Watch 7 Ultra 47mm',
      slug: 'samsung-galaxy-watch-7-ultra',
      description: 'Rugged titanium cushion smartwatch with 3nm BioActive sensor, Energy Score, and Dual-frequency GPS.',
      brandSlug: 'samsung',
      categorySlug: 'smartwatches',
      image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
      rating: 4.7,
      reviewCount: 30,
      specifications: {
        display: '1.5" Super AMOLED 3000 nits Sapphire Crystal',
        processor: 'Exynos W1000 (3nm 5-Core)',
        batteryLife: 'Up to 100 Hours in Power Saving',
        sensors: 'BioActive Sensor (ECG, AGEs index, Heart Rate), BIA Sensor',
        waterResistance: '10 ATM + IP68, MIL-STD-810H',
        connectivity: 'Dual GPS (L1+L5), LTE, Bluetooth 5.3',
      },
      basePrice: 59999,
    },
    {
      name: 'Apple Watch Series 10 46mm',
      slug: 'apple-watch-series-10-46mm',
      description: 'Thinnest Apple Watch ever with largest display, Sleep Apnea notifications, and fast charging to 80% in 30 minutes.',
      brandSlug: 'apple',
      categorySlug: 'smartwatches',
      image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
      reviewCount: 47,
      specifications: {
        display: '46mm Wide-Angle OLED Always-On Retina Display',
        processor: 'Apple S10 SiP',
        batteryLife: '18 Hours Normal Use',
        sensors: 'ECG, Sleep Apnea Detection, Blood Oxygen, Temp Sensing',
        waterResistance: '50m Water Resistant',
        connectivity: 'GPS, Bluetooth 5.3',
      },
      basePrice: 46900,
    },
    {
      name: 'Samsung Galaxy Watch FE',
      slug: 'samsung-galaxy-watch-fe',
      description: 'Essential fitness monitoring with Sapphire Crystal glass, Body Composition Analysis, and Wear OS by Samsung.',
      brandSlug: 'samsung',
      categorySlug: 'smartwatches',
      image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80',
      rating: 4.4,
      reviewCount: 16,
      specifications: {
        display: '1.2" Super AMOLED Sapphire Crystal',
        processor: 'Exynos W920 Dual-Core',
        batteryLife: 'Up to 40 Hours',
        sensors: 'BioActive Sensor (HR, ECG, BIA Body Comp)',
        waterResistance: '5 ATM + IP68',
        connectivity: 'GPS, Bluetooth 5.3',
      },
      basePrice: 19999,
    },
    {
      name: 'OnePlus Watch 2',
      slug: 'oneplus-watch-2',
      description: 'Dual-Engine architecture with Snapdragon W5 + BES2700, running Wear OS 4 with up to 100 hours battery life.',
      brandSlug: 'oneplus',
      categorySlug: 'smartwatches',
      image: 'https://images.unsplash.com/photo-1510017803434-a899398421b3?auto=format&fit=crop&w=800&q=80',
      rating: 4.6,
      reviewCount: 25,
      specifications: {
        display: '1.43" AMOLED 1000 nits Sapphire Crystal',
        processor: 'Snapdragon W5 Gen 1 + MCU BES2700',
        batteryLife: 'Up to 100 Hours (Smart Mode)',
        sensors: 'Heart Rate, SpO2, Sleep Tracking, Dual Frequency GPS',
        waterResistance: '5 ATM + IP68, MIL-STD-810H',
        connectivity: 'Dual Frequency GPS, Bluetooth 5.0',
      },
      basePrice: 24999,
    },

    // TABLETS (26-29)
    {
      name: 'Apple iPad Pro 13" M4 (OLED)',
      slug: 'apple-ipad-pro-13-m4-oled',
      description: 'Impossibly thin tablet with Tandem Ultra Retina XDR OLED screen, M4 chip, and Apple Pencil Pro support.',
      brandSlug: 'apple',
      categorySlug: 'tablets',
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
      reviewCount: 36,
      specifications: {
        display: '13" Tandem Ultra Retina XDR OLED (2752x2064) 120Hz ProMotion',
        processor: 'Apple M4 Chip (9-Core / 10-Core GPU)',
        ram: '8 GB',
        storage: '256 GB',
        battery: '38.99 Whr (Up to 10 hours)',
        camera: '12MP Wide + LiDAR Scanner',
        operatingSystem: 'iPadOS 18',
      },
      basePrice: 129900,
    },
    {
      name: 'Samsung Galaxy Tab S10 Ultra 5G',
      slug: 'samsung-galaxy-tab-s10-ultra-5g',
      description: 'Massive 14.6" Dynamic AMOLED 2X display with anti-reflective coating, MediaTek Dimensity 9300+, and bundled S-Pen.',
      brandSlug: 'samsung',
      categorySlug: 'tablets',
      image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
      reviewCount: 22,
      specifications: {
        display: '14.6" Dynamic AMOLED 2X 120Hz Anti-Reflection',
        processor: 'MediaTek Dimensity 9300+ (4nm)',
        ram: '12 GB',
        storage: '256 GB (Expandable up to 1TB)',
        battery: '11,200 mAh, 45W Fast Charge',
        camera: '13MP + 8MP Ultra-wide Dual Rear',
        operatingSystem: 'One UI 6.1.1 (Android 14)',
      },
      basePrice: 133999,
    },
    {
      name: 'Apple iPad Air 11" M2',
      slug: 'apple-ipad-air-11-m2',
      description: 'Fresh design powered by M2 chip, Liquid Retina display, landscape front camera, and fast Wi-Fi 6E.',
      brandSlug: 'apple',
      categorySlug: 'tablets',
      image: 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?auto=format&fit=crop&w=800&q=80',
      rating: 4.7,
      reviewCount: 40,
      specifications: {
        display: '11" Liquid Retina IPS (2360x1640)',
        processor: 'Apple M2 (8 CPU / 10 GPU)',
        ram: '8 GB',
        storage: '128 GB',
        battery: '28.93 Whr',
        camera: '12MP Wide Rear + 12MP Landscape Ultra-wide Front',
        operatingSystem: 'iPadOS 17',
      },
      basePrice: 59900,
    },
    {
      name: 'Xiaomi Pad 6 Pro',
      slug: 'xiaomi-pad-6-pro',
      description: 'Powerful Android tablet featuring Snapdragon 8+ Gen 1, 144Hz 2.8K display, 67W fast charging, and quad speakers.',
      brandSlug: 'xiaomi',
      categorySlug: 'tablets',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
      rating: 4.6,
      reviewCount: 28,
      specifications: {
        display: '11" 2.8K (2880x1800) IPS 144Hz, Dolby Vision',
        processor: 'Snapdragon 8+ Gen 1',
        ram: '8 GB',
        storage: '256 GB',
        battery: '8600 mAh, 67W HyperCharge',
        camera: '50MP Main + 2MP Depth',
        operatingSystem: 'Xiaomi HyperOS (Android 14)',
      },
      basePrice: 28999,
    },

    // GAMING CONSOLES (30-32)
    {
      name: 'Sony PlayStation 5 Pro (PS5 Pro)',
      slug: 'sony-playstation-5-pro',
      description: 'The ultimate gaming console with upgraded GPU, PlayStation Spectral Super Resolution (PSSR) AI upscaling, and 2TB SSD.',
      brandSlug: 'sony',
      categorySlug: 'gaming-consoles',
      image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
      reviewCount: 33,
      specifications: {
        processor: 'Custom AMD Ryzen Zen 2 8-Core',
        graphics: 'Upgraded RDNA Graphics (16.7 TFLOPS)',
        storage: '2 TB Custom NVMe SSD',
        resolution: '4K 60fps/120fps with Ray Tracing & PSSR AI Upscaling',
        audio: 'Tempest 3D AudioTech',
        controllers: 'DualSense Wireless Controller included',
      },
      basePrice: 69990,
    },
    {
      name: 'Asus ROG Ally X Handheld Console',
      slug: 'asus-rog-ally-x-handheld',
      description: 'Windows gaming handheld with AMD Ryzen Z1 Extreme, 80Whr massive battery, 24GB LPDDR5X RAM, and 120Hz FHD touchscreen.',
      brandSlug: 'asus',
      categorySlug: 'gaming-consoles',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
      rating: 4.7,
      reviewCount: 25,
      specifications: {
        processor: 'AMD Ryzen Z1 Extreme (8C/16T, up to 5.1GHz)',
        graphics: 'AMD RDNA 3 Graphics (12 CUs)',
        ram: '24 GB LPDDR5X-7500',
        storage: '1 TB PCIe 4.0 NVMe SSD',
        display: '7" FHD (1920x1080) 120Hz 500 nits IPS Touchscreen',
        battery: '80 Whr',
        weight: '678 g',
      },
      basePrice: 89990,
    },
    {
      name: 'Sony PlayStation 5 Slim Digital Edition',
      slug: 'sony-playstation-5-slim-digital',
      description: 'Sleek, compact PS5 console with 1TB SSD storage, ray tracing immersion, and ultra-high-speed I/O.',
      brandSlug: 'sony',
      categorySlug: 'gaming-consoles',
      image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
      reviewCount: 65,
      specifications: {
        processor: 'Custom AMD Ryzen Zen 2 8-Core',
        graphics: 'AMD RDNA 2-based graphics engine',
        storage: '1 TB Custom NVMe SSD',
        resolution: 'Up to 4K 120Hz',
        audio: 'Tempest 3D AudioTech',
      },
      basePrice: 44990,
    },
  ];

  const createdProducts = [];
  let priceCount = 0;
  let priceHistoryCount = 0;
  let reviewCountTotal = 0;

  const usersPool = [admin, demoUser, reviewer2, reviewer3];

  for (const prodData of productsData) {
    const { basePrice, brandSlug, categorySlug, specifications, ...rest } = prodData;

    const product = await prisma.product.create({
      data: {
        ...rest,
        specifications: JSON.stringify(specifications),
        brandId: brandsMap[brandSlug],
        categoryId: categoriesMap[categorySlug],
      },
    });
    createdProducts.push(product);

    // Create 3-4 store prices per product to ensure store price comparison feature is rich!
    const storeIndices = [0, 1, 2, 3, 4];
    const selectedStores = storeIndices
      .sort(() => 0.5 - Math.random())
      .slice(0, 3 + (Math.floor(Math.random() * 2)));

    for (let i = 0; i < selectedStores.length; i++) {
      const store = createdStores[selectedStores[i]];
      const priceModifier = (Math.random() * 0.11) - 0.05;
      const actualPrice = Math.round(basePrice * (1 + priceModifier));
      const discountPct = Math.round((Math.random() * 15) + 5);
      const originalPrice = Math.round(actualPrice * (1 + (discountPct / 100)));
      const availabilities = ['In Stock', 'In Stock', 'In Stock', 'Limited Stock', 'Pre-order'];
      const deliveryOptions = [
        'Free Express Delivery by Tomorrow',
        'Standard Delivery (2-3 Days)',
        'Free Store Pickup Available Today',
        'Ships in 24 Hours',
      ];

      await prisma.price.create({
        data: {
          productId: product.id,
          storeId: store.id,
          price: actualPrice,
          originalPrice,
          discount: discountPct,
          availability: availabilities[i % availabilities.length],
          deliveryText: deliveryOptions[i % deliveryOptions.length],
          productUrl: `${store.website}/buy/${product.slug}`,
          lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 3 * 86400000)),
        },
      });
      priceCount++;

      // Create Price History entries (spanning last 60 days) to populate Recharts trend graph
      const daysHistory = [60, 45, 30, 15, 7, 0];
      for (const d of daysHistory) {
        const historicalFluctuation = ((Math.random() * 0.14) - 0.07);
        const histPrice = Math.round(actualPrice * (1 + historicalFluctuation));
        await prisma.priceHistory.create({
          data: {
            productId: product.id,
            storeId: store.id,
            price: histPrice,
            recordedAt: new Date(Date.now() - (d * 86400000)),
          },
        });
        priceHistoryCount++;
      }
    }

    // Create 2-3 realistic reviews per product
    const reviewTitles = [
      'Outstanding build quality and performance!',
      'Great value for money compared to alternatives.',
      'Extremely satisfied with the display and battery life.',
      'Sleek design and super fast delivery.',
      'Does everything as promised. Top tier product.',
    ];
    const reviewContents = [
      'I checked multiple store listings on PricePilot before buying and saved nearly ₹3,500. The performance is ultra smooth.',
      'The specification balance is great. PricePilot Smart Buy Score accurately rated this deal!',
      'Battery lasts easily over a day with heavy usage. Highly recommended for power users.',
      'Camera quality and display crispness are phenomenal. Fast delivery from TechWorld.',
    ];

    for (let r = 0; r < 2; r++) {
      const reviewer = usersPool[(r + Math.floor(Math.random() * usersPool.length)) % usersPool.length];
      await prisma.review.create({
        data: {
          productId: product.id,
          userId: reviewer.id,
          rating: Math.floor(Math.random() * 2) + 4,
          title: reviewTitles[(product.name.length + r) % reviewTitles.length],
          content: reviewContents[(product.name.length + r) % reviewContents.length],
          helpfulCount: Math.floor(Math.random() * 25) + 3,
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 86400000)),
        },
      });
      reviewCountTotal++;
    }
  }

  console.log(`✅ Created ${createdProducts.length} Products`);
  console.log(`✅ Created ${priceCount} Store Price Entries`);
  console.log(`✅ Created ${priceHistoryCount} Historical Price Records`);
  console.log(`✅ Created ${reviewCountTotal} Product Reviews`);

  // 6. Create initial Wishlist & Recently Viewed items for Demo User
  await prisma.wishlist.create({
    data: {
      userId: demoUser.id,
      productId: createdProducts[0].id,
    },
  });
  await prisma.wishlist.create({
    data: {
      userId: demoUser.id,
      productId: createdProducts[7].id,
    },
  });

  await prisma.recentlyViewed.create({
    data: {
      userId: demoUser.id,
      productId: createdProducts[0].id,
    },
  });
  await prisma.recentlyViewed.create({
    data: {
      userId: demoUser.id,
      productId: createdProducts[1].id,
    },
  });

  console.log('✅ Created initial Wishlist and Recently Viewed records for demo user.');
  console.log('🎉 PricePilot Database Seed Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error Seeding Database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
