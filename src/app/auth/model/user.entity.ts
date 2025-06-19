export class User {
  /** Unique identifier for the user */
  id: number;

  /** Name of the user */
  name: string;

  /** Email address of the user */
  email: string;

  /** Password of the user */
  password: string;

  /** Role of the user (e.g., 'barista', 'dueno_cafeteria') */
  role: string;

  /** Name of the cafeteria associated with the user (if applicable) */
  cafeteriaName: string;

  /** Experience of the user (if applicable) */
  experience: string;

  /** Profile picture URL of the user */
  profilePicture: string;

  /** Payment method selected by the user */
  paymentMethod: string;

  /** Flag indicating if it is the user's first login */
  isFirstLogin: boolean;

  /** Plan selected by the user (e.g., 'barista', 'admin', 'complete') */
  plan: string;

  /** Flag indicating if the user has a plan */
  hasPlan: boolean;

  /**
   * Creates a new User instance
   * @param user - The user initialization object
   * @param user.id - The user ID (defaults to 0 if not provided)
   * @param user.name - The username (defaults to empty string if not provided)
   * @param user.email - The user email (defaults to empty string if not provided)
   * @param user.password - The user password (defaults to empty string if not provided)
   * @param user.role - The user role (defaults to empty string if not provided)
   * @param user.cafeteriaName - The cafeteria name associated with the user (defaults to empty string if not provided)
   * @param user.experience - The user experience (defaults to empty string if not provided)
   * @param user.profilePicture - The user profile picture URL (defaults to empty string if not provided)
   * @param user.paymentMethod - The user payment method (defaults to empty string if not provided)
   * @param user.isFirstLogin - Flag indicating if it is the user's first login (defaults to false if not provided)
   * @param user.plan - The user plan (defaults to empty string if not provided)
   * @param user.hasPlan - Flag indicating if the user has a plan (defaults to false if not provided)
   */
  constructor(user: {
    id?: number,
    name?: string,
    email?: string,
    password?: string,
    role?: string,
    cafeteriaName?: string,
    experience?: string,
    profilePicture?: string,
    paymentMethod?: string,
    isFirstLogin?: boolean,
    plan?: string,
    hasPlan?: boolean
  }) {
    this.id = user.id || 0;
    this.name = user.name || '';
    this.email = user.email || '';
    this.password = user.password || '';
    this.role = user.role || '';
    this.cafeteriaName = user.cafeteriaName || '';
    this.experience = user.experience || '';
    this.profilePicture = user.profilePicture || '';
    this.paymentMethod = user.paymentMethod || '';
    this.isFirstLogin = user.isFirstLogin || false;
    this.plan = user.plan || '';
    this.hasPlan = user.hasPlan || false;
  }

}
