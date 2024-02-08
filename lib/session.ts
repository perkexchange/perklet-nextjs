export const SessionOptions = {
  password: process.env.PERKLET_SESSION_PASSWORD, // Replace with a strong password
  cookieName: process.env.PERKLET_SESSION_COOKIE_NAME || "perklet-session",
  cookieOptions: {
    secure: process.env.PERKLET_SESSION_COOKIE_SECURE, // Make sure to use HTTPS
    httpOnly: process.env.PERKLET_SESSION_COOKIE_HTTPONLY,
    sameSite: process.env.PERKLET_SESSION_COOKIE_SAMESITE,
  },
};

export interface SessionData {
  ticket: string;
  activatedAt: string;
  endsAt: string;
}
