const express = require("express");
const router = express.Router();
const openai = require("../config/openai");
const Test = require("../models/Test");
const { error, success } = require("../helpers/httpResponses");
const { extractJSONS } = require("../helpers/utils");

const content = `Eres ChatGPT, un gran modelo de lenguaje entrenado por OpenAI. Responde de la forma más concisa posible. 
                 Límite de conocimientos: {límite de conocimientos} Fecha actual: {fecha_actual}`;

router.post("/", async (req = express.Request, res = express.response) => {
  try {
    const { title, skillsList, description, id } = req.body;
    let skills = "";
    if (skillsList && skillsList?.length > 0) {
      skills += " El test debe contener temas relacionados a: ";
      skills += skillsList.map((sk) => sk.skill).join(", ") + ". ";
      console.log(skills);
    }

    const result = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      temperature: 0.6,
      messages: [
        {
          role: "system",
          content,
        },
        {
          role: "user",
          content: `Crea un test de evaluación técnica para un puesto de "${title}".${skills}
                      Crea la prueba solamente de los conocimientos o habiladades que requiere el puesto segun la descripción. 
                      Debe ser conciso y sin errores. No quiero que escribas textos demás, solo quiero que me respondas directamente con el formato JSON especificado. 
                      Quiero que el test de evaluación tenga un formato JSON, que empiece con '---' y termine con '---' con la siguiente estructura:
                    ---
                    [{
                      "question" : "titulo de la pregunta...",
                      "options" : ["opcion 1", "opcion 2"],
                      "validOptionIndex": [0, 2, 1]
                    }, 
                    {
                      ...
                    }] ---`,
        },
      ],
    });

    const data = result.data.choices[0].message.content;
    const jsons = extractJSONS(data);
    const test = Array.isArray(jsons?.[0]) ? jsons.flat() : jsons;
    const basicTest = await Test.create({
      jobId: id,
      questions: test,
    });
    const testProtected = basicTest.toObject();

    // users cant see the correct answers
    testProtected.questions.forEach((q) => delete q.validOptionIndex);

    success(res, testProtected, 201);
  } catch (err) {
    error(res, err, 500);
    console.log(err);
  }
});

router.post("/check", async (req = express.Request, res = express.response) => {
  try {
    const { jobId, answers } = req.body;
    const test = await Test.findOne({ jobId }).lean();

    if (!test) {
      return success(res, { ok: false, message: "No se encontro la prueba" });
    }

    const questions = test.questions.map((question, index) => {
      const userAnswer = answers[index];
      console.log({ userAnswer });
      const isSuccess = question.validOptionIndex.includes(
        userAnswer.selectedOption
      );

      return {
        ...question,
        selectedOption: userAnswer.selectedOption,
        index,
        isSuccess,
      };
    });

    const topics = questions.map((q) => q.question).join(", ");
    const successQuestions = questions.filter((q) => q.isSuccess).length;

    const result = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      temperature: 0.6,
      messages: [
        {
          role: "system",
          content,
        },
        {
          role: "user",
          content: `Hazme una evaluación de una prueba sobre ${topics}. 
                    Donde yo respondí correctamente ${successQuestions} preguntas de ${questions.length}.
                    Si puedes, califícame del 1 al 10, donde 1 es realmente malo y 10 es realmente bueno.
                    Además, genera resumidamente temas relacionados para que pueda estudar y mejorar técnicamente en dichos temas.
                    `,
        },
      ],
    });

    const rating = result.data.choices[0].message.content;

    success(res, { result: questions, rating });
  } catch (err) {
    error(res, err.message);
  }
});

module.exports = router;
