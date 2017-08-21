var sheetProperties = PropertiesService.getUserProperties();

function DAO() {
}
DAO.prototype.loadAll = function(initObj) {
  for(var i=0; i<this.attrNames.length; i++) {
    var name = this.attrNames[i];
    this[name] = this.loadAttr(name, initObj);
  }
}
DAO.prototype.saveAll = function() {
  for(var i=0; i<this.attrNames.length; i++) {
    var name = this.attrNames[i];
    this.save(name);
  }
}
DAO.prototype.loadAttr = function(name, initObj) {
  if(initObj===undefined) {
    var raw = this.load(name);
    return this.parse(raw);
  } else {
    return this.parse(initObj[name]);
  }
}
DAO.prototype.parse = function(rawValue) {
  if(typeof(rawValue)==='boolean')
    return rawValue;
  var value = parseFloat(rawValue);
  if(isNaN(value)) {
    value = (rawValue==="true");
  }
  return value;
}
DAO.prototype.toString = function() {
  var result = [];
  for(var i=0; i<this.attrNames.length; i++) {
    var name = this.attrNames[i];
    var value = this[name];
    result.push(name+": "+value);
  }
  return "["+result.join(", ")+"]";
}

function MarketData() {}
MarketData.prototype = new DAO();
MarketData.prototype.attrNames = ["step", "spot", "position", "pnl", "bid", "offer"];
MarketData.prototype.sheetConst = {
  step: "B1", spot: "B2", bid: "B3", offer: "B4", position: "B5", 
  pnl: "B6", message: "B7", data: "D1:I1" };
MarketData.prototype.save = function(attrName) {
  //Logger.log("save: "+attrName+" -> "+this[attrName]);
  spreadsheet.getRange(this.sheetConst[attrName]).setValue(this[attrName]);
}
MarketData.prototype.load = function(attrName) {
  return spreadsheet.getRange(this.sheetConst[attrName]).getValue();
}
MarketData.prototype.pushData = function() {
  try {
    spreadsheet.getRange(this.sheetConst.data).offset(this.step, 0).setValues(
      [[this.step, this.spot, this.position, this.pnl, this.bid, this.offer]]
    );
  } catch(e) {
    //Logger.log(e);
    throw e;
  }
}
MarketData.prototype.clear = function() {
  try {
    var params = new SimParams();
    params.loadAll();
    var init = params.initialSpot;
    this.step = 1;
    this.spot = init;
    this.bid = init-params.spread/2;
    this.offer = init+params.spread/2;
    this.position = 0;
    this.pnl = 0; 
    this.message = '';
    this.saveAll();
    spreadsheet.getRange(this.sheetConst.data).offset(1, 0, 500, 6).clear();
    spreadsheet.getRange(this.sheetConst.message).setValue(this.message);
  } catch(e) {
    //Logger.log("MarketData.clear");
    throw e;
  }
}

function SimParams() {}
SimParams.prototype = new DAO();
SimParams.prototype.attrNames = ['initialSpot', 'tickTime', 'spotIncrement', 
                                  'spread', 'buyProb', 'sellProb', 'priceTakers'];
SimParams.prototype.save = function(name) {
  sheetProperties.setProperty(name, this[name]);
}
SimParams.prototype.load = function(name) {
  var par = sheetProperties.getProperty(name);
  return par;
}

function testFun() {
  var sim = new SimParams();
  sim.loadAll({'initialSpot':1.3, 'tickTime':1, 'spotIncrement':0.001, 
               'spread':0.003, 'buyProb':20, 'sellProb':20, 'priceTakers':true});
  sim.saveAll();
  Logger.log(""+sim);
  var newSim = new SimParams();
  newSim.loadAll();
  Logger.log(""+newSim);
  var dat = new MarketData();
  dat.clear();
  dat.pushData();
}



