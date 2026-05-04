const Crypto = require("../models/Crypto");

const getAllCrypto = async (req, res) => {
  try {
    const cryptos = await Crypto.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: cryptos.length,
      data: cryptos,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

const getTopGainers = async (req, res) => {
  try {
    const gainers = await Crypto.find({ change24h: { $gt: 0 } }).sort({
      change24h: -1,
    });
    res.status(200).json({
      success: true,
      count: gainers.length,
      data: gainers,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

const getNewListings = async (req, res) => {
  try {
    const newListings = await Crypto.find().sort({ createdAt: -1 }).limit(20);
    res.status(200).json({
      success: true,
      count: newListings.length,
      data: newListings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

const addCrypto = async (req, res) => {
  const { name, symbol, price, image, change24h } = req.body;

  if (!name || !symbol || price === undefined || !image || change24h === undefined) {
    return res.status(400).json({
      success: false,
      message: "Please provide name, symbol, price, image, and change24h.",
    });
  }

  try {
    const existingCrypto = await Crypto.findOne({
      symbol: symbol.toUpperCase(),
    });
    if (existingCrypto) {
      return res.status(409).json({
        success: false,
        message: `A cryptocurrency with symbol '${symbol.toUpperCase()}' already exists.`,
      });
    }

    const crypto = await Crypto.create({ name, symbol, price, image, change24h });
    res.status(201).json({
      success: true,
      message: `${crypto.name} (${crypto.symbol}) added successfully.`,
      data: crypto,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages[0] });
    }
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

module.exports = { getAllCrypto, getTopGainers, getNewListings, addCrypto };