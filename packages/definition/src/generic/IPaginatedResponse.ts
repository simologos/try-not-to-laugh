import IPaginatedRequest from "./IPaginatedRequest";

interface IPaginatedResponse<T> extends IPaginatedRequest {
  result: T[];
}

export default IPaginatedResponse;
