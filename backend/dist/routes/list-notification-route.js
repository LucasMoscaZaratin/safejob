"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_connection_1 = require("../db/db-connection");
const notificationList = async (app) => {
    app.get("/listLocation", async (request, reply) => {
        try {
            // Query para obter os dados das tabelas
            const locationQuery = "SELECT * FROM locationincident";
            const typeIncidentQuery = "SELECT * FROM typeincident";
            // Executa as queries em paralelo
            const [locationResult, typeIncidentResult] = await Promise.all([(0, db_connection_1.query)(locationQuery), (0, db_connection_1.query)(typeIncidentQuery)]);
            // Monta a resposta tipada
            const response = {
                typeIncident: typeIncidentResult.rows,
                locationIncident: locationResult.rows,
            };
            console.log(response);
            reply.send(response);
        }
        catch (error) {
            console.error(error);
            reply.code(500).send({ error: "Erro ao carregar os dados" });
        }
    });
};
exports.default = notificationList;
//# sourceMappingURL=list-notification-route.js.map