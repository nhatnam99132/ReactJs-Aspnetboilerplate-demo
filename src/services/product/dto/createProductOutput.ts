export interface CreateProductOutputItem {
  name: string;
  quantity: number;
  isActive: boolean;
  lastLoginTime?: any;
  creationTime: Date;
  roleNames: string[];
  id: number;
}

export interface CreateProductrOutput {
  result: CreateProductOutputItem;
}
