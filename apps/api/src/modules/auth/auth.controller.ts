import { Body, Controller, Get, Post, Query, Req, Res, UseGuards, Headers } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AppConfigService } from '../../shared/services/app-config.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { MezonCallbackQueryDto } from './dto/mezon-callback-query.dto';
import { MezonExchangeDto } from './dto/mezon-exchange.dto';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly appConfig: AppConfigService
  ) {}

  @Get('url')
  getMezonOAuthUrl() {
    const url = this.authService.getMezonOAuthUrl();
    return { url };
  }

  @Get('mezon')
  async redirectToMezon(@Res() res: Response) {
    const url = this.authService.getMezonOAuthUrl();
    return res.redirect(url);
  }

  @Post('mezon/exchange')
  async mezonExchange(@Body() body: MezonExchangeDto) {
    const { code, state } = body;
    const result = await this.authService.handleMezonCallback(code, state);
    return {
      user: result.user,
      tokens: result.tokens,
    };
  }

  @Get('mezon/callback')
  mezonCallback(@Query() query: MezonCallbackQueryDto, @Res() res: Response) {
    const { code, state } = query;
    const base = this.appConfig.frontendUrl.replace(/\/+$/, '');
    const params = new URLSearchParams();
    if (code) params.set('code', code);
    if (state) params.set('state', state);
    const redirectUrl = `${base}/auth/mezon/callback?${params.toString()}`;
    return res.redirect(302, redirectUrl);
  }

  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    const tokens = await this.authService.refreshAccessToken(body.refreshToken);
    return { tokens };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: Request) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Body() body: { refreshToken?: string }, @Req() req: Request) {
    await this.authService.revokeRefreshToken(body.refreshToken!);

    return {
      success: true,
      message: 'Logged out successfully',
    };
  }
}
