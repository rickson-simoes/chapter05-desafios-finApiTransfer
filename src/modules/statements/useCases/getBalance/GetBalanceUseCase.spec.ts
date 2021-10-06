import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetBalanceError } from "./GetBalanceError";

let statementsRepository: InMemoryStatementsRepository;
let usersRepository: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Balance - Statements", () => {
  beforeEach(() => {
    statementsRepository = new InMemoryStatementsRepository();
    usersRepository = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(statementsRepository, usersRepository);
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);
    createUserUseCase = new CreateUserUseCase(usersRepository);
  })

  it("Should be able to get the balance from the user", async () => {
    const user = await createUserUseCase.execute({
      name: "rick",
      email: "rick@teste.com",
      password: "1234"
    });

    const newStatement: ICreateStatementDTO = {
      user_id: user.id as string,
      type: "deposit" as OperationType,
      amount: 500,
      description: "500 reais"
    }

    await createStatementUseCase.execute(newStatement);

    const getBalance = await getBalanceUseCase.execute({
      user_id: user.id as string,
    });

    expect(getBalance.balance).toBe(500);
    expect(getBalance.statement[0]).toHaveProperty("id");
  });

  it("Should not be able to get the balance from a nonexistent user", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({
        user_id: "nonexistent id",
      });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
})
