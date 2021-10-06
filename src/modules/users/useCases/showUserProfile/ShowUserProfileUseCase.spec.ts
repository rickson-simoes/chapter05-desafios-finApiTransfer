import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("User profile", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
  })

  it("Should show the profile of the user", async () => {
    const newUser = {
      name: "rick",
      email: "rick@teste.com",
      password: "teste123"
    }

    const { id } = await createUserUseCase.execute(newUser);

    const userProfile = await showUserProfileUseCase.execute(id as string);

    expect(userProfile).toHaveProperty("id");
    expect(userProfile).toHaveProperty("email");
    expect(userProfile).toHaveProperty("name");
  });

  it("Should not show the profile of the user", () => {
    expect(async () => {
      await showUserProfileUseCase.execute("123");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
})
