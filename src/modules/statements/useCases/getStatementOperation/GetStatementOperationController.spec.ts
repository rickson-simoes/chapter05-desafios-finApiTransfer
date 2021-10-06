import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";

import getConnection from "../../../../database";

let connection: Connection;
describe("Get Balance", () => {

  beforeAll( async () => {
    connection = await getConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

  it("Should be able to get the balance", async () => {
    await request(app).post("/api/v1/users").send({
      "name": "teste",
      "email": "teste10@teste.com",
      "password": "1234"
    });

    const responseAuth = await request(app).post("/api/v1/sessions").send({
      "email": "teste10@teste.com",
      "password": "1234"
    });

    const { token } = responseAuth.body;

    const statementResponse = await request(app).post("/api/v1/statements/deposit")
    .send({
      amount: 500,
      description: "depósito de 500 reais"
    })
    .set("Authorization", `bearer ${token}`);

    const response = await request(app).get(`/api/v1/statements/${statementResponse.body.id}`)
    .set("Authorization", `bearer ${token}`);

    const {id} = response.body;

    const statementIdShouldBeEqual = id === statementResponse.body.id;

    expect(statementIdShouldBeEqual).toBe(true);
  });
});
