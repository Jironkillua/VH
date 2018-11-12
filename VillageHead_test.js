
const Discord = require('discord.js')
const client = new Discord.Client()



let villageMsgChanId
const village = []
const villageTime = []
const villageTime6h = []
const villageTime2h = []
const villageTime30min = []
const villageTime10min = []

client.on('ready', async () => {

    // List servers the bot is connected to
    var villageChanId

    console.log("Servers:")

    client.guilds.forEach((guild) => {
        console.log(" - " + guild.name)

        // List all channels
        guild.channels.forEach((channel) => {
            var s = channel.name.toString()
            if (s.includes("village-event-bot"))
                villageChanId = channel.id
            villageMsgChanId = villageChanId
        })

        var messageChannel = client.channels.get(villageChanId.toString()) // Replace with known channel ID
        messageChannel.send("Greetings Agonians!")
    })
})


// ---------------------- 

client.on('message', (receivedMessage) => {
    if (receivedMessage.author == client.user) { // Prevent bot from responding to its own messages
        return
    }



    if (receivedMessage.content.startsWith("!")) {
        processCommand(receivedMessage)
    }
})



function processCommand(receivedMessage) {
    let fullCommand = receivedMessage.content.substr(1) // Remove the leading exclamation mark
    let splitCommand = fullCommand.split(" ") // Split the message up in to pieces for each space
    let primaryCommand = splitCommand[0] // The first word directly after the exclamation is the command
    let arguments = splitCommand.slice(1) // All other words are arguments/parameters/options for the command

    console.log("Command received: " + primaryCommand)
    console.log("Arguments: " + arguments) // There may not be any arguments

    if (primaryCommand == "help") {
        helpCommand(arguments, receivedMessage)
    } else if (primaryCommand == "multiply") {
        multiplyCommand(arguments, receivedMessage)
    } else if (primaryCommand == "addvillage") {
        addVillagetimerCommand(arguments, receivedMessage)
    } else if (primaryCommand == "removevillage") {
        removeVillagetimerCommand(arguments, receivedMessage)
    }
    else if (primaryCommand == "updatevillage") {
        updateTheVillageCommand(arguments, receivedMessage)
    }
    else if (primaryCommand == "showvillages") {
        showVillagetimerCommand(arguments, receivedMessage)
    } else {
        receivedMessage.channel.send("I don't understand the command. Try `!help` or `!showvillages`")
    }
}

function helpCommand(arguments, receivedMessage) {
    if (arguments.length == 0) {
        receivedMessage.channel.send("Try `!help [topic]`, such as `village`, `update`, `remove`")
    } else if (arguments[0] == "village") {
        receivedMessage.channel.send(" add villages by using the command `!addvillage` \n ex !addvillage nameofvillage 24 12 \n nameofvillage is going live in 24hours 12min")
    }
    else if (arguments[0] == "update") {
        receivedMessage.channel.send(" Updates the timeer of a village. `!updatevillage` \n ex !updatevillage nameofvillage 24 12 \n nameofvillage is going live in 24hours 12min")
    }
    else if (arguments[0] == "remove") {
        receivedMessage.channel.send(" Removes the village `!removevillage` \n ex !removevillage nameofvillage")
    }
    else {
        receivedMessage.channel.send("I'm not sure what you need help with. Try `!help`")
    }
}

function multiplyCommand(arguments, receivedMessage) {
    if (arguments.length < 2) {
        receivedMessage.channel.send("Not enough values to multiply. Try `!multiply 2 4 10` or `!multiply 5.2 7`")
        return
    }
    let product = 1
    arguments.forEach((value) => {
        product = product * parseFloat(value)
    })
    receivedMessage.channel.send("The product of " + arguments + " multiplied together is: " + product.toString())

}

function addVillagetimerCommand(arguments, receivedMessage) {
    if (arguments.length < 3) {
        receivedMessage.channel.send("What village is that, and what time ?_?. try nameOfVillage 12 45")
        return
    }

    addVillage(arguments, receivedMessage)

}



