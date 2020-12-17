import { connect, Connection, connection } from "mongoose";
import { dbHost, dbPort, dbName } from './config';

export const getMongooseConnection = (): Connection => {
  return connection;
};

const connectToDb = async () => {
  try {
    await connect(`mongodb://${dbHost}:${dbPort}/${dbName}`);
    console.log('Connected to mongo!!!');
  }
  catch (err) {
    console.error('Could not connect to MongoDB');
  }
};

export default connectToDb;
