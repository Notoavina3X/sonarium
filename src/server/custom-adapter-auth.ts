import { PrismaAdapter } from "@next-auth/prisma-adapter";

/** @return { import("next-auth/adapters").Adapter } */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CustomPrismaAdapterForNextAuth(prisma: any) {
  const adapter = PrismaAdapter(prisma);

  adapter.createUser = async (data) => {
    const userExist = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (userExist) {
      return userExist;
    }

    return prisma.user.create({
      data: {
        ...data,
        username:
          data.username ||
          `${data.email.split("@")[0]}_${Math.random()
            .toString(36)
            .substring(7)}`,
      },
    });
  };

  return adapter;
}
