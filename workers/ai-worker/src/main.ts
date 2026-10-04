import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ThrottlerModule } from '@nestjs/throttler';
import { AiGenerationProcessor } from './processor';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_QUEUE_HOST || 'localhost',
        port: parseInt(process.env.REDIS_QUEUE_PORT || '6380', 10),
        password: process.env.REDIS_AI_WORKER_PASSWORD, // per-service Redis user
        tls: process.env.NODE_ENV === 'production' ? {} : undefined,
        enableAutoPipelining: true,
      },
    }),
    BullModule.registerQueue({ name: 'ai-generation' }),
  ],
  providers: [AiGenerationProcessor],
})
export class AiWorkerModule {}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AiWorkerModule, {
    logger: ['log', 'warn', 'error'],
  });

  await app.init();

  // Graceful shutdown
  const signals: NodeJS.Signals[] = ['SIGTERM', 'SIGINT'];
  signals.forEach((signal) => {
    process.on(signal, async () => {
      console.log(`Received ${signal}, shutting down gracefully...`);
      await app.close();
      process.exit(0);
    });
  });

  console.log('AI Worker is processing jobs from the ai-generation queue...');
}

bootstrap().catch((err) => {
  console.error('AI Worker failed to start:', err);
  process.exit(1);
});
