import { baseUrl, HABITTYPE } from "../common/constants/constant";
import FcmHelper from "./fcmHelper";
import FcmToken from "../../model/fcmToken";

/**
 * App logo
 * @returns
 */
export const logo = () => {
    return baseUrl("icons/logo.png");
};

/**
 * random string generator
 * @param {*} givenLength 
 * @returns 
 */
export const randomStringGenerator = (givenLength = 70) => {
    const characters =
        givenLength > 10 ?
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789" :
            "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const length = givenLength;
    let randomStr = "";

    for (let i = 0; i < length; i++) {
        const randomNum = Math.floor(Math.random() * characters.length);
        randomStr += characters[randomNum];
    }
    return randomStr
}




// send push notification in habit
export const sendPushNotificationHabit = async (status, auth, frequency, habitId, habitName) => {
    const tokens = [];
    (await FcmToken.find({ userId: auth })).forEach(function (document) { tokens.push(document.token) });

    const payload = {
        notification: {
            title: "",
            body: "",
        },
        data: {
            habitId: habitId.toString(),
        }
    };

    if (status === 0) {
        (payload.notification.title = "Hey! Don’t forget."),
            (payload.notification.body = `You need to ${habitName}. Have a great day!`);
        payload.data.type = HABITTYPE.DAILY.toString();
        payload.data.frequency = frequency.toString();
    } else if (status === 1) {
        (payload.notification.title = "Hey! Don’t forget."),
            (payload.notification.body = `You need to ${habitName}. Have a great day!`);
        payload.data.type = HABITTYPE.WEEKLY.toString();
        payload.data.frequency = frequency.toString();
    } else if (status === 2) {
        (payload.notification.title = "Hey! Don’t forget."),
            (payload.notification.body = `You need to ${habitName}. Have a great day!`);
        payload.data.type = HABITTYPE.MONTHLY.toString();
        payload.data.frequency = frequency.toString();
    }


    await FcmHelper.sendPushNotification(tokens, payload)
}  