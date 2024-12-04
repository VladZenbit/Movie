import { validate } from 'uuid';

/**
 * Validates whether a given string is a valid UUID.
 *
 * @param uuid - The string to validate as a UUID.
 * @returns {boolean} - Returns `true` if the string is a valid UUID, otherwise returns `false`.
 *
 * Example:
 * validateUID('123e4567-e89b-12d3-a456-426614174000'); // true
 * validateUID('invalid-uuid'); // false
 */
export const validateUID = (uuid: string): boolean => {
  return validate(uuid);
};
