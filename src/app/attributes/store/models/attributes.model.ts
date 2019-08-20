export interface AttributeEntitiesHttpParams {
    ownerQuery?: string;
    scopeQuery?: string;
    page?: string;
    size?: string;
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


export interface AttributeEntitiesResponse {
    data?: (AttributeEntity)[] | null;
    links: Links;
    page: Page;
}

export interface AttributeApiResponse {
    data?: AttributeEntity;
}

export interface AttributeApiRequest {
    data: AttributeEntity;
}

export interface AttributeEntity {
    id: string;
    category: string;
    name: string;
    description: string;
    tags: string;
    related?: (RelatedEntity)[] | null;
}

export interface RelatedEntity {
    id: string;
    category: string;
    name: string;
    description: string;
    tags: string;
    related?: (RelatedEntity)[] | null;
}


// Attribute Detail
export interface AttributeDetailApiResponse {
    data: AttributeDetail;
}
export interface AttributeDetail {
    id: string;
    name: string;
    category: string;
    description: string;
    tags: string;
    owners?: (Owners)[] | null;
    customProperties?: (CustomProperties)[] | null;
    related?: (RelatedEntity)[]| null;
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

export interface Owners {
    id: string;
    name: string;
    type: string;
}

export interface CustomProperties {
    id: string;
    type: string;
    name: string;
    description: string;
    levels: (string)[] | null;
}