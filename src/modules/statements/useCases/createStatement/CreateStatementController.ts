import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateStatementUseCase } from './CreateStatementUseCase';

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer'
}

export class CreateStatementController {
  async execute(request: Request, response: Response) {
    const { id: user_id } = request.user;
    const { amount, description } = request.body;
    const { destinatario } = request.params;

    const splittedPath = request.originalUrl.split('/')
    const type = splittedPath[splittedPath.length - 1] as OperationType;

    const createStatement = container.resolve(CreateStatementUseCase);

    let statement;

    if(type === 'deposit' || type === "withdraw") {
      statement = await createStatement.execute({
        user_id,
        type,
        amount,
        description
      });
    } else {
      statement = await createStatement.execute({
        user_id: destinatario,
        type: 'transfer' as OperationType,
        amount,
        description,
        sender_id: user_id
      });
    }


    return response.status(201).json(statement);
  }
}
