// Automatically detect environment and resolve the correct backend API URL
const getBackendUrl = () => {
    // 1. If explicit environment variable is set and valid, use it
    const envUrl = import.meta.env.VITE_BACKEND_URL;
    if (envUrl && envUrl.trim() !== "" && !envUrl.includes("delete")) {
        return envUrl.startsWith("http") ? envUrl.trim() : `https://${envUrl.trim()}`;
    }

    // 2. Auto-detect local development environment (localhost / 127.0.0.1)
    if (
        typeof window !== "undefined" &&
        (window.location.hostname === "localhost" ||
         window.location.hostname === "127.0.0.1" ||
         import.meta.env.DEV)
    ) {
        return "http://localhost:8080";
    }

    // 3. Auto-detect production live domain
    return "https://shop.rajnishsystems.in";
};

// Done

const URL_TEST = getBackendUrl();

export default URL_TEST;