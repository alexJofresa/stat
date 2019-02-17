function miseajour() {
    init()
  }

var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1WfqCKaGxmxf351-L6uq836TQhI4JZzjgG_BOtcrd6Cc/edit?usp=sharing';  //jojo


function init() {
  Tabletop.init( { key: publicSpreadsheetUrl,
                   callback: showInfo,
                   simpleSheet: true } )
}


function showInfo(data, tabletop) {
  alert('Successfully processed!')
 var source = tabletop.sheets("Réponses au formulaire 1").elements
  console.log(source)
}




