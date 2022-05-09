module.exports = (client, prefix) => {
    require('dotenv').config()
    client.user.setActivity("Loading Screen!", {
        type: "WATCHING",

    });
    const activities = ["Commands!", "-commands", "Waffle's chat!", "Staff members!", "Users!"]

    setInterval(() => {
        let activity = activities[Math.floor(Math.random() * activities.length)]
        client.user.setActivity(process.env.PREFIX + `help | ${activity}`, { type: 'LISTENING' })
    }, 30000)

};
module.exports.config = {
    // The display name that server owners will see.
    // This can be changed at any time.
    displayName: 'ready',
    
    // The name the database will use to set if it is enabled or not.
    // This should NEVER be changed once set, and users cannot see it.
    dbName: 'READY'
  }