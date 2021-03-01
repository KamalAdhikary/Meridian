export class UserSecurity {
  Id: number;
  SecMainModuleId: number;
  SecMenuOptionLevelId: number;
  SecMenuAccessLevelId: number;
  UserSubSecurities: Array<UserSubSecurity>;
}

export class UserSubSecurity {
  SecByRoleId: number;
  RefTableName: string;
  SubsMenuOptionLevelId: number;
  SubsMenuAccessLevelId: number;
}

