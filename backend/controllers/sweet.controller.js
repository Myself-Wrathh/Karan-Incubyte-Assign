import Sweet from "../models/sweet.model.js";

/**
 * Get all sweets
 * GET /api/sweets
 */
export const getAllSweets = async (req, res) => {
  try {
    const sweets = await Sweet.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: sweets.length,
      data: sweets,
    });
  } catch (error) {
    console.error("Error fetching sweets:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching sweets",
      error: error.message,
    });
  }
};

/**
 * Search sweets by name, category, or price range
 * GET /api/sweets/search?name=&category=&minPrice=&maxPrice=
 */
export const searchSweets = async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;

    const query = {};

    if (name) {
      query.name = { $regex: name, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const sweets = await Sweet.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: sweets.length,
      data: sweets,
    });
  } catch (error) {
    console.error("Error searching sweets:", error);
    res.status(500).json({
      success: false,
      message: "Error searching sweets",
      error: error.message,
    });
  }
};

/**
 * Add a new sweet (Admin only)
 * POST /api/sweets
 */
export const createSweet = async (req, res) => {
  try {
    const { name, category, price, quantity, description, imageUrl } = req.body;

    const sweet = await Sweet.create({
      name,
      category,
      price,
      quantity,
      description,
      imageUrl,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Sweet created successfully",
      data: sweet,
    });
  } catch (error) {
    console.error("Error creating sweet:", error);
    res.status(500).json({
      success: false,
      message: "Error creating sweet",
      error: error.message,
    });
  }
};

/**
 * Update a sweet (Admin only)
 * PUT /api/sweets/:id
 */
export const updateSweet = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price, quantity, description, imageUrl } = req.body;

    const sweet = await Sweet.findByIdAndUpdate(
      id,
      { name, category, price, quantity, description, imageUrl },
      { new: true, runValidators: true }
    );

    if (!sweet) {
      return res.status(404).json({
        success: false,
        message: "Sweet not found",
      });
    }

    res.json({
      success: true,
      message: "Sweet updated successfully",
      data: sweet,
    });
  } catch (error) {
    console.error("Error updating sweet:", error);
    res.status(500).json({
      success: false,
      message: "Error updating sweet",
      error: error.message,
    });
  }
};

/**
 * Delete a sweet (Admin only)
 * DELETE /api/sweets/:id
 */
export const deleteSweet = async (req, res) => {
  try {
    const { id } = req.params;

    const sweet = await Sweet.findByIdAndDelete(id);

    if (!sweet) {
      return res.status(404).json({
        success: false,
        message: "Sweet not found",
      });
    }

    res.json({
      success: true,
      message: "Sweet deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting sweet:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting sweet",
      error: error.message,
    });
  }
};

/**
 * Purchase a sweet (decreases quantity)
 * POST /api/sweets/:id/purchase
 */
export const purchaseSweet = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity = 1 } = req.body;

    const sweet = await Sweet.findById(id);

    if (!sweet) {
      return res.status(404).json({
        success: false,
        message: "Sweet not found",
      });
    }

    if (sweet.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient quantity in stock",
      });
    }

    sweet.quantity -= quantity;
    await sweet.save();

    res.json({
      success: true,
      message: "Purchase successful",
      data: sweet,
    });
  } catch (error) {
    console.error("Error purchasing sweet:", error);
    res.status(500).json({
      success: false,
      message: "Error purchasing sweet",
      error: error.message,
    });
  }
};

/**
 * Restock a sweet (Admin only)
 * POST /api/sweets/:id/restock
 */
export const restockSweet = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid quantity",
      });
    }

    const sweet = await Sweet.findById(id);

    if (!sweet) {
      return res.status(404).json({
        success: false,
        message: "Sweet not found",
      });
    }

    sweet.quantity += quantity;
    await sweet.save();

    res.json({
      success: true,
      message: "Sweet restocked successfully",
      data: sweet,
    });
  } catch (error) {
    console.error("Error restocking sweet:", error);
    res.status(500).json({
      success: false,
      message: "Error restocking sweet",
      error: error.message,
    });
  }
};
