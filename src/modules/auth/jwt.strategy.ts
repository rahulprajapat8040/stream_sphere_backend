import { ConfigService } from '@nestjs/config';

export const jwtConfig = (configService: ConfigService) => ({
    secret: configService.get<string>('SCRETE') || 'fallback-secret',
    signOptions: { expiresIn: '15d' },
});
