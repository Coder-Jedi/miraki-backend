import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module';
import { ArtworksModule } from './artworks/artworks.module.js';
import { ArtistsModule } from './artists/artists.module.js';
import { CartModule } from './cart/cart.module.js';
import { OrdersModule } from './orders/orders.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): ThrottlerModuleOptions => ({
        throttlers: [
          {
            ttl: configService.get<number>('THROTTLE_TTL', 60),
            limit: configService.get<number>('THROTTLE_LIMIT', 60),
          },
        ],
      }),
    }),
    AuthModule,
    UsersModule,
    ArtworksModule,
    ArtistsModule,
    CartModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
