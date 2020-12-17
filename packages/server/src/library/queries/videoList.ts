
import IVideo from "@tntl/definition/src/library/IVideo";
import IIdentifier from "@tntl/definition/src/generic/IIdentifier";
import { libraryModel } from "../repository/model";
import IQueryResult from "../../_definition/rest/IQueryResult";

export const listVideos = async (page: number, limit: number)
: Promise<IQueryResult<IVideo & IIdentifier>> => {

  try {
    const result = await libraryModel
      .find()
      .skip(page * limit)
      .limit(limit)
      .exec();

    return {
      success: true,
      result: {
        limit,
        page,
        search: '',
        result: result.map(e => ({
          id: e.id,
          name: e.name,
          url: e.url,
          start: e.start
        }))
      }
    }

  } catch (e) {
    return {
      success: false,
      result: {      
        error: e.message
      }
    }
  }
}