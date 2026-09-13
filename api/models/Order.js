import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    fullName: { type: String, required: true, trim: true, maxlength: 120 },
    phone: { type: String, required: true, trim: true, maxlength: 20 },
    email: { type: String, required: true, trim: true, lowercase: true },
    companyName: { type: String, trim: true, maxlength: 120, default: '' },

    pickupCity: { type: String, required: true, trim: true, maxlength: 100 },
    pickupAddress: { type: String, required: true, trim: true, maxlength: 300 },
    pickupPin: { type: String, trim: true, maxlength: 10, default: '' },

    dropCity: { type: String, required: true, trim: true, maxlength: 100 },
    dropState: { type: String, required: true, trim: true, maxlength: 100 },
    dropAddress: { type: String, required: true, trim: true, maxlength: 300 },
    dropPin: { type: String, trim: true, maxlength: 10, default: '' },

    materialType: { type: String, required: true, trim: true, maxlength: 100 },
    quantity: { type: String, required: true, trim: true, maxlength: 100 },
    weightTonnes: { type: String, trim: true, maxlength: 50, default: '' },

    vehicleType: { type: String, required: true, trim: true, maxlength: 100 },
    pickupDate: { type: String, required: true, trim: true },
    specialInstructions: { type: String, trim: true, maxlength: 2000, default: '' },

    status: { type: String, enum: ['new', 'confirmed', 'in_transit', 'completed', 'cancelled'], default: 'new' },
  },
  { timestamps: true }
);

orderSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id?.toString();
    delete ret._id;
    return ret;
  },
});

export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;
