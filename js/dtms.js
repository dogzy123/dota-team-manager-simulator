// TODO make players db a separate module
const playersDB = [
    {
        nick : "Dondo",
        mmr  : 4000,
        pos  : [2],
        teamExp : 0
    },
    {
        nick : "Sinner",
        mmr  : 4100,
        pos  : [1, 2],
        teamExp : 0
    },
    {
        nick : "Rtz",
        mmr  : 4500,
        pos  : [1, 2],
        teamExp : 0
    },
    {
        nick : "GG",
        mmr  : 5000,
        post : [3],
        teamExp : 0
    },
    {
        nick : "lox",
        mmr  : 2000,
        post : [1],
        teamExp : 0
    }
];

let teamId = 0;

let day = 1, week = 1, month = 1, year = 1;

const Game = {

    // TODO make function which will parse days to date (extra needed)

    getDate         : function ()
    {
        return day + '/' + week + '/' + month + '/' + year;
    },

    events          : [],

    notifications   : [],

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
        const DAY_INTERVAL = 2000;

        const date = setInterval( () => {
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

            console.log("Day: " + day + ", Week: " + week + ", Month: " + month + ", Year: " + year);
        }, DAY_INTERVAL);
    }
};

class TeamManager {

    constructor (name = "Player") {
        this.nick    = name;
        this.teams   = [];
        this.money   = 1000;
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
        let _this       = this;
        this.id         = teamId++;
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

        Game.pushEvent({
            eventId     : "salary",
            triggerDate : "monthly",
            triggerFn   : function () {
                _this.manager.money -= 100;
                console.log(_this.manager.money);
            }
        });
    }

    findPlayer (days) {
        let _this = this;
        let playersFound = [];

        if (days <= 3)
        {
            playersDB.forEach(function (el) {
                if (el.mmr < 3500)
                {
                    playersFound.push(el);
                }
            });
        }

        if (days > 3 && days <= 7)
        {
            playersDB.forEach(function (el) {
                if (el.mmr > 3500 && el.mmr < 4500)
                {
                    playersFound.push(el);
                }
            })
        }

        if (days > 7)
        {
            playersDB.forEach(function (el) {
                if (el.mmr > 4500)
                {
                    playersFound.push(el);
                }
            });
        }

        if (this.players.length > 4)
        {
            Game.pushEvent({
                eventId     : "salary",
                triggerDate : 'monthly',
                triggerFn   : function () {
                    console.log("Now you have to pay salary to your team members.");
                    _this.manager.money -= 100;
                }
            });
        }
    }

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

Game.init();