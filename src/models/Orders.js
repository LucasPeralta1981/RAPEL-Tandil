import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userRole: String,
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    sku: String,
    name: String,
    quantity: Number,
    price: Number
  }],
  subtotal: Number,
  total: Number,
  shippingMethod: String,
  shippingCost: Number,
  status: { type: String, enum: ['pendiente', 'quote', 'aprobado', 'pagado', 'enviado', 'entregado', 'cancelado'], default: 'pendiente' },
  trackingNumber: String,
  paymentMethod: String,
  mercadoPagoPreferenceId: String,
  cae: String, // Para facturación
  notes: String,
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
