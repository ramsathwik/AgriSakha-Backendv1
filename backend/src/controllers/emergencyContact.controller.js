import { User } from "../models/user.models.js";
import { EmergencyContact } from "../models/emergencycontacts.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";

export const getEmergencyContacts = asyncHandler(async (req, res) => {
  const user = req.user;

  const levels = [
    { key: "village", value: user.village },
    { key: "mandal", value: user.mandal },
    { key: "district", value: user.district },
    { key: "state", value: user.state },
  ];
  console.log(levels);
  for (const level of levels) {
    if (!level.value) continue;

    const contacts = await EmergencyContact.find({
      $or: [{ [level.key]: level.value }],
      isActive: true,
    });

    if (contacts.length > 0) {
      return res
        .status(200)
        .json(new ApiResponse(200, `${level.key} contacts found`, contacts));
    }
  }

  // No contacts at any level
  return res
    .status(200)
    .json(new ApiResponse(200, "No emergency contacts available", []));
});

export const addEmergencyContact = asyncHandler(async (req, res) => {
  const {
    officerName,
    phoneNumber,
    designation,
    department,
    serviceAreaLevel, // State / District / Mandal / Village
    specializations,
    state,
    district,
    mandal, // optional
    village, // optional
  } = req.body || {};

  // Validate required fields
  if (
    !officerName ||
    !phoneNumber ||
    !designation ||
    !department ||
    !serviceAreaLevel ||
    !state ||
    !district
  ) {
    throw new ApiError(400, "Missing required fields");
  }

  const newContactData = {
    officerName,
    phoneNumber,
    designation,
    department,
    serviceAreaLevel,
    specializations,
    state,
    district,
  };

  // Add optional fields ONLY if provided
  if (mandal) newContactData.mandal = mandal;
  if (village) newContactData.village = village;

  const contact = await EmergencyContact.create(newContactData);

  return res
    .status(201)
    .json(
      new ApiResponse(201, "Emergency contact added successfully", contact),
    );
});

export const updateEmergenctContact = asyncHandler(async (req, res) => {
  const contactId = req.params.contactId;
  if (!contactId) {
    throw new ApiError(400, "Contact ID is required");
  }

  const {
    officerName,
    phoneNumber,
    designation,
    department,
    serviceAreaLevel,
    specializations,
    state,
    district,
    mandal,
    village,
  } = req.body || {};

  const updatedFields = {};

  if (officerName) updatedFields.officerName = officerName;
  if (phoneNumber) updatedFields.phoneNumber = phoneNumber;
  if (designation) updatedFields.designation = designation;
  if (department) updatedFields.department = department;
  if (serviceAreaLevel) updatedFields.serviceAreaLevel = serviceAreaLevel;

  if (specializations) {
    updatedFields.specializations = specializations;
  }

  if (state) updatedFields.state = state;
  if (district) updatedFields.district = district;
  if (mandal) updatedFields.mandal = mandal;
  if (village) updatedFields.village = village;

  const updatedContact = await EmergencyContact.findByIdAndUpdate(
    contactId,
    updatedFields,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedContact) {
    throw new ApiError(404, "Contact not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Contact updated successfully", updatedContact));
});

export const deleteEmergencyContact = asyncHandler(async (req, res) => {
  const contactId = req.params.contactId;
  if (!contactId) {
    throw new ApiError(400, "Contact ID is required");
  }

  const deletedContact = await EmergencyContact.findByIdAndDelete(contactId);

  if (!deletedContact) {
    throw new ApiError(404, "Contact not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Contact deleted successfully"));
});

export const getAllEmergencyContacts = asyncHandler(async (req, res) => {
  const contacts = await EmergencyContact.find();
  res
    .status(200)
    .json(new ApiResponse(200, "Fetched Emergency Contacts", contacts));
});
