import { query } from "../db/db-connection";
import type { FastifyInstance } from "fastify";
import type { Location, TypeIncident } from "../interfaces/incident-interface";

const notificationList = async (app: FastifyInstance) => {
  app.get("/listLocation", async (request, reply) => {
    try {
      // Query para obter os dados das tabelas
      const locationQuery = "SELECT * FROM locationincident";
      const typeIncidentQuery = "SELECT * FROM typeincident";

      // Executa as queries em paralelo
      const [locationResult, typeIncidentResult] = await Promise.all([query(locationQuery), query(typeIncidentQuery)]);

      // Monta a resposta tipada
      const response: {
        typeIncident: TypeIncident[];
        locationIncident: Location[];
      } = {
        typeIncident: typeIncidentResult.rows,
        locationIncident: locationResult.rows,
      };

      console.log(response);

      reply.send(response);
    } catch (error) {
      console.error(error);
      reply.code(500).send({ error: "Erro ao carregar os dados" });
    }
  });
};

export default notificationList;
