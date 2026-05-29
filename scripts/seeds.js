const mongoose = require('mongoose');
require('dotenv').config({
path: '.env.local',
});
mongoose.connect(process.env.MONGODB_URI);
const Product = require('../src/models/Product').default;
async function seed() {
await Product.deleteMany();
await Product.create([
{
sku: 'ACE-001',
name: 'Aceite Shell 5W30',
description: 'Aceite sintético',
price: 15000,
stock: 20,
category: 'aceites',
imageUrl:
'https://dummyimage.com/400x300/000/fff',
},
{
sku: 'NEU-001',
name: 'Neumático Michelin',
description: 'Alta duración',
price: 45000,
stock: 12,
category: 'neumaticos',
imageUrl:
'https://dummyimage.com/400x300/000/fff',
},
]);
console.log('Seed completa');
process.exit();
18
}
seed();