function removeVillagetimerCommand(arguments, receivedMessage) {
    if (arguments.length < 1) {
        receivedMessage.channel.send("What village is that?")
        return
    }

    removeVillage(arguments[0])

}

function removeVillage(arg) {

    for (let i = 0; i < village.length; i++) {
        if (village[i] == arg) {

            var pos = village.indexOf(arg)
            console.log("remove " + village[pos] + " " + pos)
            village.splice(pos, 1)
            clearInterval(villageTime[pos])
            clearInterval(villageTime6h[pos])
            clearInterval(villageTime2h[pos])
            clearInterval(villageTime30min[pos])
            clearInterval(villageTime10min[pos])
            villageTime.splice(pos, 1)
            villageTime6h.splice(pos, 1)
            villageTime2h.splice(pos, 1)
            villageTime30min.splice(pos, 1)
            villageTime10min.splice(pos, 1)
        }
    }

}

function addVillage(args, receivedMessage) {



    for (let i = 0; i <= village.length; i++) {
        if (!village.includes(args[0])) {

            var hours = args[1]
            var min = args[2]

            if (hours > 0)
                hours = hours * 3600000
            if (min > 0)
                min = min * 60000

            var timer = hours + min
            var timer6h = 21600000
            var timer2h = 7200000
            var timer30min = 1800000
            var timer10min = 600000

            village.push(args[0])
            var vil = setInterval(intervalFunc, timer, args[0]);
            villageTime.push(vil)
            console.log(args[0])

            if ((timer - timer6h) > 0) {
                console.log("6h")
                var vil6h = setInterval(intervalFunc6h, (timer - timer6h), args[0]);


            }
            if ((timer - timer2h) > 0) {
                console.log("2h")
                var vil2h = setInterval(intervalFunc2h, (timer - timer2h), args[0]);


            }
            if ((timer - timer30min) > 0) {
                console.log("30min")
                var vil30min = setInterval(intervalFunc30min, (timer - timer30min), args[0]);



            }
            if ((timer - timer10min) > 0) {
                console.log("10min")
                var vil10m = setInterval(intervalFunc10min, (timer - timer10min), args[0]);



            }
            villageTime6h.push(vil6h)
            villageTime2h.push(vil2h)
            villageTime30min.push(vil30min)
            villageTime10min.push(vil10m)
            break;
        }
        receivedMessage.channel.send("I am all ready tracking that village.")
        break;
        
    }

}



function updateTheVillageCommand(args, receivedMessage) {

    if (args.length < 3) {
        receivedMessage.channel.send("What village is that, and what time ?_?. try nameOfVillage 12 45")
        return
    }

    for (let i = 0; i <= village.length; i++) {
        if (village[i] == args[0]) {
            removeVillage(args[0])
            addVillage(args, receivedMessage)
            break;
        }

    }
}

function updateVillagetimer(args) {


    for (let i = 0; i <= village.length; i++) {
        if (village[i] == args) {

            var pos = village.indexOf(args)
            console.log("update timer " + village[pos] + " " + pos)
            village.splice(pos, 1)
            clearInterval(villageTime[pos])

            villageTime.splice(pos, 1)
            villageTime6h.splice(pos, 1)
            villageTime2h.splice(pos, 1)
            villageTime30min.splice(pos, 1)
            villageTime10min.splice(pos, 1)


        }
    }
    var vilx = setInterval(intervalFunc, 90000000, arguments[0]);
    villageTime.push(vilx)
    village.push(args)

    var timer6h = 21600000
    var timer2h = 7200000
    var timer30min = 1800000
    var timer10min = 600000
    if ((90000000 - timer6h) > 0) {
        var vil6h = setInterval(intervalFunc6h, (90000000 - timer6h), arguments[0]);
        villageTime6h.push(vil6h)
    }
    if ((90000000 - timer2h) > 0) {
        var vil2h = setInterval(intervalFunc2h, (90000000 - timer2h), arguments[0]);
        villageTime2h.push(vil2h)
    }
    if ((90000000 - timer30min) > 0) {
        var vil30min = setInterval(intervalFunc30min, (90000000 - timer30min), arguments[0]);
        villageTime30min.push(vil30min)
    }
    if ((90000000 - timer10min) > 0) {
        var vil10m = setInterval(intervalFunc10min, (90000000 - timer10min), arguments[0]);
        villageTime10min.push(vil10m)
    }

}

