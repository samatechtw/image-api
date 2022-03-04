class StringHelper {
  isInEnum = <EnumType extends string | number>(
    enumType: { [key in EnumType]: string },
    str: string,
  ): boolean => {
    return Object.values(enumType).includes(str)
  }
}

export default new StringHelper()
