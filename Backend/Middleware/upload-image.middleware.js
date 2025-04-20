import multer from "multer";

import ApiError from "../Utils/ApiError.js";

const multerOptions = () => {
  const multerStorage = multer.memoryStorage();
  const multerfileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Please upload an image", 400), false);
    }
  };
  const upload = multer({
    storage: multerStorage,
    fileFilter: multerfileFilter,
  });
  return upload;
};

export const uploadSingle = (field) => multerOptions().fields(field);
