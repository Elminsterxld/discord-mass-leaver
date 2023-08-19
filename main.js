
const fs = require('fs');
const { Client } = require("discord.js-selfbot-v13");

const botTokens = fs.readFileSync('tokens.txt', 'utf8').split('\n').map(line => line.trim());
const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}
const leaveGuilds = async () => {
    for (const token of botTokens) {
        const client = new Client({

        });

        client.once('ready', () => {
            console.log(`[LOGİN]: ${client.user.tag}`);

            client.guilds.cache.forEach(async guild => {
                try {
                    await guild.leave();
                    console.log(`[LEAVED] Sunucudan ayrıldı: ${guild.name} (${client.user.tag})`);
                } catch (error) {
                    console.error(`[ERROR] Sunucudan ayrılırken bir hata oluştu: ${guild.name} (${client.user.tag}) - ${error}`);
                }
                await sleep(5000); 
                console.log("[WARNING] RATE LİMİT BEKLEMESİ AKTİF!")
            });

            console.log('[SUCCESS] Tüm sunuculardan ayrılma işlemi tamamlandı.');
         
        });

        try {
            await client.login(token);
        } catch (error) {
            console.error(`[ERROR] Token giriş yaparken bir hata oluştu: ${error}`);
        }
    }
};

leaveGuilds();
