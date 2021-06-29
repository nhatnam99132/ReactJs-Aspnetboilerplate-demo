import { action, observable } from 'mobx';

import { CreateOrUpdateProductInput } from '../services/product/dto/createOrUpdateProductInput';
import { EntityDto } from '../services/dto/entityDto';
import { GetRoles } from '../services/product/dto/getRolesOuput';
import { GetProductOutput } from '../services/product/dto/getProductOutput';
import { PagedResultDto } from '../services/dto/pagedResultDto';
import { PagedProductResultRequestDto } from '../services/product/dto/PagedProductResultRequestDto';
import { UpdateProductInput } from '../services/product/dto/updateProductInput';
import productService from '../services/product/productService';

class ProductStore {
  @observable products!: PagedResultDto<GetProductOutput>;
  @observable editProduct!: CreateOrUpdateProductInput;
  @observable roles: GetRoles[] = [];

  @action
  async create(createProductInput: CreateOrUpdateProductInput) {
    let result = await productService.create(createProductInput);
    this.products.items.push(result);
  }

  @action
  async update(updateProductInput: UpdateProductInput) {
    let result = await productService.update(updateProductInput);
    this.products.items = this.products.items.map((x: GetProductOutput) => {
      if (x.id === updateProductInput.id) x = result;
      return x;
    });
  }

  @action
  async delete(entityDto: EntityDto) {
    await productService.delete(entityDto);
    this.products.items = this.products.items.filter((x: GetProductOutput) => x.id !== entityDto.id);
  }

  @action
  async getRoles() {
    let result = await productService.getRoles();
    this.roles = result;
  }

  @action
  async get(entityDto: EntityDto) {
    let result = await productService.get(entityDto);
    this.editProduct = result;
  }

  @action
  async createProduct() {
    this.editProduct = {   
      name: '',
      quantity: 0,
      isActive: false,
      roleNames: [],
      id: 0,
    };
    this.roles = [];
  }

  @action
  async getAll(pagedFilterAndSortedRequest: PagedProductResultRequestDto) {
    let result = await productService.getAll(pagedFilterAndSortedRequest);
    this.products = result;
  }


}

export default ProductStore;
