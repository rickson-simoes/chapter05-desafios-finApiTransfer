import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";

let statementsRepository: InMemoryStatementsRepository;
let usersRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Operations - Statements", () => {
  beforeEach(() => {
    statementsRepository = new InMemoryStatementsRepository();
    usersRepository = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);
    createUserUseCase = new CreateUserUseCase(usersRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepository, statementsRepository);
  })

  it("Should be able to get the statement operation from the user id and statement id", async () => {
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

    const statement = await createStatementUseCase.execute(newStatement);

    const getStatementOperation = await getStatementOperationUseCase.execute({
      statement_id: statement.id as string,
      user_id: user.id as string
    });

    expect(getStatementOperation).toHaveProperty("id");
    expect(getStatementOperation).toHaveProperty("user_id");
  });

  it("Should not be able to get the statement operation from nonexistent user", () => {
    expect(async() => {
      await getStatementOperationUseCase.execute({
        statement_id: "nonexistent statement ID",
        user_id: "nonexistent user id"
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("Should not be able to get the statement operation from nonexistent statement", async () => {
    const user = await createUserUseCase.execute({
      name: "rick",
      email: "rick@teste.com",
      password: "1234"
    })

    expect(async() => {
      await getStatementOperationUseCase.execute({
        statement_id: "nonexistent statement ID",
        user_id: user.id as string
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
})
