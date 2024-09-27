import pg from 'pg';
import environment from "../scripts/env.js";

const { dbHOST, dbUSER, dbNAME, dbPASS, dbPORT } = environment;
const { Pool } = pg;
const db = new Pool({
    host: dbHOST,
    user: dbUSER,
    database: dbNAME,
    password: dbPASS,
    port: dbPORT
});

export default db;
