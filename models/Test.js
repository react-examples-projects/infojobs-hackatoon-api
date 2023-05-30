const { Schema, model } = require("mongoose");
const TestSchema = new Schema(
  {
    jobId: {
      type: String,
      required: [true, "El id de la oferta es obligatoria"],
    },
    questions: [
      {
        question: {
          type: String,
          required: [true, "La pregunta es obligatoria"],
          trim: true,
        },
        options: {
          type: [String],
          required: [true, "Las opciones son obligatorias"],
        },
        validOptionIndex: {
          type: [Number],
          required: [true, "La opcion correcta es obligatoria"],
        },
      },
    ],
  },
  { timestamps: { updatedAt: false } }
);

module.exports = model("Test", TestSchema);
