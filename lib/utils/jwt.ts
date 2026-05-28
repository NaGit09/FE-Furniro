/**
 * Utility for parsing and decoding JWT tokens on the client side.
 */

export interface DecodedToken {
  userID?: number;
  UserID?: number;
  id?: number;
  sub?: string | number;
  accountID?: number;
  AccountID?: number;
  username?: string;
  UserName?: string;
  email?: string;
  Email?: string;
  exp?: number;
  [key: string]: any;
}

/**
 * Decodes a base64-encoded JWT token string.
 */
export const parseJwt = (token: string): DecodedToken | null => {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to parse JWT token:", error);
    return null;
  }
};

/**
 * Extracts key user properties from a decoded JWT token.
 */
export const getUserInfoFromToken = (token: string) => {
  const decoded = parseJwt(token);
  if (!decoded) return null;

  const userID = decoded.userID || decoded.UserID || decoded.id || (typeof decoded.sub === "number" ? decoded.sub : parseInt(decoded.sub || "")) || null;
  const accountID = decoded.accountID || decoded.AccountID || decoded.id || null;
  const username = decoded.username || decoded.UserName || decoded.sub || "User";
  const email = decoded.email || decoded.Email || "";

  return {
    userID: userID ? Number(userID) : null,
    accountID: accountID ? Number(accountID) : null,
    username: String(username),
    email: String(email),
  };
};
