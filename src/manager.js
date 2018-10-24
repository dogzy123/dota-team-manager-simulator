export default class Manager {
    constructor (name = "Player") {
        this.name = name;
        this.teams = [];
        this.money = 1000;
        this.level = 1;

        return this;
    }
};