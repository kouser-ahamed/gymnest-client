// Guest / Demo Mode Credentials and Masking Utilities

export const DEMO_CREDENTIALS = {
  member: {
    role: "member",
    label: "Guest Member",
    email: "taslimaislam69t@gmail.com",
    password: "Member5643@",
  },
  trainer: {
    role: "trainer",
    label: "Guest Trainer",
    email: "maishatabassumprova@gmail.com",
    password: "Trainer5643@",
  },
  admin: {
    role: "admin",
    label: "Guest Admin",
    email: "kouserahamed@admin.com",
    password: "GymnestAdmin@X",
  },
};

export const DEMO_EMAILS = [
  DEMO_CREDENTIALS.member.email.toLowerCase(),
  DEMO_CREDENTIALS.trainer.email.toLowerCase(),
  DEMO_CREDENTIALS.admin.email.toLowerCase(),
];

/**
 * Returns true if the user or email belongs to one of the 3 demo accounts.
 */
export const isDemoUser = (userOrEmail) => {
  if (!userOrEmail) return false;
  const email = (
    typeof userOrEmail === "string" ? userOrEmail : userOrEmail?.email || ""
  )
    .trim()
    .toLowerCase();
  return DEMO_EMAILS.includes(email);
};

/**
 * Returns true if the user or email is the Demo Admin account.
 */
export const isDemoAdmin = (userOrEmail) => {
  if (!userOrEmail) return false;
  const email = (
    typeof userOrEmail === "string" ? userOrEmail : userOrEmail?.email || ""
  )
    .trim()
    .toLowerCase();
  return email === DEMO_CREDENTIALS.admin.email.toLowerCase();
};

/**
 * Masking utility for admin dashboard tables (Manage Users & Manage Trainers).
 * Replaces real user emails with generic role-based aliases.
 */
export const getMaskedAdminListEmail = (userOrItem, fallbackRole = "member") => {
  if (!userOrItem) return "guestmember@gmail.com";
  const role =
    (typeof userOrItem === "object" ? userOrItem?.role : fallbackRole) ||
    fallbackRole;

  if (role === "admin") return "adminguest@gmail.com";
  if (role === "trainer") return "trainerguest@gmail.com";
  return "guestmember@gmail.com";
};

/**
 * Backward compatibility alias for list masking.
 */
export const getMaskedUserEmail = getMaskedAdminListEmail;

/**
 * Returns sequential masked transaction emails (e.g. member1@gmail.com, member2@gmail.com).
 */
export const getMaskedTransactionEmail = (index = 0) => {
  return `member${index + 1}@gmail.com`;
};

/**
 * Resolves the destination dashboard route based on user role.
 * - admin -> /dashboard/admin
 * - trainer -> /dashboard/trainer
 * - member (or default) -> /dashboard/member
 */
export const getDashboardRouteByRole = (role) => {
  const normalized = (role || "").toLowerCase().trim();
  if (normalized === "admin") return "/dashboard/admin";
  if (normalized === "trainer") return "/dashboard/trainer";
  return "/dashboard/member";
};

