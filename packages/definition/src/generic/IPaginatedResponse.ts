import IPaginatedRequest from './IPaginatedRequest';

/**
 * Response model containing the data to a paginated request.
 */
interface IPaginatedResponse<T> extends IPaginatedRequest {

  /**
   * List of results based on a IPaginatedRequest.
   */
  result: T[];
}

export default IPaginatedResponse;
