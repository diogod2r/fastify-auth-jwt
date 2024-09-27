const onRequestHook = async (request, reply) => {
  reply.header('Access-Control-Allow-Origin', '*');
  reply.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  reply.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  reply.header("Access-Control-Allow-Credentials", "true");
  if (request.method === 'OPTIONS') {
    reply.status(204).send();
    return;
  }
};

export default onRequestHook;