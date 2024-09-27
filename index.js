import fastify from "fastify";
import fastifyCookie from "@fastify/cookie";
import endpoints from './src/scripts/endpoints.js';
import environment from "./src/scripts/env.js";
import onRequestHook from './src/hooks/onRequest.js';

const { srvPORT, srvHOST } = environment;
const server = fastify();
server.register(fastifyCookie);
server.addHook('onRequest', onRequestHook);

endpoints.forEach(route => {
  server.route(route);
});
 
server.listen({ port: srvPORT, host: srvHOST }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Servidor rodando em http://${srvHOST}:${srvPORT}`);
});