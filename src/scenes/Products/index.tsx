import * as React from 'react';

import { Button, Card, Col, Dropdown, Input, Menu, Modal, Row, Table, Tag } from 'antd';
import { inject, observer } from 'mobx-react';

import AppComponentBase from '../../components/AppComponentBase';
import CreateOrUpdateProduct from './components/createOrUpdateProduct';
import { EntityDto } from '../../services/dto/entityDto';
import { L } from '../../lib/abpUtility';
import Stores from '../../stores/storeIdentifier';
import ProductStore from '../../stores/productStore';
import { FormInstance } from 'antd/lib/form';
import { PlusOutlined, SettingOutlined } from '@ant-design/icons';

export interface IProductProps {
  productStore: ProductStore;
}

export interface IProductState {
  modalVisible: boolean;
  maxResultCount: number;
  skipCount: number;
  productId: number;
  filter: string;
}

const confirm = Modal.confirm;
const Search = Input.Search;

@inject(Stores.ProductStore)
@observer
class Product extends AppComponentBase<IProductProps, IProductState> {
  formRef = React.createRef<FormInstance>();

  state = {
    modalVisible: false,
    maxResultCount: 10,
    skipCount: 0,
    productId: 0,
    filter: '',
  };

  async componentDidMount() {
    await this.getAll();
  }

  async getAll() {
    await this.props.productStore.getAll({ maxResultCount: this.state.maxResultCount, skipCount: this.state.skipCount, keyword: this.state.filter });
  }

  handleTableChange = (pagination: any) => {
    this.setState({ skipCount: (pagination.current - 1) * this.state.maxResultCount! }, async () => await this.getAll());
  };

  Modal = () => {
    this.setState({
      modalVisible: !this.state.modalVisible,
    });
  };

  async createOrUpdateModalOpen(entityDto: EntityDto) {
    if (entityDto.id === 0) {
      await this.props.productStore.createProduct();
      await this.props.productStore.getRoles();
    } else {
      await this.props.productStore.get(entityDto);
      await this.props.productStore.getRoles();
    }

    this.setState({ productId: entityDto.id });
    this.Modal();

    setTimeout(() => {
      this.formRef.current?.setFieldsValue({ ...this.props.productStore.editProduct });
    }, 100);
  }

  delete(input: EntityDto) {
    const self = this;
    confirm({
      title: 'Do you Want to delete these items?',
      onOk() {
        self.props.productStore.delete(input);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  handleCreate = () => {
    const form = this.formRef.current;

    form!.validateFields().then(async (values: any) => {
      if (this.state.productId === 0) {
        await this.props.productStore.create(values);
      } else {
        await this.props.productStore.update({ ...values, id: this.state.productId });
      }

      await this.getAll();
      this.setState({ modalVisible: false });
      form!.resetFields();
    });
  };

  handleSearch = (value: string) => {
    this.setState({ filter: value }, async () => await this.getAll());
  };

  public render() {
    const { products } = this.props.productStore;
    const columns = [
      //{ title: L('ProductName'), dataIndex: 'productName', key: 'productName', width: 150, render: (text: string) => <div>{text}</div> },
      { title: L('ProductName'), dataIndex: 'name', key: 'name', width: 150, render: (text: string) => <div>{text}</div> },
      { title: L('Quantity'), dataIndex: 'quantity', key: 'quantity', width: 150, render: (text: number) => <div>{text}</div> },
      {
        title: L('IsActive'),
        dataIndex: 'isActive',
        key: 'isActive',
        width: 150,
        render: (text: boolean) => (text === true ? <Tag color="#2db7f5">{L('Yes')}</Tag> : <Tag color="red">{L('No')}</Tag>),
      },
      {
        title: L('Actions'),
        width: 150,
        render: (text: string, item: any) => (
          <div>
            <Dropdown
              trigger={['click']}
              overlay={
                <Menu>
                  <Menu.Item onClick={() => this.createOrUpdateModalOpen({ id: item.id })}>{L('Edit')}</Menu.Item>
                  <Menu.Item onClick={() => this.delete({ id: item.id })}>{L('Delete')}</Menu.Item>
                </Menu>
              }
              placement="bottomLeft"
            >
              <Button type="primary" icon={<SettingOutlined />}>
                {L('Actions')}
              </Button>
            </Dropdown>
          </div>
        ),
      },
    ];

    return (
      <Card>
        <Row>
          <Col
            xs={{ span: 4, offset: 0 }}
            sm={{ span: 4, offset: 0 }}
            md={{ span: 4, offset: 0 }}
            lg={{ span: 2, offset: 0 }}
            xl={{ span: 2, offset: 0 }}
            xxl={{ span: 2, offset: 0 }}
          >
            {' '}
            <h2>{L('Products')}</h2>
          </Col>
          <Col
            xs={{ span: 14, offset: 0 }}
            sm={{ span: 15, offset: 0 }}
            md={{ span: 15, offset: 0 }}
            lg={{ span: 1, offset: 21 }}
            xl={{ span: 1, offset: 21 }}
            xxl={{ span: 1, offset: 21 }}
          >
            <Button type="primary" shape="circle" icon={<PlusOutlined />} onClick={() => this.createOrUpdateModalOpen({ id: 0 })} />
          </Col>
        </Row>
        <Row>
          <Col sm={{ span: 10, offset: 0 }}>
            <Search placeholder={this.L('Filter')} onSearch={this.handleSearch} />
          </Col>
        </Row>
        <Row style={{ marginTop: 20 }}>
          <Col
            xs={{ span: 24, offset: 0 }}
            sm={{ span: 24, offset: 0 }}
            md={{ span: 24, offset: 0 }}
            lg={{ span: 24, offset: 0 }}
            xl={{ span: 24, offset: 0 }}
            xxl={{ span: 24, offset: 0 }}
          >
            <Table
              rowKey={(record) => record.id.toString()}
              bordered={true}
              columns={columns}
              pagination={{ pageSize: 10, total: products === undefined ? 0 : products.totalCount, defaultCurrent: 1 }}
              loading={products === undefined ? true : false}
              dataSource={products === undefined ? [] : products.items}
              onChange={this.handleTableChange}
            />
          </Col>
        </Row>
        <CreateOrUpdateProduct
          formRef={this.formRef}
          visible={this.state.modalVisible}
          onCancel={() => {
            this.setState({
              modalVisible: false,
            });
            this.formRef.current?.resetFields();
          }}
          modalType={this.state.productId === 0 ? 'edit' : 'create'}
          onCreate={this.handleCreate}
          roles={this.props.productStore.roles}
        />
      </Card>
    );
  }
}

export default Product;
