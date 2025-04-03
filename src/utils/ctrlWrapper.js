// import { getContactsController } from '../controllers/contacts.js';

export const ctrlWrapper = (getContactsController) => {
  const func = async (req, res, next) => {
    try {
      await getContactsController(req, res, next);
    } catch (error) {
      next(error);
    }
  };
  return func;
};
