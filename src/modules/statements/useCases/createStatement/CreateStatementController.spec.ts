import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";

import getConnection from "../../../../database";

let connection: Connection;
describe("Create Statement", () => {

  beforeAll( async () => {
    connection = await getConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

  it("Should be able to deposit", async () => {
    await request(app).post("/api/v1/users").send({
      "name": "teste",
      "email": "teste7@teste.com",
      "password": "1234"
    });

    const responseAuth = await request(app).post("/api/v1/sessions").send({
      "email": "teste7@teste.com",
      "password": "1234"
    });

    const { token } = responseAuth.body;

    const response = await request(app).post("/api/v1/statements/deposit")
    .send({
      amount: 500,
      description: "500 reais"
    })
    .set("Authorization", `bearer ${token}`);

    const { amount } = response.body;

    expect(amount).toBe(500);
  });

  it("Should be able to withdraw", async () => {
    await request(app).post("/api/v1/users").send({
      "name": "teste",
      "email": "teste8@teste.com",
      "password": "1234"
    });

    const responseAuth = await request(app).post("/api/v1/sessions").send({
      "email": "teste8@teste.com",
      "password": "1234"
    });

    const { token } = responseAuth.body;

    await request(app).post("/api/v1/statements/deposit")
    .send({
      amount: 500,
      description: "500 reais"
    })
    .set("Authorization", `bearer ${token}`);

    const response = await request(app).post("/api/v1/statements/withdraw")
    .send({
      amount: 200,
      description: "retirando 200 reais"
    })
    .set("Authorization", `bearer ${token}`);

    const { amount } = response.body;

    expect(amount).toBe(200);
  });

  it("Should not be able to withdraw", async () => {
    await request(app).post("/api/v1/users").send({
      "name": "teste",
      "email": "teste9@teste.com",
      "password": "1234"
    });

    const responseAuth = await request(app).post("/api/v1/sessions").send({
      "email": "teste9@teste.com",
      "password": "1234"
    });

    const { token } = responseAuth.body;

    const response = await request(app).post("/api/v1/statements/withdraw")
    .send({
      amount: 200,
      description: "retirando 200 reais"
    })
    .set("Authorization", `bearer ${token}`);

    expect(response.status).toBe(400);
  });
});
