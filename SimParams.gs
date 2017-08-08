var sheetProperties = PropertiesService.getUserProperties();

function SimParams() {
  if(arguments.length != 0 ) {
    var params = arguments[0];
    this.initialSpot = parseFloat(params.initialSpot);
    this.tickTime = parseInt(params.tickTime);
    this.spotIncrement = parseFloat(params.spotIncrement);
    this.initialSpot = parseFloat(params.initialSpot);
    this.spread = parseFloat(params.spread);
    this.buyProb = parseFloat(params.buyProb);
    this.sellProb = parseFloat(params.sellProb);
    this.priceTakers = params.priceTakers;
  } else {
    this.initialSpot = parseFloat(sheetProperties.getProperty('initialSpot'));
    this.tickTime = parseInt(sheetProperties.getProperty('tickTime'));
    this.spotIncrement = parseFloat(sheetProperties.getProperty('spotIncrement'));
    this.initialSpot = parseFloat(sheetProperties.getProperty('initialSpot'));
    this.spread = parseFloat(sheetProperties.getProperty('spread'));
    this.buyProb = parseFloat(sheetProperties.getProperty('buyProb'));
    this.sellProb = parseFloat(sheetProperties.getProperty('sellProb'));
    this.priceTakers = sheetProperties.getProperty('priceTakers')==='true';
  }
}

SimParams.prototype.update = function() {
  sheetProperties.setProperty('initialSpot', JSON.stringify(this.initialSpot));
  sheetProperties.setProperty('tickTime', JSON.stringify(this.tickTime));
  sheetProperties.setProperty('spotIncrement', JSON.stringify(this.spotIncrement));
  sheetProperties.setProperty('initialSpot', JSON.stringify(this.initialSpot));
  sheetProperties.setProperty('spread', JSON.stringify(this.spread));
  sheetProperties.setProperty('buyProb', JSON.stringify(this.buyProb));
  sheetProperties.setProperty('sellProb', JSON.stringify(this.sellProb));
  sheetProperties.setProperty('priceTakers', JSON.stringify(this.priceTakers));
}
