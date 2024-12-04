const __importDefault = (mod) => (mod?.__esModule ? mod : { default: mod });

Object.defineProperty(exports, "__esModule", { value: true });
exports.query = exports.pool = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.pool = new pg_1.Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: Number(process.env.PGPORT),
});

const query = (text, params) => {
  return exports.pool.query(text, params);
};
exports.query = query;
//# sourceMappingURL=db-connection.js.map
