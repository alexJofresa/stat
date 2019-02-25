// PAGE DE SCRIPT
//18/02/2019
// https://alexjofresa.github.io/stat/




// Declarartion des variable globale:
var jd = jsdataframe;

//===========================================
// Declarartion des fonctions:
//===========================================

// -------------------------------------------
// Function lié au buttun de la page html

function miseajour() {
    init()
  }

// -------------------------------------------
// Function pour recuperé les donné

var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1WfqCKaGxmxf351-L6uq836TQhI4JZzjgG_BOtcrd6Cc/edit?usp=sharing';  //jojo

var df_generale;

function init() {
  Tabletop.init( { key: publicSpreadsheetUrl,
                   callback: showInfo,
                   simpleSheet: true } )
}



function showInfo(data, tabletop) {

  console.log('Successfully processed!')
 var source = tabletop.sheets("Réponses au formulaire 1").elements
  console.log(source)
  main(source)

}

// -------------------------------------------
// Functions pour préparer les donnée

function date_tt(dateGenerale,heure_tt) {
  // fonction qui inclue l'heure de la tété dans une format date classique
    const [hours, minute ,second] = heure_tt.split(":");
    return  new Date(dateGenerale.setHours(hours,minute,second));

}


function jour_tt(dateGenerale) {
  // fonction qui ne retourne que le jour format classique
    
    return  new Date(dateGenerale.setHours(0,0,0));

}
function convUnixToMomentDate(msDate){
  var momentDate=moment.unix(msDate.values/1000);
  return momentDate;
  //return moment(strDate.values);
}

 function findlastNotNull(vectorIn){
   vector=vectorIn.values
   lst_val=[]
    for(var i in vector)
    {
        if(vector[i]>0){
          lst_val.push(vector[i]);
        }
    }
    return lst_val.slice(-1)[0] 
}

function forceToDate(datestr){
  return new Date(datestr);
}

function strToDate(dateStr) {
  // fonction qui convertie la chaine de caractere en date
  if (dateStr.split(" ").length>1){     // test si c'est le format  "17/02/2019 05:07:39" ou "17/02/2019"
    //dans le cas du format  "17/02/2019 05:07:39"
    const [day, month, year ] = dateStr.split(" ")[0].split("/");
    const [hours, minute ,second] = dateStr.split(" ")[1].split(":");
    return new Date(year, month -1, day ,hours,minute,second);
  } else {
    //dans le cas du format  "17/02/2019"
    const [day, month, year ] = dateStr.split("/");
    return new Date(year, month -1, day);
  }
}

function forceBool(str){
  // fonction qui convertir une string en Booleen
  if (str.trim() === String("Oui").trim()){
    return 1
    }else {
        return 0
    }

}

function forceInt(str){
  // fonction qui convertir une string en nomber entier ou renvoie 0
  if (str){
    return (parseInt(str, 10))
    }else {
        return 0
    }
}

function forceFloat(str){
  // fonction qui convertir une string en nomber a virgule ou renvoie 0
  if (str){
    return (parseFloat(str))
    }else {
        return 0
    }

}

// function adaptQteSelle(str){
//   // function qui converti  la quantité de selle en  nombre de +
//   return (str.match(/+/g)||[]).length
// }

function adaptPoids(str){
  // function qui adapte le poids car desfois il est en gr et desfois en kg
  var value=forceFloat(str)
  if (value>1000) {
    return value/1000
  } else{
    return value
  }
}

function include(strbase,searchStr){
  // check si une chaine de caratere est inclu ans une autre
  if (strbase.indexOf(searchStr) !== -1) {
    return 1
  } else {
    return 0
  }
}

function inspect(v){
  console.log("\n inspect: ")
  console.log(v);
  console.log(typeof v);
  console.log("---------- ")

}


