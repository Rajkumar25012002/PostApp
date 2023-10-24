import pkg from "jsonwebtoken";
const { sign } = pkg;

export const createAccesToken = (userid,userRole) => {
  return sign({ userid ,userRole}, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};
export const createRefreshToken = (userid) => {
  return sign({ userid }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};
export const sendAccessToken = (res, req, accessToken) => {
  res.send({
    accessToken,
    message: "Your account has been logged in successfully",
  });
};
export const sendRefreshToken = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    domain:"rockys-post-app.netlify.app",
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/user/refresh_token",
  });
};
