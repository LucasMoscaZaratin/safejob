import { query } from "../db/db-connection";
import type { FastifyInstance } from "fastify";
import type { Notification } from "../interfaces/notification-interface";

const notificationRoute = async (app: FastifyInstance) => {
  app.post<{ Body: Notification }>("/createNotification", async (request, reply) => {
    const { dia, hora, localizacao, type, user_name } = request.body;

    const text = `
            INSERT INTO notification (dia, hora, localizacao, type, user_name)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
    const values = [dia, hora, localizacao, type, user_name];

    try {
      const result = await query(text, values);
      reply.code(201).send(result.rows[0]);
    } catch (err) {
      console.log(err);
      reply.code(500).send({ error: "Erro ao inserir a notificação" });
    }
  });
  app.get("/getAllNotifications", async (request, reply) => {
    try {
      const text = `
            SELECT * FROM notification
        `;
      const result = await query(text);
      reply.send(result.rows);
    } catch (err) {
      reply.code(500).send({ error: "Erro ao buscar notificações" });
    }
  });
};

export default notificationRoute;
