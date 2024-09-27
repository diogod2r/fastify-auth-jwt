import dotenv from "dotenv";

dotenv.config();

const environment = {
  srvPORT: process.env.srvPORT,
  srvHOST: process.env.srvHOST,
  dbHOST: process.env.dbHOST,
  dbUSER: process.env.dbUSER,
  dbNAME: process.env.dbNAME,
  dbPASS: process.env.dbPASS,
  dbPORT: process.env.dbPORT,
  secretKeyA: process.env.secretKeyA,
  secretKeyR: process.env.secretKeyR,
};

export default environment;