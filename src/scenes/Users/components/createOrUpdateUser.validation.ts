import { L } from '../../../lib/abpUtility';

const rules = {
  name: [{ required: true, message: L('ThisFieldIsRequired') }],
  surname: [{ required: true, message: L('ThisFieldIsRequired') }],
  userName: [{ required: true, message: L('ThisFieldIsRequired') }],
  emailAddress: [
    { required: true, message: L('ThisFieldIsRequired') },
    {
      type: 'email',
      message: 'The input is not valid E-mail!',
    },
  ],
  address: [{ required: true, message: L('ThisFieldIsRequired') }],
  birthdate: [{ required: true, message: L('ThisFieldIsRequired') }],
};

export default rules;
