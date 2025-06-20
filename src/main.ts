import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './components/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = configService.get<string>('ALLOWED_ORIGINS');
      if (!allowedOrigins || allowedOrigins === '*') {
        callback(null, true);
        return;
      }
      const originsArray = allowedOrigins.split(',').map((o) => o.trim());
      if (!origin || originsArray.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('The Movie Concierge')
    .setDescription('API documentation for The Movie Concierge')
    .setVersion('1.0')
    .addTag('The Movie Concierge')
    .build();
  
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/v1', app, document);

  const port = configService.get<number>('PORT') ?? 3000;

  await app.listen(port);
  console.log(`Server is listening on port ${port}`);
}

bootstrap();
