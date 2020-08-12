export interface DocumentStandardsApiResponse {
  data?: DocumentStandard[] | null;
  links: Links;
  page: Page;
}
export interface DocumentStandardApiResponse {
  data: DocumentStandard;
}
export interface DocumentStandardApiRequest {
  data: DocumentStandard;
}
export interface DocumentStandard {
  id?: string;
  type: string;
  name: string;
  value?: string;
  description: string;
  levels?: string[] | null;
}
export interface Links {
  first: string;
  previous: string;
  next: string;
  last: string;
}
export interface Page {
  size: number;
  totalObjects: number;
  totalPages: number;
  number: number;
}

export interface DocumentStandardsApiRequest {
  page: number;
  size: number;
  textFilter: string;
  sortBy?: string;
  sortOrder?: string;
}
