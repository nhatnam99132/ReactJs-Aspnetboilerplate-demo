export interface UpdateProductInput {
  name: string;
  quantity: number;
  isActive: boolean;
  lastLoginTime: Date;
  creationTime: Date;
  roleNames: string[];
  id: number;
}
