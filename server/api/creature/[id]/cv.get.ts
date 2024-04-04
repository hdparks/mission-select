import { FORWARDS, START } from "@eventstore/db-client"
import getEventStoreClient from "~/composables/eventStoreClient"
import { AttendedSchool, AttendedSchoolType, BecameEnemies, BecameEnemiesType, BecameFriends, BecameFriendsType, GainedExperience, GainedExperienceType, JoinedGroup, JoinedGroupType, LeftGroup, LeftGroupType, LeveledUp, LeveledUpType, WasBorn, WasBornType } from "~/types/events/creatureEvents";

const GALACTIC_NOW = 2024;

interface CreatureCV {
  age: number;
  height: number;
  weight: number;
  name: string;
  species: string;
  classes: { class: string, level: number; }[],
  skills: { skill: string, level: number; }[],
  schools: string[];
  apprenticeships: string[];
  affiliations: {groupName: string, startDate: number, endDate: number|null}[];
  friends: number[];
  enemies: number[];
  totalXP: number;
}

function addSkill(cv: Partial<CreatureCV>, skill: string, level: number){
  if (cv.skills == null) { cv.skills = [] } 
  let currentSkill = cv.skills.find(s => s.skill == skill)
  if (currentSkill == null) {
    currentSkill = {skill: skill, level: level}
    cv.skills.push(currentSkill)
  }
  currentSkill.level = level
}

function addSchool(cv: Partial<CreatureCV>, school: string){ 
  if (cv.schools == null) { cv.schools = []}
  if (cv.schools.includes(school)) {return;}
  cv.schools.push(school)
}

function addClass(cv: Partial<CreatureCV>, className: string, level: number){
  if (cv.classes == null) { cv.classes = []}
  let currentClass = cv.classes.find(c => c.class == className)
  if (currentClass == null) {
    currentClass = {class: className, level: level}
    cv.classes.push(currentClass)
  }
  currentClass.level = level
}

function addFriend(cv: Partial<CreatureCV>, friendId: number) {
  if(cv.friends == null) {cv.friends = []}
  if(cv.friends.includes(friendId)) {return;}
  cv.friends.push(friendId)
}

function removeFriend(cv: Partial<CreatureCV>, friendId: number){
  cv.friends = cv.friends?.filter(fid => fid != friendId)
}

function addEnemy(cv: Partial<CreatureCV>, enemyId: number) {
  if(cv.enemies == null) {cv.enemies = []}
  if(cv.enemies.includes(enemyId)) {return;}
  cv.enemies.push(enemyId)
}

function removeEnemy(cv: Partial<CreatureCV>, enemyId: number){
  cv.enemies = cv.enemies?.filter(fid => fid != enemyId)
}

function addAffiliation(cv: Partial<CreatureCV>, groupName: string, startDate: number){
  if (cv.affiliations == null) {cv.affiliations = []}
  cv.affiliations.push({groupName: groupName, startDate: startDate, endDate: null})
}

function endAffiliation(cv: Partial<CreatureCV>, groupName: string, endDate: number) {
  if (cv.affiliations == null) { return; }
  const affiliation = cv.affiliations.find(g => g.groupName == groupName)
  if (affiliation == null) { return;}
  affiliation.endDate = endDate
}

export default defineEventHandler(async (event) => {
  const client = getEventStoreClient()
  const cv: Partial<CreatureCV> = {};
  if (event.context.params == null) return cv
  const creatureId = event.context.params.id
  const events = client.readStream('asdf', {
    direction: FORWARDS,
    fromRevision: START,
  })


  for await (const resolvedEvent of events) {
    const ev = resolvedEvent.event;
    switch (ev?.type) {
      case WasBornType: {
        const bornEvent = ev.data as WasBorn['data'];
        if (bornEvent.creatureId.toString() != creatureId) { break;}
        cv.age = GALACTIC_NOW - bornEvent.year;
        cv.name = bornEvent.name;
        cv.height = bornEvent.height;
        cv.weight = bornEvent.weight;
        cv.species = bornEvent.species;
        break;
      }
      case AttendedSchoolType: {
        const attendedSchoolEvent = ev.data as AttendedSchool['data'];
        addSchool(cv, attendedSchoolEvent.schoolName)
        addSkill(cv, attendedSchoolEvent.skill, attendedSchoolEvent.skillAfter)
        break;
      }
      case JoinedGroupType: {
        const data = ev.data as JoinedGroup['data']
        addAffiliation(cv, data.groupName, data.year)
        break;
      }
      case LeftGroupType:  {
        const data = ev.data as LeftGroup['data']
        endAffiliation(cv, data.groupName, data.year)
        break;
      }
      case LeveledUpType: {
        const data = ev.data as LeveledUp['data']
        addClass(cv, data.class, data.level)
        break;
      }
      case GainedExperienceType: {
        const data = ev.data as GainedExperience['data']
        cv.totalXP = (cv.totalXP ?? 0) + data.xpGained
        break;
      }
      case BecameFriendsType: {
        const data = ev.data as BecameFriends['data']
        addFriend(cv, data.friendId)
        if (data.amityAfter - data.amityGained < 0){
          removeEnemy(cv, data.friendId)
        }
        break;
      } 
      case BecameEnemiesType: {
        const data = ev.data as BecameEnemies['data']
        addEnemy(cv, data.enemyId)
        if (data.amityAfter + data.amityLost > 0){
          removeFriend(cv, data.enemyId)
        }
      }
    }
  }

  return cv
})
