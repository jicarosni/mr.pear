import fs from "fs";
import * as d3 from "d3";
const src = JSON.parse(fs.readFileSync("ne50.geojson"));
const topo = JSON.parse(fs.readFileSync("world_raw.json"));
const byId = {}; src.features.forEach(f => byId[f.properties.ADM0_A3] = f);
const MERGE = {CYN:"CYP",SOL:"SOM",ALD:"FIN"};
const areas = {};
src.features.forEach(f => { const id = MERGE[f.properties.ADM0_A3]||f.properties.ADM0_A3; areas[id]=(areas[id]||0)+d3.geoArea(f)*6371*6371; });
const TERR = new Set("JEY GGY IMN ABW CUW SXM MAC HKG GRL IOT FLK SAH KAS".split(" "));
const NAME = {USA:"United States",COD:"DR Congo",COG:"Republic of the Congo",CIV:"Côte d'Ivoire",SWZ:"Eswatini",
 SRB:"Serbia",TZA:"Tanzania",BHS:"Bahamas",TLS:"Timor-Leste",FSM:"Micronesia",CZE:"Czechia",SDS:"South Sudan",
 PSX:"Palestine",KOS:"Kosovo",STP:"São Tomé and Príncipe",CPV:"Cape Verde",MKD:"North Macedonia",VAT:"Vatican City",
 GBR:"United Kingdom",KOR:"South Korea",PRK:"North Korea",LAO:"Laos",MMR:"Myanmar",BRN:"Brunei",SYR:"Syria",
 RUS:"Russia",IRN:"Iran",VNM:"Vietnam",MDA:"Moldova",BOL:"Bolivia",VEN:"Venezuela",TUR:"Türkiye",
 GMB:"Gambia",NLD:"Netherlands",NOR:"Norway",FRA:"France",IND:"India",SOM:"Somalia",CYP:"Cyprus",FIN:"Finland"};
