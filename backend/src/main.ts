import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { TransformInterceptor } from './core/transform.interceptor';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
dotenv.config();


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public'));

  // Enable using global pipes
  app.useGlobalPipes(new ValidationPipe());

  // Config global prefix
  app.setGlobalPrefix('api');

  // Config cookie parser
  app.use(cookieParser());

  /// Config versoning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1'],
  });

  // Config Swagger
  const config = new DocumentBuilder()
    .setTitle('Documanet API Job Seeking')
    .setDescription('The Job Seeking API description')
    .setVersion('1.0')
    // .addTag('job-seeking')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  // Enable using global interceptor
  app.useGlobalInterceptors(new TransformInterceptor(app.get(Reflector)));

  // Enable CORS to accept all origins
  app.enableCors({
    origin: true, // Allow all origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    // preflightContinue: false,
    credentials: true,
  });

  await app.listen(process.env.PORT);
}
bootstrap();