function modifHtmlTableByID( mId,mValue) {
  var x = document.getElementById(mId)
  x.innerText=String(mValue)
  //inspect(x)

}
// -------------------------------------------
// Function principale
function main(data){
  df_generale= preparation_des_donnees(data);
  
  console.log("Dataframe principale:")
  df_generale.p();  //Affiche la dataframe principale
  df_generale.dtypes().p();

  traitement_ojourdhui(df_generale);
  traitement_moyenne();
  historique_grah_qt_tt();
  historique_grah_poids();

}



// -------------------------------------------
// Fonction diverse

function preparation_des_donnees(data){
  //Preparation des données, pour plus de facilité plus tard

  //On crée de nouvelle liste vide que l'on va remplir plus tard
  lst_heure_tt=[]
  lst_heure_tt_epoch=[]
  lst_jour=[]
  lst_horodateur=[]   
  lst_date=[]    //Date
  lst_adrigyl=[]  //Bool
  lst_type_alim=[] // list mais surement inutile
  lst_alim_seins=[]  // Bool
  lst_alim_bib=[]   //Bool
  lst_nettoyage_nez=[]
  lst_poids=[]  //Float
  //lst_qte_selle=[]  // Int , on compte le nombre de "+"
  lst_urine=[]    //Bool
  lst_selle=[]    // Int
  lst_qte_tt=[]   //Int
  lst_temperature=[]  //Float
  lst_tire_lait=[] //Int
  //lst_ferostane=[]  // bool



  for (var line in data) {     //on parcoure toutes les donnée une a une 

    // rempli chaque liste
    lst_adrigyl.push(forceBool(data[line].Adrigyl))
    //lst_ferostane.push(forceBool(data[line].Ferostane))   // inutile
    lst_urine.push(forceBool(data[line].Urines))
    lst_selle.push(forceBool(data[line].Selles))

    var date_enregistrement= strToDate(data[line].Horodateur)

    lst_date.push(date_enregistrement);
    lst_heure_tt.push(date_tt(date_enregistrement,data[line]["Heure de la tété"]));
    lst_heure_tt_epoch.push(date_tt(date_enregistrement,data[line]["Heure de la tété"]).getTime())
    lst_jour.push(jour_tt(date_enregistrement).getTime())
    
    //lst_qte_selle.push(adaptQteSelle(data[line]["Quantité de selles"]));   inutile

    lst_qte_tt.push(forceInt(data[line]["Quantité en ml"]));
    lst_tire_lait.push(forceInt(data[line]["Tire lait en m"]));

    lst_temperature.push(forceFloat(data[line]["Température"]));
    lst_poids.push(adaptPoids(data[line]["Poids en kg"]));

    //lst_type_alim.push(data[line]["Comment s'est il alimenté?"],"Sein");    inutile
    lst_alim_seins.push(include(data[line]["Comment s'est il alimenté?"],"Sein"));
    lst_alim_bib.push(include(data[line]["Comment s'est il alimenté?"],"Bib")); 
  }

  // créée le tableau general
  var df = jd.df([lst_date,lst_jour,lst_heure_tt,lst_heure_tt_epoch,lst_alim_seins,lst_alim_bib, lst_adrigyl, lst_qte_tt,lst_tire_lait,lst_temperature,lst_poids,lst_urine,lst_selle], 
                 ['date','jour','heure_tt','heure_ms','sein','bib', 'adrigyl', 'qte_tt','tire_lait','temp','poids','urine','selle']);
  return df
}

