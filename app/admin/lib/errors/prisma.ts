import { Prisma } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { TError } from "./response";

export const prismaErrors = (error: PrismaClientKnownRequestError) => {
  let message: string = "";
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      console.log({ error });
      const table = error?.meta?.modelName;
      const target = error?.meta?.target;
      message =
        "Error: ya se ha registrado un(a) " +
        table +
        " con ese valor (" +
        target +
        ")";
    } else {
      message = error.message;
    }
  }
  return message;
};

export const CatchError = <T>(error: unknown, action?: string): TError<T> => {
  const obj: TError<T> = {
    message: "",
    hasError: true,
    body: undefined,
  };

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const field = (error?.meta?.target as string)?.split("_").at(-2) as string;
    obj.message = `Error al ${action ?? "crear"} el elemento`;
    const bodyError: { [key: string]: string } = {};
    if (error.code === "P2002") {
      bodyError[field] = `Ya existe un ${field} con este valor`;
      obj.body = { ...bodyError } as T;
    }
  } else {
    if (error && typeof error === "object" && "message" in error) {
      obj.message = (error as { message: string }).message;
    }
  }

  return obj;
};
