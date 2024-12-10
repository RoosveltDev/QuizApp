import { User } from '@prisma/client';
import { prisma } from '../../db';

// **** Functions **** //

async function getOneById(id: number): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  return user ?? null;
}

async function getOneByUsername(username: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });
  return user ?? null;
}

async function getAll(): Promise<User[]> {
  const users = await prisma.user.findMany();
  return users;
}

async function getManyByTotalScore(quantity: number): Promise<User[]> {
  const users = await prisma.user.findMany({
    orderBy: {
      totalScore: 'desc',
    },
    take: quantity,
  });
  return users;
}

async function persistsById(id: number): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  return user !== null;
}

async function persistsByUsername(username: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });
  return user !== null;
}

async function add(username: string, password: string): Promise<void> {
  await prisma.user.create({
    data: {
      username,
      password,
    },
  });
}

async function update(user: Partial<User>): Promise<void> {
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      wins: user.wins,
      totalScore: user.totalScore,
      playedGames: user.playedGames,
    },
  });
}

async function delete_(id: number): Promise<void> {
  await prisma.user.delete({
    where: {
      id,
    },
  });
}

export default {
  getOneById,
  getOneByUsername,
  persistsById,
  persistsByUsername,
  getAll,
  getManyByTotalScore,
  add,
  update,
  delete: delete_,
} as const;
