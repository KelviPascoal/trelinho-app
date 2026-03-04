import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Pool } from 'pg';

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

@Injectable()
export class AuthService {
  private readonly prisma: PrismaClient;

  constructor(private readonly jwtService: JwtService) {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error('DATABASE_URL is not set');
    }

    const adapter = new PrismaPg(new Pool({ connectionString }));
    this.prisma = new PrismaClient({ adapter });
  }

  async register(payload: RegisterPayload) {
    const name = payload.name?.trim();
    const email = payload.email?.toLowerCase().trim();
    const password = payload.password;

    if (!name || !email || !password) {
      throw new BadRequestException('name, email and password are required');
    }

    if (password.length < 6) {
      throw new BadRequestException('password must have at least 6 characters');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('email already registered');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    const accessToken = await this.signToken(user.id, user.email, user.name);

    return { accessToken, user };
  }

  async login(payload: LoginPayload) {
    const email = payload.email?.toLowerCase().trim();
    const password = payload.password;

    if (!email || !password) {
      throw new BadRequestException('email and password are required');
    }

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      throw new UnauthorizedException('invalid credentials');
    }

    const accessToken = await this.signToken(user.id, user.email, user.name);

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    };
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('user not found');
    }

    return user;
  }

  private signToken(userId: string, email: string, name: string) {
    return this.jwtService.signAsync({
      sub: userId,
      email,
      name,
    });
  }
}
