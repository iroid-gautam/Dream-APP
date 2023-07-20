import cron from "node-cron";
import { weeklySendNotification, monthlySendNotification, dailySendNotification } from "./habitsNotification";


// Every day send notification daily
cron.schedule('0 6 * * *', async () => {
    console.log('Every day 6 am cron call (Daily)');
    dailySendNotification()
});



// Every monday send notifications week
cron.schedule('0 9 * * MON', async () => {
    console.log("Every monday 9 am cron call (Weekly)");
    weeklySendNotification()
});


// Every sunday send notifications monthly
cron.schedule('0 9 * * SUN', async () => {
    console.log("Every sunday 9 am cron call(Monthly)");
    monthlySendNotification()
});