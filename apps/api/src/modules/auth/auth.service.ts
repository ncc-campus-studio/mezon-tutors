import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { User } from '@mezon-tutors/db';
import { PrismaService } from '../../prisma/prisma.service';
import { AppConfigService } from '../../shared/services/app-config.service';
import type {
  AuthTokens,
  AuthUserPayload,
  MezonTokenResponse,
  MezonUserInfo,
} from './interfaces/auth.interfaces';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly appConfig: AppConfigService,
    private readonly userService: UserService
  ) {}

  getMezonOAuthUrl(): string {
    const oauth = this.appConfig.oauthConfig;
    const params = new URLSearchParams({
      client_id: oauth.clientId,
      redirect_uri: oauth.redirectUri,
      response_type: 'code',
      scope: 'openid offline',
      state: crypto.randomUUID().substring(0, 10),
    });

    return `${oauth.baseUri}/oauth2/auth?${params.toString()}`;
  }

  async exchangeCodeForToken(code: string, state?: string): Promise<MezonTokenResponse> {
    const oauth = this.appConfig.oauthConfig;

    const response = await fetch(`${oauth.baseUri}/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        ...(state ? { state } : {}),
        client_id: oauth.clientId,
        client_secret: oauth.clientSecret,
        redirect_uri: oauth.redirectUri,
        scope: 'openid offline',
      }),
    });

    if (!response.ok) {
      throw new UnauthorizedException('Failed to exchange authorization code with Mezon');
    }

    const data = (await response.json()) as MezonTokenResponse;
    if (!data.access_token) {
      throw new UnauthorizedException('Mezon token response is missing access_token');
    }

    return data;
  }

  async fetchMezonUserInfo(accessToken: string): Promise<MezonUserInfo> {
    const oauth = this.appConfig.oauthConfig;

    const response = await fetch(`${oauth.baseUri}/userinfo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        access_token: encodeURIComponent(accessToken),
        client_id: oauth.clientId,
        client_secret: oauth.clientSecret,
        redirect_uri: oauth.redirectUri,
      }),
    });

    if (!response.ok) {
      throw new UnauthorizedException('Failed to fetch user info from Mezon');
    }

    const data = (await response.json()) as MezonUserInfo;

    if (!data.username) {
      throw new BadRequestException('Mezon user info does not contain an username');
    }

    return {
      ...data,
      avatar: data.avatar ?? null,
    };
  }

  async findOrCreateUserFromMezon(mezonUser: MezonUserInfo): Promise<User> {
    const mezonUserId = mezonUser.user_id;
    const username = mezonUser.username || `user-${mezonUserId.substring(0, 8)}`;

    return this.userService.upsertFromMezon({
      mezonUserId,
      username,
      avatar: mezonUser.avatar,
      email: mezonUser.email,
    });
  }

  async generateTokens(user: User): Promise<AuthTokens> {
    const jwtConfig = this.appConfig.jwtConfig;
    const payload: AuthUserPayload = {
      sub: user.id,
      mezonUserId: user.mezonUserId,
      username: user.username,
      role: user.role,
      avatar: user.avatar,
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(
      { sub: user.id },
      {
        expiresIn: '30d',
        secret: jwtConfig.refreshSecret,
      }
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async handleMezonCallback(code: string, state?: string) {
    const tokenData = await this.exchangeCodeForToken(code, state);
    const mezonUser = await this.fetchMezonUserInfo(tokenData.access_token);
    const user = await this.findOrCreateUserFromMezon(mezonUser);
    const tokens = await this.generateTokens(user);

    const result = {
      user: {
        id: user.id,
        mezonUserId: user.mezonUserId,
        username: user.username,
        role: user.role,
        avatar: user.avatar,
        email: mezonUser.email ?? null,
      },
      tokens,
    };

    return {
      ...result,
    };
  }
}
