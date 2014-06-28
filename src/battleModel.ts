/// <reference path="affliction.ts"/>
/// <reference path="battleLogger.ts"/>
/// <reference path="card.ts"/>
/// <reference path="cardManager.ts"/>
/// <reference path="enums.ts"/>
/// <reference path="famDatabase.ts"/>
/// <reference path="formation.ts"/>
/// <reference path="player.ts"/>
/// <reference path="skill.ts"/>
/// <reference path="skillCalcType.ts"/>
/// <reference path="skillDatabase.ts"/>
/// <reference path="skillFunc.ts"/>
/// <reference path="skillRange.ts"/>
/// <reference path="util.ts"/>

class BattleModel {

    // set to true when doing a mass simulation and you don't care about the graphics or logging stuffs
    static IS_MASS_SIMULATION = false;

    logger : BattleLogger;
    cardManager: CardManager;
    
    player1: Player;
    player2: Player;

    playerWon: Player = null;
    
    // the two players' cards. The order of the cards in these two arrays should never be changed
    player1Cards : Card[];
    player2Cards : Card[];
    
    // contains all cards in play. Should be re-sorted every turn
    allCards: Card[];

    // only used for quickly get a card by its id
    allCardsById: any = {};
    
    // for the current card. Remember to update these when it's a new card's turn. Maybe move to a separate structure?
    currentPlayer : Player;
    oppositePlayer : Player;
    currentPlayerCards : Card[];
    oppositePlayerCards : Card[];
    
    private static _instance : BattleModel = null;

    public static getInstance() : BattleModel {
        if (BattleModel._instance === null) {
            BattleModel._instance = new BattleModel();
        }
        return BattleModel._instance;
    }

    constructor(data?: GameData, mode?: string) {
    
        if(BattleModel._instance) {
            throw new Error("Error: Instantiation failed: Use getInstance() instead of new.");
        }
        BattleModel._instance = this;
        this.logger = BattleLogger.getInstance();
        this.cardManager = CardManager.getInstance();
        
        var player1formation: string;
        var player2formation: string;
        var player1cardsInfo = [];
        var player2cardsInfo = [];
        
        if (mode == "random") {
            player1formation = pickRandomProperty(Formation.FORMATION_CONFIG);
            player2formation = pickRandomProperty(Formation.FORMATION_CONFIG);
            for (var i = 0; i < 5; i++) {
                player1cardsInfo.push(famDatabase[pickRandomProperty(famDatabase)]);
                player2cardsInfo.push(famDatabase[pickRandomProperty(famDatabase)]);
            }        
        }
        else {
            player1formation = data.player1formation;
            player2formation = data.player2formation;

            player1cardsInfo = data.player1cardsInfo;
            player2cardsInfo = data.player2cardsInfo;
        }        
        
        this.player1 = new Player(1, "Player 1", new Formation(player1formation), 1); // me
        this.player2 = new Player(2, "Player 2", new Formation(player2formation), 1); // opp
        
        // initialize the cards
        this.player1Cards = [];
        this.player2Cards = [];
        this.allCards = [];        
        
        for (var i = 0; i < 5; i++) {
            var player1Skills = this.makeSkillArray(player1cardsInfo[i].skills);
            var player2Skills = this.makeSkillArray(player2cardsInfo[i].skills);
            
            var stats1 = new Stats(player1cardsInfo[i].hp, player1cardsInfo[i].atk, 
                player1cardsInfo[i].def, player1cardsInfo[i].wis, player1cardsInfo[i].agi);
            var stats2 = new Stats(player2cardsInfo[i].hp, player2cardsInfo[i].atk, 
                player2cardsInfo[i].def, player2cardsInfo[i].wis, player2cardsInfo[i].agi);

            var auto1: Skill;
            if (player1cardsInfo[i].autoAttack) {
                auto1 = new Skill(player1cardsInfo[i].autoAttack);
            }
            else {
                auto1 = new Skill(0);
            }

            var auto2: Skill;
            if (player2cardsInfo[i].autoAttack) {
                auto2 = new Skill(player2cardsInfo[i].autoAttack);
            }
            else {
                auto2 = new Skill(0);
            }

            
            this.player1Cards[i] = new Card(player1cardsInfo[i].name,
                                        stats1, 
                                        player1Skills, 
                                        this.player1,
                                        i,
                                        player1cardsInfo[i].imageLink,
                                        auto1); //my cards
            this.player2Cards[i] = new Card(player2cardsInfo[i].name, 
                                        stats2,
                                        player2Skills, 
                                        this.player2,
                                        i,
                                        player2cardsInfo[i].imageLink,
                                        auto2);  // opp card
            this.allCards.push(this.player1Cards[i]);
            this.allCards.push(this.player2Cards[i]);

            this.allCardsById[this.player1Cards[i].id] = this.player1Cards[i];
            this.allCardsById[this.player2Cards[i].id] = this.player2Cards[i];
        }

        this.cardManager.sortAllCards();
        
        // save the initial field snapshot
        this.logger.saveInitialField();
        
        this.logger.displayFormationAndFamOnCanvas();
    }

