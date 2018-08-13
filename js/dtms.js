// players database temporary deleted
//const PLAYERS_DB = players.players;  //array of players

const decisions = require('./decisions.js');
const Notifications = require('./notifications');

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
const continueBtn     = $('#continue');
const createTeam      = $('#create-team');

let teamId = 0, managerId = 0;  // unique ids
let day, week, month, year;     // date
let time;                       // date function
let MAIN_CHARACTER;
let escMenu;                    // pause/menu toggle

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
            onConfirm : function () {
                if (obj.onConfirm)
                {
                    obj.onConfirm();
                }

                Game.paused = false;
            }
        });

        message.init = () => Game.pause();

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

            const togglePause = e => {
                Game.paused = !Game.paused;

                if (game.css('display') === "none")
                {
                    game.show();
                }
                else
                {
                    game.hide();
                }

                if (menu.css('display') === "none")
                {
                    menu.show();
                    $('#new-game').on('click', () => gameStarting());
                }
                else
                {
                    menu.hide();
                }
            };

            escMenu = e => {
                if (e.keyCode === 27)
                {
                    togglePause();
                }
            };

            const continueEvent = e => {
                Game.paused = false;
                menu.hide();
                game.show();
            };

            time = setInterval( () => {
                dateText.innerHTML = `Day ${day} Week ${week} Month ${month} Year ${year}`;

                if (!Game.paused)
                {
                    if (this.events.length > 0)
                    {
                        this.events.forEach( event => {
                            if (event.triggerDate === this.getDate())
                            {
                                if (event.triggerFn)
                                {
                                    event.triggerFn();
                                }

                                if (event.notification)
                                {
                                    Game.createNotification(event.notification);
                                }

                                this.events = this.events.filter( (e) => e.eventId !== event.eventId );
                            }

                            if (event.triggerDate === "monthly")
                            {
                                if (day === 7 && week === 4)
                                {
                                    if (event.triggerFn)
                                    {
                                        event.triggerFn();
                                    }

                                    if (event.notification)
                                    {
                                        Game.createNotification(event.notification);
                                    }
                                }
                            }

                            if (event.triggerDate === "daily")
                            {
                                if (event.triggerFn)
                                {
                                    event.triggerFn();
                                }

                                if (event.notification)
                                {
                                    Game.createNotification(event.notification);
                                }
                            }
                        } );
                    }

                    if (this.notifications.length > 0)
                    {
                        const backdrop = $('#backdrop');

                        let current = '', next = true;

                        this.notifications.forEach( notification => {
                            if (next)
                            {
                                current = notification;

                                $('#notifications').append(current);
                                backdrop.addClass('modal-backdrop');

                                current.init();

                                next = false;

                                if (this.notifications.indexOf(current) > -1)
                                {
                                    this.notifications.splice(this.notifications.indexOf(current), 1);
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
                }
            }, DAY_INTERVAL );

            // events & handlers
            document.body.addEventListener('keydown', escMenu);
            continueBtn.on('click', continueEvent);

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

        Game.pushEvent({
            eventId : 'DTMS-NOTIFICATION-WITH-OPTIONS',
            triggerDate : Game.daysToDate(3),
            notification : {
                title : 'News',

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
        this.teams.push(new Team(teamTitle, this));
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
    constructor (title, managerData) {
        const _this     = this;

        this.id         = teamId;
        this.title      = title;
        this.manager    = managerData;
        this.players    = [];
        this.postions   = {
            1   : '',
            2   : '',
            3   : '',
            4   : '',
            5   : ''
        };
        this.progress   = 0;

        if (!title)
        {
            this.title =  this.manager.name + "\'s team";
        }

        teamId++;
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

    document.body.removeEventListener('keydown', escMenu);

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

            document.body.style.backgroundColor = "#19273c";
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