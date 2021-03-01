export class DropDownInfo {
    RecordId: number;
    ParentId: number;
    PageSize: number;
    PageNumber: number;
    Contains: string;
    TotalCount: number;
    OrderBy: string;
    PrimaryKeyValue: string;
    WhereCondition: string;
    EntityFor: EntitiesAlias;
    ParentEntity: EntitiesAlias;
    Entity: EntitiesAlias;
}

export enum EntitiesAlias {
    JobCargo = 81,
    GwyExceptionStatusCode = 165,
    GwyExceptionCode = 164,
}

export class CargoModel {
    Id: number;
    CgoPartNumCode: string;
    CgoSerialNumber: string;
    CgoTitle: string;
}
export class InstallStatusModel {
    Id: number;
    ExStatusDescription: string;
}
export class ExceptionModel {
    Id: number;
    JgeTitle: string;
    JgeReasonCode: string;
}