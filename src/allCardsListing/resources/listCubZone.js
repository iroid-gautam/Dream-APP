import { baseUrl } from "../../common/constants/constant";

export default class CubZoneResource {
    constructor(cubzone) {
        return cubzone.map(data => ({
            _id: data._id,
            frontImage: data.frontImage !== null ? baseUrl(data.frontImage) : null,
            flipImage: data.flipImage !== null ? baseUrl(data.flipImage) : null
        }));
    }
}