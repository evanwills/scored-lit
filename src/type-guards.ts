
export const isCustomEvent = (evt: Event): evt is CustomEvent => {
  return (evt as CustomEvent).detail !== undefined;
};

export const inputHasValue = (evt: EventTarget): evt is HTMLInputElement => {
  return (evt as HTMLInputElement).value !== undefined;
};
