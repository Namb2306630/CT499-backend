const ContactService = require("../services/contact.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
  if (!req.body?.name) return next(new ApiError(400, "Name can not be empty"));

  try {
    const contactService = new ContactService(MongoDB.client);
    const doc = await contactService.create(req.body);
    res.json(doc);
  } catch {
    return next(
      new ApiError(500, "An error occurred while creating the contact"),
    );
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];
  try {
    const contactService = new ContactService(MongoDB.client);
    const { name } = req.query; //Lấy query parameter name để tìm kiếm contacts theo tên, nếu không có thì tìm tất cả contacts
    if (name) {
      documents = await contactService.findByName(name);
    } else {
      documents = await contactService.find({});
    }
  } catch {
    return next(
      new ApiError(500, "An error occurred while retrieving contacts"),
    );
  }

  return res.json(documents);
};

exports.findOne = async (req, res, next) => {
  const { id } = req.params;

  if (!id) return next(new ApiError(400, "Id can not be empty"));

  try {
    const contactService = new ContactService(MongoDB.client);
    const document = await contactService.findById(id);

    if (!document) return next(new ApiError(404, "Contact not found"));

    return res.json(document);
  } catch {
    return next(new ApiError(500, `Error retrieving contact with id=${id}`));
  }
};

exports.update = async (req, res, next) => {
  const { id } = req.params;
  const payload = req.body;

  if (!id) return next(new ApiError(400, "Id can not be empty"));
  if (Object.keys(payload).length === 0)
    return next(new ApiError(400, "Data to update can not be empty"));
  try {
    const contactService = new ContactService(MongoDB.client);
    const document = await contactService.update(id, payload);
    if (!document) return next(new ApiError(404, "Contact not found"));

    res.json(document);
  } catch {
    return next(new ApiError(500, `Error updating contact with id=${id}`));
  }
};

exports.delete = async (req, res, next) => {
  const { id } = req.params;
  if (!id) return next(new ApiError(400, "Id can not be empty"));

  try {
    const contactService = new ContactService(MongoDB.client);
    const document = await contactService.delete(id);
    if (!document) return next(new ApiError(404, "Contact not found"));
    res.json(document);
  } catch {
    return next(new ApiError(500, `Could not delete contact with id=${id}`));
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    const contactService = new ContactService(MongoDB.client);
    const deletedCount = await contactService.deleteAll();

    return res.json({
      message: `${deletedCount} contacts were deleted successfully!`,
    })
  } catch {
    return next(
      new ApiError(500, "An error occurred while removing all contacts"),
    );
  }
};

exports.findAllFavorite = async (req, res, next) => {
  try {
    const contactService = new ContactService(MongoDB.client);
    const documents = await contactService.findFavorite();

    res.json(documents);
  } catch {
    return next(
      new ApiError(500, "An error occurred while retrieving favorite contacts"),
    );
  }
};
