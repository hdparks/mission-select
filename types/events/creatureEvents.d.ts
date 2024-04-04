import type { JSONEventType } from "@eventstore/db-client";
import { UUID } from "@eventstore/db-client/generated/shared_pb";

export const WasBornType = "was-born"
export type WasBorn = JsonEventType<
  WasBornType,{ 
  creatureId: UUID;
  species: string;
  planet: string;
  name: string;
  height: number;
  weight: number;
  year: number;
}>;

export const AttendedSchoolType = "attended-school"
export type AttendedSchool = JsonEventType<
  AttendedSchoolType,{ 
  creatureId: UUID;
  schoolName: string;
  skill: string;
  skillImprovement: number;
  skillAfter: number;
}>;

export const WorkedApprenticeshipType = "worked-apprenticeship"
export type WorkedApprenticeship = JsonEventType<
  WorkedApprenticeshipType,{ 
  creatureId: UUID;
  masterName: string;
  skillImprovement: number;
  skillAfter: number;
}>;

export const JoinedGroupType = "joined-group"
export type JoinedGroup = JsonEventType<
  JoinedGroupType,{ 
  creatureId: UUID;
  groupName: string;
  year: number;
}>;

export const LeftGroupType = "left-group"
export type LeftGroup = JsonEventType<
  LeftGroupType,{ 
  creatureId: UUID;
  groupName: string;
  year: number;
}>;

export const LeveledUpType = "leveled-up"
export type LeveledUp = JsonEventType<
  LeveledUpType,{ 
  creatureId: UUID;
  class: string;
  level: number;
}>;

export const GainedExperienceType = "gained-experience"
export type GainedExperience = JsonEventType<
  GainedExperienceType,{ 
  creatureId: UUID;
  xpGained: number;
  xpAfter: number;
}>;

export const FoughtEnemyType = "fought-enemy"
export type FoughtEnemy = JsonEventType<
  FoughtEnemyType,{ 
  creatureId: UUID;
  enemyId: UUID;
  outcome: string;
}>;

export const TrainedType = "trained"
export type Trained = JsonEventType<
  TrainedType,{ 
  creatureId: UUID;
  skills: string[];
  description: string;
}>;

export const BecameFriendsType = "became-friends"
export type BecameFriends = JsonEventType<
  BecameFriendsType,{ 
  creatureId: UUID;
  friendId: UUID;
  amityGained: number;
  amityAfter: number;
}>;

export const BecameEnemiesType = "became-enemies"
export type BecameEnemies = JsonEventType<
  BecameEnemiesType,{ 
  creatureId: UUID;
  enemyId: UUID;
  amityLost: number;
  amityAfter: number;
}>;

