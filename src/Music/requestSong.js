const Comando = require("discord-js-commando");

module.exports = class PlayMusic extends Comando.Command{
    constructor(client){
        super(client,{
            name: "play",
            
        })
    }
}