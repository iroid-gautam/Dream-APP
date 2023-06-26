import Emojis from "../model/emojis";
import MindBody from "../model/mindAndBody";
import MyInspiration from "../model/myInspiration";
import { baseUrl } from "../src/common/constants/constant";

export const seedImages = async () => {
    const images = [
        {
            emoji: baseUrl('emojis/1.png')
        },
        {
            emoji: baseUrl('emojis/2.png')
        },
        {
            emoji: baseUrl('emojis/3.png')
        },
        {
            emoji: baseUrl('emojis/4.png')
        },
        {
            emoji: baseUrl('emojis/5.png')
        },
        {
            emoji: baseUrl('emojis/6.png')
        },
        {
            emoji: baseUrl('emojis/7.png')
        },
        {
            emoji: baseUrl('emojis/8.png')
        },
        {
            emoji: baseUrl('emojis/9.png')
        },
        {
            emoji: baseUrl('emojis/10.png')
        },
    ];

    const findEmoji = await Emojis.find({});
    if (findEmoji.length === 0) {
        const inserted = await Emojis.insertMany(images);
        console.log('Emoji seeded');
        return true;
    }
}
seedImages()


export const myMindAndBody = async () => {
    const mindBody = [
        {
            title: 'My Habits'
        },
        {
            title: 'My Goals'
        },
        {
            title: 'My Journal'
        },
        {
            title: 'My Mental Health'
        }
    ];

    const finddata = await MindBody.find({});
    if (finddata.length === 0) {
        const inserted = await MindBody.insertMany(mindBody);
        console.log('My Mind & Body seeded');
        return true;
    }
}
myMindAndBody()



export const myInspiration = async () => {
    const inspiration = [
        {
            title: 'Affirmations'
        },
        {
            title: 'Inspirational Quotes'
        },
        {
            title: 'Questions to Contemplate'
        },
        {
            title: 'Strategy Cards'
        },
        {
            title: 'Cub Zone'
        },
        {
            title: 'Our Insights'
        },
        {
            title: 'Videos & Podcasts'
        },
    ];

    const finddata = await MyInspiration.find({});
    if (finddata.length === 0) {
        const inserted = await MyInspiration.insertMany(inspiration);
        console.log('My Inspiration seeded');
        return true;
    }
}
myInspiration()
