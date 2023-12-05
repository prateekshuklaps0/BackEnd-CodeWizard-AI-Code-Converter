const express = require("express");
const cors = require("cors");
const { default: axios } = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT;

// code convertor
app.post("/convert", async (req, res) => {
  const { language, code } = req.body;

  await axios
    .post(
      "https://api.openai.com/v1/chat/completions",
      {
        messages: [
          {
            role: "user",
            content: `Act as a code converter, You have to convert the given code into the ${language} language and do not need to provide an explanation of the code alter the code and provide the converted code only, do not write anything extra other than the converted code, also you need not to provide any note as well
         the code that you need to convert is : ${code}`,
          },
        ],
        model: "gpt-3.5-turbo",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAPI_URL}`,
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      res.json({
        msg: "Response Created",
        response: response.data.choices[0].message.content,
      });
    })
    .catch((error) => {
      console.log(error);
      res.send({ Error_Message: "There is an error in Backend", error: error});
    });
});

//code Debugger
app.post("/debug", async (req, res) => {
  const { code } = req.body;

  await axios
    .post(
      "https://api.openai.com/v1/chat/completions",
      {
        messages: [
          {
            role: "user",
            content: `Act as a Professional code Debugger, You have to debug the given code with less and precise Explanation and need not go into deep explanation.
                The given code is :${code}`,
          },
        ],
        model: "gpt-3.5-turbo",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAPI_URL}`,
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      res.json({
        msg: "Response Created",
        response: response.data.choices[0].message.content,
      });
    })
    .catch((err) => {
      console.log(err);
      res.send({ Error_Message: "There is an error in Backend", err: err });
    });
});

//code Quality Checker
app.post("/qualityCheck", async (req, res) => {
  const { code } = req.body;

  await axios
    .post(
      "https://api.openai.com/v1/chat/completions",
      {
        messages: [
          {
            role: "user",
            content: `
            
            Act as a Professional Developer and code quality checker, you have to check the quality of code on the following basis :
            
            1. Code Consistency: Evaluate the code for consistent coding style, naming conventions, and formatting.
            2. Code Performance: Assess the code for efficient algorithms, optimized data structures, and overall performance considerations.
            3. Code Documentation: Review the code for appropriate comments, inline documentation, and clear explanations of complex logic.
            4. Error Handling: Examine the code for proper error handling and graceful error recovery mechanisms.
            5. Code Testability: Evaluate the code for ease of unit testing, mocking, and overall testability.
            6. Code Modularity: Assess the code for modular design, separation of concerns, and reusability of components.
            7. Code Complexity: Analyze the code for excessive complexity, convoluted logic, and potential code smells.
            8. Code Duplication: Identify any code duplication and assess its impact on maintainability and readability.
            9. Code Readability: Evaluate the code for readability, clarity, and adherence to coding best practices.
            
            Provide a summary  of code quality and a report showing the percentage-wise evaluation for each parameter mentioned above.
            
            the following code is : ${code} `,
          },
        ],
        model: "gpt-3.5-turbo",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAPI_URL}`,
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      res.json({
        msg: "Response Created",
        response: response.data.choices[0].message.content,
      });
    })
    .catch((error) => {
      console.log(error);
      res.send({ Error_Message: "There is an error in Backend", error:error });
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
