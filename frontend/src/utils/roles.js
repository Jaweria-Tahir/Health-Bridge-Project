export const ROLES = {
  CITIZEN: "citizen",
  ORGANIZATION: "organization",
  ADMIN: "admin",
};

export const isStaff = (role) => role === ROLES.ORGANIZATION || role === ROLES.ADMIN;

export const roleLabel = (role) => {
  switch (role) {
    case ROLES.ADMIN:
      return "Administrator";
    case ROLES.ORGANIZATION:
      return "Organization";
    case ROLES.CITIZEN:
    default:
      return "Citizen";
  }
};

export const formatCategory = (value = "") =>
  value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
