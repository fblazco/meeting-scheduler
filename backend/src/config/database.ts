import { Sequelize } from 'sequelize';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Sequelize database instance.
 * Supports connection via DATABASE_URL or individual credentials.
 */
export const sequelize = process.env.DATABASE_URL
    ? new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        dialectModule: pg,
        logging: false,
        dialectOptions: isProduction
            ? {
                ssl: {
                    require: true,
                    rejectUnauthorized: false,
                },
            }
            : {},
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    })
    : new Sequelize(
        process.env.DB_NAME || 'meeting_scheduler',
        process.env.DB_USER || 'felipeblasquezcontreras',
        process.env.DB_PASSWORD || undefined,
        {
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432', 10),
            dialect: 'postgres',
            dialectModule: pg,
            logging: false,
            pool: {
                max: 10,
                min: 0,
                acquire: 30000,
                idle: 10000,
            },
        }
    );

/**
 * Authenticates the database connection.
 */
export const connectDB = async (): Promise<void> => {
    try {
        await sequelize.authenticate();
        console.log('✅ PostgreSQL database connected successfully via Sequelize.');
    } catch (error) {
        console.error('❌ Unable to connect to PostgreSQL database:', error);
        throw error;
    }
};

export default sequelize;