// extra aliases (any spelling; normalised client-side)
const ALIAS = {
 USA:["USA","US","U.S.","U.S.A.","America","United States of America","the States"],
 GBR:["UK","U.K.","Great Britain","Britain","England","GB","United Kingdom of Great Britain and Northern Ireland"],
 CZE:["Czech Republic","Czech","Cesko","Česko","Ceska republika"],
 CIV:["Ivory Coast","Cote d'Ivoire","Cote dIvoire"],
 NLD:["Holland","The Netherlands","Nederland"],
 COD:["DRC","Congo","DR Congo","Democratic Republic of Congo","Democratic Republic of the Congo","Congo-Kinshasa","Congo Kinshasa","Zaire","DROC"],
 COG:["Congo","Republic of Congo","Congo-Brazzaville","Congo Brazzaville","Congo Republic"],
 TUR:["Turkey","Turkiye","Türkiye"],
 SWZ:["Swaziland","eSwatini"],
 MKD:["Macedonia","FYROM","Republic of North Macedonia"],
 MMR:["Burma"],TLS:["East Timor"],CPV:["Cabo Verde"],
 KOR:["Korea","Republic of Korea","S Korea","S. Korea"],PRK:["DPRK","N Korea","N. Korea","Democratic People's Republic of Korea"],
 RUS:["Russian Federation"],IRN:["Persia","Islamic Republic of Iran"],SYR:["Syrian Arab Republic"],LAO:["Lao PDR","Lao"],
 VNM:["Viet Nam"],MDA:["Republic of Moldova"],BOL:["Plurinational State of Bolivia"],VEN:["Bolivarian Republic of Venezuela"],
 BIH:["Bosnia","Bosnia-Herzegovina","Bosnia Herzegovina","BiH"],ARE:["UAE","U.A.E.","Emirates"],
 CAF:["CAR","Central Africa"],DOM:["Dominican Rep"],GNQ:["Eq Guinea","Equatorial Guinea"],
 VAT:["Vatican","Holy See","Vatican City State"],PSX:["Palestinian Territories","State of Palestine","West Bank","Palestine"],
 TWN:["Republic of China","ROC","Chinese Taipei","Formosa"],CHN:["PRC","People's Republic of China"],
 FSM:["Federated States of Micronesia","FSM"],MHL:["Marshall Islands"],SLB:["Solomon Islands","Solomons"],
 KNA:["St Kitts and Nevis","Saint Kitts","St Kitts","Saint Christopher and Nevis"],LCA:["St Lucia"],
 VCT:["St Vincent and the Grenadines","Saint Vincent","St Vincent","St Vincent and Grenadines"],ATG:["Antigua"],
 TTO:["Trinidad","Trinidad & Tobago"],STP:["Sao Tome","Sao Tome and Principe","São Tomé"],GNB:["Guinea Bissau"],
 SDS:["South Sudan","S Sudan","S. Sudan"],TZA:["United Republic of Tanzania"],GMB:["The Gambia"],BHS:["The Bahamas"],
 SAU:["KSA","Saudi"],NZL:["NZ","Aotearoa"],AUS:["Oz"],PNG:["PNG"],DEU:["Deutschland"],ESP:["España","Espana"],
 IRL:["Eire","Éire","Republic of Ireland"],CHE:["Swiss Confederation","Schweiz","Suisse"],HRV:["Hrvatska"],
 SVK:["Slovak Republic","Slovensko"],GRC:["Hellas","Hellenic Republic"],FIN:["Suomi"],KOS:["Kosova"],
 KGZ:["Kirghizia","Kyrgyz Republic"],BLR:["Byelorussia","Belorussia"],SRB:["Republic of Serbia"],
 ZAF:["RSA","S Africa"],LKA:["Ceylon"],BFA:["Upper Volta"],BEN:["Dahomey"],THA:["Siam"],KHM:["Kampuchea"],
 BRN:["Brunei Darussalam"],GBR2:[],
};
const CONT_OVERRIDE = {SYC:"Africa",MUS:"Africa",MDV:"Asia"};
const REG = c => ({"Europe":"europe","Asia":"asia","Africa":"africa","North America":"namerica","South America":"samerica","Oceania":"oceania"})[c];
const EXTRA = {RUS:["asia"],TUR:["europe"],CYP:["europe"],GEO:["europe"],ARM:["europe"],AZE:["europe"]};
const obj = topo.objects.ne50; delete topo.objects.ne50; topo.objects.countries = obj;
let report = [];
obj.geometries.forEach(g => {
  const id = g.properties.gid, p = byId[id].properties;
  const type = p.TYPE;
  const playable = !TERR.has(id) && type !== "Dependency" && type !== "Indeterminate" || id==="PSX";
  const cont = CONT_OVERRIDE[id] || p.CONTINENT;
  const regions = [REG(cont), ...(EXTRA[id]||[])].filter(Boolean);
  const name = NAME[id] || p.ADMIN;
  const al = new Set([p.ADMIN,p.NAME,p.NAME_LONG,p.NAME_EN,p.BRK_NAME,p.FORMAL_EN,p.NAME_SORT,p.NAME_ALT,p.NAME_CIAWF,...(ALIAS[id]||[])].filter(x=>x && x!==name));
  if (id==="COG") al.delete("Congo"), al.add("Congo");
  g.id = id;
  g.properties = {n:name, a:[...al], p:playable?1:0, r:regions, km2:Math.round(areas[id]), lr:p.LABELRANK, pop:p.POP_EST};
  report.push([id,name,playable,regions.join(","),Math.round(areas[id]),p.LABELRANK].join("|"));
});
fs.writeFileSync("../data/world.js", "/* Natural Earth 1:50m admin-0 countries (public domain), simplified. Generated. */\nwindow.WORLD_TOPO=" + JSON.stringify(topo) + ";\n");
fs.writeFileSync("report.txt", report.join("\n"));
