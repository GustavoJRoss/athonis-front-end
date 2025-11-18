export type DialogOpenType = "view" | "edit" | "create";

export type DialogOpenRef<T> = {
  open: (type: DialogOpenType, data?: T) => void;
};