function traitement_ojourdhui(df1){
  console.log("Traitement aujourdhui :")

  // Compte le nombre d alaitement aujourdhui
  var date_minuit = new Date();
  date_minuit.setHours(0,0,0,0);

  var date_now = new Date();
  var moment_now= moment.unix(date_now.getTime()/1000)



  var df_today=  df1.s(df1.c('heure_tt').gt(date_minuit))   //df_today est donc une nouvelle dataframe avec  les valeur uniquement d 'aujourdhui

  df_today.p()

  // donnée generale
  var dernier_poids= findlastNotNull(df1.c('poids'));


  var dernier_ojdhui= convUnixToMomentDate(df_today.c('heure_ms').s(-1));
  var ms = moment_now.diff(dernier_ojdhui);
  var d = moment.duration(ms);

  var dernier_enregistrement= dernier_ojdhui.format('DD/MM/YY kk:mm');
  var nb_seins_ojdhui = df_today.c('sein').sum() ;
  var nb_bib_ojdhui   = df_today.c('bib').sum();
  var nb_total_ojdhui = nb_seins_ojdhui+ nb_bib_ojdhui;
  var qte_ojdhui      = df_today.c('qte_tt').sum();
  var qte_lait_tire      = df_today.c('tire_lait').sum();

  var dernier_ojdhui_format  = dernier_ojdhui.format('kk:mm');
  var temps_depuis_dernier_ojdhui = d.get("hours") +":"+ d.get("minutes") ;

  console.log({nb_seins_ojdhui,nb_bib_ojdhui,nb_total_ojdhui,qte_ojdhui,dernier_ojdhui_format,temps_depuis_dernier_ojdhui})
  
  modifHtmlTableByID("dernier_enregistrement",dernier_enregistrement)

  modifHtmlTableByID("nb_seins_ojdhui",nb_seins_ojdhui);
  modifHtmlTableByID("nb_bib_ojdhui",nb_bib_ojdhui);
  modifHtmlTableByID("nb_total_ojdhui",nb_total_ojdhui);
  modifHtmlTableByID("qte_ojdhui",qte_ojdhui);
  modifHtmlTableByID("qte_lait_tire",qte_lait_tire);
  modifHtmlTableByID("dernier_ojdhui_format",dernier_ojdhui_format);
  modifHtmlTableByID("temps_depuis_dernier_ojdhui",temps_depuis_dernier_ojdhui);
  modifHtmlTableByID("dernier_poids",dernier_poids);

  var nb_adrigyl_ojdhui = df_today.c('adrigyl').sum() ;
  var nb_selles_ojdhui = df_today.c('selle').sum() ;
  var nb_urines_ojdhui = df_today.c('urine').sum() ;

  modifHtmlTableByID("nb_adrigyl_ojdhui",nb_adrigyl_ojdhui);
  modifHtmlTableByID("nb_selles_ojdhui",nb_selles_ojdhui);
  modifHtmlTableByID("nb_urines_ojdhui",nb_urines_ojdhui);

}

function traitement_moyenne(){
  console.log("Dans traitement moyenne")
  df2=df_generale;  //On recupere df_generale qui declarer comme variable globale
  var nb_days = document.getElementById("input_nb_jours").value;
  console.log("on va faire le calcul pour: " + nb_days);
  df2.p();

  var d = new Date();
  d.setDate(d.getDate()-nb_days);

  var df_average=  df2.s(df2.c('heure_tt').gt(d))   //df_today est donc une nouvelle dataframe avec  les valeur uniquement d 'aujourdhui
  df_average.p()

  var avg_qte_tt  =(df_average.c('qte_tt').sum()/nb_days).toFixed(1);
  var avg_nb_seins=(df_average.c('sein').sum()/nb_days).toFixed(2);
  var avg_nb_bib  =(df_average.c('bib').sum()/nb_days).toFixed(2);
  var avg_urine   =(df_average.c('urine').sum()/nb_days).toFixed(2);
  var avg_selle   =(df_average.c('selle').sum()/nb_days).toFixed(2);

  console.log("avg_qte_tt: " + avg_qte_tt)
  console.log("avg_nb_seins: " + avg_nb_seins)
  console.log("avg_nb_bib: " + avg_nb_bib)
  console.log("avg_urine: " + avg_urine)
  console.log("avg_selle: " + avg_selle)

  modifHtmlTableByID("qte_tete_avg",avg_qte_tt);
  modifHtmlTableByID("nb_seins_avg",avg_nb_seins);
  modifHtmlTableByID("nb_bib_avg",avg_nb_bib);
  modifHtmlTableByID("nb_urines_avg",avg_urine);
  modifHtmlTableByID("nb_selles_avg",avg_selle);

}

