"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_connection_1 = require("../db/db-connection");
const loginRoute = async (app) => {
    app.post("/login", async (request, reply) => {
        const { email, password } = request.body;
        try {
            const text = `
            SELECT * from login WHERE email = $1
        `;
            const result = await (0, db_connection_1.query)(text, [email]);
            if (result.rows.length === 0) {
                return reply.code(401).send({ error: "Nome de usuário ou senha incorretos" });
            }
            const user = result.rows[0];
            if (password !== user.password) {
                return reply.code(401).send({ error: "Nome de usuário ou senha incorretos" });
            }
            const redirectUrl = "capacetes.html";
            return { ok: true, message: "Login realizado com sucesso", redirectUrl };
        }
        catch (err) {
            console.log(err);
            reply.code(500).send({ error: "Erro ao realizar login" });
        }
    });
    app.post("/createLogin", async (request, reply) => {
        const { email, password } = request.body;
        try {
            const text = `
            SELECT * from login WHERE email = $1
        `;
            const existingUser = await (0, db_connection_1.query)(text, [email]);
            if (existingUser.rows.length > 0) {
                return reply.code(401).send({ error: "Email ja está em uso" });
            }
            const sql = `
        INSERT INTO login (email, password)
        VALUES ($1, $2)
        returning *
      `;
            const values = [email, password];
            const result = await (0, db_connection_1.query)(sql, values);
            reply.code(201).send({ message: "Usuario criado com sucesso", user: result.rows[0] });
        }
        catch (err) {
            console.log(err);
            reply.code(500).send({ error: "Erro ao realizar login" });
        }
    });
};
exports.default = loginRoute;
//# sourceMappingURL=login-route.js.map