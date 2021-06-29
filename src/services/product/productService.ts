
import { CreateOrUpdateProductInput } from './dto/createOrUpdateProductInput';
import { EntityDto } from '../dto/entityDto';
import { GetAllProductOutput } from './dto/getAllProductOutput';
import { PagedResultDto } from '../dto/pagedResultDto';
import { PagedProductResultRequestDto } from "./dto/PagedProductResultRequestDto";
import { UpdateProductInput } from './dto/updateProductInput';
import http from '../httpService';

class ProductService {
  public async create(createProductInput: CreateOrUpdateProductInput) {
    let result = await http.post('api/services/app/Products/Create', createProductInput);
    return result.data.result;
  }

  public async update(updateProductInput: UpdateProductInput) {
    let result = await http.put('api/services/app/Products/Update', updateProductInput);
    return result.data.result;
  }

  public async delete(entityDto: EntityDto) {
    let result = await http.delete('api/services/app/Products/Delete', { params: entityDto });
    return result.data;
  }

  public async getRoles() {
    let result = await http.get('api/services/app/User/GetRoles');
    return result.data.result.items;
  }

  public async get(entityDto: EntityDto): Promise<CreateOrUpdateProductInput> {
    let result = await http.get('api/services/app/Products/Get', { params: entityDto });
    return result.data.result;
  }

    public async getAll(pagedFilterAndSortedRequest: PagedProductResultRequestDto): Promise<PagedResultDto<GetAllProductOutput>> {
    let result = await http.get('api/services/app/Products/GetAll', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }
}

export default new ProductService();
