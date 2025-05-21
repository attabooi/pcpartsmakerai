const admin = require("firebase-admin");
const serviceAccount = require("./your-service-account-file.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function seed() {
  // components 샘플 데이터 (여러 카테고리/티어/벤치/가격)
  const components = [
    {
      name: "Intel Core i5-12400F",
      brand: "Intel",
      category: "CPU",
      tier: "A",
      price: 180,
      bench: 17500
    },
    {
      name: "AMD Ryzen 5 5600X",
      brand: "AMD",
      category: "CPU",
      tier: "S",
      price: 200,
      bench: 22000
    },
    {
      name: "NVIDIA RTX 3060",
      brand: "NVIDIA",
      category: "GPU",
      tier: "A",
      price: 350,
      bench: 17000
    },
    {
      name: "NVIDIA RTX 4090",
      brand: "NVIDIA",
      category: "GPU",
      tier: "S",
      price: 1600,
      bench: 42000
    },
    {
      name: "Corsair Vengeance 16GB DDR4",
      brand: "Corsair",
      category: "RAM",
      tier: "A",
      price: 60,
      bench: 3200
    },
    {
      name: "Samsung 980 Pro 1TB",
      brand: "Samsung",
      category: "SSD",
      tier: "S",
      price: 120,
      bench: 7000
    },
    {
      name: "Kingston A400 240GB",
      brand: "Kingston",
      category: "SSD",
      tier: "C",
      price: 25,
      bench: 500
    }
  ];

  // components 컬렉션에 데이터 삽입
  const batch = db.batch();
  for (const comp of components) {
    const ref = db.collection("components").doc();
    batch.set(ref, comp);
  }
  await batch.commit();

  // users sample
  await db.collection('users').doc('user1').set({
    email: 'user1@example.com',
    purchaseHistory: [],
    buildHistory: []
  });

  // tierLists sample
  await db.collection('tierLists').add({
    category: 'CPU',
    rankings: [
      { componentId: 'component1', tier: 'S' },
      { componentId: 'component2', tier: 'A' }
    ]
  });

  // buildRecords sample
  await db.collection('buildRecords').add({
    userId: 'user1',
    request: { budget: 1000, purpose: 'gaming' },
    result: { cpu: 'Intel Core i5-12400F', gpu: 'NVIDIA RTX 3060', totalPrice: 950 }
  });

  console.log('Sample components seeded!');
  process.exit();
}

seed(); 