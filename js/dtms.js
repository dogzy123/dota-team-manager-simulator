// players database temporary deleted
//const PLAYERS_DB = players.players;  //array of players

const characterDialog = $('#create-form');
const characterButton = $('#create-character');
const game            = $('#game');
const menu            = $('#menu');

let teamId = 0, managerId = 0;

let day = 1, week = 1, month = 1, year = 1;

let mainCharacter;

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

        if (this.events.length > 0 )
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
        // further there will be created modal
        // for each notification object
        this.notifications.push(alert(obj.msg));
    },

    init            : function ()
    {
        if (!this.initialized)
        {
            const DAY_INTERVAL = 2000;

            const time = setInterval( () => {
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
                }
                else
                {
                    menu.hide();
                }
            };

            document.body.addEventListener('keydown', function (e) {
                e.preventDefault();

                if(e.keyCode === 27)
                {
                    togglePause();
                }
            });

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
                _this.money = _this.money - 150;
                document.getElementById('money-text').innerHTML = _this.money + "$";
            }
        });

        Game.pushEvent({
            eventId : 'DTMS-EVENT-NEWMANAGER#' + managerId,
            triggerDate : Game.daysToDate(3),
            triggerFn : function () {
                Game.createNotification({
                    title : 'News',
                    msg : `New manager called ${_this.nick} appeared in professional Dota scene. We wish him good luck in in startup!`
                });
            }
        });

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

characterDialog.show();

characterDialog.css('opacity', "1");

characterButton.on('click', function () {
    mainCharacter = new TeamManager(this.value);

    characterDialog.hide();

    document.body.style.backgroundColor = "#3b4a63";
    document.body.style.color = "azure";

    game.show();

    Game.init();
});
