export interface DocumentStandardsApiResponse {
    data?: (DocumentStandard)[] | null;
    links: Links;
    page: Page;
  }
  export interface DocumentStandard {
    id: string;
    type: string;
    name: string;
    description: string;
    levels?: (string)[] | null;
  }
  export interface Links {
    first: string;
    previous: string;
    next: string;
    last: string;
  }
  export interface Page {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  }
  