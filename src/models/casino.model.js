import mongoose from "mongoose";

const casinoSchema = mongoose.Schema(
  {
    nombreCasino: {
      type: String,
      required: true,
      trim: true,
    },
    imgCasino: {
      url: String,
      public_id: String,
    },
    ciudadCasino: {
      type: String,
      required: true,
      trim: true,
    },
    direccionCasino: {
      type: String,
      required: true,
      trim: true,
    },
    documentacionCasino: {
      url: String,
      public_id: String,
    },
    maquinas: [{ type: mongoose.Schema.Types.ObjectId, ref: "Maquinas" }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Casinos", casinoSchema);
