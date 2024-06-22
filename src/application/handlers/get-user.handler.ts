import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserQuery } from '../queries/get-user.query';
import { UserService } from '../../domain/services/user.service';
import { User } from '../../domain/models/user.model';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(private readonly userService: UserService) {}

  async execute(query: GetUserQuery): Promise<User> {
    const { userId } = query;
    return this.userService.getUserById(userId);
  }
}
