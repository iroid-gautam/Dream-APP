import moment from "moment";
import MyHabits from "../model/myHabits";
import { HABITTYPE } from "../src/common/constants/constant";
import { sendPushNotificationHabit } from "../src/common/helper";



// Daily send push notification
export const dailySendNotification = async () => {
    const dayNumber = moment().format('d');

    const habits = await MyHabits.find({ frequency: 0, days: { $in: dayNumber } });

    habits.map(async (data) => {
        if (data.markDone === false) {
            await sendPushNotificationHabit(HABITTYPE.DAILY, data.userId, data.frequency, data._id, data.name);
        }
    });
}




// Weekly send push notifications 
export const weeklySendNotification = async () => {
    const habits = await MyHabits.find({ frequency: 1 });

    habits.map(async (data) => {
        if (data.markDone === false) {
            await sendPushNotificationHabit(HABITTYPE.WEEKLY, data.userId, data.frequency, data._id, data.name);
        }
    });
}



// Monthly send push notifications
export const monthlySendNotification = async () => {
    const habits = await MyHabits.find({ frequency: 2 });

    habits.map(async (data) => {
        if (data.markDone === false) {
            await sendPushNotificationHabit(HABITTYPE.MONTHLY, data.userId, data.frequency, data._id, data.name);
        }
    });
}