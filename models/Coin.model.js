const { Schema, model } = require("mongoose");

const coinSchema = new Schema({
  coin: String,
  purchasedPrice: Number,
  quantity: Number,
  purchaseValue: Number,
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Coin = model("Coin", coinSchema);

module.exports = Coin;
