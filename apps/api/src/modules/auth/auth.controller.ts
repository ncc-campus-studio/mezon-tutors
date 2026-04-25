import { Body, Controller, Get, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { CookieOptions, Request, Response } from 'express';
import { AppConfigService } from '../../shared/services/app-config.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { MezonCallbackQueryDto } from './dto/mezon-callback-query.dto';
import { MezonExchangeDto } from './dto/mezon-exchange.dto';

const REFRESH_TOKEN_MAX_AGE = 1000 * 60 * 60 * 24 * 30;

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly appConfig: AppConfigService
  ) {}

  private getRefreshCookieOptions(): CookieOptions {
    const isProduction = this.appConfig.nodeEnv === 'production';

    return {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: REFRESH_TOKEN_MAX_AGE,
    };
  }

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
  async mezonExchange(@Body() body: MezonExchangeDto, @Res({ passthrough: true }) res: Response) {
    const { code, state } = body;
    const result = await this.authService.handleMezonCallback(code, state);

    res.cookie('refresh_token', result.tokens.refreshToken, this.getRefreshCookieOptions());

    return {
      user: result.user,
      accessToken: result.tokens.accessToken,
      idToken: result.idToken,
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
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies.refresh_token;
    
    const tokens = await this.authService.refreshAccessToken(refreshToken);

    res.cookie('refresh_token', tokens.refreshToken, this.getRefreshCookieOptions());

    return { accessToken: tokens.accessToken };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: Request) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: Request) {
    const refreshToken = req.cookies.refresh_token;
    
    await this.authService.revokeRefreshToken(refreshToken);

    return {
      success: true,
      message: 'Logged out successfully',
    };
  }
}
