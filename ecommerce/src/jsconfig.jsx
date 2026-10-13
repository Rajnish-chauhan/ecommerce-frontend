// Ensure base URL always points to absolute backend domain with https://
const getBackendUrl = () => {
    const envUrl = import.meta.env.VITE_BACKEND_URL;
    if (envUrl && envUrl.trim() !== "" && !envUrl.includes("delete")) {
        return envUrl.startsWith("http") ? envUrl.trim() : `https://${envUrl.trim()}`;
    }
    // Hard fallback directly to live backend domain
    return "https://shop.rajnishsystems.in";
};

const URL_TEST = getBackendUrl();

export default URL_TEST;