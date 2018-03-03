// players database temporary deleted
//const PLAYERS_DB = players.players;  //array of players

let decisions = require('./decisions.js');
const Notifications = require('./notifications');

// HTML CONSTANTS
const characterDialog = $('#create-form');
const characterButton = $('#create-character');
const characterInput  = $('#inlineFormInputGroup');
const moneyText       = $('#money-text');
const costsText       = $('#costs-text');
const costsDescr      = $('#costs-description');
const game            = $('#game');
const menu            = $('#menu');
const continueBtn     = $('#continue');

let teamId, managerId;          // unique ids
let day, week, month, year;     // date
let time;                       // date function
let mainCharacter;
let escMenu;                    // pause/menu toggle

const Game = {
    // tournaments template
    paused          : false,

    tournaments     : {
        level1 : [
            {
                name : "Dota Star League",
                prize : 10000,
                startDate : '1/5/3/1'
            }
        ]
    },

    initialized     : false,

    events          : [],

    notifications   : [],

    daysToDate      : function ( days )
    {
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

    getDate         : function ()
    {
        return day + '/' + week + '/' + month + '/' + year;
    },

    pushEvent       : function ( obj )
    {
        const _this = this;

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
                _this.events.push(obj);
            }
        }
        else
        {
            this.events.push(obj);
        }
    },

    createNotification : function ( obj )
    {
        let message = Notifications.Notifications.create({
                title     : obj.title,
                msg       : obj.msg,
                onConfirm : function () {
                    Game.paused = false;
                }
        });

        $('#notifications').append(message);

        Game.paused = true;

        this.notifications.push(message);
    },

    over            : function () {
        reInitialize();
    },

    init            : function ()
    {
        if (!this.initialized)
        {
            const DAY_INTERVAL = 2000;

            const togglePause = () => {
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
                    $('#new-game').on('click', function () {
                        gameStarting();
                    })
                }
                else
                {
                    menu.hide();
                }
            };

            Game.paused = false;

            time = setInterval( () => {
                if (!Game.paused)
                    {
                    if (this.events.length > 0)
                    {
                        let _this = this;

                        this.events.forEach(function (event) {
                            if (event.triggerDate === _this.getDate())
                            {
                                event.triggerFn();
                                _this.events = _this.events.filter( (e) => e.eventId !== event.eventId );
                            }

                            if (event.triggerDate === "monthly")
                            {
                                if (day === 7 && week === 4)
                                {
                                    event.triggerFn();
                                }
                            }

                            if (event.triggerDate === "daily")
                            {
                                event.triggerFn();
                            }
                        });
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


                    document.getElementById('date-text').innerText = `Day ${day} Week ${week} Month ${month} Year ${year}`;

                    console.log("Day: " + day + ", Week: " + week + ", Month: " + month + ", Year: " + year);
                }
            }, DAY_INTERVAL );

            escMenu = (e) => {
                if(e.keyCode === 27)
                {
                    togglePause();
                }
            };

            document.body.addEventListener('keydown', escMenu);

            continueBtn.show();

            continueBtn.on('click', () => {
                Game.paused = !Game.paused;
                menu.hide();
                game.show();
            });

            if (mainCharacter)
            {
                moneyText.text(mainCharacter.money + '$');
            }

            this.initialized = true;
        }
    }
};

class TeamManager {

    constructor (name = "Player") {
        const _this  = this;

        this.nick    = name;
        this.teams   = [];
        this.money   = 1000;
        this.level   = 1;
        this.id      = managerId;

        // monthly costs like food, clothes etc.
        Game.pushEvent({
            eventId : 'DTMS-EVENT-MONTHLY-COSTS',
            triggerDate : "monthly",
            triggerFn : function () {
                _this.changeMoney(-150, "Monthly costs");
            }
        });

        Game.pushEvent({
            eventId : 'DTMS-EVENT-NEWMANAGER#' + managerId,
            triggerDate : Game.daysToDate(3),
            triggerFn : function () {
                Game.createNotification({
                    title : 'News',
                    msg : `New manager called ${_this.nick} appeared in professional Dota scene. We wish him good luck in startup!`
                });
            }
        });
        for (let event of decisions.inst.makeEvents(_this, Game)) {
            Game.pushEvent(event);
        }

        managerId++;
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
        let textClass = amount > 0 ? "text-success" : "text-danger";

        this.money = this.money + amount;

        moneyText.text(this.money + "$");
        costsText.text(amount);

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
            this.title =  this.manager.nick + "\'s team";
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

    teamId = 0;
    managerId = 0;
    day = 1;
    week = 1;
    month = 1;
    year = 1;
    document.getElementById('date-text').innerText = `Day ${day} Week ${week} Month ${month} Year ${year}`;
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

    characterButton.on('click', function () {
        if (characterInput.val())
        {
            characterInput.removeClass('form-control-danger');
            characterInput.parent().removeClass('has-danger');

            mainCharacter = new TeamManager(characterInput.val());

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

gameStarting();