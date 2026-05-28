const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../src/lib/db');
const User = require('../src/models/User');
const Product = require('../src/models/Product');
const Order = require('../src/models/Order');

// Importar variables de entorno
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

async function seedData() {
  try {
    await connectDB();
    console.log('✅ Conectado a MongoDB');

    // 1. Limpiar datos existentes (Opcional, cuidado en producción)
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    console.log('🗑️  Base de datos limpiada');

    // 2. Crear Usuarios
    const hashedPassword = await bcrypt.hash('123456', 10);

    const adminUser = await User.create({
      name: 'Lucas Admin',
      email: 'admin@rape-l.com',
      password: hashedPassword,
      role: 'admin',
      phone: '1112345678'
    });

    const b2bUser = await User.create({
      name: 'Juan Pérez',
      email: 'juan@taller-garcia.com',
      password: hashedPassword,
      role: 'b2b',
      company: 'Taller García S.A.',
      cuit: '30-12345678-9',
      phone: '1198765432'
    });

    const b2cUser = await User.create({
      name: 'María González',
      email: 'maria@gmail.com',
      password: hashedPassword,
      role: 'b2c',
      phone: '1155556666'
    });

    console.log('👥 Usuarios creados: Admin, B2B, B2C');

    // 3. Crear Productos de Ejemplo
    const products = await Product.create([
      {
        sku: 'SH-5W30-1L',
        name: 'Aceite Shell Helix HX8 5W-30 1L',
        description: 'Aceite sintético avanzado.',
        category: 'aceites',
        basePrice: 15000,
        stock: 100,
        imageUrl: 'https://dummyimage.com/400x300/004d99/fff&text=Shell+5W30',
        margin: 0.30,
        logisticsCost: 500
      },
      {
        sku: 'NEUM-195-65-R15',
        name: 'Neumático Michelin Energy 195/65R15',
        description: 'Alta seguridad para turismo.',
        category: 'neumaticos',
        basePrice: 45000,
        stock: 20,
        imageUrl: 'https://dummyimage.com/400x300/004d99/fff&text=Neumático+Michelin',
        margin: 0.25,
        logisticsCost: 2000
      },
      {
        sku: 'REP-FRE-001',
        name: 'Pastillas de Freno Delanteras Ford Focus',
        description: 'Cerámicas de alta duración.',
        category: 'repuestos',
        basePrice: 8500,
        stock: 50,
        imageUrl: 'https://dummyimage.com/400x300/004d99/fff&text=Pastillas+Freno',
        margin: 0.35,
        logisticsCost: 200
      }
    ]);

    console.log('📦 Productos creados:', products.length);

    // 4. Crear una Orden de Prueba (B2B - Cotización)
    const quoteOrder = await Order.create({
      userId: b2bUser._id,
      userRole: 'b2b',
      items: [
        {
          product: products[0]._id,
          sku: 'SH-5W30-1L',
          name: 'Aceite Shell Helix HX8 5W-30 1L',
          quantity: 10,
          price: products[0].finalPrice // Usamos el precio calculado
        },
        {
          product: products[2]._id,
          sku: 'REP-FRE-001',
          name: 'Pastillas de Freno',
          quantity: 2,
          price: products[2].finalPrice
        }
      ],
      subtotal: (products[0].finalPrice * 10) + (products[2].finalPrice * 2),
      total: 0, // Se calcula al aprobar
      status: 'quote', // Estado: Cotización
      shippingMethod: 'Andreani',
      notes: 'Necesito factura A por favor.'
    });

    console.log('📋 Cotización de prueba creada para Taller García S.A.');

    // 5. Crear una Orden de Prueba (B2C - Pagada)
    const b2cOrder = await Order.create({
      userId: b2cUser._id,
      userRole: 'b2c',
      items: [
        {
          product: products[1]._id,
          sku: 'NEUM-195-65-R15',
          name: 'Neumático Michelin',
          quantity: 4,
          price: products[1].finalPrice
        }
      ],
      subtotal: products[1].finalPrice * 4,
      total: products[1].finalPrice * 4,
      status: 'enviado', // Estado: Ya enviado
      shippingMethod: 'Correo Argentino',
      trackingNumber: 'CA123456789AR',
      paymentMethod: 'MercadoPago',
      mercadoPagoPreferenceId: 'MP-TEST-123'
    });

    console.log('🚚 Orden de envío creada para María González');

    console.log('\n🎉 ¡SEED COMPLETADA! Puedes iniciar tu servidor y probar.');
    console.log('👤 Admin: admin@rape-l.com / 123456');
    console.log('🏢 B2B: juan@taller-garcia.com / 123456');
    console.log('🛒 B2C: maria@gmail.com / 123456');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seed:', error);
    process.exit(1);
  }
}
// Ejemplos de zonas para tu script de seed
const shippingZonesData = [
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
    name: 'Región Centro',
    description: 'La Pampa, Entre Ríos, San Luis',
    type: 'region',
    values: ['La Pampa', 'Entre Ríos', 'San Luis'],
    costs: {
      domestic: {
        standard: { min: 2500, max: 7000, perKg: 180 },
        express: { min: 4000, max: 12000, perKg: 300 }
      }
    },
    minOrderAmount: 5000,
    maxWeight: 25,
    isActive: true
  },
  {
    name: 'Región Norte',
    description: 'Todas las provincias del norte',
    type: 'region',
    values: ['Jujuy', 'Salta', 'Tucumán', 'Santiago del Estero', 'Chaco', 'Formosa', 'Corrientes', 'Misiones'],
    costs: {
      domestic: {
        standard: { min: 3000, max: 10000, perKg: 200 },
        express: { min: 5000, max: 15000, perKg: 350 }
      }
    },
    minOrderAmount: 8000,
    maxWeight: 20,
    isActive: true
  },
  {
    name: 'Región Cuyo',
    description: 'Mendoza, San Juan, La Rioja',
    type: 'region',
    values: ['Mendoza', 'San Juan', 'La Rioja'],
    costs: {
      domestic: {
        standard: { min: 2800, max: 9000, perKg: 190 },
        express: { min: 4500, max: 14000, perKg: 320 }
      }
    },
    minOrderAmount: 7000,
    maxWeight: 25,
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
    notes: 'Los tiempos de entrega pueden ser más largos',
    isActive: true
  },
  {
    name: 'Nacional por Código Postal',
    description: 'Zona específica por rango de CP',
    type: 'zipCode',
    values: ['9000-9999'], // Patagonia sur
    costs: {
      domestic: {
        standard: { min: 4000, max: 15000, perKg: 300 },
        express: { min: 7000, max: 20000, perKg: 500 }
      }
    },
    minOrderAmount: 12000,
    maxWeight: 15,
    isActive: true
  }
];
seedData();
