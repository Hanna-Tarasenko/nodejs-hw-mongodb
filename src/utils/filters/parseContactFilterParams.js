import { typeList } from '../../constants/contacts.js';

export const parseContactFilterParams = ({ isFavourite, type }) => {
  const parsedType = typeList.includes(type) ? type : undefined;
  const parsedIsFavourite =
    isFavourite !== undefined ? isFavourite === 'true' : undefined;
  return {
    isFavourite: parsedIsFavourite,
    contactType: parsedType,
  };
};
