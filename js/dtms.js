// players database temporary deleted
//const PLAYERS_DB = players.players;  //array of players

const decisions = require('./decisions.js');
const Notifications = require('./notificationModal');
const TeamModal = require('./teamModal');

// HTML CONSTANTS
const characterDialog = $('#create-form');
const characterButton = $('#create-character');
const characterInput  = $('#inlineFormInputGroup');
const moneyText       = $('#money-text');
const dateText        = document.getElementById("date-text");
const costsText       = $('#costs-text');
const costsDescr      = $('#costs-description');
const game            = $('#game');
const menu            = $('#menu');
const newGameBtn      = $('#new-game');
const continueBtn     = $('#continue');
const createTeam      = $('#create-team');

let teamId = 0, managerId = 0;  // unique ids
let day, week, month, year;     // date
let time;                       // date function
let MAIN_CHARACTER;
let escMenuEvent;               // pause/menu toggle

const Game = {
    paused          : false,
    initialized     : false,
    tournaments     : {
        level1 : [
            {
                name : "Dota Star League",
                prize : 10000,
                startDate : '1/5/3/1'
            }
        ]
    },
    events          : [],
    notifications   : [],

    pause           : function () {
        Game.paused = true;
    },

    unpause         : function () {
        Game.paused = false;
    },

    daysToDate      : function ( days ) {
        let daysTotal = days + day;

        let newDays = daysTotal % 7 === 0 ? 7 : daysTotal % 7;

        daysTotal = newDays === 7 ? daysTotal - 7 : daysTotal;

        let weeksTotal = daysTotal % 7 === 0 ? daysTotal / 7 + week : Math.floor(daysTotal / 7) + week;

        let newWeeks = weeksTotal % 4 === 0 ? 4 : weeksTotal % 4;

        weeksTotal = newWeeks === 4 ? weeksTotal - 4 : weeksTotal;

        let monthsTotal = weeksTotal % 4 === 0 ? weeksTotal / 4 + month : Math.floor(weeksTotal / 4) + month;

        let newMonth = monthsTotal % 12 === 0 ? 12 : monthsTotal % 12;

        monthsTotal = newMonth === 12 ? monthsTotal - 12 : monthsTotal;

        let newYear = monthsTotal % 12 === 0 ? monthsTotal / 12 : Math.floor(monthsTotal / 12) + year;

        return newDays + '/' + newWeeks + '/' + newMonth + '/' + newYear;
    },

    getDate         : function () {
        return day + '/' + week + '/' + month + '/' + year;
    },

    pushEvent       : function ( obj ) {
        let uniqueId = true;

        if (this.events.length > 0)
        {
            this.events.forEach(function (e) {
                if ( e.eventId === obj.eventId )
                {
                    return uniqueId = false;
                }
            });

            if (uniqueId)
            {
                this.events.push(obj);
            }
        }
        else
        {
            this.events.push(obj);
        }
    },

    createNotification : function ( obj ) {
        let message;

        message = Notifications.create({
            title     : obj.title,
            msg       : obj.msg,
            onConfirm : () => {
                if (obj.onConfirm)
                {
                    obj.onConfirm();
                }

                Game.unpause();
            }
        });

        if (obj.buttons)
        {
            message = Notifications.create({
                title     : obj.title,
                msg       : obj.msg,
                buttons   : obj.buttons,
                callback  : () => Game.unpause()
            });
        }

        this.notifications.push(message);
    },

    over            : function () {
        return reInitialize();
    },

    start           : function () {
        return gameStarting();
    },

    init            : function () {
        if (!this.initialized)
        {
            const DAY_INTERVAL = 2000;

            const triggerEvent = e => {
                if (e.triggerFn)
                {
                    e.triggerFn();
                }

                if (e.notification)
                {
                    this.createNotification(e.notification);
                }
            };

            // main frame func
            const update = () => {
                if (!Game.paused)
                {
                    if (this.events.length > 0)
                    {
                        this.events.forEach( event => {
                            if (event.triggerDate === this.getDate())
                            {
                                triggerEvent(event);
                                this.events = this.events.filter( (e) => e.eventId !== event.eventId );
                            }

                            if (event.triggerDate === "monthly")
                            {
                                if (day === 7 && week === 4)
                                {
                                    triggerEvent(event);
                                }
                            }

                            if (event.triggerDate === "daily")
                            {
                                triggerEvent(event);
                            }
                        } );
                    }

                    if (this.notifications.length > 0)
                    {
                        const backdrop = $('#backdrop');

                        let next = true;

                        this.notifications.forEach( notification => {
                            if (next)
                            {
                                next = false;

                                Game.pause();

                                $('#notifications').append(notification);
                                backdrop.addClass('modal-backdrop');

                                if (this.notifications.indexOf(notification) > -1)
                                {
                                    this.notifications.splice(this.notifications.indexOf(notification), 1);
                                }
                            }
                        } );
                    }

                    day = day + 1;

                    if (day > 7 )
                    {
                        week = week + 1;
                        day = 1;
                    }

                    if (week > 4)
                    {
                        month = month + 1;
                        week = 1;
                    }

                    if (month > 12)
                    {
                        year = year + 1;
                        month = 1;
                    }

                    if (MAIN_CHARACTER.money < 1) // lost
                    {
                        this.createNotification({
                            title: 'GAME INFO',
                            msg : 'You lost! Try again. Maybe you should\'ve get another players in your team. :D',
                            onConfirm : () => clearInterval(time)
                        })
                    }

                    dateText.innerHTML = `Day ${day} Week ${week} Month ${month} Year ${year}`;
                }
            };

            // events & handlers
            escMenuEvent = e => {
                if (e.keyCode === 27)
                {
                    Game.paused = !Game.paused;

                    game.css('display') === "none" ? game.show() : game.hide();
                    menu.css('display') === "none" ? menu.show() : menu.hide();
                    createTeam.css('display') === "none" ? createTeam.show() : createTeam.hide();
                }
            };

            const continueEvent = e => {
                Game.paused = false;
                menu.hide();
                game.show();
            };

            const createTeamEvent = e => {
                $('#notifications').append(TeamModal.create());
            };

            time = setInterval( update, DAY_INTERVAL );

            document.body.addEventListener('keydown', escMenuEvent);
            newGameBtn.on('click', () => gameStarting());
            continueBtn.on('click', continueEvent);
            createTeam.on('click', createTeamEvent);

            continueBtn.show();
            createTeam.show();

            moneyText.text(MAIN_CHARACTER.money + '$');

            Game.paused = false;

            this.initialized = true;
        }
    }
};

