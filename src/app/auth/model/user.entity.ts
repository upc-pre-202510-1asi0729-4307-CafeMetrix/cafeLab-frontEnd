export interface User {
  id?: string;
  name?: string;
  email: string;
  password?: string;
  role?: string;
  cafeteriaName?: string;
  experience?: string;
  profilePicture?: string;
  paymentMethod?: string;
  isFirstLogin?: boolean;
  hasPlan?: boolean | string;
  plan?: string;
}

export function createUser(data: Partial<User> = {}): User {
  return {
    id: data.id || "",
    name: data.name || "",
    email: data.email || "",
    password: data.password || "",
    role: data.role || "",
    cafeteriaName: data.cafeteriaName || "",
    experience: data.experience || "",
    profilePicture: data.profilePicture || "",
    paymentMethod: data.paymentMethod || "",
    isFirstLogin: data.isFirstLogin,
    hasPlan: data.hasPlan,
    plan: data.plan
  };
}
