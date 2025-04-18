import { typeList } from '../../constants/contacts.js';

export const parseContactFilterParams = ({ isFavourite, contactType }) => {
  const parsedType = typeList.includes(contactType) ? contactType : undefined;
  const parsedIsFavourite =
    isFavourite !== undefined ? isFavourite === 'true' : undefined;
  return {
    isFavourite: parsedIsFavourite,
    contactType: parsedType,
  };
};
