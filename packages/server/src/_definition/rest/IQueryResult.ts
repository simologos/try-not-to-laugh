import IError from "@tntl/definition/src/generic/IError";
import IPaginatedResponse from "@tntl/definition/src/generic/IPaginatedResponse";

interface IQueryResult<T> {
  success: boolean;
  result: IPaginatedResponse<T> | IError;
}

export default IQueryResult;
