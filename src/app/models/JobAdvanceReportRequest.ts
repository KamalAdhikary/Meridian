export class JobAdvanceReportRequest {
  CustomerId: number;
  ReportType?: number;
  ProgramId: Array<number>;
  Origin: Array<string>;
  Destination: Array<string>;
  Brand: Array<string>;
  GatewayTitle: Array<string>;
  ServiceMode: Array<string>;
  ProductType: Array<string>;
  Channel: Array<string>;
  Scheduled: string;
  OrderType: string;
  StartDate: string;
  EndDate: string;
  Mode: string;
  JobStatus: string;
  Search: string;
  DateTypeName: string;
  PackagingCode: string;
  CargoId: number;
  FileName: string;
  ProjectedYear: string;
}
