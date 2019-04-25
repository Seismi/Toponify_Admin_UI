export interface VersionApiResponse {
  data?: (Version)[] | null;
}

export interface AddVersionApiResponse {
  data?: (Version) | null;
}

export interface UpdateVersionApiResponse {
  data?: (Version) | null;
}

export interface CopyVersionApiResponse {
  data?: (Version) | null;
}

export interface Version {
  id: string;
  previewImage: string;
  name: string;
  status: string;
  description: string;
  lastUpdatedOn: string;
  lastUpdateBy: AuthorOrLastUpdatedByOrLastUpdateBy;
  latestComments?: (LatestCommentsEntity)[] | null;
}
export interface AuthorOrLastUpdatedByOrLastUpdateBy {
  id: string;
  firstName: string;
  lastName: string;
  team?: (string)[] | null;
}
export interface LatestCommentsEntity {
  id: string;
  title: string;
  commentText: string;
  category: string;
  author: AuthorOrLastUpdatedByOrLastUpdateBy;
  status: string;
  createdOn: string;
  lastUpdatedOn: string;
  lastUpdatedBy: AuthorOrLastUpdatedByOrLastUpdateBy;
  replyCount: number;
}

export interface AddVersionApiRequest {
  data: AddVersion;
}
export interface AddVersion {
  name: string;
  status: string;
  description: string;
}


export interface UpdateVersionApiRequest {
  data: UpdateVersion;
}
interface UpdateVersion {
  id: string;
  name: string;
  status: string;
  description: string;
}


export interface CopyVersionApiRequest {
  data: CopyVersion;
}
export interface CopyVersion {
  id?: string;
  name: string;
  status: string;
  description: string;
  isCopy: boolean;
  copyFromId: string;
}