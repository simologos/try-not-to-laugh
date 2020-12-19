import { connect, Connection, connection } from "mongoose";
import { dbHost, dbPort, dbName, dbPass, dbUser } from './config';

export const getMongooseConnection = (): Connection => {
  return connection;
};

const connectToDb = async () => {
  try {
    await connect(`mongodb+srv://${dbUser}:${dbPass}@${dbHost}/${dbName}?retryWrites=true&w=majority`);
    
    console.log('Connected to mongo!!!');
  }
  catch (err) {
    console.error('Could not connect to MongoDB');
  }
};

export default connectToDb;
