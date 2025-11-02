import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips unknown fields
      transform: true, // auto-converts query params to proper types
      transformOptions: {
        enableImplicitConversion: true, // allows string->number
      },
    }),
  );
  await app.listen(3000);
  console.log('Places API running on http://localhost:3000');
}
bootstrap().catch((err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
