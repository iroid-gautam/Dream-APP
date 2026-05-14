export default class GetUserResource {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.isVerified = data.isVerified;
    this.providerType = data.providerType || null;
    this.lastLoginProvider = data.lastLoginProvider || null;
  }
}
