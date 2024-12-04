"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_connection_1 = require("../db/db-connection");
const helmetRoute = async (app) => {
    app.get("/getHelmet", async (request, reply) => {
        try {
            const text = `
      SELECT * FROM helmet`;
            const result = await (0, db_connection_1.query)(text);
            const helmets = result.rows.map((helmet) => {
                return {
                    ...helmet,
                    status: helmet.status ? "Ativo" : "Desativo",
                };
            });
            reply.send(helmets);
        }
        catch (err) {
            console.log(err);
            reply.code(500).send({ error: "Erro ao buscar capacetes" });
        }
    });
    app.get("/getSetor", async (request, reply) => {
        try {
            const text = `
      SELECT nome_setor FROM tipos_setores`;
            const result = await (0, db_connection_1.query)(text);
            reply.send(result.rows);
        }
        catch (err) {
            console.log(err);
            reply.code(500).send({ error: "Erro ao buscar os setores" });
        }
    });
    app.post("/createHelmet", async (request, reply) => {
        const { user_name, setor, mac_address } = request.body; // Incluindo mac_address
        try {
            const text = `
        INSERT INTO helmet (user_name, setor, mac_address)  -- Adicionando mac_address à tabela
        VALUES ($1, $2, $3)
        RETURNING *
      `;
            const values = [user_name, setor, mac_address]; // Incluindo mac_address nos valores
            const result = await (0, db_connection_1.query)(text, values);
            reply.code(201).send({ message: "Usuario criado com sucesso", user: result.rows[0] });
        }
        catch (err) {
            console.error(err);
            reply.code(500).send({ error: "Erro ao cadastrar capacete" });
        }
    });
};
exports.default = helmetRoute;
//# sourceMappingURL=helmet-route.js.map