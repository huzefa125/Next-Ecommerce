import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

// Separate storage for categories
const categoryStorage = multer.memoryStorage();

const categoryUpload = multer({ storage: categoryStorage });

export { categoryUpload };
export default upload;  
