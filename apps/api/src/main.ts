import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  // Setup Swagger OpenAPI
  const config = new DocumentBuilder()
    .setTitle('VentureSketch API')
    .setDescription('The VentureSketch API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  // Generate a static JSON file for the OpenAPI spec
  fs.writeFileSync('openapi.json', JSON.stringify(document, null, 2));
  
  // To generate a static JSON file for the OpenAPI spec, we can use an environment variable
  // or write it directly in development if needed, but SwaggerModule.setup serves it.
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger Docs available at: http://localhost:${port}/api/docs`);
}
bootstrap();
