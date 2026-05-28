// scripts/seedShippingZones.js
import mongoose from 'mongoose';
import { connectDB } from '../src/lib/db.js';
import ShippingZone from '../src/models/ShippingZone.js';

const shippingZonesData = [
  // ... (usa los datos del ejemplo anterior)
  {
    name: 'CABA y GBA',
    description: 'Capital Federal y Gran Buenos Aires',
    type: 'province',
    values: ['CABA', 'Buenos Aires'],
    costs: {
      domestic: {
        standard: { min: 1500, max: 5000, perKg: 100 },
        express: { min: 2500, max: 8000, perKg: 200 }
      }
    },
    minOrderAmount: 0,
    maxWeight: 30,
    isActive: true
  },
  {
    name: 'Córdoba y Santa Fe',
    description: 'Provincias del centro',
    type: 'province',
    values: ['Córdoba', 'Santa Fe'],
    costs: {
      domestic: {
        standard: { min: 2000, max: 6000, perKg: 150 },
        express: { min: 3500, max: 10000, perKg: 250 }
      }
    },
    minOrderAmount: 5000,
    maxWeight: 30,
    isActive: true
  },
  {
    name: 'Patagonia',
    description: 'Todas las provincias patagónicas',
    type: 'region',
    values: ['Neuquén', 'Río Negro', 'Chubut', 'Santa Cruz', 'Tierra del Fuego'],
    costs: {
      domestic: {
        standard: { min: 3500, max: 12000, perKg: 250 },
        express: { min: 6000, max: 18000, perKg: 400 }
      }
    },
    minOrderAmount: 10000,
    maxWeight: 20,
    isActive: true
  }
];

async function seedShippingZones() {
  try {
    await connectDB();
    
    console.log('🗑️  Eliminando zonas existentes...');
    await ShippingZone.deleteMany({});
    
    console.log('📦 Creando zonas de envío...');
    const zones = await ShippingZone.insertMany(shippingZonesData);
    
    console.log(`✅ ${zones.length} zonas de envío creadas exitosamente:`);
    zones.forEach(zone => {
      console.log(`   - ${zone.name}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seedando zonas de envío:', error);
    process.exit(1);
  }
}

seedShippingZones();
