var sheetConst = {
  step: "B1",
  spot: "B2",
  bid: "B3",
  offer: "B4",
  position: "B5",
  pnl: "B6",
  marketSignal: "B7",
  data: "D1:I1"
};

function MarketData() {
}

MarketData.prototype.saveStats = function() {
  try {
    spreadsheet.getRange(sheetConst.data).offset(this.step, 0).setValues(
      [[this.step, this.spot, this.position, this.pnl, this.bid, this.offer]]
    );
  } catch(e) {
    Logger.log("MarketData.clear");
    Logger.log(e);
  }
}

MarketData.prototype.load = function() {
  try {
    this.step =  parseInt(spreadsheet.getRange(sheetConst.step).getValue());
    this.spot = parseFloat(spreadsheet.getRange(sheetConst.spot).getValue());
    this.position = parseInt(spreadsheet.getRange(sheetConst.position).getValue());
    this.pnl = parseFloat(spreadsheet.getRange(sheetConst.pnl).getValue());
    this.bid = parseFloat(spreadsheet.getRange(sheetConst.bid).getValue());
    this.offer = parseFloat(spreadsheet.getRange(sheetConst.offer).getValue());
    this.message = "";
  } catch(e) {
    Logger.log("MarketData.load");
    Logger.log(e);
  }
}

MarketData.prototype.update = function() {
  try {
    spreadsheet.getRange(sheetConst.step).setValue(this.step);
    spreadsheet.getRange(sheetConst.spot).setValue(this.spot);
    spreadsheet.getRange(sheetConst.position).setValue(this.position);
    spreadsheet.getRange(sheetConst.pnl).setValue(this.pnl);
    spreadsheet.getRange(sheetConst.bid).setValue(this.bid);
    spreadsheet.getRange(sheetConst.offer).setValue(this.offer);
    spreadsheet.getRange(sheetConst.marketSignal).setValue(this.message);
  } catch(e) {
    Logger.log("MarketData.update");
    Logger.log(e);
  }
}

MarketData.prototype.clear = function() {
  try {
    var params = new SimParams();
    spreadsheet.getRange(sheetConst.step).setValue(1);
    var init = params.initialSpot;
    var spread = params.spread;
    spreadsheet.getRange(sheetConst.spot).setValue(init);
    spreadsheet.getRange(sheetConst.data).offset(1, 0, 500, 6).clear();
    spreadsheet.getRange(sheetConst.bid).setValue(init-spread/2);
    spreadsheet.getRange(sheetConst.offer).setValue(init+spread/2);
    spreadsheet.getRange(sheetConst.position).setValue(0);
    spreadsheet.getRange(sheetConst.pnl).setValue(0);
    spreadsheet.getRange(sheetConst.marketSignal).setValue("");
  } catch(e) {
    Logger.log("MarketData.clear");
    Logger.log(e);
  }
}

MarketData.prototype.processOrders = function(handler) {
  var queue = getQueue();
  Logger.log(queue);
  while(queue.length>0) {
    var order = queue.shift();
    handler(order);
  }
  emptyQueue();
}

