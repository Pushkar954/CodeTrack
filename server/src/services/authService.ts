export class AuthService {
  static async findByClerkUserId(clerkUserId: string) {
    const { User } = await import('../models/User.js');
    return User.findOne({ clerkUserId }).lean();
  }

  static async findOrCreate(clerkUserId: string, clerkData: {
    email: string;
    firstName?: string;
    lastName?: string;
    profileImageUrl?: string;
  }) {
    const { User } = await import('../models/User.js');
    const existing = await User.findOne({ clerkUserId }).lean();
    if (existing) {
      return existing;
    }
    const name = `${clerkData.firstName || ''} ${clerkData.lastName || ''}`.trim() || clerkData.email;
    const newUser = await User.create({
      clerkUserId,
      name,
      email: clerkData.email,
      profileImage: clerkData.profileImageUrl,
    });
    return newUser;
  }
}
