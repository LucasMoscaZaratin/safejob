import { query } from "../db/db-connection";
import type { FastifyInstance } from "fastify";
import type { Login } from "../interfaces/login-interface";

const loginRoute = async (app: FastifyInstance) => {
  app.post<{ Body: Login }>("/login", async (request, reply) => {
    const { email, password } = request.body;

    try {
      const text = `
            SELECT * from login WHERE email = $1
        `;
      const result = await query(text, [email]);
      if (result.rows.length === 0) {
        return reply.code(401).send({ error: "Nome de usuário ou senha incorretos" });
      }
      const user = result.rows[0];

      if (password !== user.password) {
        return reply.code(401).send({ error: "Nome de usuário ou senha incorretos" });
      }
      const redirectUrl = "capacetes.html";

      return { ok: true, message: "Login realizado com sucesso", redirectUrl };
    } catch (err) {
      console.log(err);
      reply.code(500).send({ error: "Erro ao realizar login" });
    }
  });
  app.post<{ Body: Login }>("/createLogin", async (request, reply) => {
    const { email, password } = request.body;

    try {
      const text = `
            SELECT * from login WHERE email = $1
        `;
      const existingUser = await query(text, [email]);
      if (existingUser.rows.length > 0) {
        return reply.code(401).send({ error: "Email ja está em uso" });
      }
      const sql = `
        INSERT INTO login (email, password)
        VALUES ($1, $2)
        returning *
      `;
      const values = [email, password];

      const result = await query(sql, values);
      reply.code(201).send({ message: "Usuario criado com sucesso", user: result.rows[0] });
    } catch (err) {
      console.log(err);
      reply.code(500).send({ error: "Erro ao realizar login" });
    }
  });
};

export default loginRoute;
