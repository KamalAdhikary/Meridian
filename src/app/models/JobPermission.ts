
export enum Permission {
  NoAccess = 16,
  ReadOnly = 17,
  EditActuals = 18,
  EditAll = 19,
  AddEdit = 20,
  All = 21,
}
export class JobPermission {
  Job: Permission;
  Tracking: Permission;
  Document: Permission;
  Cargo: Permission;
  Price: Permission;
  Cost:Permission;
  Note:Permission;
}
