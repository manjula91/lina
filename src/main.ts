import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
import { Constants } from './server/constants';
import { AppModule } from './server/app.module';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import * as csurf from 'csurf';
import * as compression from 'compression';

async function bootstrap() {

  // With Cross-origin resource sharing (CORS) support
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix('v1');

  /////////////////////////// SERVER VIEWS ///////////////////////
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  /////////////////////////// SWAGGER API /////////////////////////
  const options = new DocumentBuilder()
    .setTitle(Constants.APP_NAME)
    .setDescription(Constants.APP_DESC)
    .setVersion(Constants.VERSION)
    .addTag('gueva')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(Constants.SWAGGER_MOUNT_POINT, app, document);

  //////////////////////////// SECURITY SECTION ////////////////////////
  // app.use(helmet());  // helmet
  // app.use(csurf()); // Cross-site request forgery (known as CSRF or XSRF) option
  /*app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  }));  // rate limit security options
  app.use(compression());  // rate limiting*/

  ///////// START APP ///////
  await app.startAllMicroservicesAsync();

  await app.listen(3000);

}
bootstrap();