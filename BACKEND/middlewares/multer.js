import multer from "multer";

// Store files in memory (not disk)
const storage = multer.memoryStorage();
export const upload = multer({ storage });
