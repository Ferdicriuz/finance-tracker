const Transaction = require("../models/Transaction");
const User = require("../models/User");

// Create a transaction
exports.createTransaction = async (req, res, next) => {
  try {
    const { amount, type, description } = req.body;

    // Validation
    if (amount <= 0) return res.status(400).json({ message: "Amount must be positive" });

    const transaction = await Transaction.create({
      user: req.user._id,
      amount,
      type,
      description,
    });

    // Adjust user balance
    if (type === "credit") {
      req.user.balance += amount;
    } else {
      req.user.balance -= amount;
    }
    await req.user.save();

    res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
};

// Get transactions with optional pagination & filtering
exports.getTransactions = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, type, start, end } = req.query;
    const filter = { user: req.user._id };

    if (type) filter.type = type;
    if (start || end) filter.createdAt = {};
    if (start) filter.createdAt.$gte = new Date(start);
    if (end) filter.createdAt.$lte = new Date(end);

    const transactions = await Transaction.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Transaction.countDocuments(filter);

    res.status(200).json({
      page: Number(page),
      limit: Number(limit),
      total,
      transactions,
    });
  } catch (error) {
    next(error);
  }
};

// Update a transaction
exports.updateTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amount, type, description } = req.body;

    const transaction = await Transaction.findOne({ _id: id, user: req.user._id });
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

    // Adjust balance: reverse old transaction
    if (transaction.type === "credit") req.user.balance -= transaction.amount;
    else req.user.balance += transaction.amount;

    // Update fields
    if (amount !== undefined) transaction.amount = amount;
    if (type) transaction.type = type;
    if (description) transaction.description = description;

    // Adjust balance: apply new transaction
    if (transaction.type === "credit") req.user.balance += transaction.amount;
    else req.user.balance -= transaction.amount;

    await transaction.save();
    await req.user.save();

    res.status(200).json(transaction);
  } catch (error) {
    next(error);
  }
};

// Delete a transaction
exports.deleteTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findOne({ _id: id, user: req.user._id });
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

    // Adjust balance
    if (transaction.type === "credit") req.user.balance -= transaction.amount;
    else req.user.balance += transaction.amount;

    await req.user.save();
    await transaction.remove();

    res.status(200).json({ message: "Transaction deleted" });
  } catch (error) {
    next(error);
  }
};