    /**
     * Resets everything
     * Used for testing only
     */
    static resetAll() {
        BattleModel.removeInstance();
        BattleLogger.removeInstance();
    }

    /**
     * Allows to create a new instance
     * Used for testing only
     */
    static removeInstance() {
        BattleModel._instance = null;
    }
    
    /**
     * Given an array of skill ids, return an array of Skills
     */
    makeSkillArray (skills : number[]) {
        var skillArray : Skill[] = [];
        
        for (var i = 0; i < 3; i++) {
            if (skills[i]) {
                skillArray.push(new Skill(skills[i]));
            }
        }
        
        return skillArray;
    }
    
    getOppositePlayer (player : Player) {
        if (player == this.player1) {
            return this.player2;
        }
        else if (player == this.player2) {
            return this.player1;
        }
        else {
            throw new Error("Invalid player");
        }
    }

    damageToTarget(attacker : Card, target : Card, skill : Skill, additionalDescription : string) {
        var skillMod = skill.skillFuncArg1;
        var ignorePosition = (skill.skillFunc == ENUM.SkillFunc.MAGIC);
    
        var baseDamage : number;
            
        switch (skill.skillCalcType) {
            case (ENUM.SkillCalcType.DEFAULT) :
            case (ENUM.SkillCalcType.WIS) :
                baseDamage = getDamageCalculatedByWIS(attacker, target);
                break;
            case (ENUM.SkillCalcType.ATK) :
                baseDamage = getDamageCalculatedByATK(attacker, target, ignorePosition);
                break;
            case (ENUM.SkillCalcType.AGI) :
                baseDamage = getDamageCalculatedByAGI(attacker, target, ignorePosition);
                break;
        }
            
        // apply the multiplier
        var damage = skillMod * baseDamage;
            
        // apply the target's ward
        switch (skill.ward) {
            case ("PHYSICAL") :
                damage = Math.round(damage * (1 - target.status.attackResistance));
                break;
            case ("MAGICAL") :
                damage = Math.round(damage * (1 - target.status.magicResistance));
                break;
            case ("BREATH") :
                damage = Math.round(damage * (1 - target.status.breathResistance));
                break;
            default :
                throw new Error ("Wrong type of ward. Maybe you forgot to include in the skill?");
        }
    
        target.changeHP(-1 * damage);

        if (!additionalDescription) {
            additionalDescription = "";
        }
        var description = additionalDescription +
            target.name + " lost " + damage + "hp (remaining " + target.getHP() + "/" + target.originalStats.hp + ")";
        this.logger.addMinorEvent({
            executorId: attacker.id, 
            targetId: target.id, 
            type: ENUM.MinorEventType.HP, 
            amount: (-1) * damage, 
            description: description, 
            skillId: skill.id
        });

        if (target.getHP() <= 0) {
            this.logger.displayMinorEvent(target.name + " is dead");
            target.isDead = true;
        }

        this.processAffliction(attacker, target, skill);
    }

    // todo: move this to Card?
    damageToTargetDirectly(target: Card, damage: number, reason: string) {
        target.changeHP(-1 * damage);

        var description = target.name + " lost " + damage + " HP because of " + reason;
        
        this.logger.addMinorEvent({
            targetId: target.id, 
            type: ENUM.MinorEventType.HP, 
            amount: (-1) * damage, 
            description: description, 
        });
        
        if (target.getHP() <= 0) {
            this.logger.displayMinorEvent(target.name + " is dead");
            target.isDead = true;
        }
    }

