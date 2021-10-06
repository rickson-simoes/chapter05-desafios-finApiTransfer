import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";

import getConnection from "../../../../database";

let connection: Connection;
describe("Show user profile", () => {

  beforeAll( async () => {
    connection = await getConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

  it("Should be able to show the user profile", async () => {
    await request(app).post("/api/v1/users").send({
      "name": "teste",
      "email": "teste6@teste.com",
      "password": "1234"
    });

    const responseAuth = await request(app).post("/api/v1/sessions").send({
      "email": "teste6@teste.com",
      "password": "1234"
    });

    const { user, token } = responseAuth.body;

    const response = await request(app).get("/api/v1/profile")
    .set('Authorization', `bearer ${token}`);

    const { id, email } = response.body;

    const userIdShouldBeEqual = id === user.id;
    const userEmailShouldBeEqual = email === user.email;

    expect(userIdShouldBeEqual).toBe(true);
    expect(userEmailShouldBeEqual).toBe(true);
  });
});
