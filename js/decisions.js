
let battle = require('./battle.js');

/**
 * I'll put here some logic describing random events I came up with
 */
let Decisions = function()
{
    let flags = {};

    /**
     * @param {Manager} player
     * @param {Game}        game - not actually a valid type hint, but provides Ctrl+B at least
     * @param {Function}    game.createNotification
     * @param {Function}    game.over
     */
    let makeEvents = function(player, game) {
        let showMsg = (msg) => game.createNotification({title : 'News', msg : msg});
        return [
            {
                eventId : 'DTMS-EVENT-' + player.id + Math.random(),
                triggerDate : game.daysToDate(7),
                triggerFn : function () {
                    flags.cameToLanParty = confirm('A friend of yours invited you to a lan party to play custom W3 maps. Are you going?');
                    if (flags.cameToLanParty) {
                        showMsg('On the way there you found a 5 bucks on the road, it surely was worth coming!');
                        player.changeMoney(+5);
                    } else {
                        showMsg('You spent whole day studying, what a looser!');
                    }
                }
            },
            {
                eventId : Math.random(),
                triggerDate : game.daysToDate(9),
                triggerFn : function () {
                    if (flags.cameToLanParty) {
                        let giveItATry = confirm('Surfing through custom maps your glance stops at a title "Defence of the Ancients". Do you want to give it a try?');
                        if (giveItATry) {
                            battle.start(player, game);
                        } else {
                            showMsg('Sure, the title does not sound even close to cool maps like Angel Arena or AOS, it probably won\'t ever get popular.');
                        }
                    }
                }
            },
            {
                eventId : Math.random(),
                triggerDate : game.daysToDate(12),
                triggerFn : function () {
                    flags.boughtLotteryTicket = confirm('You come across a stand with lottery tickets. Your attention was caught by a ticket worth 200 bucks. Would you like to buy it?');
                    if (flags.boughtLotteryTicket) {
                        showMsg('The results will be announced in a year. Did you make right decision? Time will show...');
                        player.changeMoney(-200);
                    }
                }
            },
            {
                eventId : Math.random(),
                triggerDate : game.daysToDate(365),
                triggerFn : function () {
                    let wasWinningTicket = Math.random() < 0.49;
                    if (wasWinningTicket) {
                        showMsg('The lottery ticket you bought a year ago was the winning one. Congrats.');
                        player.changeMoney(400);
                    } else {
                        if (flags.boughtLotteryTicket) {
                            showMsg('The lottery ticket you bought a year ago was not the winning one. Pity you.');
                        }
                    }
                }
            },
            {
                eventId : Math.random(),
                triggerDate : game.daysToDate(31),
                triggerFn : function () {
                    flags.attemptedToTakeTheJob = confirm('Your labor of love does not give you enough profit just yet, but you realize that you have to pay for living. You see a "Help Wanted" sign on a Pakistan Kebab, do you take the job?');
                    if (flags.attemptedToTakeTheJob) {
                        showMsg('You came to an interview, but sadly it appears that you need to know the native language for this job. You decided to start learning it.');
                    } else {
                        showMsg('Right, let\'s wait for a better opportunity or spend time improving your team!');
                    }
                }
            },
            {
                eventId : Math.random(),
                triggerDate : game.daysToDate(60),
                triggerFn : function () {
                    if (flags.attemptedToTakeTheJob) {
                        flags.tookTheJob = confirm('You come across a "Help Wanted" sign in a grocery store. Do you want to give it a try?');
                        if (flags.tookTheJob) {
                            showMsg('You passed, congrats. It is not enough to pay for your usual needs, but it is better than nothing.');
                        }
                    }
                }
            },
            {
                eventId : Math.random(),
                triggerDate : 'monthly',
                triggerFn : function () {
                    if (flags.tookTheJob) {
                        let delayed = Math.random() < 0.2;
                        if (!delayed) {
                            showMsg('Here is your salary, guys!');
                            player.changeMoney(75);
                        } else {
                            showMsg('Your employer is short on funds this month, so your salary gets "delayed".');
                        }
                    }
                }
            },
            {
                eventId : Math.random(),
                triggerDate : 'daily',
                triggerFn : function () {
                    if (player.money < 0) {
                        if (!flags.begged) {
                            flags.begged = confirm('You don\'t have any money left. Would you like to start begging around your acquaintances?');
                            if (flags.begged) {
                                let spent = confirm('You managed to get some money. Would you like to spend it all on a booze?');
                                if (spent) {
                                    showMsg('Congrats, now you are officially a miserable homeless man without a hope to get up ever again');
                                    game.over();
                                } else {
                                    showMsg('You now have some money, but you don\'t have friends anymore.');
                                    player.changeMoney(-player.money + 50);
                                }
                            } else {
                                showMsg('You are sticking to your pride, but sadly it does not fill your belly. You get sick and don\'t have money to pay for medicine. You die.');
                                game.over();
                            }
                        } else {
                            showMsg('You try to beg for money again, but nobody agrees except your poor old mother that sells her last necklace to support you. Realising what jerk you are you commit suicide.');
                            game.over();
                        }
                    }
                }
            },
        ];
    };
    return {
        makeEvents: makeEvents,
    };
}();

exports.inst = Decisions;