    processAffliction(executor: Card, target: Card, skill: Skill) {
        var type: ENUM.AfflictionType = skill.skillFuncArg2
        var prob: number = skill.skillFuncArg3;

        if (!type) {
            return;
        }

        if (skill.skillFuncArg4 || skill.skillFuncArg5) {
            // arg4: number of turns for silent & blind, % for venom
            // arg5: miss prob. for blind
            var optParam = [skill.skillFuncArg4, skill.skillFuncArg5];
        }
            
        if(Math.random() <= prob){
            target.setAffliction(type, optParam);
            var description = target.name + " is now " + ENUM.AfflictionType[type];
            var maxTurn = 1;
            if (type == ENUM.AfflictionType.BLIND || type == ENUM.AfflictionType.SILENT) {
                maxTurn = skill.skillFuncArg4;
            }
            else if (type == ENUM.AfflictionType.POISON) {
                maxTurn = -1;
            }
            
            this.logger.addMinorEvent({
                executorId: executor.id, 
                targetId: target.id, 
                type: ENUM.MinorEventType.AFFLICTION, 
                affliction: {
                    type: type,
                    duration: maxTurn 
                },
                description: description,                 
            });
        }
    }
   
    startBattle () {
        this.logger.startBattleLog();
        
        this.performOpeningSkills();
        this.cardManager.sortAllCards();

        var finished = false;

        while (!finished) {

            this.logger.currentTurn++;
            this.logger.bblogTurn("Turn " + this.logger.currentTurn);

            // assuming both have 5 cards
            for (var i = 0; i < 10 && !finished; i++) {
                var currentCard = this.allCards[i];
                this.currentPlayer = currentCard.player;
                this.currentPlayerCards = this.cardManager.getPlayerCards(this.currentPlayer); // cards of the attacking player
                this.oppositePlayer = this.getOppositePlayer(this.currentPlayer);
                this.oppositePlayerCards = this.cardManager.getPlayerCards(this.oppositePlayer);

                if (!currentCard || currentCard.isDead) {
                    continue;
                }

                // procs active skill if we can
                var attackSkill = currentCard.attackSkill;
                if (attackSkill) {
                    if (Math.random() * 100 <= attackSkill.maxProbability && currentCard.canUseSkill()) {
                        this.logger.addMajorEvent({
                            description: currentCard.name + " procs " + attackSkill.name,
                            executorId: currentCard.id,
                            skillId: attackSkill.id
                        });

                        attackSkill.execute({
                            executor: currentCard,
                            skill: attackSkill
                        });
                    }
                    else {
                        this.executeNormalAttack(currentCard);
                    }
                }
                else {
                    this.executeNormalAttack(currentCard);
                }

                // update poison status
                if (!currentCard.isDead && currentCard.getAfflictionType() == ENUM.AfflictionType.POISON) {
                    currentCard.updateAffliction();
                }

                if (this.cardManager.isAllDead(this.oppositePlayerCards)) {
                    finished = true;
                    this.playerWon = this.currentPlayer;
                    this.logger.addMajorEvent({
                        description: currentCard.getPlayerName() + " has won"
                    });                    
                }
                else if (this.cardManager.isAllDead(this.currentPlayerCards)) {
                    finished = true;
                    this.playerWon = this.oppositePlayer;
                    this.logger.addMajorEvent({
                        description: this.oppositePlayer.name + " has won"
                    });
                }
            }

            if (!finished) {
                this.processEndTurn();
            }
        }
        return this.playerWon.name;
    }

    /**
     * Called at the end of two player's turn
     */
    processEndTurn() {
        // process end turn events: afflictions, etc.
        this.logger.addMajorEvent({
            description: "Turn end"
        });

        for (var i = 0; i < 10; i++) {
            var currentCard = this.allCards[i];
            if (currentCard.isDead) {
                continue;
            }

            // poison is updated at fam's turn end instead
            if (currentCard.getAfflictionType() != ENUM.AfflictionType.POISON) {
                var cured = currentCard.updateAffliction();
                // if cured, make a log
                if (!currentCard.affliction && cured) {
                    var desc = currentCard.name + " is cured of affliction!";
                    
                    this.logger.addMinorEvent({
                        targetId: currentCard.id, 
                        type: ENUM.MinorEventType.AFFLICTION, 
                        affliction: {
                            type: currentCard.getAfflictionType(),
                            isFinished: true,
                        },
                        description: desc, 
                        
                    });
                }
            }
        }
    }
    
