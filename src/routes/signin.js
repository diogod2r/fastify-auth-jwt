import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../services/database.js";
import environment from "../scripts/env.js";
const { secretKeyA, secretKeyR } = environment;

export default async function signin(request, reply) {
  try {
    const { user, password, stay } = request.body || {
      user: user ? user : false,
      password: password ? password : false,
      stay: stay ? stay : false,
    };

    if (!checkUser(user)) {
      console.log(`Usuario não fornecido ou formato invalido`);
      return reply
        .status(400)
        .send({ "Falha de requisição": "solicitação invalida!" });
    }
    if (!checkPass(password)) {
      console.log(`Senha não fornecida ou formato invalido`);
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

    const findUser = await getUserByUsername(user);
    if (!findUser) {
      console.log(
        `Usuario: ${user} não encontrado ou falha com o banco de dados`
      );
      return reply
        .status(401)
        .send({ "Falha de requisição": "acesso não autorizado!" });
    }

    const isPasswordMatch = await bcrypt.compare(password, findUser.password);
    if (!isPasswordMatch) {
      console.log(`Senha incorreta para o usuário: ${user}`);
      return reply
        .status(401)
        .send({ "Falha de requisição": "acesso não autorizado!" });
    }

    const { token, rftoken } = await generateTokens(findUser);

    const cookies = await userSetCookie(reply, token, rftoken, stayB);
    if (!cookies) {
      return reply.status(500).send({ error: `Erro ao salvar os cookies` });
    }
    console.log(`Usuario: ${user} fez login com sucesso`);
    return reply
      .status(200)
      .send({ Sucesso: "acesso autorizado tokens gerados!" });
  } catch (error) {
    console.error(`Erro ao obter os dados:`, error);
    return reply.status(500).send({ error: `Erro ao obter os dados` });
  }
}

async function getUserByUsername(user) {
  try {
    const sql = `SELECT "user", "password" FROM users WHERE "user" = $1`;
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

const checkUser = (x) => {
  if (typeof x !== "string") {
    return false;
  }
  const regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  return regex.test(x);
};

const checkPass = (x) => {
  if (typeof x !== "string") {
    return false;
  }
  const regex = /^[^\s]+$/;
  return regex.test(x);
};

const checkStay = (x) => {
  if (x === "true" || x === true) {
    return true;
  }
  if (x === "false" || x === false) {
    return false;
  }
  return "400";
};
