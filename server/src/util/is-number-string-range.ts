import { buildMessage, ValidateBy, ValidationOptions } from 'class-validator'

export const IS_NUMBER_STRING_RANGE = 'isNumberStringRange'

/**
 * Options to be passed to IsNumberStringRange decorator.
 */
export interface IsNumberStringRangeOptions {
  allowInfinity?: boolean
  maxDecimalPlaces?: number
  min?: number
  max?: number
}

/**
 * Checks if a given value is a number string
 */
export function isNumber(
  value: unknown,
  options: IsNumberStringRangeOptions = {},
): boolean {
  if (typeof value !== 'string') {
    return false
  }
  let num: number
  try {
    num = Number(value)
  } catch (e) {
    return false
  }

  if (num === Infinity || num === -Infinity) {
    return !!options.allowInfinity
  }
  if (Number.isNaN(num)) {
    return false
  }
  if (options.min && num < options.min) {
    return false
  }
  if (options.max && num > options.max) {
    return false
  }

  if (options.maxDecimalPlaces !== undefined) {
    let decimalPlaces = 0
    if (num % 1 !== 0) {
      decimalPlaces = value.toString().split('.')[1].length
    }
    if (decimalPlaces > options.maxDecimalPlaces) {
      return false
    }
  }

  return Number.isFinite(num)
}

/**
 * Checks if a value is a string that is a valid number within an optional range.
 */
export function IsNumberStringRange(
  options: IsNumberStringRangeOptions = {},
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_NUMBER_STRING_RANGE,
      constraints: [options],
      validator: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        validate: (value: unknown, args: any): boolean =>
          isNumber(value, args.constraints[0]),
        defaultMessage: buildMessage(
          (eachPrefix: string) =>
            eachPrefix +
            '$property must be a number string conforming to the specified constraints',
          validationOptions,
        ),
      },
    },
    validationOptions,
  )
}
