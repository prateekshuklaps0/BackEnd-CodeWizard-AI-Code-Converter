require("dotenv").config();
const PORT = process.env.PORT || 8080;
const API_KEY = process.env.API_KEY || "";
const openApiUrl = "https://api.openai.com/v1/chat/completions";

const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// HomeRoute
app.get("/", async (req, res) => {
  try {
    res.status(200).json({ msg: "Welcome to CodeWizard!" });
  } catch (error) {
    res.status(500).json({ msg: "Convert Request Error!" });
  }
});

// Code Convertor
app.post("/convert", async (req, res) => {
  try {
    const { code, language } = req.body;
    const Prompt = `
    [ Act as a Professional Developer and Code Converter ],
    You have to convert the given code into the ${language} language as per the Instructions below.
    Instructions : 
    - [ ! IMPORTANT ] If the language in which the given code written is same as the language asked to convert the code into, Just simply tell me in a good and soothing language, do not write any code.
    - Else, convert the code into the language asked.
    - Do not provide any explanation of the code and do not write anything extra other than the converted code, also you need not to provide any note as well.

    Here is the Code that needs to be converted :- ${code}
    `;

    const response = await axios.post(
      openApiUrl,
      {
        messages: [{ role: "user", content: Prompt }],
        model: "gpt-3.5-turbo",
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (
      response &&
      response.data &&
      response.data.choices &&
      response.data.choices[0]
    ) {
      res.status(200).json({
        msg: "Convert Request Successful!",
        response: response.data.choices[0].message.content + "\n" + "",
      });
    } else {
      res.status(500).json({
        msg: "Error from openAPI while converting the code!",
        error_msg:
          response && response.data
            ? response.data
            : "No valid response received",
      });
    }
  } catch (error) {
    console.log("Convert Request Error :-", error);
    res.status(500).json({ msg: "Convert Request Error!" });
  }
});

// Code Debugger
app.post("/debug", async (req, res) => {
  try {
    const { code } = req.body;
    const Prompt = `
    [ Act as a Professional Developer and Code Debugger ],
    You have to debug the given code as per the Instructions below.
    Instructions :
    - [ ! IMPORTANT ] If there is no errors in the given code or it seems to work fine, Just simply tell me that the code seems to work fine in good and soothing language, do not write any code or explaination for that.
    - Else Provide a least and precise markdown explaination of the errors detected in the the given code and how it is fixed with explaination heading: "Following Errors detected in the given Code:".
    - After providing the explaination, give the debugged code and do not write or add without any comments or explaination in between the code lines.
    - Don't go much deep into the explaination, keep it short and precise.

    Here is the Code that needs to be debugged :- ${code}
    `;

    const response = await axios.post(
      openApiUrl,
      {
        messages: [{ role: "user", content: Prompt }],
        model: "gpt-3.5-turbo",
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (
      response &&
      response.data &&
      response.data.choices &&
      response.data.choices[0]
    ) {
      res.status(200).json({
        msg: "Debug Request Successful!",
        response: response.data.choices[0].message.content + "\n" + "",
      });
    } else {
      res.status(500).json({
        msg: "Error from openAPI while debugging the code!",
        error_msg:
          response && response.data
            ? response.data
            : "No valid response received",
      });
    }
  } catch (error) {
    console.log("Debug Request Error :-", error);
    res.status(500).json({ msg: "Debug Request Error!" });
  }
});

// Code Quality Checker
app.post("/qualityCheck", async (req, res) => {
  try {
    const { code } = req.body;
    const Prompt = `
    [ Act as a Professional Developer and Code Quality Checker ],
    Based on the below Criteria and Instructions, you have to check the quality of the given code.

    Criteria:
    - Consistency: Evaluate the code for consistent coding style, naming conventions, and formatting.
    - Performance: Assess the code for efficient algorithms, optimized data structures, and overall performance considerations.
    - Documentation: Review the code for appropriate comments, inline documentation, and clear explanations of complex logic.
    - Error Handling: Examine the code for proper error handling and graceful error recovery mechanisms.
    - Testability: Evaluate the code for ease of unit testing, mocking, and overall testability.
    - Modularity: Assess the code for modular design, separation of concerns, and reusability of components.
    - Complexity: Analyze the code for excessive complexity, convoluted logic, and potential code smells.
    - Duplication: Identify any code duplication and assess its impact on maintainability and readability.
    - Readability: Evaluate the code for readability, clarity, and adherence to coding best practices.

    Instructions :
    - Provide a summary of code quality in visually appealing points.
    - Provide quality check report showing the percentage-wise evaluation for each parameter mentioned above in the Criteria section.
    - In the summary also provide the areas where the code needs to be improved.
    - Don't go much deep into the explaination, keep it short and precise.
    - Use simple english language, do not use complex words.
    - Do not write anything extra other, also you need not to provide any note as well.

    Here is the Code that needs to be quality checked :- ${code}
    `;

    const response = await axios.post(
      openApiUrl,
      {
        messages: [{ role: "user", content: Prompt }],
        model: "gpt-3.5-turbo",
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (
      response &&
      response.data &&
      response.data.choices &&
      response.data.choices[0]
    ) {
      res.status(200).json({
        msg: "Quality Check Request Successful!",
        response: response.data.choices[0].message.content + "\n" + "",
      });
    } else {
      res.status(500).json({
        msg: "Error from openAPI while checking quality of the code!",
        error_msg:
          response && response.data
            ? response.data
            : "No valid response received",
      });
    }
  } catch (error) {
    console.log("Quality Check Request Error :-", error);
    res.status(500).json({ msg: "Quality Check Request Error!" });
  }
});

app.listen(PORT, async () => {
  try {
    console.log(`Server is running on the port: ${PORT}`);
  } catch (error) {
    console.log("Error while setting up the server :-", error);
  }
});
