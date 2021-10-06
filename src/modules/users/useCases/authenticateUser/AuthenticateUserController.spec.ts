import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";

import getConnection from "../../../../database";

let connection: Connection;
describe("Authenticate User", () => {

  beforeAll( async () => {
    connection = await getConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

  it("Should be able to authenticate an user", async () => {
    await request(app).post("/api/v1/users").send({
      "name": "teste",
      "email": "teste3@teste.com",
      "password": "1234"
    });

    const response = await request(app).post("/api/v1/sessions").send({
      "email": "teste3@teste.com",
      "password": "1234"
    });

    expect(response.status).toBe(200);
  });

  it("Should not be able to authenticate an user with wrong email", async () => {
    await request(app).post("/api/v1/users").send({
      "name": "teste",
      "email": "teste4@teste.com",
      "password": "1234"
    });

    const response = await request(app).post("/api/v1/sessions").send({
      "email": "testea@teste.com",
      "password": "1234"
    });

    expect(response.status).toBe(401);
  });

  it("Should not be able to authenticate an user with wrong password", async () => {
    await request(app).post("/api/v1/users").send({
      "name": "teste",
      "email": "teste5@teste.com",
      "password": "1234"
    });

    const response = await request(app).post("/api/v1/sessions").send({
      "email": "teste5@teste.com",
      "password": "1235"
    });

    expect(response.status).toBe(401);
  });
})
