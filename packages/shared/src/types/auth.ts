export interface MezonAuthSuccessMessage {
  type: 'MEZON_AUTH_SUCCESS';
  data: {
    user?: {
      id?: string;
      email?: string;
      avatar?: string | null;
    };
    tokens: {
      accessToken: string;
      refreshToken?: string;
    };
  };
}

export interface MezonAuthErrorMessage {
  type: 'MEZON_AUTH_ERROR';
  error?: string;
}

export type MezonAuthMessage = MezonAuthSuccessMessage | MezonAuthErrorMessage;
