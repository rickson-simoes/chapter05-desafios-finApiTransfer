import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let usersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("User authentication", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
  })

  it("Should authenticate an user", async () => {
    const newUser = {
      name: "rick",
      email: "rick@teste.com",
      password: "teste123"
    }

    await createUserUseCase.execute(newUser);

    const user = {
      email: "rick@teste.com",
      password: "teste123"
    }

    const authenticateUser = await authenticateUserUseCase.execute(user);

    expect(authenticateUser).toHaveProperty("token");
  });

  it("Should not authenticate an user with wrong email", async () => {
    const newUser = {
      name: "rick",
      email: "rick@teste.com",
      password: "teste123"
    }

    await createUserUseCase.execute(newUser);

    const user = {
      email: "ricka@teste.com",
      password: "teste123"
    }

    expect(async() => {
      await authenticateUserUseCase.execute(user)
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("Should not authenticate an user with wrong password", async () => {
    const newUser = {
      name: "rick",
      email: "rick@teste.com",
      password: "teste123"
    }

    await createUserUseCase.execute(newUser);

    const user = {
      email: "rick@teste.com",
      password: "teste1234"
    }

    expect(async() => {
      await authenticateUserUseCase.execute(user)
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
})
