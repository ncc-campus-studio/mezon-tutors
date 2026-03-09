import { Injectable } from '@nestjs/common';
import { Role, type User } from '@mezon-tutors/db';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findByMezonUserId(mezonUserId: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { mezonUserId },
    });
  }

  async upsertFromMezon(params: {
    mezonUserId: string;
    username: string;
    avatar?: string | null;
    email: string;
  }): Promise<User> {
    const { mezonUserId, username, avatar, email } = params;

    return this.prisma.user.upsert({
      where: { mezonUserId },
      update: {
        username,
        avatar: avatar ?? '',
        email,
      },
      create: {
        mezonUserId,
        username,
        avatar: avatar ?? '',
        role: Role.STUDENT,
        email,
      },
    });
  }
}
