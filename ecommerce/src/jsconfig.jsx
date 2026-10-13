// Resolves base API URL dynamically from environment or defaults to local server
const URL_TEST = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

export default URL_TEST;