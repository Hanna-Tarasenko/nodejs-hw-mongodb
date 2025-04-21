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

  const contactQuery = ContactCollection.find();
  if (filters.contactType) {
    contactQuery.where('contactType').equals(filters.contactType);
  }

  if (filters.isFavourite !== undefined) {
    contactQuery.where('isFavourite').equals(filters.isFavourite);
  }

  const [totalItems, data] = await Promise.all([
    ContactCollection.find().merge(contactQuery).countDocuments(),
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

export const getContactbyId = (id) => ContactCollection.findOne({ _id: id });

export const addContact = (payload) => ContactCollection.create(payload);

export const updateContact = async (_id, payload, options = {}) => {
  const { upsert } = options;
  const rawResult = await ContactCollection.findByIdAndUpdate(
    { _id },
    payload,
    {
      upsert,
      includeResultMetadata: true,
    },
  );

  if (!rawResult || !rawResult.value) return null;
  return {
    data: rawResult.value,
    isNew: Boolean(rawResult.lastErrorObject.upserted),
  };
};

export const deleteContactById = (_id) =>
  ContactCollection.findOneAndDelete({ _id });
