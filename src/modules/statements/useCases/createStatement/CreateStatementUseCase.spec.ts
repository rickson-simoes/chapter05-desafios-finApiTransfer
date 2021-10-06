import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { ICreateStatementDTO } from "./ICreateStatementDTO";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { CreateStatementError } from "./CreateStatementError";

let statementsRepository: InMemoryStatementsRepository;
let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Deposit/Withdraw - Statements", () => {
  beforeEach(() => {
    statementsRepository = new InMemoryStatementsRepository();
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);
  })

  it("Should be able to deposit", async () => {
    const user = await createUserUseCase.execute({
      name: "rick",
      email: "rick@teste.com",
      password: "1234"
    })

    const newStatement: ICreateStatementDTO = {
      user_id: user.id as string,
      type: "deposit" as OperationType,
      amount: 500,
      description: "500 reais"
    }

    const statement = await createStatementUseCase.execute(newStatement);

    expect(statement).toHaveProperty("id");
    expect(statement).toHaveProperty("user_id");
  });

  it("Should be able to withdraw", async () => {
    const user = await createUserUseCase.execute({
      name: "rick",
      email: "rick@teste.com",
      password: "1234"
    });

    const newStatementDeposit: ICreateStatementDTO = {
      user_id: user.id as string,
      type: 'deposit' as OperationType,
      amount: 500,
      description: "adição de 500 reais"
    };

    await createStatementUseCase.execute(newStatementDeposit);

    const newStatementWithdraw: ICreateStatementDTO = {
      user_id: user.id as string,
      type: "withdraw" as OperationType,
      amount: 150,
      description: "remoção de 150 reais"
    };

    const statement = await createStatementUseCase.execute(newStatementWithdraw);

    expect(statement).toHaveProperty("id");
    expect(statement).toHaveProperty("user_id");
  });

  it("Should not be able to withdraw", async () => {
    const user = await createUserUseCase.execute({
      name: "rick",
      email: "rick@teste.com",
      password: "1234"
    });

    const newStatementDeposit: ICreateStatementDTO = {
      user_id: user.id as string,
      type: 'deposit' as OperationType,
      amount: 500,
      description: "adição de 500 reais"
    };

    await createStatementUseCase.execute(newStatementDeposit);

    const newStatementWithdraw: ICreateStatementDTO = {
      user_id: user.id as string,
      type: "withdraw" as OperationType,
      amount: 650,
      description: "remoção de 650 reais"
    };

    expect(async() => {
      await createStatementUseCase.execute(newStatementWithdraw)
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });

  it("Should not be able to deposit in a invalid user account", async () => {
    const newStatementWithdraw: ICreateStatementDTO = {
      user_id: "1234 invalid id user",
      type: 'deposit' as OperationType,
      amount: 500,
      description: "adição de 500 reais"
    };

    expect(async() => {
      await createStatementUseCase.execute(newStatementWithdraw)
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });
})