    executeNormalAttack(attacker: Card) {

        if (!attacker.canAttack()) {
            return;
        }

        this.logger.addMajorEvent({
            description: attacker.name + " attacks!"
            // we may consider adding the attacker id and auto id later on
        });

        attacker.autoAttack.execute({
            executor: attacker,
            skill: attacker.autoAttack
        });
    }

    /**
     * Process the protecting sequence. Return true if a protect has been executed
     * or false if no protect has been executed
     *
     * @param targetsAttacked optional, set to null when multiple protect/hit is allowed
     */
    processProtect(attacker: Card, targetCard: Card, attackSkill: Skill, targetsAttacked: any): boolean {
        // now check if someone on the enemy side can protect before the damage is dealt
        var enemyCards = this.cardManager.getEnemyCards(attacker.player);
        var protectSkillActivated = false; //<- has any protect skill been activated yet?
        for (var i = 0; i < enemyCards.length && !protectSkillActivated; i++) {
            if (enemyCards[i].isDead) {
                continue;
            }
            var protectSkill = enemyCards[i].protectSkill;
            if (protectSkill) {
                var protector = enemyCards[i];

                // a fam cannot protect itself, unless the skillRange is 21 (hard-coded here for now)
                if (this.cardManager.isSameCard(targetCard, protector) && protectSkill.skillRange != 21) {
                    continue;
                }

                // if a fam that has been attacked is not allowed to protect (like in the case of AoE), continue
                if (targetsAttacked && targetsAttacked[protector.id]) {
                    continue;
                }

                if (!protector.canUseSkill()) {
                    continue;
                }

                // now check if the original target is in the protect range of the protector
                var defenseTargets = protectSkill.range.getTargets(protector);
                if (this.cardManager.isCardInList(targetCard, defenseTargets)) {
                    if (Math.random() * 100 <= protectSkill.maxProbability) {
                        // ok, so now activate the protect skill
                        protectSkillActivated = true;
                        protectSkill.execute({
                            executor: protector,
                            skill: protectSkill,
                            attacker: attacker,    // for protect
                            attackSkill: attackSkill, // for protect
                            targetCard: targetCard,  // for protect
                            targetsAttacked: targetsAttacked  // for protect
                        });
                    }
                }
            }
            else {
                // this fam doesn't have a protect skill, move on to the next one
                continue;
            }
        }
        return protectSkillActivated;
    }

    performOpeningSkills () {
        for (var i = 0; i < this.player1Cards.length; i++) {
            var skill1 = this.player1Cards[i].openingSkill;
            if (skill1) {
                if (Math.random() * 100 < skill1.maxProbability && this.player1Cards[i].canUseSkill()) {
                    this.logger.addMajorEvent({
                        description: this.player1Cards[i].name + " procs " + skill1.name,
                        executorId: this.player1Cards[i].id,
                        skillId: skill1.id
                    });
                    skill1.execute({
                        executor: this.player1Cards[i],
                        skill: skill1
                    });
                }
            }
        }
        
        for (var i = 0; i < this.player2Cards.length; i++) {
            var skill2 = this.player2Cards[i].openingSkill;
            if (skill2) {
                if (Math.random() * 100 < skill2.maxProbability && this.player2Cards[i].canUseSkill()) {
                    this.logger.addMajorEvent({
                        description: this.player2Cards[i].name + " procs " + skill2.name,
                        executorId: this.player2Cards[i].id,
                        skillId: skill2.id
                    });
                    skill2.execute({
                        executor: this.player2Cards[i],
                        skill: skill2
                    });
                }
            }
        }
    }
}

interface GameData {
    player1formation: string;
    player2formation: string;
    player1cardsInfo: any[];
    player2cardsInfo: any[];
}