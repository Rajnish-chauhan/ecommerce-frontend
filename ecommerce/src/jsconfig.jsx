// Resolve backend URL from environment or fall back to local dev server
const URL_TEST = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

export default URL_TEST;