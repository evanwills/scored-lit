
export const isCustomEvent = (target: Event): target is CustomEvent => {
  return (target as CustomEvent).detail !== undefined;
};

export const inputHasValue = (target: EventTarget): target is HTMLInputElement => {
  return (target as HTMLInputElement).value !== undefined;
};

export const linkHasHref = (target: EventTarget): target is HTMLAnchorElement => {
  return (target as HTMLAnchorElement).href !== undefined;
};
