import pkg from "jsonwebtoken";
import jwtDecode from "jwt-decode";
// const { verify } = pkg;
import jwt from "jsonwebtoken";
import ROLE from "./Roles.js";
export const isAuth = (req) => {
  const authorization = req.headers["authorization"];
  
  if (!authorization) throw new Error("You need to login");
  const token = authorization && authorization.split(" ")[1];
  if (token == null) return false;
  
  const { userid } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  return userid;
};
export const isAuthorizedUserUpdate = (req, res, next) => {
  const authorization = req.headers["authorization"];
  const token = authorization && authorization.split(" ")[1];
  const { userid, userRole } = jwtDecode(token);
  if (req.body.userid === userid || userRole === ROLE.ADMIN) {
    next();
  } else {
    return res.status(400).send({
      error: "Bad Request",
      message: "You aren't authorized to update this user",
    });
  }
};

export const isAuthorizedForPost = (req, res, next) => {
  const authorization = req.headers["authorization"];
  const token = authorization && authorization.split(" ")[1];
  const { userid, userRole } = jwtDecode(token);
  if (
    req.body.editor === userid ||
    userRole === ROLE.ADMIN ||
    userRole === ROLE.EDITOR
  ) {
    next();
  } else {
    return res.status(400).send({
      error: "Bad Request",
      message: "You aren't authorized to make changes to this post",
    });
  }
};
