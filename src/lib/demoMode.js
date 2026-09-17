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

/**
 * Checks if a target path is allowed for a user role.
 */
export const isRouteAllowedForRole = (targetPath, role) => {
  if (!targetPath || typeof targetPath !== "string") return false;

  // Strip query parameters and hashes for permission checking
  const path = targetPath.split("?")[0].split("#")[0].toLowerCase().trim();

  // If path is empty, root, or an auth route, it is not a destination protected route
  if (!path || path === "/" || path.startsWith("/auth/")) {
    return false;
  }

  // Dashboard role-specific checks
  if (path.startsWith("/dashboard/admin")) {
    return role === "admin";
  }

  if (path.startsWith("/dashboard/trainer")) {
    return role === "trainer";
  }

  if (path.startsWith("/dashboard/member")) {
    return role === "member";
  }

  // Root /dashboard route
  if (path === "/dashboard") {
    return true;
  }

  // General authenticated routes (e.g. /all-classes/.../booking, /payment/..., /community-forum/...)
  return true;
};

/**
 * Resolves the destination URL after login:
 * 1. Inspects destination callback URL parameters (callbackUrl, redirect, from, returnUrl).
 * 2. If present, decodes and checks if user role has permission for that target route.
 * 3. If authorized, returns the callback URL; otherwise falls back to the role's default dashboard.
 */
export const resolvePostLoginRedirect = (searchParamsOrUrl, role) => {
  const defaultDashboard = getDashboardRouteByRole(role);

  if (!searchParamsOrUrl) return defaultDashboard;

  let candidate = "";

  if (typeof searchParamsOrUrl === "string") {
    candidate = searchParamsOrUrl;
  } else if (typeof searchParamsOrUrl.get === "function") {
    candidate =
      searchParamsOrUrl.get("callbackUrl") ||
      searchParamsOrUrl.get("callbackURL") ||
      searchParamsOrUrl.get("redirect") ||
      searchParamsOrUrl.get("from") ||
      searchParamsOrUrl.get("returnUrl") ||
      "";
  }

  if (!candidate) return defaultDashboard;

  try {
    candidate = decodeURIComponent(candidate.trim());
  } catch (_) {
    candidate = candidate.trim();
  }

  // Disallow external absolute URLs (e.g. https://, http://, //, ://) to prevent open redirects
  if (
    candidate.startsWith("http://") ||
    candidate.startsWith("https://") ||
    candidate.startsWith("//") ||
    candidate.includes("://")
  ) {
    return defaultDashboard;
  }

  if (!candidate.startsWith("/")) {
    candidate = "/" + candidate;
  }

  // Ensure candidate is a valid internal relative application path
  if (!candidate || candidate === "/" || candidate.startsWith("//")) {
    return defaultDashboard;
  }

  // Verify permission for target route
  if (isRouteAllowedForRole(candidate, role)) {
    return candidate;
  }

  // Fallback to role's default dashboard if route requires a different role
  return defaultDashboard;
};



