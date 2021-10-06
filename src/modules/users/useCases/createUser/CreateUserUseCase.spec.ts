import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create user", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
  })

  it("Should create a new user", async () => {
    const user = {
      name: "rick",
      email: "rick@teste.com",
      password: "teste123"
    }

    const createUser = await createUserUseCase.execute(user);

    expect(createUser).toHaveProperty("id");
  });

  it("Should not create a new user with the same email", async () => {
    const user = {
      name: "rick",
      email: "rick@teste.com",
      password: "teste123"
    }

    const user2 = {
      name: "rickson",
      email: "rick@teste.com",
      password: "teste1234"
    }

    await createUserUseCase.execute(user);

    expect(async () => {
      await createUserUseCase.execute(user2);
    }).rejects.toBeInstanceOf(CreateUserError);
  });
})
