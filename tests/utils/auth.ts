import app from "../../src/app";
import supertest from "supertest";

const request = supertest(app);

const getAdminToken = async (): Promise<string> => {
  await request.post("/api/auth/register").send({ pwd: "12345", email: "admin@gmail.com" });
  const res = await request.post("/api/auth/login").send({ pwd: "12345", email: "admin@gmail.com" });
  const adminToken = `Bearer ${res.body.accessToken}`;
  return adminToken;
};

export { getAdminToken };
