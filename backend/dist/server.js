const __importDefault = (mod) => (mod?.__esModule ? mod : { default: mod });

import fastify from "fastify";
import cors from "@fastify/cors";
import loginRoute from "./routes/login-route";
import notificationRoute from "./routes/notification-route";
import workerRoute from "./routes/worker-route";
import helmetRoute from "./routes/helmet-route";
import relatorioRoute from "./routes/relatorio-route";
import listNotificationRoute from "./routes/list-notification-route";
import getHelmetInformationRoute from "./routes/get-helmet-information-route";

const app = fastify();

app.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
});

app.register(loginRoute, { prefix: "/login" });
app.register(notificationRoute, { prefix: "/notification" });
app.register(workerRoute, { prefix: "/worker" });
app.register(helmetRoute, { prefix: "/helmet" });
app.register(relatorioRoute, { prefix: "/report" });
app.register(listNotificationRoute, { prefix: "/list" });
app.register(getHelmetInformationRoute, { prefix: "/impact" });

app.listen({ port: 3000 }).then(() => {
  console.log("Server Running on port 3000");
});
