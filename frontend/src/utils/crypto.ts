import CryptoJS from "crypto-js";

// Secret key for encryption (in production, use a more secure approach for managing this key)
const SECRET_KEY: string = "fca45251-df80-4429-be57-f871e74a1d86";

type Role = 'user' | 'artist' | 'admin';

// Function to encrypt and store refresh token
const storeRefreshToken = ( role: Role,refreshToken: string): boolean => {
  try {
    // Encrypt the refresh token
    const encryptedToken: string = CryptoJS.AES.encrypt(
      refreshToken,
      SECRET_KEY
    ).toString();

    // Store in localStorage with role-specific key
    const storageKey = `${role}RefreshToken`;
    localStorage.setItem(storageKey, encryptedToken);
    return true;
  } catch (error) {
    console.error("Failed to encrypt and store refresh token:", error);
    return false;
  }
};

// Function to retrieve and decrypt refresh token
const getRefreshToken = (role: Role): string | null => {
  try {
    // Get encrypted token from localStorage using role-specific key
    const storageKey = `${role}RefreshToken`;
    const encryptedToken: string | null = localStorage.getItem(storageKey);

    // If no token exists, return null
    if (!encryptedToken) {
      return null;
    }

    // Decrypt the token
    const bytes = CryptoJS.AES.decrypt(encryptedToken, SECRET_KEY);
    const decryptedToken: string = bytes.toString(CryptoJS.enc.Utf8);

    return decryptedToken;
  } catch (error) {
    console.error("Failed to retrieve or decrypt refresh token:", error);
    return null;
  }
};

// Function to clear refresh token
const clearRefreshToken = (role: Role): void => {
  const storageKey = `${role}RefreshToken`;
  localStorage.removeItem(storageKey);
};

export { storeRefreshToken, getRefreshToken, clearRefreshToken };
