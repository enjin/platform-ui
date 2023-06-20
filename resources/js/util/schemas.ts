import * as yup from 'yup';
import { isValidAddress } from './address';

export const integerRegex = /^[0-9]+$/;
export const integerRangeRegex = /^([0-9]+)\.\.([0-9]+)$/;

export const testInteger = (value: string) => {
    if (integerRangeRegex.test(value)) {
        const [start, end] = value.split('..');
        if (Number(start) > Number(end)) return false;
    } else if (integerRegex.test(value)) {
        if (Number(value) < 0) return false;
    } else if (!integerRegex.test(value) && !integerRangeRegex.test(value)) {
        return false;
    }

    return true;
};

export const integerOrRangeSchema = yup
    .array()
    .of(yup.string())
    .test('validStrings', 'Invalid format found', (value) => {
        if (!value) return false;

        for (let i = 0; i < value.length; i++) {
            const currentValue = value[i];
            if (!currentValue) return false;

            if (!testInteger(currentValue)) return false;
        }

        return true;
    })
    .min(1, 'Token IDs are required');

export const stringRequiredSchema = yup.string().nullable().required();

export const stringNotRequiredSchema = yup.string().nullable();

export const addressRequiredSchema = yup
    .string()
    .required()
    .test('is-address', 'Invalid address', (val: string) => !val || isValidAddress(val));

export const addressNotRequiredSchema = yup
    .string()
    .ensure()
    .test('is-address', 'Invalid address', (val: string) => !val || isValidAddress(val));

export const collectionIdRequiredSchema = yup.number().typeError('Collection ID must be a number').required();

export const dateRequiredSchema = yup.date().required();

export const numberRequiredSchema = yup.number().required();

export const numberNotRequiredSchema = yup.number().nullable();

export const booleanRequiredSchema = yup.boolean().required();

export const booleanNotRequiredSchema = yup.boolean().default(false);
