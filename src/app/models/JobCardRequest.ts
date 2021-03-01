export enum EntitiesAlias {
  JobCard = 163,
  JobCargo = 82,
  JobBillableSheet = 88,
  JobCostSheet = 87,
  JobEDIXcbl = 162,
  JobAdvanceReport = 158,
}
export class JobCardRequest {
  Count: number;
  CardName: string;
  CardType: string;
  BackGroundColor: string;
  DashboardCategoryRelationId: number;
  CustomerId: number | null;
  DashboardCategoryName: string;
  DashboardSubCategoryName: string;
}

export class PagedDataInfo {
  UserId: number;
  RoleId: number;
  OrganizationId: number;
  Entity: EntitiesAlias | null;
  PageNumber: number;
  PageSize: number;
  IsNext: boolean;
  IsEnd: boolean;
  Params: string;
  ParentId: number;
  WhereCondition: string;
}
