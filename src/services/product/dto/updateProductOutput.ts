export interface UpdateProductOutput {
  name: string;
  quantity: number;
  isActive: boolean;
  lastLoginTime?: any;
  creationTime: Date;
  roleNames: string[];
  id: number;
}
