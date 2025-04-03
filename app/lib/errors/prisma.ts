import { Prisma } from "@prisma/client"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

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

