import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";

import getConnection from "../../../../database";

let connection: Connection;
describe("Create User Controller", () => {

  beforeAll( async () => {
    connection = await getConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

  it("Should be able to create an user", async () => {
    const response = await request(app).post("/api/v1/users").send({
      "name": "teste",
      "email": "teste1@teste.com",
      "password": "1234"
    });

    expect(response.status).toBe(201);
  });

  it("Should not be able to create an user with an email that already exists", async () => {
    await request(app).post("/api/v1/users").send({
      "name": "teste",
      "email": "teste2@teste.com",
      "password": "1234"
    });

    const response = await request(app).post("/api/v1/users").send({
      "name": "teste2",
      "email": "teste2@teste.com",
      "password": "12345"
    });

    expect(response.status).toBe(400);
  });
})
