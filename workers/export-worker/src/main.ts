import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  providers: [],
})
export class ExportWorkerModule {}

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ExportWorkerModule,
    {
      transport: Transport.REDIS,
      options: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
      },
    },
  );
  
  await app.listen();
  console.log('Export Worker microservice is listening for jobs on Redis...');
}
bootstrap();
