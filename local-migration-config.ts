import { DataSource, DataSourceOptions } from "typeorm";
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { config } from "dotenv";

const namingStrategy = new SnakeNamingStrategy();
config();
const dbConfig = process.env;
const dataSourceOptions = {
    type: 'mssql',
    host: dbConfig.DB_HOST,
    port: parseInt(dbConfig.DB_PORT, 10),
    username: dbConfig.DB_USERNAME,
    password: dbConfig.DB_PASSWORD,
    database: dbConfig.DB_DATABASE,
    synchronize: false,
    migrationsRun: false,
    logging: true,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../migrations/**/*{.ts,.js}'],
    subscribers: [],
    options: {
        encrypt: true,
        trustServerCertificate: true,
    },
    namingStrategy,
} as DataSourceOptions

export default new DataSource(dataSourceOptions);