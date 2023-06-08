class PanelController {
  constructor(uuid) {
    this.uuid = uuid;
    this.createdAt = new Date().toISOString();
    this.lastSeen = null;
    this.socket = null;
  }

  updateLastSeen () {
    this.lastSeen = new Date().toISOString();
  }
}

module.exports = PanelController;