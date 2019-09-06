export interface ReportLibraryApiResponse {
    data?: (ReportLibrary)[] | null;
    links: Links;
    page: Page;
  }
  export interface ReportLibrary {
    id: string;
    name: string;
    description: string;
    dataSets?: (DataSetsEntity)[] | null;
  }
  export interface DataSetsEntity {
    id: string;
    layer: string;
    name: string;
    description: string;
    category: string;
    tags: string;
    locations?: ((LocationsEntityEntity)[] | null)[] | null;
    owners?: (OwnersEntity)[] | null;
  }
  export interface LocationsEntityEntity {
    layout: Layout;
    locationCoordinates: string;
  }
  export interface Layout {
    id: string;
    name: string;
  }
  export interface OwnersEntity {
    id: string;
    name: string;
    type: string;
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

  // Report Detail
  export interface ReportDetailApiRespoonse {
    data: Report;
  }
  export interface Report {
    id: string;
    name: string;
    description: string;
    owners?: (OwnersEntity)[] | null;
    dataSets?: (DataSetsEntityOrDimensionsEntityOrReportingConceptsEntity)[] | null;
    dimensions?: (DataSetsEntityOrDimensionsEntityOrReportingConceptsEntity)[] | null;
    reportingConcepts?: (DataSetsEntityOrDimensionsEntityOrReportingConceptsEntity)[] | null;
    attributes?: (AttributesEntity)[] | null;
    customPropertyValues?: (CustomPropertyValues)[] | null;
    relatedRadios?: (RelatedRadios)[] | null;
    relatedWorkPackages?: (RelatedWorkPackages)[] | null;
  }

  export interface RelatedWorkPackages {
    id: string;
    name: string;
    description: string;
    hasErrors: boolean;
    status: string;
  }

  export interface RelatedRadios {
    id: string;
    title: string;
    description: string;
  }

  export interface CustomPropertyValues {
    propertyId: string;
    name: string;
    type: boolean;
    value: string;
  }

  export interface OwnersEntity {
    id: string;
    name: string;
    type: string;
  }
  export interface DataSetsEntityOrDimensionsEntityOrReportingConceptsEntity {
    id: string;
    layer: string;
    name: string;
    description: string;
    category: string;
    tags: string;
    locations?: ((LocationsEntityEntity)[] | null)[] | null;
    owners?: (OwnersEntity)[] | null;
  }
  export interface LocationsEntityEntity {
    layout: Layout;
    locationCoordinates: string;
  }
  export interface Layout {
    id: string;
    name: string;
  }
  export interface AttributesEntity {
    id: string;
    category: string;
    name: string;
    description: string;
    tags: string;
    related?: (null)[] | null;
  }
  
  