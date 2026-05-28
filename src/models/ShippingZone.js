// src/models/ShippingZone.js
import mongoose from 'mongoose';

const ShippingZoneSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true 
  },
  description: {
    type: String,
    default: ''
  },
  // Definición de la zona
  type: {
    type: String,
    enum: ['zipCode', 'province', 'region', 'country'],
    required: true,
    default: 'province'
  },
  values: [{
    type: String
  }], // Ej: ['CABA', 'Buenos Aires'] o ['1000-1999', '2000-2999']
  
  // Costos de envío
  costs: {
    domestic: {
      standard: {
        min: { type: Number, default: 0 }, // Costo mínimo
        max: { type: Number, default: 0 }, // Costo máximo (por peso)
        perKg: { type: Number, default: 150 } // Costo por kg adicional
      },
      express: {
        min: { type: Number, default: 0 },
        max: { type: Number, default: 0 },
        perKg: { type: Number, default: 250 }
      }
    },
    international: {
      standard: {
        min: { type: Number, default: 0 },
        max: { type: Number, default: 0 },
        perKg: { type: Number, default: 500 }
      }
    }
  },
  
  // Limitaciones
  minOrderAmount: {
    type: Number,
    default: 0,
    min: 0
  }, // Pedido mínimo para enviar a esta zona
  maxWeight: {
    type: Number,
    default: 30, // kg
    min: 0
  }, // Peso máximo por paquete
  isActive: {
    type: Boolean,
    default: true
  },
  notes: {
    type: String,
    default: ''
  }
}, { timestamps: true });

// Índice para búsquedas eficientes
ShippingZoneSchema.index({ type: 1, values: 1 });

// Método para calcular costo de envío
ShippingZoneSchema.methods.calculateCost = function(weight, serviceType = 'standard') {
  const costConfig = this.costs.domestic[serviceType];
  
  if (weight > this.maxWeight) {
    throw new Error(`Peso excede el límite de ${this.maxWeight}kg para ${this.name}`);
  }
  
  let baseCost = costConfig.min;
  const additionalWeight = Math.max(0, weight - 1); // Primer kg incluido
  const additionalCost = additionalWeight * costConfig.perKg;
  
  const totalCost = baseCost + additionalCost;
  
  // Aplicar costo máximo si existe
  if (costConfig.max > 0 && totalCost > costConfig.max) {
    return costConfig.max;
  }
  
  return Math.round(totalCost); // Redondear
};

// Método para verificar si una zona aplica a un código postal/provincia
ShippingZoneSchema.statics.findMatchingZone = function(zipCode, province) {
  return this.findOne({
    $or: [
      { type: 'zipCode', values: { $in: [zipCode] } },
      { type: 'province', values: { $in: [province] } },
      { type: 'region', values: { $in: ['NACIONAL'] } } // Zona nacional por defecto
    ],
    isActive: true
  });
};

const ShippingZone = mongoose.models.ShippingZone || mongoose.model('ShippingZone', ShippingZoneSchema);

export default ShippingZone;