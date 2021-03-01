export class JobCardTile {
  CategoryName: string;
  JobCardTileDetailList: JobCardTileDetail[];
}
export class JobCardTileDetail {
  DashboardCategoryRelationId: number;
  RecordCount: number;
  DashboardName: string;
  DashboardCategoryDisplayName: string;
  DashboardSubCategoryDisplayName: string;
  BackGroundColor: string;
  FontColor: string;
  DashboardCategoryName: string;
  DashboardSubCategoryName: string;
  SortOrder: number;
}
