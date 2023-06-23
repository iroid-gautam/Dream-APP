import Emojis from "../model/emojis";
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
        return true;
    }
}

seedImages()