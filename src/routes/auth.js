import jwt from "jsonwebtoken";
import db from "../services/database.js";
import environment from "../scripts/env.js";
const { secretKeyA, secretKeyR } = environment;

export default async function auth(request, reply) {
  try {
    const { access_token, refresh_token, stay } = request.cookies || {
      access_token: access_token ? access_token : false,
      refresh_token: refresh_token ? refresh_token : false,
      stay: stay ? stay : false,
    };
    if (!checkJwt(refresh_token) || !checkJwt(access_token)) {
      console.log(`Token não fornecido ou formato invalido.`);
      return reply
        .status(400)
        .send({ "Falha de requisição": "solicitação invalida!" });
    }
    const stayB = checkStay(stay);
    if (stayB === "400") {
      console.log(`stay não fornecido ou formato invalido`);
      return reply
        .status(400)
        .send({ "Falha de requisição": "solicitação invalida!" });
    }

    try {
      const userReq = await verifyToken(access_token, secretKeyA);
      console.log(`usuario ${userReq.account} está autenticado`);
      return reply.status(200).send({ message: "você está autenticado" });
    } catch (err) {
      console.log(`Erro de token: `, err.message);
      const typeError = await handleError(
        err,
        refresh_token,
        secretKeyR,
        reply
      );
      if (!typeError) {
        await userClearCookie(reply);
        return reply.status(401).send({ message: "token inválido" });
      }
      await userSetCookie(reply, typeError.token, typeError.rftoken, stayB);
      console.log(`Tokens atualizados`);
      return reply
        .status(200)
        .send({
          message: "seus tokens foram atualizados, você permanece autenticado",
        });
    }
  } catch (error) {
    console.error(`Erro ao obter os dados:`, error);
    return reply
    .status(500)
    .send({ "Falha de requisição": "erro interno do servidor!" });
  }
}

async function verifyToken(token, secret) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
}

async function getUserByUsername(user) {
  try {
    const sql = `SELECT "user" FROM users WHERE "user" = $1`;
    const result = await db.query(sql, [user]);
    if (result.rowCount === 1) {
      return result.rows[0];
    }
    return false;
  } catch (error) {
    console.error(`Erro ao obter os dados do usuario ${user}:`, error);
    return false;
  }
}

async function handleError(err, refresh_token, secretKeyR, reply) {
  const errorHandlers = {
    TokenExpiredError: async () =>
      await verifyRefreshToken(refresh_token, secretKeyR, reply),
    default: async () => {
      await userClearCookie(reply);
      console.log(`Token inválido.`);
      return false;
    },
  };
  const handleStatus = errorHandlers[err.name] || errorHandlers["default"];
  try {
    return await handleStatus();
  } catch (error) {
    console.error("Erro ao lidar com o token:", error);
    return false;
  }
}

async function verifyRefreshToken(refresh_token, secretKeyR, reply) {
  try {
    const validRefresh = await verifyToken(refresh_token, secretKeyR);
    const findUser = await getUserByUsername(validRefresh.account);
    if (!findUser) {
      console.log(
        `Usuario: ${validRefresh.account} não encontrado ou falha com o banco de dados`
      );
      return reply
        .status(401)
        .send({ "Falha de requisição": "acesso não autorizado!" });
    }
    if (validRefresh) {
      const { token, rftoken } = await generateTokens(findUser);
      return { token, rftoken };
    }
    return false;
  } catch (err) {
    console.log(`${err.message}`);
    return false;
  }
}

async function generateTokens(findUser) {
  try {
    const userAccount = findUser.user;
    const token = jwt.sign({ account: userAccount }, secretKeyA, {
      expiresIn: "1200s",
    });
    const rftoken = jwt.sign({ account: userAccount }, secretKeyR, {
      expiresIn: "7d",
    });
    return { token, rftoken };
  } catch (error) {
    console.error("Erro ao gerar tokens JWT:", error);
    throw new Error("Erro ao gerar tokens");
  }
}

const checkStay = (x) => {
  if (x === "true" || x === true) {
    return true;
  }
  if (x === "false" || x === false) {
    return false;
  }
  return "400";
};

const checkJwt = (x) => {
  if (typeof x !== "string") {
    return false;
  }
  const regex = /^[a-zA-Z0-9\-_\.]+$/;
  return regex.test(x);
};

const userSetCookie = async (reply, token, rftoken, stayB) => {
  try {
    const cookieOptions = {
      httpOnly: true,
    };
    if (stayB) {
      const expires = new Date();
      expires.setDate(expires.getDate() + 7);
      cookieOptions.expires = expires;
    }
    reply.setCookie("access_token", token, cookieOptions);
    reply.setCookie("refresh_token", rftoken, cookieOptions);
    reply.setCookie("stay", stayB, cookieOptions);
    return true;
  } catch (error) {
    console.error("Erro ao salvar os cookies");
    return false;
  }
};

const userClearCookie = async (reply) => {
  try {
    reply.clearCookie('access_token');
    reply.clearCookie('refresh_token');
    reply.clearCookie('stay');
    return true;
  } catch (error) {
    console.error('error ao limpar os cookies', error);
    return false;
  }
};
