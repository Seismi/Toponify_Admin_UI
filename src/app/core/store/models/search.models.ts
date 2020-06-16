export interface SearchApiResponse {
  data?: (SearchEntity)[] | null;
}

export interface SearchEntity {
  id: string;
  objectType: ObjectType;
  name: string;
  workPackage: WorkPackage;
  description: string;
}

export interface WorkPackage {
  id: string;
  name: string;
}

export enum ObjectType {
  system = 'system',
  system_link= 'system link',
  data_node = 'data node',
  data_link = 'data link',
  dimension = 'dimension',
  dimension_link = 'dimension link',
  reporting_concept = 'reporting concept',
  reporting_concept_link = 'reporting concept link',
  attribute = 'attribute',
  report = 'report',
  radio = 'radio',
  workpackage = 'workpackage'
}
