export interface AttributeApiResponse {
    data?: (Attribute)[] | null;
}

export interface Attribute {
    id: string;
    name: string;
    category: string;
    description: string;
    tags: string;
    scope?: string;
    owner: string;
    customProperties?: (CustomPropertiesEntity)[] | null;
    related?: (RelatedEntity)[] | null;
}
export interface CustomPropertiesEntity {
    Name: string;
    value: string;
}
export interface RelatedEntity {
    id: string;
    category: string;
    name: string;
}

export interface AttributeApiRequest {
    data: Attribute;
}

export interface AttributeSingleApiResponse {
    data?: Attribute | null;
}

export interface AddAttributeApiRequest {
    data: AddAttribute;
}
interface AddAttribute {
    name: string;
    category: string;
    scope: string;
}