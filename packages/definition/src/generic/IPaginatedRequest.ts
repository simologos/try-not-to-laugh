interface IPaginatedRequest {
  search: string;

  page: number;
  
  limit: number;
}

export default IPaginatedRequest;
