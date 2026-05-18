export default class GetUserResource {
  constructor(data) {
    this.id = data.id;
    this.firstName = data.firstName || null;
    this.lastName = data.lastName || null;
    this.email = data.email;
    this.timezone = data.timezone || null;
    this.isVerified = data.isVerified;
    this.providerType = data.providerType || null;
    this.lastLoginProvider = data.lastLoginProvider || null;
  }
}
