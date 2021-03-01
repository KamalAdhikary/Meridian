export class JobCost {
  Id: number;
  CstLineItem: number;
  CstChargeID: number;
  CstChargeCode: string;
  CstTitle: string;
  ChargeTypeId: number;
  ChargeTypeIdName : string;
  CstQuantity: number;
  CstUnitId: number;
  CstUnitIdName: string;
  CstRate: number;
  CstComments: string;
  StatusId: number;
  CstElectronicBilling: boolean;
  IsProblem: boolean;
}
