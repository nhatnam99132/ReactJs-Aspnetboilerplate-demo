export interface CreateOrUpdateProductInput {
  name: string;
  quantity: number;
  isActive: boolean;
  roleNames: string[];
  id: number;
}
