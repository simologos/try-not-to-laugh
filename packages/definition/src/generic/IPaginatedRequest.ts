/**
 * Data model of a paginated request.
 */
interface IPaginatedRequest {

  /**
   * Search parameter used to filter the available records.
   */
  search: string;

  /**
   * The page number to query.
   */
  page: number;

  /**
   * The number of records per page.
   */
  limit: number;
}

export default IPaginatedRequest;
