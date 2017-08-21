var spreadsheet = SpreadsheetApp.getActive();

function onInstall(e) {
  onOpen(e);
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createAddonMenu()
    .addItem('Start', 'showSidebar')
    .addToUi();
  
  SpreadsheetApp.getUI()
      .createMenu('Tradingsim')
      .addItem('Start', 'doit')
}

function doit() {
  marketTick('sell');
}

function showSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('sidebar')
      .setTitle('TradingSim')
      .setWidth(300);
  SpreadsheetApp.getUi()
      .showSidebar(html);
}

function createNewSheet(sheetName) {
  if(sheetName == null) { 
    sheetName = "Simulation/"+Session.getActiveUser().getEmail();
  }
  var sheet = null
  sheet = spreadsheet.insertSheet(sheetName);
  return sheet;
}
  
function createNew(params, sheetName)
{
    var simParams = new SimParams();
    simParams.loadAll(params);
    simParams.saveAll();
    var sheet = createNewSheet(sheetName);
    SpreadsheetApp.setActiveSheet(sheet);
    var varTitles = [["Step"],
                     ["Midmarket Spot"],
                     ["Bid"],
                     ["Offer"],
                     ["Position"],
                     ["PnL"]];
  sheet.getRange("A1:A6").setValues(varTitles).setFontWeight("bold");
  var dataTitles = [['Step', 'Spot', 'Position', 'PnL']];
  sheet.getRange("D1:G1").setValues(dataTitles).setFontWeight("bold");
  var initData = [[1],
                  [simParams.initialSpot],
                  [simParams.initialSpot-simParams.spread/2],
                  [simParams.initialSpot+(simParams.spread/2)],
                  [0],
                  [0]];
  sheet.getRange("B1:B6").setValues(initData);
}

function updateParams(params) {
  var simParams = new SimParams();
  simParams.loadAll(params);
  simParams.saveAll();
}

function clear() {
    var marketData = new MarketData();
    marketData.clear();
}
    
function marketTick(order) {
  try {
    var simParams = new SimParams();
    simParams.loadAll();
    var marketData = new MarketData();
    marketData.loadAll();
    marketData.pushData();
    
    var spotInc = simParams.spotIncrement;
    if(Math.random()<0.5) 
    {
      spotInc = -spotInc;
    }

    marketData.pnl = marketData.pnl+marketData.position*spotInc;
    marketData.spot += spotInc;
    marketData.step += 1;  
    
    marketData.bid = marketData.spot-simParams.spread/2;
    marketData.offer = marketData.spot+simParams.spread/2;

    if(order !== null) {
      if(order==='buy') {
        marketData.position += 1;
      } else if(order==='sell') {
        marketData.position -= 1;
      }
      marketData.pnl = marketData.pnl-simParams.spread/2;
    }
    if(simParams.priceTakers) {
      var marketSignal = Math.random();
      if(marketSignal < simParams.buyProb/100) {
        marketData.position -=1;
        marketData.pnl += simParams.spread/2;
        marketData.message = "Market buys";
      } else if(marketSignal > simParams.buyProb/100 && marketSignal< simParams.buyProb/100+simParams.sellProb/100) {
        marketData.position += 1;
        marketData.pnl += simParams.spread/2;
        marketData.message = "Market sells";
      } else {
        marketData.message = "";
      }
    }
    
    marketData.saveAll();
  } catch(e) {
    //Logger.log(e);
    throw e;
  }
}
