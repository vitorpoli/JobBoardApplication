import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import applicationRoutes from "./routes/application.js";
import jobsRouter from "./routes/jobs.js";
import loginRouter from "./routes/login.js"; // Importando a rota de login

const app = express();
const port = 3001;

// Middleware para aceitar JSON e configurar CORS
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" })); 

// Configuração do Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "PARK-ing API",
      version: "1.0.0",
      description: "API for managing parking application",
      license: {
        name: "Licensed Under MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
    },
    servers: [
      {
        url: `http://localhost:${port}`, // URL base da API
      },
    ],
  },
  apis: ["./routes/*.js"], // Define a localização dos arquivos com anotações Swagger
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // Configura a documentação Swagger

// Configuração das rotas da aplicação
app.use("/api", loginRouter);  // Agora a rota de login é '/api/login', conforme alterado
app.use("/api", applicationRoutes);  // Rota principal da aplicação (ajuste conforme necessário)
app.use("/api/jobs", jobsRouter);  // Rota para vagas de emprego (ajuste conforme necessário)

// Inicia o servidor
app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/docs`);
});
