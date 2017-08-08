var spreadsheet = SpreadsheetApp.getActive();

function onInstall(e) {
  onOpen(e);
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createAddonMenu()
    .addItem('Start', 'showSidebar')
    .addToUi();
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
  
function startSim(params, sheetName)
{
    var simParams = new SimParams(params);
    Logger.log("Start called: "+JSON.stringify(simParams));
    simParams.update();
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
  var simParams = new SimParams(params);
  simParams.update();
}

function clear() {
    var marketData = new MarketData();
    marketData.clear();
}
    
function marketTick(order) {
  try {
    var marketParams = new SimParams();
    var marketData = new MarketData();

    marketData.load();
    marketData.saveStats();
    
    var spotInc = marketParams.spotIncrement;
    if(Math.random()<0.5) 
    {
      spotInc = -spotInc;
    }

    marketData.pnl = marketData.pnl+marketData.position*spotInc;
    marketData.spot += spotInc;
    marketData.step += 1;  
    
    marketData.bid = marketData.spot-marketParams.spread/2;
    marketData.offer = marketData.spot+marketParams.spread/2;

    if(order !== null) {
      if(order==='buy') {
        marketData.position += 1;
      } else if(order==='sell') {
        marketData.position -= 1;
      }
      marketData.pnl = marketData.pnl-marketParams.spread/2;
    }

    if(marketParams.priceTakers) {
      var marketSignal = Math.random();
      if(marketSignal < marketParams.buyProb/100) {
        marketData.position -=1;
        marketData.pnl += marketParams.spread/2;
        marketData.message = "Market buys";
      } else if(marketSignal > marketParams.buyProb/100 && marketSignal< marketParams.buyProb/100+marketParams.sellProb/100) {
        marketData.position += 1;
        marketData.pnl += marketParams.spread/2;
        marketData.message = "Market sells";
      } else {
        marketData.message = "";
      }
    }
    
    marketData.update();
  } catch(e) {
    Logger.log(e);
    return false;
  }
}

