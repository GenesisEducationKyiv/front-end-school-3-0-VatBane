export const isValidImageUrl = (url: string): boolean => {
    try {
        const parsed = new URL(url);
        return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(parsed.pathname);
    } catch {
        return false;
    }
};