function historique_grah_poids() {
  console.log("Dans historique_grah_qt_tt")
  dfgraph=df_generale;  //On recupere df_generale qui declarer comme variable globale

  var val=[]

  console.log("df_tete:")

  df_poids= dfgraph.s(null, ['jour', 'poids'])

  df_tete.p()

  console.log("grouped:")



  for ( i=0;i < df_poids.nRow();i++) {     //on parcoure toutes les donnée une a une 
    if (df_poids.at(i, ['poids'])>0) {
    // rempli chaque liste
    xVal=df_poids.at(i, ['jour']);   //df_group.c('jour').s(i).values[0]  or df_group.at(i,'jour')
    yVal=df_poids.at(i, ['poids']);
    //xVal=df_group[line].jour
    //yVal=df_group[line].qte_tt
    val.push({x: xVal,y: yVal})
    }
  }

  var chart = new CanvasJS.Chart("chartContainer_qte_tt", {
      animationEnabled: true,
      zoomEnabled: true,
      theme: "light2", // "light1", "light2", "dark1", "dark2"
      title: {
          text: "Evolution poids (kg)"
      },
      axisY: {
          title: "poids (kg)",
          includeZero: false
      },
      axisX: {
          title: "Date"
      },
      data: [{
          type: "line",
          xValueType: "dateTime",
          dataPoints: val             
          
      }]
  });
  chart.render();
}

function historique_grah_qt_tt() {
  console.log("Dans historique_grah_poids")
  dfgraph=df_generale;  //On recupere df_generale qui declarer comme variable globale

  var val=[]

  console.log("df_tete:")

  df_tete= dfgraph.s(null, ['jour', 'qte_tt'])

  df_tete.p()

  console.log("grouped:")

  df_group=df_tete.groupApply('jour', function(dfSubset) {
    return dfSubset.mapCols(
      function(colVector) { return colVector.sum(); });
  });
  df_group.p();

  for ( i=0;i < df_group.nRow();i++) {     //on parcoure toutes les donnée une a une 

    // rempli chaque liste
    xVal=df_group.at(i, ['jour']);   //df_group.c('jour').s(i).values[0]  or df_group.at(i,'jour')
    yVal=df_group.at(i, ['qte_tt']);
    //xVal=df_group[line].jour
    //yVal=df_group[line].qte_tt
    val.push({x: xVal,y: yVal})
  }

  var chart = new CanvasJS.Chart("chartContainer_poids", {
      animationEnabled: true,
      zoomEnabled: true,
      theme: "light2", // "light1", "light2", "dark1", "dark2"
      title: {
          text: "Evolution quantitée tétée (ml)"
      },
      axisY: {
          title: "qte tété (ml)",
          includeZero: false
      },
      axisX: {
          title: "Date"
      },
      data: [{
          type: "line",
          xValueType: "dateTime",
          dataPoints: val             
          
      }]
  });
  chart.render();
}




window.addEventListener('DOMContentLoaded', init)



// 407:
// Adrigyl: ""
// Comment s'est il alimenté?: "Biberon"
// Commentaire: ""
// Ferostane: ""
// Heure de la tété: "04:15:00"
// Horodateur: "17/02/2019 05:07:39"
// Nettoyage nez: "Mouchette"
// Poids en kg: ""
// Quantité de selles: ""
// Quantité en ml: "150"
// Selles: "Non"
// Température: ""
// Tire lait en ml: "190"
// Urines: "Oui"

// info dataframe : https://github.com/osdat/jsdataframe/wiki


// mit de coté : <link rel="stylesheet" href="sources/style.css">
