import ContactCollection from '../db/models/Contact.js';

import { calcPaginationData } from '../utils/calcPaginationData.js';

import { sortList } from '../constants/index.js';

export const getContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = '_id',
  sortOrder = sortList[0],
  filters = {},
}) => {
  const skip = (page - 1) * perPage;

  const contactQuery = ContactCollection.find({ userId: filters.userId });

  if (filters.userId) {
    contactQuery.where('userId').equals(filters.userId);
  }

  if (filters.contactType) {
    contactQuery.where('contactType').equals(filters.contactType);
  }

  if (filters.isFavourite !== undefined) {
    contactQuery.where('isFavourite').equals(filters.isFavourite);
  }

  const [totalItems, data] = await Promise.all([
    ContactCollection.find({ userId: filters.userId })
      .merge(contactQuery)
      .countDocuments(),
    contactQuery
      .skip(skip)
      .limit(perPage)
      .sort({ [sortBy]: sortOrder }),
  ]);

  const paginationData = calcPaginationData({ page, perPage, totalItems });
  return {
    data,
    totalItems,
    ...paginationData,
  };
};

export const getContactbyId = (id, userId) =>
  ContactCollection.findOne({ _id: id, userId });

export const addContact = (payload) => ContactCollection.create(payload);

// export const updateContact = async (id, userId, payload, options = {}) => {
//   const { upsert } = options;
//   const rawResult = await ContactCollection.findOneAndUpdate(
//     { _id: id, userId },
//     payload,
//     {
//       upsert,
//       includeResultMetadata: true,
//     },
//   );

//   if (!rawResult || !rawResult.value) return null;
//   return {
//     data: rawResult.value,
//     isNew: Boolean(rawResult.lastErrorObject.upserted),
//   };
// };

export const updateContact = async (id, userId, payload, options = {}) => {
  const contact = await ContactCollection.findOneAndUpdate(
    { _id: id, userId },
    payload,
    {
      new: true,
    },
  );
  return contact;
};

export const deleteContactById = (id, userId) =>
  ContactCollection.findOneAndDelete({ _id: id, userId });
