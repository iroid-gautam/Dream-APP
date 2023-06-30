
export default class GetMentalScoreResource {
    constructor(data) {
        return ({
            _id: data._id,
            score: data.score,
            emojiId: data.emojiId,
            added: data.added,
        });
    }
}