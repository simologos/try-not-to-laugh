import IIdentifier from '@tntl/definition/src/generic/IIdentifier';
import IUser from '@tntl/definition/src/user/IUser';
import IError from 'definition/src/generic/IError';
import IResponse from 'definition/src/generic/IResponse';
import { userModel } from '../repository/model';

export const getUserById = async (id: string): Promise<IResponse & (IUser & IIdentifier | IError)> => {
  try {
    const user = await userModel.findById(id).exec();

    return {
      success: true,
      id: user._id,
      displayName: user.displayName,
      avatar: user.avatar,
      firstName: user.firstName,
      lastName: user.lastName,
      googleId: user.googleId,
      isValidated: user.isValidated,
      score: user.score,
    };
  } catch (e) {
    return null;
  }
};

export const getUserByGoogleId = async (googleId: string): Promise<IUser & IIdentifier | null> => {
  try {
    const user = await userModel.findOne({ googleId }).exec();

    if (user === null) {
      return null;
    }

    return {
      id: user._id,
      displayName: user.displayName,
      avatar: user.avatar,
      firstName: user.firstName,
      lastName: user.lastName,
      googleId: user.googleId,
      isValidated: user.isValidated,
      score: user.score,
    };
  } catch (e) {
    return null;
  }
};
