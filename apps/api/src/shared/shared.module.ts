import { Global, Module } from '@nestjs/common';
import { AppConfigService } from './services/app-config.service';
import { EmailService } from './services/email.service';

@Global()
@Module({
  providers: [AppConfigService, EmailService],
  exports: [AppConfigService, EmailService],
})
export class SharedModule {}
