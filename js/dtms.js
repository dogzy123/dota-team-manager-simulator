const {PLAYERS}     = require('./playersDB');
const decisions     = require('./decisions.js');
const Notifications = require('./notificationModal');
const TeamModal     = require('./teamModal');

// HTML CONSTANTS
const teamsBlock      = $('#team-list');
const notificationBlock = $('#notifications');
const characterDialog = $('#create-form');
const moneyText       = $('#money-text');
const dateText        = document.getElementById("date-text");
const costsText       = $('#costs-text');
const costsDescr      = $('#costs-description');
const game            = $('#game');
const menu            = $('#menu');
const createTeamBlock = $('#create-team');
const continueBtn     = $('#continue');
const createTeamBtn   = $('#create-team-btn');

let backDrop;

let teamId, managerId;          // unique ids
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

    createNotification : function ( data ) {
        let decisions = [];
        let onConfirmEvent = () => {};

        if (data.options && data.triggers)
        {
            for (let i = 0; i < data.options.length; i++)
            {
                decisions.push({
                    title: data.options[i],
                    triggerFn: () => {
                        data.triggers[i]();
                        Game.unpause();
                        notificationBlock.html("");
                        backDrop = null;
                    }
                });
            }
        }

        onConfirmEvent = () => {
            if (data.onConfirm && typeof data.onConfirm === 'function')
            {
                data.onConfirm();
            }

            Game.unpause();
            notificationBlock.html("");
            backDrop = null;
        };

        return this.notifications.push(
            Notifications.create({
                title     : data.title,
                msg       : data.msg,
                decisions : decisions,
                onConfirm : onConfirmEvent
            })
        );
    },

    pushEvent       : function ( obj ) {
        let uniqueId = true;

        if (this.events.length > 0)
        {
            this.events.forEach(function (e) {
                if ( e.eventId === obj.eventId )
                {
                    uniqueId = false;
                }
            });

            if (!uniqueId)
            {
                throw new Error('UniqueID Event Error: check events ids for uniqueness!');
            }

            return this.events.push(obj);
        }
        else
        {
            return this.events.push(obj);
        }
    },

    over            : function () {
        return reInitialize();
    },

    start           : function () {
        reInitialize();

        characterDialog.show();
        characterDialog.css('opacity', "1");
    },

    init            : function ( manager ) {
        if (!this.initialized)
        {
            const DAY_INTERVAL = 1500;

            const triggerEvent = e => {
                if (e.notification)
                {
                    this.createNotification(e.notification);
                }

                if (e.triggerFn)
                {
                    e.triggerFn();
                }
            };

            // main frame func
            const update = () => {
                if (!Game.paused)
                {
                    console.log(MAIN_CHARACTER); // debug main char

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

                    dateText.innerHTML = `Day ${day} Week ${week} Month ${month} Year ${year}`;

                    if (this.events.length > 0)
                    {
                        this.events.forEach( event => {
                            if (event.triggerDate === this.getDate())
                            {
                                triggerEvent(event);
                                this.events = this.events.filter( e => e.eventId !== event.eventId );
                            }

                            if (event.triggerDate === "monthly")
                            {
                                if (day === 1 && week === 1)
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

                                backdrop.addClass('modal-backdrop');
                                notificationBlock.append(notification);
                                notificationBlock.show();

                                backDrop = backdrop;

                                if (this.notifications.indexOf(notification) > -1)
                                {
                                    this.notifications.splice(this.notifications.indexOf(notification), 1);
                                }
                            }
                        } );
                    }

                    // main character props handlers
                    if (MAIN_CHARACTER.money < 1) // lost
                    {
                        this.createNotification({
                            title: 'GAME INFO',
                            msg : 'You lost! Try again. Maybe you should\'ve get another players in your team. :D',
                            onConfirm : () => clearInterval(time)
                        })
                    }

                    if (MAIN_CHARACTER.teams.length >= 2)
                    {
                        createTeamBtn.attr('disabled', true);
                    }
                }
            };

            // events & handlers
            escMenuEvent = e => {
                if (e.keyCode === 27)
                {
                    Game.paused = !Game.paused;

                    if (Game.paused)
                    {
                        menu.show();

                        game.hide();
                        notificationBlock.hide();
                        createTeamBlock.hide();

                        if (backDrop)
                        {
                            backDrop.removeClass('modal-backdrop');
                        }
                    }
                    else
                    {
                        menu.hide();

                        game.show();
                        notificationBlock.show();
                        createTeamBlock.show();

                        if (backDrop)
                        {
                            backDrop.addClass('modal-backdrop');
                            Game.pause();
                        }
                    }
                }
            };

            const createTeamModalShow = e => {
                Game.pause();

                notificationBlock.append(TeamModal.create({
                    onClose     : () => {
                        Game.unpause();
                    },
                    onCreate    : props => {
                        MAIN_CHARACTER.createTeam(props.name.trim());
                        Game.unpause();
                    }
                }));
            };

            MAIN_CHARACTER = manager;
            time = setInterval( update, DAY_INTERVAL );

            document.body.addEventListener('keydown', escMenuEvent);

            createTeamBtn.on('click', createTeamModalShow);

            continueBtn.show();
            createTeamBlock.show();

            moneyText.text(MAIN_CHARACTER.money + '$');

            Game.paused = false;

            return this.initialized = true;
        }

        return false;
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
                msg : `New manager called '${this.name}' appeared in a slowly growing cybersport community. Wish him good luck!`
            }
        });

        // monthly costs
        Game.pushEvent({
            eventId : 'DTMS-EVENT-MONTHLY-COSTSMANAGER#' + managerId,
            triggerDate : "monthly",
            triggerFn : () => this.changeMoney(-150, "Monthly costs")
        });

        //decision dialog test
        Game.pushEvent({
            eventId: 'DTMS-EVENT-DECISION-DIALOG',
            triggerDate: Game.daysToDate(4),
            notification: {
                title: 'Friend\'s call',
                msg: "A friend of yours invited you to a lan party to play custom W3 maps. Are you going?",
                options: ['Yes', 'Sorry, I\'m Pass'],
                triggers: [
                    () => Game.createNotification({
                            title: 'Info',
                            msg: 'On the way there you found a 5 bucks on the road, it surely was worth coming!',
                            onConfirm : () => this.changeMoney(+5)
                        }),
                    () => Game.createNotification({
                            title: 'Info',
                            msg: 'You spent whole day studying, what a loser!',
                            onConfirm : () => Game.unpause()
                        })
                ]
            }
        });

       /* // check for main character
        if (this.id === 1)
        {
            for (let event of decisions.inst.makeEvents(this, Game)) {
                Game.pushEvent(event);
            }
        }*/
    }

    createTeam (teamTitle) {
        let team = new Team( teamTitle, this );

        this.teams.push(team);

        teamsBlock.append(
            team.makeContext()
        );

        return team;
    }

    disbandTeam (teamId) {
        this.teams = this.teams.filter( el => el.id !== teamId );
    }

    changeMoney (amount, description) {
        let textClass = "text-success";

        this.money = this.money + parseInt(amount);

        amount < 0 ? textClass = "text-danger" : amount = "+" + amount;

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
        this.context    = null;
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

        Game.pushEvent({
            eventId : 'DTMS-EVENT-NEWTEAM#' + this.id,
            triggerDate : Game.daysToDate(2),
            notification : {
                title : 'News',
                msg : `New team under the name "${title}" was recently registered by ${this.manager.name}. Seems like they are planning something terrible in the good sense of this word. "Wait for it!"`
            }
        });

        return this;
    }

    makeContext () {
        const teamTemplate      = $('<div class="team">');
        const teamTitle         = $('<span class="text">'+ this.title +'</span>');
        const disbandTeam       = $('<span class="team-close">&times;</span>');
        const findRandomsBtn    = $('<button class="btn btn-lg btn-warning">Find 5 random players</button>');

        findRandomsBtn.on('click', e => {
            this.find5Randoms();
        });

        disbandTeam.on('click', e => {
            this.manager.disbandTeam(this.id);
            this.context.remove();

            createTeamBtn.attr('disabled', false);
        });

        return this.context = $('<div class="row">').append(
            $('<div class="col-sm-12">').append(
                teamTemplate.append(
                    $('<div class="row">').append(
                        $('<div class="col-sm-12">').append(
                            $('<div class="team-header">').append(
                                teamTitle,
                                disbandTeam
                            )
                        )
                    ),
                    $('<div class="row">').append(
                        $('<div class="col-sm-12">').append(
                            $('<div class="team-body clearfix">').append(
                                $('<div class="player-wrap">').append(
                                    $('<div class="player">')
                                ),
                                $('<div class="player-wrap">').append(
                                    ('<div class="player">')
                                ),
                                $('<div class="player-wrap">').append(
                                    ('<div class="player">')
                                ),
                                $('<div class="player-wrap">').append(
                                    ('<div class="player">')
                                ),
                                $('<div class="player-wrap">').append(
                                    ('<div class="player">')
                                )
                            )
                        )
                    ),
                    $('<div class="row">').append(
                        $('<div class="col-sm-12">').append(
                            $('<div class="team-footer">').append(
                                findRandomsBtn
                            )
                        )
                    )
                )
            )
        )
    }

    // TODO make finding players

    find5Randoms () {
        let randomNumber, filteredPlayers = PLAYERS;

        for (let i = 0; i < 5; i++)
        {
            randomNumber = Math.floor(Math.random() * filteredPlayers.length);

            this.players.push(filteredPlayers[randomNumber]);

            filteredPlayers = filteredPlayers.filter( player => player.nick !== filteredPlayers[randomNumber].nick);
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

const reInitialize = () => {
    if (time) clearInterval(time);

    teamId      = 0;
    managerId   = 0;
    day         = 1;
    week        = 1;
    month       = 1;
    year        = 1;

    dateText.innerHTML = `Day ${day} Week ${week} Month ${month} Year ${year}`;

    Game.initialized    = false;
    Game.events         = [];
    Game.notifications  = [];

    document.body.removeEventListener('keydown', escMenuEvent);

    moneyText.text("");
};

module.exports = {
    Game    : Game,
    Manager : Manager
};