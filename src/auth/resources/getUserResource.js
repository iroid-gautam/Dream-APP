import { baseUrl } from "../../common/constants/constant"


export default class GetUserResource {
    constructor(data) {
      this._id = data._id;
      this.name = data.name;
      this.profileImage = data.profileImage ? baseUrl(data.profileImage) : null;
      this.email = data.email;
      this.isVerified = data.isVerified;
    }
  }