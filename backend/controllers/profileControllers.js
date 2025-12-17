import Profile from "../models/Profile.js";

// GET MY PROFILE
export const getMyProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const profile = await Profile.findOne({ user: userId });

        if (!profile)
            return res.status(200).json({ success: true, profile: null });

        res.status(200).json({ success: true, profile });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// COMPLETE PROFILE (CREATE OR UPDATE)
export const completeProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const updateData = {
            phone: req.body.phone,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            country: req.body.country,
            bio: req.body.bio || "",
            profileImage: req.body.profileImage || "",
            isComplete: true
        };

        const profile = await Profile.findOneAndUpdate(
            { user: userId },
            updateData,
            { new: true, upsert: true }
        );

        res.status(200).json({ success: true, profile });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// UPDATE PROFILE IMAGE
export const saveProfileImage = async (req, res) => {
    try {
        const userId = req.user.id;

        const profile = await Profile.findOneAndUpdate(
            { user: userId },
            { profileImage: req.body.profileImage },
            { new: true, upsert: true }
        );

        res.status(200).json({ success: true, profile });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
