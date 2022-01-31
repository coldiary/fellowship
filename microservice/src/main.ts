import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { readFileSync } from 'fs';
import { WinstonModule } from 'nest-winston';
import { join } from 'path';
import { ApiConfigService } from './services/api.config.service';
import { CachingService } from './services/caching.service';
import { CachingInterceptor } from './common/interceptors/caching.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { MetricsService } from './endpoints/metrics/metrics.service';
import { PrivateAppModule } from './private.app.module';
import { PublicAppModule } from './public.app.module';
import { TransactionProcessorModule } from './transaction.processor.module';
import * as bodyParser from 'body-parser';
import { WinstonLoggerOptions } from './winston.config';

async function bootstrap() {
  const publicApp = await NestFactory.create(PublicAppModule, {
    logger: WinstonModule.createLogger(WinstonLoggerOptions)
  });
  publicApp.use(bodyParser.json({limit: '1mb'}));
  publicApp.enableCors();

  let apiConfigService = publicApp.get<ApiConfigService>(ApiConfigService);
  let metricsService = publicApp.get<MetricsService>(MetricsService);
  let cachingService = publicApp.get<CachingService>(CachingService);
  let httpAdapterHostService = publicApp.get<HttpAdapterHost>(HttpAdapterHost);

  publicApp.useGlobalInterceptors(
    new LoggingInterceptor(metricsService),
    new CachingInterceptor(cachingService, httpAdapterHostService, metricsService),
  );

  const description = readFileSync(join(__dirname, '..', 'docs', 'swagger.md'), 'utf8');

  let documentBuilder = new DocumentBuilder()
    .setTitle('Elrond Microservice API')
    .setDescription(description)
    .setVersion('1.0.0')
    .setExternalDoc('Elrond Docs', 'https://docs.elrond.com');

  let apiUrls = apiConfigService.getSwaggerUrls();
  for (let apiUrl of apiUrls) {
    documentBuilder = documentBuilder.addServer(apiUrl);
  }

  const config = documentBuilder.build();

  const document = SwaggerModule.createDocument(publicApp, config);
  SwaggerModule.setup('', publicApp, document);

  if (apiConfigService.getIsPublicApiFeatureActive()) {
    await publicApp.listen(3001);
  }

  if (apiConfigService.getIsPrivateApiFeatureActive()) {
    const privateApp = await NestFactory.create(PrivateAppModule);
    await privateApp.listen(4000);
  }

  if (apiConfigService.getIsTransactionProcessorFeatureActive()) {
    const transactionProcessorApp = await NestFactory.create(TransactionProcessorModule);
    await transactionProcessorApp.listen(6000);
  }
}

bootstrap();
