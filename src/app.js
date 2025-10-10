require("./services/NotificationService").startNotificationJob();
const express = require("express");
const dbcon = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const groupRoutes = require("./routes/groupRoutes");
const contributionRoutes = require("./routes/contributionRoutes");
const errorHandler = require("./middlewares/errorHandler");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");

require("./services/CronService").startCronJobs();

require("dotenv").config({ path: "../.env" });

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

dbcon();

app.get("/", (req, res) => {
  res.send("IT IS WORKING!!!!");
});

app.use("/api/users", userRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/contributions", contributionRoutes);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TireLire-API",
      version: "1.0.0",
      description:
        'TireLire APP is A backend REST API to serve a "DART"(Collaboratif Money Savings)',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: [path.join(__dirname, "routes/*.js")],
};

const swaggerSpec = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((req, res) => {
  return res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server Started on PORT: ${port}`);
});

module.exports = app;
