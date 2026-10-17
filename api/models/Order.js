import mongoose from 'mongoose';

const stoneItemSchema = new mongoose.Schema(
  {
    stoneName: { type: String, required: true, trim: true, maxlength: 120 },
    slabSize: { type: String, trim: true, maxlength: 120, default: '' },
    slabCount: { type: String, trim: true, maxlength: 80, default: '' },
    quantityTonnes: { type: String, trim: true, maxlength: 80, default: '' },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    fullName: { type: String, required: true, trim: true, maxlength: 120 },
    phone: { type: String, required: true, trim: true, maxlength: 20 },
    email: { type: String, required: true, trim: true, lowercase: true },
    companyName: { type: String, trim: true, maxlength: 120, default: '' },

    // Delivery destination (primary routing)
    dropCity: { type: String, required: true, trim: true, maxlength: 100 },
    dropState: { type: String, required: true, trim: true, maxlength: 100 },
    dropAddress: { type: String, required: true, trim: true, maxlength: 300 },
    dropPin: { type: String, trim: true, maxlength: 10, default: '' },

    // Optional legacy pickup info
    pickupCity: { type: String, trim: true, maxlength: 100, default: 'Makrana' },
    pickupAddress: { type: String, trim: true, maxlength: 300, default: '' },
    pickupPin: { type: String, trim: true, maxlength: 10, default: '' },

    // Cargo details: multiple stones with slab size, slab count, tonnes
    stones: { type: [stoneItemSchema], default: [] },

    // Summary strings for quick reference & backwards compatibility
    materialType: { type: String, trim: true, maxlength: 500, default: '' },
    quantity: { type: String, trim: true, maxlength: 500, default: '' },
    weightTonnes: { type: String, trim: true, maxlength: 100, default: '' },

    // Target arrival date
    arrivedByDate: { type: String, required: true, trim: true },
    pickupDate: { type: String, trim: true, default: '' }, // legacy alias

    // Optional vehicle preference (now optional)
    vehicleType: { type: String, trim: true, maxlength: 100, default: '' },

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
