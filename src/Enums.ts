module ENUM {
    export enum Setting {
        IS_MOBILE = 0
    }

    /**
     * Is the skill opening, attack, defense, etc.
     */
    export enum SkillType {
        OPENING = 1,
        ACTIVE = 2, // attack, active healing, revive, dispell, suicide, random
        DEFENSE = 3, // drain, counter, counter-indirect, survive, counter-debuff, onhit-buff, onhit-debuff,
        FIELD = 4,
        PROTECT = 5, // protect, protect-counter, evade, protect-reflect, counter-dispell
        EVADE = 6,
        ACTION_ON_DEATH = 16,
        PASSIVE = 20
    }

    /**
     * Based on activation time. Not really, but anyway
     */
    export enum SkillCategory {
        OPENING = 10,
        ACTIVE = 20,
        REACTIVE = 30, // a combination of DEFENSE, PROTECT and EVADE
        ACTION_ON_DEATH = 16,
    }

    /**
     * Is the skill buff, attack, magic, etc.
     */
    export enum SkillFunc {
        BUFF = 1, // arg1: multiplier, arg2, 3: status
        DEBUFF = 2, // arg1: multi, arg2: status
        ATTACK = 3, // arg1: multi, arg2: affliction, arg3: affliction prob.,
                    // arg4: number of turns for silent, blind & confuse, % for venom, arg5: miss prob.for blind & confuse prob
        MAGIC = 4, // anything that ignores position, args: same as ATTACK
        COOP = 5,
        REVIVE = 6, // arg1: hp heal ratio on revive
        KILL = 7, // arg1: multi, arg2: kill chance
        STEAL = 8,
        CHARGE = 9,
        DRAIN = 11, //arg1: always 1?
        PROTECT = 12,
        COUNTER = 13, // arg1: multi
        PROTECT_COUNTER = 14,
        TREASURE_HUNTER = 15,
        DISPELL = 16, //arg1-5: 0
        SUICIDE = 17,
        HEAL = 18, //arg1: multi, arg2: 0 if heal based on caster's wis, 1 if heal based on target's max HP
        AFFLICTION = 19, //arg1: always 0? arg2: afflict type, arg3: afflict prob.,
                         // arg4: turns for silent & blind, % for venom, dmg for burn, arg5: miss prob. for blind
        SURVIVE = 20, //arg1: HP threshold percent
        DEBUFFATTACK = 21, // arg1: multiplier, arg2: status, arg3: debuff prob., arg4: debuff multi (use WIS)
        DEBUFFINDIRECT = 22, // same as 21

        RANDOM = 24,
        COPY = 25,
        IMITATE = 26,
        EVADE = 27, // arg1: skill type to evade, arg2: skill calc type to evade, arg3 & 4: unimportant
        PROTECT_REFLECT = 28, // arg1: reflect mod, arg2: calctype can reflect, arg3: reflect range, arg4: attack type can reflect,
                              // arg5: damage ratio to take
        COUNTER_DISPELL = 29, // arg1, arg2: 0?, arg3: dispell range, arg4: ?? (aka protect-dispell)
        TURN_ORDER_CHANGE = 31, // arg1: new base, arg2: turn num
        CASTER_BASED_DEBUFF = 32, //arg1: multi, arg2, 3: status
        CASTER_BASED_DEBUFF_ATTACK = 33,  // arg1: multi, arg2: status, arg3: debuff prob, arg4: debuff multi
        CASTER_BASED_DEBUFF_MAGIC  = 34,  // same as 33

        DRAIN_ATTACK = 36, //arg1: multi, arg2: heal % of damage dealt, arg3: effect (unimportant), arg4: heal range
        DRAIN_MAGIC = 37, // same as 36
        ONHIT_DEBUFF = 38, //arg1: multi, arg2: type1, arg3: type2, arg4: flat amount debuff (-100*x), arg5: max no. of executions
        ONHIT_BUFF = 39,   // same as 38
        CLEAR_DEBUFF = 40,
        COUNTER_INDIRECT = 41,
        COUNTER_DEBUFF = 42, // 1: mod, 2: status, 3: prob, 4: debuff pow
        COUNTER_DEBUFF_INDIRECT = 43, // same as 42
        MULTI_BUFF = 44, // 1-5: same as buff, arg6: multiplier, arg7, 8: status
        MULTI_DEBUFF = 45,
        DEBUFF_AFFLICTION = 46, // 1-5: same as CASTER_BASED_DEBUFF, 6: afflict type, 7: afflict prob., 8, 9: afflict opt param
        ABSORB = 51, // 1: not used, 2: stat(s) to be absorbed, 3: skill mod used for the buff/debuff,
                     // 4: base stat for debuff (SkillCalcType, if is 6 (DEBUFF) then arg3 is the direct debuff amount)
                     // 5: percent gain from the amount debuffed of a target, 6: inner probability,
                     // 7, 8, 9: unimportant (effect ids), 10: not used
        ABSORB_ATTACK = 52, // 1: multi, rest: same as ABSORB
        ABSORB_MAGIC = 53, // same as 52
        PROTECT_COUNTER_DEBUFF = 56, // 1: counter mod, 2: debuff status, 3: debuff prob, 4: debuff power
        COUNTER_DRAIN_INDIRECT = 62,
        COUNTER_DRAIN = 63, // 1: counter mod, 2: heal ratio from damage done, 3: effect id, 4: heal range
        PROTECT_COUNTER_DRAIN_INDIRECT = 64,
        PROTECT_COUNTER_DRAIN = 65,
        PROTECT_COUNTER_DEBUFF_INDIRECT = 66,
        DAMAGE_PASSIVE = 1001,
        DEFENSE_PASSIVE = 1002,
        AFFLICTION_PROB_BUFF_PASSIVE = 1003,
        AFFLICTION_PASSIVE = 1005,
        EXTRA_TURN_PASSIVE = 1006,
    }

    /**
     * Is the skill calculated based on atk, wis, agi, etc.
     */
    export enum SkillCalcType {
        DEFAULT = 0, // default is Wis, usually used for buff
        ATK = 1,
        WIS = 2, // usually used for active skill
        AGI = 3,
        HEAL = 4,
        BUFF = 5,
        DEBUFF = 6,
        REFLECT = 7,
        ATK_WIS = 8,
        ATK_AGI = 9,
        WIS_AGI = 10
    }

    export enum ProtectAttackType {
        ALL = 0,
        NORMAL = 1,
        SKILL = 2,
        NOT_COUNTER = 3,
        COUNTER = 4
    }

    export enum StatType {
        HP, ATK, DEF, WIS, AGI
    }

    export enum StatusType { // skillFuncArg2 for buffs
        ATK = 1,
        DEF = 2,
        WIS = 3,
        AGI = 4,

        ATTACK_RESISTANCE = 5,
        MAGIC_RESISTANCE = 6,
        BREATH_RESISTANCE = 7,

        SKILL_PROBABILITY = 8,
        ALL_STATUS = 9,

        REMAIN_HP_ATK_UP = 11,
        REMAIN_HP_DEF_UP = 12,
        REMAIN_HP_WIS_UP = 13,
        REMAIN_HP_AGI_UP = 14,
        REMAIN_HP_ALL_STATUS_UP = 15,

        ACTION_ON_DEATH = 16,

        HP_SHIELD = 17,
        WILL_ATTACK_AGAIN = 18,

        REMAIN_HP_ATK_DEF_UP = 20,
        REMAIN_HP_ATK_WIS_UP = 21,
        REMAIN_HP_ATK_AGI_UP = 22,
        REMAIN_HP_DEF_WIS_UP = 23,
        REMAIN_HP_DEF_AGI_UP = 24,
        REMAIN_HP_WIS_AGI_UP = 25,
        REMAIN_HP_ATK_DEF_WIS_UP = 26,
        REMAIN_HP_ATK_DEF_AGI_UP = 27,
        REMAIN_HP_DEF_WIS_AGI_UP = 28,
        REMAIN_HP_ATK_WIS_AGI_UP = 29,

        WILL_ATTACK_AGAIN_PASSIVE = 30,
    }

    // seems to only be used by absorb
    export enum BuffStatusType {
        ATK         = 1,
        DEF         = 2,
        WIS         = 3,
        AGI         = 4,
        ATK_DEF     = 5,
        ATK_WIS     = 6,
        ATK_AGI     = 7,
        DEF_WIS     = 8,
        DEF_AGI     = 9,
        WIS_AGI     = 10,
        ATK_DEF_WIS = 11,
        ATK_DEF_AGI = 12,
        DEF_WIS_AGI = 13,
        ALL_STATUS  = 14, // ATK + DEF + WIS + AGI
    }

    export enum SkillRange {
        PASSIVE                =  0, // only passive skills have this range
        EITHER_SIDE            =  1,
        BOTH_SIDES             =  2,
        SELF_BOTH_SIDES        =  3,
        ALL                    =  4,
        ENEMY_NEAR_1           =  5,
        ENEMY_NEAR_2           =  6,
        ENEMY_NEAR_3           =  7,
        ENEMY_ALL              =  8,
        ENEMY_FRONT            =  9,
        ENEMY_MID              = 10,
        ENEMY_REAR             = 11,
        ENEMY_FRONT_ALL        = 12,
        ENEMY_MID_ALL          = 13,
        ENEMY_REAR_ALL         = 14,
        ENEMY_FRONT_MID_ALL    = 15,
        ENEMY_RANDOM_3         = 16,
        ENEMY_RANDOM_6         = 17,
        ENEMY_REAR_RANDOM_3    = 18,
        ENEMY_RANDOM_4         = 19,
        ENEMY_RANDOM_5         = 20,
        MYSELF                 = 21,
        EVERYONE               = 22,
        ENEMY_RANDOM_2         = 23,
        WIDE_ALL               = 24,
        WIDE_ENEMY_ALL         = 25,
        WIDE_NEIGHBOR          = 26,
        WIDE_SELF_NEIGHBOR     = 27,
        RIGHT                  = 28,
        SELF_RIGHT             = 29,
        LEFT                   = 30,
        SELF_LEFT              = 31,
        ENEMY_NEAR_4           = 32,
        ENEMY_NEAR_5           = 33,
        ENEMY_FRONT_REAR_ALL   = 34,
        ATTACKER               = 35,
        SELF_IMMEDIATE_RIGHT   = 36,
        SELF_IMMEDIATE_LEFT    = 37,

        ENEMY_REAR_RANDOM_2      = 38,
        ENEMY_REAR_RANDOM_4      = 39,
        ENEMY_REAR_RANDOM_5      = 40,
        ENEMY_REAR_RANDOM_6      = 41,
        ENEMY_FRONT_RANDOM_2     = 42,
        ENEMY_FRONT_RANDOM_3     = 43,
        ENEMY_FRONT_RANDOM_4     = 44,
        ENEMY_FRONT_RANDOM_5     = 45,
        ENEMY_FRONT_RANDOM_6     = 46,
        ENEMY_MID_FRONT_RANDOM_2 = 47,
        ENEMY_MID_FRONT_RANDOM_3 = 48,
        ENEMY_MID_FRONT_RANDOM_4 = 49,
        ENEMY_MID_FRONT_RANDOM_5 = 50,
        ENEMY_MID_FRONT_RANDOM_6 = 51,
        ENEMY_MID_REAR_RANDOM_2  = 52,
        ENEMY_MID_REAR_RANDOM_3  = 53,
        ENEMY_MID_REAR_RANDOM_4  = 54,
        ENEMY_MID_REAR_RANDOM_5  = 55,
        ENEMY_MID_REAR_RANDOM_6  = 56,

        FRIEND_RANDOM          = 101,
        FRIEND_RANDOM_2        = 102,
        FRIEND_RANDOM_3        = 103,
        FRIEND_RANDOM_4        = 104,
        FRIEND_RANDOM_5        = 105,
        FRIEND_RANDOM_6        = 106,

        FRIEND_SELF_RANDOM     = 111,
        FRIEND_SELF_RANDOM_2   = 112,
        FRIEND_SELF_RANDOM_3   = 113,
        FRIEND_SELF_RANDOM_4   = 114,
        FRIEND_SELF_RANDOM_5   = 115,
        FRIEND_SELF_RANDOM_6   = 116,

        FRIEND_UNIQUE_RANDOM   = 121,
        FRIEND_UNIQUE_RANDOM_2 = 122,
        FRIEND_UNIQUE_RANDOM_3 = 123,
        FRIEND_UNIQUE_RANDOM_4 = 124,
        FRIEND_UNIQUE_RANDOM_5 = 125,
        FRIEND_UNIQUE_RANDOM_6 = 126,

        FRIEND_SELF_UNIQUE_RANDOM     = 131,
        FRIEND_SELF_UNIQUE_RANDOM_2   = 132,
        FRIEND_SELF_UNIQUE_RANDOM_3   = 133,
        FRIEND_SELF_UNIQUE_RANDOM_4   = 134,
        FRIEND_SELF_UNIQUE_RANDOM_5   = 135,
        FRIEND_SELF_UNIQUE_RANDOM_6   = 136,

        FORCED_SELF_RANDOM_1          = 142,
        FORCED_SELF_RANDOM_2          = 143,
        FORCED_SELF_RANDOM_3          = 144,
        FORCED_SELF_RANDOM_4          = 145,
        FORCED_SELF_UNIQUE_RANDOM_2   = 153,
        FORCED_SELF_UNIQUE_RANDOM_3   = 154,
        FORCED_SELF_UNIQUE_RANDOM_4   = 155,

        BOTH_SIDES_SCALED             = 202,
        SELF_BOTH_SIDES_SCALED        = 203,
        ALL_SCALED                    = 204,
        ENEMY_ALL_SCALED              = 208,
        ENEMY_FRONT_ALL_SCALED        = 212,
        ENEMY_MID_ALL_SCALED          = 213,
        ENEMY_REAR_ALL_SCALED         = 214,
        ENEMY_FRONT_MID_ALL_SCALED    = 215,
        ENEMY_FRONT_REAR_ALL_SCALED   = 234,

        ENEMY_VARYING_RANDOM_4        = 419
    }

    export enum WardType {
        PHYSICAL = 1,
        MAGICAL = 2,
        BREATH = 3
    }

    export enum AfflictionType {
        POISON = 1,
        PARALYSIS = 2,
        FROZEN = 3,
        DISABLE = 4,
        SILENT = 5,
        CONFUSE = 6,
        BLIND = 7,
        BURN = 8
    }

    export enum BattleTurnOrderType {
        AGI = 0,
        ATK = 1,
        WIS = 2,
        DEF = 3,
        HP = 4,
    }

    export enum FormationRow {
        REAR = 3,
        MID = 2,
        FRONT = 1
    }

    export enum FormationType {
        SKEIN_5  = 0,
        VALLEY_5 = 1,
        TOOTH_5  = 2,
        WAVE_5   = 3,
        FRONT_5  = 4,
        MID_5    = 5,
        REAR_5   = 6,
        PIKE_5   = 7,
        SHIELD_5 = 8,
        PINCER_5 = 9,
        SAW_5    = 10,
        HYDRA_5  = 11
    }

    export enum BattleType {
        BLOOD_CLASH = 1,
        NORMAL = 2,
        COLISEUM = 3
    }

    export enum RandomBrigType {
        NONE     = 0,
        ALL      = 1,
        XP_ONLY  = 2,
        X_ONLY   = 3,
        X_UP     = 4,
        SP_ONLY  = 5,
        SP_UP    = 6,
        S_ONLY   = 7,
        S_UP     = 8,
        AP_ONLY  = 9,
        AP_UP    = 10,
        A_ONLY   = 11,
        A_UP     = 12
    }

    export enum RandomBrigText {
        "all"            = 1,
        "Tier X+"        = 2,
        "Tier X"         = 3,
        "Tier X and up"  = 4,
        "Tier S+"        = 5,
        "Tier S+ and up" = 6,
        "Tier S"         = 7,
        "Tier S and up"  = 8,
        "Tier A+"        = 9,
        "Tier A+ and up" = 10,
        "Tier A"         = 11,
        "Tier A and up"  = 12
    }

    export enum MinorEventType {
        HP = 1,
        STATUS = 2,
        AFFLICTION = 3,
        PROTECT = 4,
        DESCRIPTION = 5,
        BATTLE_DESCRIPTION = 51, // used for displaying things that affect the whole battle
        TEXT = 6, // used for displaying text in the debugger that has nothing to do with the battle
        REVIVE = 7,
        RESERVE_SWITCH = 8,
        BC_ADDPROB = 9, // added probability at end of turn in bloodclash
    }

    export enum RarityType {
        COMMON = 1,
        UNCOMMON = 2,
        RARE = 3,
        EPIC = 4,
        LEGEND = 5,
        MYTHIC = 6
    }

    export enum BonusType {
        COLISEUM = 1
    }

    export enum AddProbability {
        BLOODCLASH = 10,
        COLISEUM = 3
    }
}
