import Emojis from "../model/emojis";
import MindBody from "../model/mindAndBody";
import MyInspiration from "../model/myInspiration";
import Admin from "../model/admin";
import { baseUrl } from "../src/common/constants/constant";

// admin credentials
export const admin = async () => {

    const adminData = {
        email: 'admin@kickfearandbuttapp.com',
        password: '$2y$12$ghkZX2MM/douHFJnsO9iUu/LM88cQ/TcK8WZR4oIkKJF7nS1ItVTO'      // admin@123
    }

    const finddata = await Admin.find({});
    if (finddata.length === 0) {
        const inserted = await Admin.create(adminData);
        console.log('admin seeded');
        return true;
    }
}
admin()

// Emojis seeding
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


// My mind and body seeding
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



// My inspiration seeding
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