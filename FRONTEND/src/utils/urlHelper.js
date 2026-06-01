export const generateRandomSuffix = (id) => {
    if (!id) return "";
    // Generate a semi-stable 4-character suffix based on the ID
    // This ensures the link doesn't change on every re-render but looks random
    const hash = Math.abs((id * 9301 + 49297) % 233280);
    const chars = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789"; // Removed O and 0 for clarity
    let suffix = "";
    let currentHash = hash;
    for (let i = 0; i < 4; i++) {
        suffix += chars[currentHash % chars.length];
        currentHash = Math.floor(currentHash / chars.length);
    }
    return suffix;
};