class Manager {
    constructor (name = "Player") {
        this.name    = name;
        this.teams   = [];
        this.money   = 1000;
        this.level   = 1;
        this.id      = managerId = managerId + 1;

        // initial event
        Game.pushEvent({
            eventId : 'DTMS-EVENT-NEWMANAGER#' + managerId,
            triggerDate : Game.daysToDate(2),
            notification : {
                title : 'News',
                msg : `New manager called '${this.name}' appeared in a professional Dota 2 scene. We wish him good luck in startup!`
            }
        });

        // monthly costs
        Game.pushEvent({
            eventId : 'DTMS-EVENT-MONTHLY-COSTSMANAGER#' + managerId,
            triggerDate : "monthly",
            triggerFn : () => this.changeMoney(-150, "Monthly costs")
        });

        // refac, cuz it is attached to every manager on creation.
        /*for (let event of decisions.inst.makeEvents(this, Game)) {
            Game.pushEvent(event);
        }*/
    }

    createTeam (teamTitle) {
        this.teams.push(new Team( teamTitle, this ));
    }

    disbandTeam (teamId) {
        this.teams = this.teams.filter( el => el.id !== teamId );
    }

    getTeams () {
        return this.teams;
    }

    changeMoney (amount, description) {
        let textClass = "text-success";

        this.money = this.money + parseInt(amount);

        if (amount < 0)
        {
            textClass = "text-danger";
        }
        else
        {
            amount = "+" + amount;
        }

        moneyText.text(this.money + "$");
        costsText.text(amount + "$");

        if (description)
        {
            costsDescr.text(description);
        }

        costsText.addClass(textClass + " costs-reveal");
        costsDescr.addClass(textClass + " costs-reveal");

        setTimeout( () => {
            costsText.removeClass("costs-reveal");
            costsDescr.removeClass("costs-reveal");
        }, 1500);
    }
}

class Team {
    constructor (title = "Default team", managerData) {
        this.id         = teamId = teamId + 1;
        this.title      = title;
        this.manager    = managerData;
        this.players    = [];
        this.progress   = 0;
        this.postions   = {
            1   : null,
            2   : null,
            3   : null,
            4   : null,
            5   : null
        };
    }

    // TODO make finding players

    fillPosition (player, position) {
        if (!this.players.length)
        {
            return false;
        }

        return this.postions[position] = player;
    }

    makeBootcamp () {
        const INTERVAL = 1000;
        const DURATION = 6000;

        const intervalId = setInterval( () => {
            this.players.forEach( (player) => {
                player.teamExp += Math.round(Math.random() * 10) + 1;
            } );
        }, INTERVAL);

        setTimeout(() => clearInterval(intervalId), DURATION);
    };

}

const reInitialize = () => {
    if (time) clearInterval(time);

    teamId      = 0;
    managerId   = 0;
    day         = 1;
    week        = 1;
    month       = 1;
    year        = 1;
    dateText.innerHTML = `Day ${day} Week ${week} Month ${month} Year ${year}`;
    Game.initialized = false;
    Game.events = [];
    Game.notifications = [];

    document.body.removeEventListener('keydown', escMenuEvent);

    moneyText.text("");
};

const gameStarting = () => {
    reInitialize();

    characterDialog.show();
    characterDialog.css('opacity', "1");

    characterInput.on('keydown', e => {
        if (e.keyCode === 13)
        {
            characterButton.focus();
        }
    });

    characterButton.on('click', function () {
        if (characterInput.val())
        {
            MAIN_CHARACTER = new Manager(characterInput.val());

            characterInput.removeClass('form-control-danger');
            characterInput.parent().removeClass('has-danger');

            document.body.style.backgroundColor = "rgba(3, 8, 16, 0.75)";
            document.body.style.color = "azure";

            characterDialog.hide();
            game.show();

            Game.init();
        }
        else
        {
            characterInput.addClass('form-control-danger');
            characterInput.parent().addClass('has-danger');
        }
    });
};

module.exports = {
    Game : Game
};