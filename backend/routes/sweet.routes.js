import express from "express";
import {
  getAllSweets,
  searchSweets,
  createSweet,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet,
} from "../controllers/sweet.controller.js";
import { authenticate, isAdmin } from "../middleware/auth.middleware.js";
import { body } from "express-validator";
import { validate } from "../middleware/validate.js";

const router = express.Router();

// Validation rules
const sweetValidation = [
  body("name").trim().notEmpty().withMessage("Sweet name is required"),
  body("category")
    .isIn([
      "chocolate",
      "candy",
      "gummy",
      "lollipop",
      "hard-candy",
      "caramel",
      "other",
    ])
    .withMessage("Invalid category"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("quantity")
    .isInt({ min: 0 })
    .withMessage("Quantity must be a positive integer"),
];

// Public routes
router.get("/", authenticate, getAllSweets);
router.get("/search", authenticate, searchSweets);

// Protected routes
router.post("/", authenticate, isAdmin, sweetValidation, validate, createSweet);
router.put(
  "/:id",
  authenticate,
  isAdmin,
  sweetValidation,
  validate,
  updateSweet
);
router.delete("/:id", authenticate, isAdmin, deleteSweet);

// Inventory routes
router.post("/:id/purchase", authenticate, purchaseSweet);
router.post("/:id/restock", authenticate, isAdmin, restockSweet);

export default router;
