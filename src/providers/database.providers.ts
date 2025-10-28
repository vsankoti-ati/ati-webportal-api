import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const namingStrategy = new SnakeNamingStrategy();
export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async (configService: ConfigService) => {
      const dbConfig = configService.get('database');
      console.log(`Database Config: ${configService.get('nodeEnv')}`);
      const isDevelopment = configService.get('nodeEnv') !== 'production';
      
      // Check if using Windows Authentication (no username/password)
      const useWindowsAuth = !dbConfig.username || !dbConfig.password;
      
      // Log connection attempt in development
      if (isDevelopment) {
        console.log('Attempting to connect to database:', {
          host: dbConfig.host,
          port: dbConfig.port,
          database: dbConfig.database,
          username: useWindowsAuth ? 'Windows Authentication' : dbConfig.username,
        });
      }

      const connectionOptions: any = {
        type: 'mssql',
        schema: 'dbo',
        host: dbConfig.host,
        port: dbConfig.port,
        database: dbConfig.database,
        entities: ['dist/entities/*.entity{.ts,.js}'],
        options: {
          encrypt: true,
          trustServerCertificate: true,
          enableArithAbort: true,
          ...(useWindowsAuth && {
            trustedConnection: true,
            integratedSecurity: true,
          }),
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
        dropSchema: isDevelopment && configService.get<boolean>('DB.DROP_SCHEMA', false),
        namingStrategy
      };

      // Add username/password only if not using Windows Auth
      if (!useWindowsAuth) {
        connectionOptions.username = dbConfig.username;
        connectionOptions.password = dbConfig.password;
      }

      const dataSource = new DataSource(connectionOptions);

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