// eslint-disable-next-line import/no-extraneous-dependencies
import csrf from "csurf";

const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  },
});

export default csrfProtection;