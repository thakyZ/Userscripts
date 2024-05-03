export function hasBooleanProperty(obj: object, property: any): boolean {
  if (Object.hasOwn(obj, property), typeof Object.entries(obj)[property] === "boolean") {
    return true;
  } else {
    return false;
  }
}

export function hasStringProperty(obj: object, property: any): boolean {
  if (Object.hasOwn(obj, property), typeof Object.entries(obj)[property] === "string") {
    return true;
  } else {
    return false;
  }
}