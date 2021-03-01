export class OrderDetails {
  Id: string;
  DeliveryDatePlanned: string;
  ArrivalDatePlanned: Date;
  JobDeliveryDateTimeBaseline: string;
  JobDeliveryDateTimeActual: string;
  CustomerSalesOrder: string;
  GatewayStatus: string;
  BOL: string;
  ManifestNo: string;
  OrderDate: string;
  ShipmentDate: string;
  CustomerId: string;
  CustomerCode: string;
  GwyOrderType: string;
  GwyShipmentType: string;
  OrderGatewayDetails: Array<OrderGatewayDetails>;
  IsJobPermission: boolean;
  JobDeliverySitePOC: string;
  JobDeliverySitePOCPhone: string;
  JobDeliverySitePOCEmail: string;
  JobDeliverySiteName: string;
  JobDeliveryStreetAddress: string;
  JobDeliveryStreetAddress2: string;
  JobDeliveryStreetAddress3: string;
  JobDeliveryStreetAddress4: string;
  JobDeliveryCity: string;
  JobDeliveryState: string;
  JobDeliveryPostalCode: string;
  JobDeliveryCountry: string;
  JobOriginSitePOC: string;
  JobOriginSitePOCPhone: string;
  JobOriginSitePOCEmail: string;
  JobOriginSiteName: string;
  JobOriginStreetAddress: string;
  JobOriginStreetAddress2: string;
  JobOriginStreetAddress3: string;
  JobOriginStreetAddress4: string;
  JobOriginCity: string;
  JobOriginState: string;
  JobOriginPostalCode: string;
  JobOriginCountry: string;
  JobSellerSitePOC: string;
  JobSellerSitePOCEmail: string;
  JobSellerSitePOCPhone: string;
  JobSellerStreetAddress: string;
  JobSellerStreetAddress2: string;
  JobSellerStreetAddress3: string;
  JobSellerStreetAddress4: string;
  JobSellerCity: string;
  JobSellerState: string;
  JobSellerPostalCode: string;
  JobCubesUnitTypeIdName: string;
  JobTotalWeight: string;
  JobWeightUnitTypeIdName: string;
  JobServiceOrder: string;
  JobServiceActual: string;
  JobDriverAlert: string;
  JobQtyOrdered: string;
  JobQtyActual: string;
  JobQtyUnitTypeIdName: string;
  JobPartsOrdered: string;
  JobPartsActual: string;
  JobTotalCubes: string;
  // OrderDocumentDetails: Array<OrderDocumentDetails>;
}

export class OrderGatewayDetails {
  Id: string;
  JobID: string;
  GatewayCode: string;
  GatewayTitle: string;
  ACD: string;
  PCD: string;
  GwyDDPCurrent: string;
  GwyDDPNew: string;
  TypeId: Number;
  GateWayName: string;
}

export class OrderDocumentDetails {
  Id: number;
  JobID: number;
  JdrCode: string;
  JdrTitle: string;
  DocTypeIdName: string;
  DocTypeId: number;
  DisplayDocName: string;

}

export class OrderPassingModel {
  CustomerCode: string;
  CustomerId: number;
  LatestDDPNew: string;
  LatestDDPCurrent: string;
  PocModel: POCModel;
  GwyOrderType: string;
  GwyShipmentType: string;
}

export class POCModel {

}
