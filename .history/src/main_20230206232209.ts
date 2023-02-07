import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      disableErrorMessages: false,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('App example')
    .setDescription('The app API description')
    .setVersion('1.0')
    .addTag('app')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // secure app by setting various HTTP headers.
  app.use(helmet());

  // protect app from brute-force attacks
  app.use(
    rateLimit({
      windowMs: 1 * 60 * 1000, // 1 minute (in milliseconds)
      max: 2000, // limit each IP to 100 requests per windowMs
    }),
  );

  await app.listen(3030);
}
bootstrap();
