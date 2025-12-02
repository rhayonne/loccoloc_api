import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

/* EMAIL REGEX */
export const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

/* IBAN VALIDATION*/
const countriesAccepteds = ['FR'];
@ValidatorConstraint({ name: 'isFrIBAN', async: false })
export class ValidationRIB implements ValidatorConstraintInterface {
  validate(iban: string, args: ValidationArguments): boolean {
    if (!iban || typeof iban !== 'string' || iban.length < 2) {
      return false;
    }

    const coutryCode = iban.substring(0, 2).toUpperCase();

    const isCountryAccepted = countriesAccepteds.includes(coutryCode);
    return isCountryAccepted && iban.length > 10;
  }
  defaultMessage(args?: ValidationArguments): string {
    const acceptedList = countriesAccepteds.join(',');
    return ` Le champ ${args?.property} doit être un IBAN des pays acceptés : ${acceptedList}.`;
  }
}
/* END IBAN VALIDATION */
