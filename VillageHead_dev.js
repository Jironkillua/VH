
var Discord = require('discord.js')
var auth = require('./auth.json');
var client = new Discord.Client()



var villageMsgChanId


var villageCommunity = [[]]
var villageTimeCommunity = []
var villageTime6hCommunity = []
var villageTime2hCommunity = []
var villageTime30minCommunity = []
var villageTime10minCommunity = []
var villageTimersToLive = []

var ClansTracker = []
var ClanChannelTracker = []


client.on('ready', async () => {

    // List servers the bot is connected to
    var villageChanId
    villageCommunity.pop()

    console.log("Servers:")

    client.guilds.forEach((guild) => {
        console.log(" - " + guild.id)

        ClansTracker.push(guild.id)
        // List all channels
        guild.channels.forEach((channel) => {
            var s = channel.name.toString()
            if (s.includes("village-event-bot")) {
                villageChanId = channel.id
                ClanChannelTracker.push(villageChanId)
                villageMsgChanId = villageChanId
            }
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
    let allowRole = receivedMessage.member.roles.find('name', 'VillageHeadHandler')

    if (primaryCommand == "help") {
        helpCommand(arguments, receivedMessage)
    } else if (primaryCommand == "multiply") {
        multiplyCommand(arguments, receivedMessage)
    }

    if (allowRole == null) {
        receivedMessage.channel.send(" Your not my Master!")
        return
    }


    if (!receivedMessage.member.roles.has(allowRole.id)) { // Requires one to have rights to the bot
        return
    }

    else if (primaryCommand == "addvillage") {
        addVillagetimerCommand(arguments, receivedMessage)
    } else if (primaryCommand == "removevillage") {
        removeVillagetimerCommand(arguments, receivedMessage)
    }
    else if (primaryCommand == "updatevillage") {
        updateTheVillageCommand(arguments, receivedMessage)
    }
    else if (primaryCommand == "showvillages") {
        showVillagetimerCommand(arguments, receivedMessage)
    }
    else if (primaryCommand == "showvillage") {
        showTimerCommand(arguments, receivedMessage)
    } else {
        receivedMessage.channel.send("I don't understand the command. Try `!help` or `!showvillages`")
    }
}

function helpCommand(arguments, receivedMessage) {
    if (arguments.length == 0) {
        receivedMessage.channel.send("Try `!help [topic]`, such as `village`, `update`, `remove`, `showvillages`, `showvillage` \n `For any issues related to the bot you can either DM Jiron#6625 or reach me ING Jiron Dawn.`")
    } else if (arguments[0] == "village") {
        receivedMessage.channel.send(" add villages by using the command `!addvillage` \n ex !addvillage nameofvillage 24 12 \n nameofvillage is going live in 24hours 12min")
    }
    else if (arguments[0] == "update") {
        receivedMessage.channel.send(" Updates the timeer of a village. `!updatevillage` \n ex !updatevillage nameofvillage 24 12 \n nameofvillage is going live in 24hours 12min")
    }
    else if (arguments[0] == "remove") {
        receivedMessage.channel.send(" Removes the village `!removevillage` \n ex !removevillage nameofvillage")
    } else if (arguments[0] == "showvillages") {
        receivedMessage.channel.send("shows villages in the list `!showvillages` ")

    } else if (arguments[0] == "showvillage") {
        receivedMessage.channel.send("shows information about a village `!showvillage`  \n ex !showvillage nameofvillage")

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
        receivedMessage.channel.send("What village is that, and what time ?_?. try !addvillage nameOfVillage 12 45 (!addvillage nameofvillage hours minutes)")
        return
    }

    if (arguments.length > 3) {
        receivedMessage.channel.send("To many arguments ?_?. try !addvillage nameOfVillage 12 45 (!addvillage nameofvillage hours minutes)")
        return
    }



    if (isNaN(arguments[1]) || isNaN(arguments[2])) {
        receivedMessage.channel.send("Incorrect timer format ?_?. Try !addvillage nameOfVillage 12 45 (!addvillage nameofvillage hours minutes)")
        return
    }

    if ((arguments[1]) === "" || (arguments[2]) === "") {
        receivedMessage.channel.send("Using to much space O_o. Try !addvillage nameOfVillage 12 45 (!addvillage nameofvillage hours minutes)")
        return
    }

    if (arguments[1] == 0 && arguments[2] == 0) {
        receivedMessage.channel.send("Incorrect timer format ?_?. Try !addvillage nameOfVillage 12 45 (!addvillage nameofvillage hours minutes)")
        return
    }

    if (receivedMessage.guild === null) {
        receivedMessage.channel.send("Use the correct server channel to add villages")
        return
    }

    else {
        addVillage(arguments, receivedMessage)
    }


}

function whenVillageIsFound(villageCommunity, arguments, receivedMessage) {
    for (var i = 0; i < array.length; i++) {
        // This if statement depends on the format of your array
        if (array[i][0] == arguments[0] && array[i][1] == receivedMessage.channel.guild.id) {
            return true;   // Found it
        }
    }
    return false;   // Not found
}





function removeVillagetimerCommand(arguments, receivedMessage) {

    if (arguments.length < 1) {
        receivedMessage.channel.send("What village is that?")
        return
    }

    if (receivedMessage.guild === null) {
        receivedMessage.channel.send("Use the correct server channel to remove villages")
        return
    }

    removeVillage(arguments[0], receivedMessage)

}



function removeVillage(arg, receivedMessage) {
    console.log(arg)


    for (var i = 0; i < villageCommunity.length; i++) {
        if (villageCommunity[i][0] == arg && villageCommunity[i][1] == receivedMessage.channel.guild.id) {


            console.log("remove " + villageCommunity[i] + " " + i)
            villageCommunity.splice(i, 1)
            clearInterval(villageTimeCommunity[i])
            clearInterval(villageTime6hCommunity[i])
            clearInterval(villageTime2hCommunity[i])
            clearInterval(villageTime30minCommunity[i])
            clearInterval(villageTime10minCommunity[i])
            villageTimeCommunity.splice(i, 1)
            villageTime6hCommunity.splice(i, 1)
            villageTime2hCommunity.splice(i, 1)
            villageTime30minCommunity.splice(i, 1)
            villageTime10minCommunity.splice(i, 1)
            break;
        }
    }


}

function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
        seconds = parseInt((duration / 1000) % 60),
        minutes = parseInt((duration / (1000 * 60)) % 60),
        hours = parseInt((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}

function DateDiff(date1, date2) {
    this.days = null;
    this.hours = null;
    this.minutes = null;
    this.seconds = null;
    this.date1 = date1;
    this.date2 = date2;

    this.init();
}

DateDiff.prototype.init = function () {
    var data = new DateMeasure(this.date1 - this.date2);
    this.days = data.days;
    this.hours = data.hours;
    this.minutes = data.minutes;
    this.seconds = data.seconds;
};

function DateMeasure(ms) {
    var d, h, m, s;
    s = Math.floor(ms / 1000);
    m = Math.floor(s / 60);
    s = s % 60;
    h = Math.floor(m / 60);
    m = m % 60;
    d = Math.floor(h / 24);
    h = h % 24;

    this.days = d;
    this.hours = h;
    this.minutes = m;
    this.seconds = s;
};

Date.diff = function (date1, date2) {
    return new DateDiff(date1, date2);
};

Date.prototype.diff = function (date2) {
    return new DateDiff(this, date2);
};



function timeToLive(timer, end) {

    var date = new Date().getTime();
    var t = Date.diff(end, date)

    return t;
}

function toLive(timer) {


    var curDate = new Date().getTime()
    var date = new Date().getTime();
    date += parseInt(timer)
    var date2 = new Date(date)
    var t = Date.diff(date2, curDate)

    return date2;

}



function isVillageInArray(array, item) {
    for (var i = 0; i < array.length; i++) {
        // This if statement depends on the format of your array
        if (array[i][0] == item[0] && array[i][1] == item[1]) {
            return true;   // Found it
        }
    }
    return false;   // Not found
}

function isClanInArray(array, item) {
    for (var i = 0; i < array.length; i++) {
        // This if statement depends on the format of your array
        if (array[i][1] == item[1]) {
            return true;   // Found it
        }
    }
    return false;   // Not found
}

function addVillage(args, receivedMessage) {
    if (receivedMessage.guild === null) {
        receivedMessage.channel.send("Use the correct server channel to add villages")
        return
    }


    console.log(args[0] + " added village")
    if (!isVillageInArray(villageCommunity, [args[0], receivedMessage.channel.guild.id])) {

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
        var lastUpdate = new Date().getTime()
        var clan = receivedMessage.channel.guild.id
        console.log(toLive(timer).toUTCString() + "String")
        console.log(toLive(timer))
        villageCommunity.push([args[0], clan, toLive(timer), lastUpdate, timer])
        console.log(villageCommunity.length)
        console.log(villageCommunity[0][4] + " " + villageCommunity[0][2] + " output")
        console.log("Test date: " + timeToLive(villageCommunity[0][4], villageCommunity[0][2]))



        var vil = setInterval(intervalFunc, timer, args[0], receivedMessage);

        villageTimeCommunity.push(vil)
        console.log(args[0])

        if ((timer - timer6h) > 0) {
            console.log("6h")
            var vil6h = setInterval(intervalFunc6h, (timer - timer6h), args[0], receivedMessage);


        }
        if ((timer - timer2h) > 0) {
            console.log("2h")
            var vil2h = setInterval(intervalFunc2h, (timer - timer2h), args[0], receivedMessage);


        }
        if ((timer - timer30min) > 0) {
            console.log("30min")
            var vil30min = setInterval(intervalFunc30min, (timer - timer30min), args[0], receivedMessage);



        }
        if ((timer - timer10min) > 0) {
            console.log("10min")
            var vil10m = setInterval(intervalFunc10min, (timer - timer10min), args[0], receivedMessage);



        }

        villageTime6hCommunity.push(vil6h)
        villageTime2hCommunity.push(vil2h)
        villageTime30minCommunity.push(vil30min)
        villageTime10minCommunity.push(vil10m)

    }
    else
        receivedMessage.channel.send("I am all ready tracking that village.")


}





function updateTheVillageCommand(args, receivedMessage) {


    if (args.length < 3) {
        receivedMessage.channel.send("What village is that, and what time ?_?. try nameOfVillage 12 45")
        return
    }

    if (receivedMessage.guild === null) {
        receivedMessage.channel.send("Use the correct server channel to update villages")
        return
    }


    for (var i = 0; i < villageCommunity.length; i++) {
        if (villageCommunity[i][0] == args[0] && villageCommunity[i][1] == receivedMessage.channel.guild.id) {
            removeVillage(args[0], receivedMessage)
            addVillage(args, receivedMessage)
            break;
        }

    }
}

function updateVillagetimer(args, msg) {


    for (var i = 0; i < villageCommunity.length; i++) {
        if (villageCommunity[i][0] == args && villageCommunity[i][1] == msg.channel.guild.id) {


            console.log("update timer " + villageCommunity[i][0] + " " + i)
            villageCommunity.splice(i, 1)
            clearInterval(villageTimeCommunity[i])

            villageTimeCommunity.splice(i, 1)
            villageTime6hCommunity.splice(i, 1)
            villageTime2hCommunity.splice(i, 1)
            villageTime30minCommunity.splice(i, 1)
            villageTime10minCommunity.splice(i, 1)



            var timer25h = 90000000
            var timer6h = 21600000
            var timer2h = 7200000
            var timer30min = 1800000
            var timer10min = 600000
            var lastUpdate = new Date().getTime()

            var clan = msg.channel.guild.id
            villageCommunity.push([args, clan, toLive(timer25h), lastUpdate, timer25h])


            var vil = setInterval(intervalFunc, timer25h, args, msg);


            if ((timer25h - timer6h) > 0) {
                var vil6h = setInterval(intervalFunc6h, (timer25h - timer6h), args, msg);
                villageTime6hCommunity.push(vil6h)
            }
            if ((timer25h - timer2h) > 0) {
                var vil2h = setInterval(intervalFunc2h, (timer25h - timer2h), args, msg);
                villageTime2hCommunity.push(vil2h)
            }
            if ((timer25h - timer30min) > 0) {
                var vil30min = setInterval(intervalFunc30min, (timer25h - timer30min), args, msg);
                villageTime30minCommunity.push(vil30min)
            }
            if ((timer25h - timer10min) > 0) {
                var vil10m = setInterval(intervalFunc10min, (timer25h - timer10min), args, msg);
                villageTime10minCommunity.push(vil10m)
            }
            break;
        }
    }


}

function showVillagetimerCommand(arguments, receivedMessage) {

    if (receivedMessage.guild === null) {
        receivedMessage.channel.send("Use the correct server channel")
        return
    }

    var key = receivedMessage.channel.guild.id
    if (isClanInArray(villageCommunity, [arguments[0], key])) {
        receivedMessage.channel.send("Currently tracking these villages: ")

        for (var i = 0, len = villageCommunity.length; i < len; i++) {
            if (villageCommunity[i][1] == key) {
                var live = timeToLive(villageCommunity[i][4], villageCommunity[i][2])
                if (parseInt(live.days) == 1)
                    receivedMessage.channel.send(villageCommunity[i][0] + " is Live in approx " + live.days + "day " + live.hours + "h" + " " + live.minutes + "min" + "\n" + villageCommunity[i][2].toUTCString())
                else
                    receivedMessage.channel.send(villageCommunity[i][0] + " is Live in approx " + live.hours + "h" + " " + live.minutes + "min" + "\n" + villageCommunity[i][2].toUTCString())

            }

        }

    }
    else
        receivedMessage.channel.send("Currently no villages added ")
}

function showTimerCommand(arguments, receivedMessage) {

    if (receivedMessage.guild === null) {
        receivedMessage.channel.send("Use the correct server channel")
        return
    }

    var key = receivedMessage.channel.guild.id
    if (isClanInArray(villageCommunity, [arguments[0], key])) {

        for (var i = 0, len = villageCommunity.length; i < len; i++) {

            if (villageCommunity[i][0] == arguments[0]) {
                var live = timeToLive(villageCommunity[i][4], villageCommunity[i][2])
                if (parseInt(live.days) == 1)
                    receivedMessage.channel.send(villageCommunity[i][0] + " is Live in approx " + live.days + "day " + live.hours + "h" + " " + live.minutes + "min" + "\n" + villageCommunity[i][2].toUTCString())
                else
                    receivedMessage.channel.send(villageCommunity[i][0] + " is Live in approx " + live.hours + "h" + " " + live.minutes + "min" + "\n" + villageCommunity[i][2].toUTCString())
                break;

            }


        }

    }
    else
        receivedMessage.channel.send(arguments[0] + " can not be found in the village list.")
}

function sendMessageToVillageChannel(msg, count, receivedMessage) {

    if (ClansTracker.includes(receivedMessage.channel.guild.id)) {
        var i = ClansTracker.indexOf(receivedMessage.channel.guild.id)
        villageMsgChanId = ClanChannelTracker[i]

    }

    var messageChannel = client.channels.get(villageMsgChanId.toString()) // Replace with known channel ID

    var now = new Date()


    if (parseInt(now.getMinutes()) < 10)
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

function intervalFunc(arg, msg) {
    updateVillagetimer(arg, msg)

    sendMessageToVillageChannel("`" + arg + "`" + " is going Live", 0, msg)
}

function intervalFunc6h(arg, msg) {

    sendMessageToVillageChannel("`" + arg + "`" + " is going Live in 6 hours ", 6, msg)

    for (var i = 0; i < villageCommunity.length; i++) {
        if (villageCommunity[i][0] == arg && villageCommunity[i][1] == msg.channel.guild.id) {

            var pos = i
            console.log(i + " pos6h")
            console.log("update timer6h " + villageCommunity[pos] + " " + pos)
            clearInterval(villageTime6hCommunity[pos])

        }
    }
}
function intervalFunc2h(arg, msg) {

    sendMessageToVillageChannel("`" + arg + "`" + " is going Live in 2 hours", 2, msg)

    for (var i = 0; i < villageCommunity.length; i++) {
        if (villageCommunity[i][0] == arg && villageCommunity[i][1] == msg.channel.guild.id) {

            var pos = i
            console.log("update timer2h " + villageCommunity[pos] + " " + pos)
            clearInterval(villageTime2hCommunity[pos])

        }
    }
}
function intervalFunc10min(arg, msg) {

    sendMessageToVillageChannel("`" + arg + "`" + " is going Live in 10min !", 10, msg)

    for (var i = 0; i < villageCommunity.length; i++) {
        if (villageCommunity[i][0] == arg && villageCommunity[i][1] == msg.channel.guild.id) {

            var pos = i
            console.log("update timer10m " + villageCommunity[i] + " " + pos)
            console.log("10min " + villageTime10minCommunity[pos])
            clearInterval(villageTime10minCommunity[pos])


            console.log("10min length: after " + villageTime10minCommunity.length)

        }
    }
}
function intervalFunc30min(arg, msg) {

    sendMessageToVillageChannel("`" + arg + "`" + " is going Live in 30min !", 30, msg)

    for (var i = 0; i < villageCommunity.length; i++) {
        if (villageCommunity[i][0] == arg && villageCommunity[i][1] == msg.channel.guild.id) {

            var pos = i
            console.log("update timer30m " + villageCommunity[i] + " " + pos)
            console.log("30min " + villageTime30minCommunity[pos])
            clearInterval(villageTime30minCommunity[pos])
            console.log("30min length: after " + villageTime30minCommunity.length)



        }
    }
}











// Get your bot's secret token from:
// https://discordapp.com/developers/applications/
// Click on your application -> Bot -> Token -> "Click to Reveal Token"
//bot_secret_token = "NTA4NTk0NDkzODIyNDY4MTE2.DsBkeQ.-r9z91JKeNcPu_R0zl98LPeqX5M"

bot_secret_token = auth.token
client.login(auth.token)