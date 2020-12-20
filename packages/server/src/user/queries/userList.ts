import IIdentifier from '@tntl/definition/src/generic/IIdentifier';
import IUser from '@tntl/definition/src/user/IUser';
import { userModel } from '../repository/model';
import IQueryResult from '../../_definition/rest/IQueryResult';

export const listUsers = async (page: number, limit: number)
: Promise<IQueryResult<IUser & IIdentifier>> => {
  try {
    const result = await userModel
      .find({ })
      .sort({ score: -1 })
      .skip(page * limit)
      .limit(limit)
      .exec();

    return {
      success: true,
      result: {
        limit,
        page,
        search: '',
        result: result.map((e) => ({
          id: e.id,
          avatar: e.avatar,
          displayName: e.displayName,
          firstName: e.firstName,
          googleId: e.googleId,
          isValidated: e.isValidated,
          lastName: e.lastName,
          score: e.score,
        })),
      },
    };
  } catch (e) {
    return {
      success: false,
      result: {
        error: e.message,
      },
    };
  }
};
