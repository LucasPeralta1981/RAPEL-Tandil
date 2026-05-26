import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  sku: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: String,
  category: { type: String, enum: ['repuestos', 'neumaticos', 'aceites', 'herramientas', 'lubricantes'] },
  basePrice: { type: Number, required: true },
  margin: { type: Number, default: 0.30 },
  logisticsCost: { type: Number, default: 0 },
  vatRate: { type: Number, default: 0.21 },
  grossIncomeRate: { type: Number, default: 0.03 },
  finalPrice: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  imageUrl: String,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Calcular precio final automáticamente
ProductSchema.pre('save', function(next) {
  const { basePrice, margin, logisticsCost, vatRate, grossIncomeRate } = this;
  const costTotal = basePrice + logisticsCost;
  const priceBase = costTotal * (1 + margin);
  const impuestos = priceBase * (vatRate + grossIncomeRate);
  this.finalPrice = priceBase + impuestos;
  next();
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
