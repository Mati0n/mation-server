class Source {
  constructor(sid, did, name, options = {}) {
    this.name = name || 'Source';
    this.id = sid.toString();
    this.image = {};
    this.description = "";
    this.driverId = did;
    this.hide = options.hide || false;
    this.runAction = options.runAction || [];
    this.active = false;
    this.nowUsedInZones = options.global ? [] : undefined;
  }
}

class SourceGroup {
  constructor(sid, name, options = {}) {
    this.name = name || "Source Group";
    this.id = sid.toString();
    this.image = {};
    this.description = "";
    this.runAction = [];
    this.active = false;
    this.group = options.group || null;
  }
}

module.exports = { Source, SourceGroup };