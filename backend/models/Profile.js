import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    bio: { type: String, default: '' },
    profileImage: { type: String, default: '' },
    isComplete: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Profile', profileSchema);