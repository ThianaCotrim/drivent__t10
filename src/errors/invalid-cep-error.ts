import { ApplicationError } from '@/protocols';

export function invalidCEPError(message: string): ApplicationError {
  return {
    name: 'InvalidCEPError',
    message,
  };
}