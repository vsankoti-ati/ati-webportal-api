import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const namingStrategy = new SnakeNamingStrategy();
export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async (configService: ConfigService) => {
      const dbConfig = configService.get('database');
      const isDevelopment = configService.get('nodeEnv') !== 'production';
      
      // Log connection attempt in development
      if (isDevelopment) {
        console.log('Attempting to connect to database:', {
          host: dbConfig.host,
          port: dbConfig.port,
          database: dbConfig.database,
          username: dbConfig.username,
        });
      }

      const dataSource = new DataSource({
        type: 'mssql',
        schema: 'dbo',
        host: dbConfig.host,
        port: dbConfig.port,
        username: dbConfig.username,
        password: dbConfig.password,
        database: dbConfig.database,
        entities: ['dist/entities/*.entity{.ts,.js}'],
        options: {
          encrypt: true,
          trustServerCertificate: true,
          enableArithAbort: true,
        },
        extra: {
          trustServerCertificate: true,
          validateConnection: false,
        },
        migrations: ['dist/migrations/*{.ts,.js}'],
        migrationsRun: configService.get<boolean>('DB.MIGRATIONS_RUN', false),
        migrationsTableName: 'migrations',
        logging: isDevelopment ? ['error', 'warn', 'schema'] : ['error', 'warn'],
        synchronize: configService.get<boolean>('DB.SYNCHRONIZE', false),
        dropSchema: isDevelopment && configService.get<boolean>('DB.DROP_SCHEMA', false), // Add this temporarily
        namingStrategy
      });

      try {
        await dataSource.initialize();
        console.log('Database connection established successfully');
        
        if (isDevelopment) {
          const entities = dataSource.entityMetadatas.map(e => e.name);
          console.log('Loaded entities:', entities);
        }
        
        return dataSource;
      } catch (error) {
        console.error('Database connection failed:', error.message);
        if (isDevelopment) {
          console.error('Full error:', error);
          console.log('\n⚠️  Database connection failed in development mode.');
          console.log('📝 Please check the following:');
          console.log('   1. SQL Server is running');
          console.log('   2. TCP/IP is enabled in SQL Server Configuration Manager');
          console.log('   3. SQL Server is listening on port 1433');
          console.log('   4. Firewall allows connections to port 1433');
          console.log('   5. Database credentials are correct\n');
        }
        throw error;
      }
    },
    inject: [ConfigService],
  },
];