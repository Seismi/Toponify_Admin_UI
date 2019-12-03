export interface SearchApiResponse {
  data?: (SearchEntity)[] | null;
}

export interface SearchEntity {
  id: string;
  objectType: string;
  name: string;
  workPackage: WorkPackage;
  description: string;
}

export interface WorkPackage {
  id: string;
  name: string;
}