function showVillagetimerCommand(arguments, receivedMessage) {

    if (village.length > 0) {
        receivedMessage.channel.send("Currently keeping track of ")
        for (let i = 0; i < village.length; i++) {
            receivedMessage.channel.send(village[i])

        }
    }
    else
        receivedMessage.channel.send("Currently no villages added ")
}

function sendMessageToVillageChannel(msg, count) {
    var messageChannel = client.channels.get(villageMsgChanId.toString()) // Replace with known channel ID

    var now = new Date()

    if (parseInt(now.getMinutes) <= 9)
        messageChannel.send("Current time (UTC) " + now.getUTCHours().toString() + ":0" + now.getMinutes())
    else
        messageChannel.send("Current time (UTC) " + now.getUTCHours().toString() + ":" + now.getMinutes())

    if (count == 30 || count == 2)
        messageChannel.send(msg)
            .then(function (messageChannel) {
                messageChannel.react("❌")
                messageChannel.react("✅")

            }).catch(function () {

            })
    else
        messageChannel.send(msg)



}





// -------------------------------------------

function intervalFunc(arg) {
    updateVillagetimer(arg)

    sendMessageToVillageChannel("`"+arg+"`" + " is going Live", 0)
}

function intervalFunc6h(arg) {

    sendMessageToVillageChannel("`"+arg+"`" + " is going Live in 6 hours ", 6)

    for (let i = 0; i <= village.length; i++) {
        if (village[i] == arg) {

            var pos = village.indexOf(arg)
            console.log("update timer6h " + village[pos] + " " + pos)
            clearInterval(villageTime6h[pos])

        }
    }
}
function intervalFunc2h(arg) {

    sendMessageToVillageChannel("`"+arg+"`" + " is going Live in 2 hours", 2)

    for (let i = 0; i <= village.length; i++) {
        if (village[i] == arg) {

            var pos = village.indexOf(arg)
            console.log("update timer2h " + village[pos] + " " + pos)
            clearInterval(villageTime2h[pos])

        }
    }
}
function intervalFunc10min(arg) {

    sendMessageToVillageChannel("`"+arg+"`" + " is going Live in 10min !", 10)

    for (let i = 0; i <= village.length; i++) {
        if (village[i] == arg) {


            var pos = village.indexOf(arg)
            console.log("update timer10m " + village[i] + " " + pos)
            console.log("10min " + villageTime10min[pos])
            clearInterval(villageTime10min[pos])


            console.log("10min length: after " + villageTime10min.length)

        }
    }
}
function intervalFunc30min(arg) {

    sendMessageToVillageChannel("`"+arg+"`" +" is going Live in 30min !", 30)

    for (let i = 0; i <= village.length; i++) {
        if (village[i] == arg) {


            var pos = village.indexOf(arg)
            console.log("update timer30m " + village[i] + " " + pos)
            console.log("30min " + villageTime30min[pos])
            clearInterval(villageTime30min[pos])
            console.log("30min length: after " + villageTime30min.length)



        }
    }
}











// Get your bot's secret token from:
// https://discordapp.com/developers/applications/
// Click on your application -> Bot -> Token -> "Click to Reveal Token"
bot_secret_token = "NTA4NTk0NDkzODIyNDY4MTE2.DsBkeQ.-r9z91JKeNcPu_R0zl98LPeqX5M"

client.login(bot_secret_token)