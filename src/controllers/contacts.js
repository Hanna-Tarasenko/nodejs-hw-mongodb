import createHttpError from 'http-errors';

import { parseParinationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { contactSortFields } from '../db/models/Contact.js';
import { parseContactFilterParams } from '../utils/filters/parseContactFilterParams.js';

import {
  getContacts,
  getContactbyId,
  addContact,
  updateContact,
  deleteContactById,
} from '../services/contacts.js';
import { saveFileToLocal } from '../utils/saveFileToLocal.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { saveFile } from '../utils/saveFile.js';

export const getContactsController = async (req, res) => {
  const paginationParams = parseParinationParams(req.query);
  const sortParams = parseSortParams(req.query, contactSortFields);
  const filters = parseContactFilterParams(req.query);
  filters.userId = req.user._id;
  const data = await getContacts({
    ...paginationParams,
    ...sortParams,
    filters,
  });
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data,
  });
};

export const getContactbyIdController = async (req, res) => {
  const { id } = req.params;

  const { _id: userId } = req.user;

  const data = await getContactbyId(id, userId);

  if (!data) {
    throw createHttpError(404, `Contact with id=${id} not found`);
  }
  res.json({
    status: 200,
    message: `Successfully found contact with id=${id}`,
    data,
  });
};

export const addContactController = async (req, res) => {
  const { _id: userId } = req.user;
  let photo = null;
  if (req.file) {
    // photo = await saveFileToLocal(req.file);
    // photo = await saveFileToCloudinary(req.file);
    photo = await saveFile(req.file);
  }

  const data = await addContact({ ...req.body, userId, photo });
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact',
    data,
  });
};

export const upsertContactController = async (req, res) => {
  const { id } = req.params;

  const { _id: userId } = req.user;

  const { data, isNew } = await updateContact(id, userId, req.body, {
    upsert: true,
  });
  const status = isNew ? 201 : 200;
  res.status(status).json({
    status,
    message: 'Successfully updated contact',
    data,
  });
};

// export const patchContactController = async (req, res) => {
//   const { id } = req.params;
//   const { _id: userId } = req.user;

//   let photo = null;

//   if (req.file) {
//     // photo = await saveFileToLocal(req.file);
//     // photo = await saveFileToCloudinary(req.file);
//     photo = await saveFile(req.file);
//   }

//   const result = await updateContact(id, userId, { ...req.body, photo });

//   if (!result) {
//     throw createHttpError(404, `Contact with id=${id} not found`);
//   }

//   res.json({
//     status: 200,
//     message: 'Successfully patched a contact!',
//     data: result.data,
//   });
// };

export const patchContactController = async (req, res, next) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  const photo = req.file;

  let photoUrl;

  if (photo) {
    photoUrl = await saveFile(req.file);
  }

  const updateData = {
    ...req.body,
    photo: photoUrl,
  };

  const result = await updateContact(id, userId, updateData);

  if (!result) {
    throw createHttpError(404, `Contact with id=${id} not found`);
  }

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result,
  });
};

export const deleteContactController = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;

  const data = await deleteContactById(id, userId);

  if (!data) {
    throw createHttpError(404, `Contact with id=${id} not found`);
  }
  res.status(204).send();
};
