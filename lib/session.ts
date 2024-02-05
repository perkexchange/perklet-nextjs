export const SessionOptions = {
  password: "your_password_hereAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", // Replace with a strong password
  cookieName: "session",
  cookieOptions: {
    secure: false, // Make sure to use HTTPS
    httpOnly: true,
    sameSite: "strict",
  },
};

export interface SessionData {
  ticket: string;
  activatedAt: string;
  endsAt: string;
}
