export const generateRandomSuffix = (id) => {
    if (!id) return "";
    let numericId = 0;
    if (typeof id === 'string') {
        for (let i = 0; i < id.length; i++) {
            numericId += id.charCodeAt(i);
        }
    } else {
        numericId = id;
    }
    // Generate a semi-stable 4-character suffix based on the ID
    // This ensures the link doesn't change on every re-render but looks random
    const hash = Math.abs((numericId * 9301 + 49297) % 233280);
    const chars = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789"; // Removed O and 0 for clarity
    let suffix = "";
    let currentHash = hash;
    for (let i = 0; i < 4; i++) {
        suffix += chars[currentHash % chars.length];
        currentHash = Math.floor(currentHash / chars.length);
    }
    return suffix;
};

export const generateAddressSuffix = (id, address) => {
    let slug = "room";
    if (address) {
        slug = address.toString().toLowerCase().trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-');
        if (slug.endsWith('-')) slug = slug.slice(0, -1);
    }
    
    let numericId = 0;
    if (typeof id === 'string') {
        for (let i = 0; i < id.length; i++) {
            numericId += id.charCodeAt(i);
        }
    } else {
        numericId = id || 0;
    }
    const hash = Math.abs((numericId * 9301 + 49297) % 900) + 100;
    
    return `${slug}-${hash}`;
};
