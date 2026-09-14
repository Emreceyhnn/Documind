export type AddMemberInputApi = {
  companyId: string;
  userEmail: string;
};

export type CompanyMemberApi = {
  id: string;
  name: string;
  surname: string;
  email: string;
  role: string;
  isActive: boolean;
};

export type CompanyResponseApi = {
  id: string;
  companyName: string;
  companyAdminId: string;
  companyMembers: CompanyMemberApi[];
  createdDate: string;
  updatedDate: string;
};
