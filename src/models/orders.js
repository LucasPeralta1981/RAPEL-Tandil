import mongoose from 'mongoose';
const OrderSchema = new mongoose.Schema(
{
customerName: String,
customerEmail: String,
items: Array,
total: Number,
status: {
type: String,
default: 'pendiente',
},
},
{
timestamps: true,
}
);
export default mongoose.models.Order ||
mongoose.model('Order', OrderSchema);
