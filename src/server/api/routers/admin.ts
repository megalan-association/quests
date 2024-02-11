import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { db } from "~/server/db";

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { roomTask } from "./room";

export const AdminRouter = createTRPCRouter({
  joinSociety: protectedProcedure
    .input(z.object({ id: z.number().min(0) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          societies: { connect: { id: input.id } },
          type: "ADMIN",
        },
      });
    }),

  leaveSociety: adminProcedure
    .input(z.object({ id: z.number().min(0) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          societies: { disconnect: { id: input.id } },
        },
      });

      const userSocieties = await ctx.db.society.count({
        where: {
          users: {
            some: {
              id: ctx.session.user.id,
            },
          },
        },
      });

      if (userSocieties === 0) {
        await ctx.db.user.update({
          where: {
            id: ctx.session.user.id,
          },
          data: {
            type: "PARTICIPANT",
          },
        });
      }

      return true;
    }),

  getSocietyName: protectedProcedure
    .input(z.object({ token: z.string().min(0) }))
    .query(async ({ ctx, input }) => {
      return ctx.db.society.findFirstOrThrow({
        where: {
          joinToken: input.token,
        },
        select: {
          name: true,
          id: true,
          image: true,
        },
      });
    }),

  getAllSocieties: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.society.findMany({
      select: {
        id: true,
        name: true,
        image: true,
      }
    });
  }),

  getAdminSocietyList: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findFirst({
      where: { id: ctx.session.user.id },
      select: {
        societies: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
  }),

  getAllTask: adminProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findFirstOrThrow({
      where: { id: ctx.session.user.id },
      select: {
        societies: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return ctx.db.task.findMany({
      where: {
        societies: {
          some: {
            id: {
              in: user.societies.map((s) => s.id),
            },
          },
        },
      },
      select: {
        id: true,
        activated: true,
        description: true,
        name: true,
        points: true,
        societies: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      distinct: ["id"],
    });
  }),
});

export const getAdminSocietyList = async (userId: number) => {
  return db.user.findFirst({
    where: { id: userId },
    select: {
      societies: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });
};

export const getAllSocieties = async () => {
  return db.society.findMany({
    select: {
      id: true,
      name: true,
      image: true,
    }
  });
}

export const getAllTask = async (userId: number) => {
  const user = await db.user.findFirstOrThrow({
    where: { id: userId },
    select: {
      societies: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  return db.task.findMany({
    where: {
      societies: {
        some: {
          id: {
            in: user.societies.map((s) => s.id),
          },
        },
      },
    },
    select: {
      id: true,
      activated: true,
      description: true,
      name: true,
      points: true,
      societies: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    distinct: ["id"],
  });
}

export type Society = {
  name: string;
  id: number;
  image: string | null;
};

export type Task = {
  name: string;
  description: string;
  activated: boolean;
  points: number;
  id: number;
  societies: Society[];
}
