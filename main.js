const fs = require('fs');
const { Client } = require("discord.js-selfbot-v13");

const botTokens = fs.readFileSync('tokens.txt', 'utf8').split('\n').map(line => line.trim());
const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

let success = 0;
let remainingTokens = botTokens.length;
let errorCount = 0;

const updateProcessTitle = () => {
    process.title = `Remaining Tokens: ${remainingTokens}, Successfull: ${success}, Errors: ${errorCount}`;
}

const getTokenFromLine = (line) => {
    const parts = line.split(":");
    if (parts.length > 1) {
        return parts[parts.length - 1];
    }
    return parts[0]; 
};

const leaveGuilds = async () => {
    for (const tokens of botTokens) {
        let token = getTokenFromLine(tokens);
        const client = new Client();
        
        client.once('ready', () => {
            console.log(`[LOGIN]: ${client.user.tag}`);

            client.guilds.cache.forEach(async guild => {
                try {
                    await guild.leave();
                    console.log(`[LEAVED] Left the guild: ${guild.name} (${client.user.tag})`);
               
                } catch (error) {
                    console.error(`[ERROR] An error occurred while leaving the guild: ${guild.name} (${client.user.tag}) - ${error}`);
                    errorCount++;
                    updateProcessTitle();
                }
                await sleep(5000); 
             
            });
            success++;
            remainingTokens--;
            updateProcessTitle();
            console.log('[SUCCESS] Left all guilds successfully.');
        });

        try {
            await client.login(token);
        } catch (error) {
            console.error(`[ERROR] An error occurred while logging in with the token: ${error}`);
            errorCount++;
            updateProcessTitle();
        }
    }
};

updateProcessTitle();
leaveGuilds();
