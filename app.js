const STORE_KEY = "pvm-professional-state-v1";
const API_STATE_URL = location.protocol === "file:" ? "http://127.0.0.1:4182/api/state" : "/api/state";
const ADMIN_TOKEN_KEY = "pvm-admin-token";
const ADMIN_MODE = new URLSearchParams(location.search).has("admin");
const LOCAL_EDIT = location.protocol === "file:" || location.hostname === "127.0.0.1" || location.hostname === "localhost";
let CAN_EDIT = LOCAL_EDIT || Boolean(sessionStorage.getItem(ADMIN_TOKEN_KEY));
const PEOPLE_SOURCE = "cadastro-xlsm-2026-05-16";
const CONTENT_VERSION = "apostilas-jun-out-2026-v7";
const hiddenWeekIds = new Set();

const specialEventLabels = {
  circuitVisit: "Visita do superintendente",
  convention: "Congresso",
  bethelAssembly: "Assembleia com representante de Betel",
  circuitAssembly: "Assembleia com superintendente de circuito"
};

const navItems = [
  ["viewer", "VI", "Visualizacao"],
  ["week", "SE", "Semana atual"],
  ["programs", "PR", "Programacoes"],
  ["assignments", "S89", "Designacoes S-89"],
  ["people", "PE", "Publicadores"],
  ["rules", "RE", "Regras"],
  ["history", "HI", "Historico"],
  ["printProgram", "IP", "Impressao da programacao"],
  ["settings", "CF", "Configuracoes"]
];

const capabilityLabels = {
  chairman: "Presidente",
  treasures: "Tesouros e joias",
  bibleReading: "Leitura da Biblia",
  ministryPrimary: "Parte no ministerio",
  ministryHelper: "Ajudante no ministerio",
  life: "Nossa Vida Crista",
  studyConductor: "Dirigir estudo biblico",
  studyReader: "Leitor do estudo biblico"
};

const basePeople = [{"name":"André Luiz Olivas de Figueiredo Pereira","gender":"M","role":"Anciao","blocked":false,"capabilities":{"chairman":true,"treasures":true,"bibleReading":false,"ministryPrimary":false,"ministryHelper":false,"life":true,"studyConductor":true,"studyReader":false}},{"name":"Jeferson Eduardo Serboncini","gender":"M","role":"Anciao","blocked":false,"capabilities":{"chairman":true,"treasures":true,"bibleReading":false,"ministryPrimary":false,"ministryHelper":false,"life":true,"studyConductor":true,"studyReader":false}},{"name":"John Hebert Ferreira de Castro","gender":"M","role":"Anciao","blocked":false,"capabilities":{"chairman":true,"treasures":true,"bibleReading":false,"ministryPrimary":false,"ministryHelper":false,"life":true,"studyConductor":true,"studyReader":false}},{"name":"Júlio César Godoy Melo","gender":"M","role":"Anciao","blocked":false,"capabilities":{"chairman":true,"treasures":true,"bibleReading":false,"ministryPrimary":false,"ministryHelper":false,"life":true,"studyConductor":true,"studyReader":false}},{"name":"Pedro Damião Pereira","gender":"M","role":"Anciao","blocked":false,"capabilities":{"chairman":true,"treasures":true,"bibleReading":false,"ministryPrimary":false,"ministryHelper":false,"life":true,"studyConductor":true,"studyReader":false}},{"name":"Washington Coutinho da Silva","gender":"M","role":"Anciao","blocked":false,"capabilities":{"chairman":true,"treasures":true,"bibleReading":false,"ministryPrimary":false,"ministryHelper":false,"life":true,"studyConductor":true,"studyReader":false}},{"name":"Ailton de Souza Rocha","gender":"M","role":"Servo ministerial","blocked":false,"capabilities":{"chairman":false,"treasures":true,"bibleReading":false,"ministryPrimary":false,"ministryHelper":false,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Anderson Carlos de Oliveira","gender":"M","role":"Servo ministerial","blocked":false,"capabilities":{"chairman":false,"treasures":true,"bibleReading":false,"ministryPrimary":false,"ministryHelper":false,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Ataíde Alexandre Marcelino Júnior","gender":"M","role":"Servo ministerial","blocked":false,"capabilities":{"chairman":false,"treasures":true,"bibleReading":false,"ministryPrimary":false,"ministryHelper":false,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Gilbert Romão de Siqueira","gender":"M","role":"Servo ministerial","blocked":false,"capabilities":{"chairman":false,"treasures":true,"bibleReading":false,"ministryPrimary":false,"ministryHelper":false,"life":false,"studyConductor":false,"studyReader":false}},{"name":"José Neto Sanches","gender":"M","role":"Servo ministerial","blocked":false,"capabilities":{"chairman":false,"treasures":true,"bibleReading":false,"ministryPrimary":false,"ministryHelper":false,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Ailton Carlos Rodrigues","gender":"M","role":"Publicador batizado","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":true,"ministryPrimary":false,"ministryHelper":false,"life":false,"studyConductor":false,"studyReader":true}},{"name":"Amin Carlos Gonçalves","gender":"M","role":"Publicador batizado","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":true,"ministryPrimary":false,"ministryHelper":false,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Anderson Dias Gabriel","gender":"M","role":"Publicador batizado","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":true,"ministryPrimary":false,"ministryHelper":false,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Éder David","gender":"M","role":"Publicador batizado","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":true,"ministryPrimary":false,"ministryHelper":false,"life":false,"studyConductor":false,"studyReader":false}},{"name":"José Vieira","gender":"M","role":"Publicador batizado","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":true,"ministryPrimary":false,"ministryHelper":false,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Sebastião Rafael","gender":"M","role":"Publicador batizado","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":true,"ministryPrimary":false,"ministryHelper":false,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Silvio Gabriel","gender":"M","role":"Publicador batizado","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":true,"ministryPrimary":false,"ministryHelper":false,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Eduardo D. d. Santos","gender":"M","role":"Publicador batizado","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":true,"ministryPrimary":false,"ministryHelper":false,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Felipe G. Reis","gender":"M","role":"Publicador batizado","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":true,"ministryPrimary":false,"ministryHelper":false,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Felipe Peterson D. Diniz","gender":"M","role":"Publicador batizado","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":true,"ministryPrimary":false,"ministryHelper":false,"life":false,"studyConductor":false,"studyReader":false}},{"name":"José Jairo Marcelino","gender":"M","role":"Publicador batizado","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":true,"ministryPrimary":false,"ministryHelper":false,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Luiz Claudio Aguiar","gender":"M","role":"Publicador batizado","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":true,"ministryPrimary":false,"ministryHelper":false,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Marcelo Luiz Fonseca","gender":"M","role":"Publicador batizado","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":true,"ministryPrimary":false,"ministryHelper":false,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Márcio De Paula","gender":"M","role":"Publicador batizado","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":true,"ministryPrimary":false,"ministryHelper":false,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Marcos Antonio G. de Carvalho","gender":"M","role":"Publicador batizado","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":true,"ministryPrimary":false,"ministryHelper":false,"life":false,"studyConductor":false,"studyReader":true}},{"name":"Marcos Melo","gender":"M","role":"Publicador batizado","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":true,"ministryPrimary":false,"ministryHelper":false,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Robson M. de Almeida","gender":"M","role":"Publicador batizado","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":true,"ministryPrimary":false,"ministryHelper":false,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Ailton R. de Souza","gender":"M","role":"Publicador batizado","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":true,"ministryPrimary":false,"ministryHelper":false,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Jorge Luiz N. d. Fonseca","gender":"M","role":"Publicador batizado","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":true,"ministryPrimary":false,"ministryHelper":false,"life":false,"studyConductor":false,"studyReader":true}},{"name":"Kauã Felipe R. Inácio","gender":"M","role":"Publicador batizado","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":true,"ministryPrimary":false,"ministryHelper":false,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Luan Cristian F. d. Carmo","gender":"M","role":"Publicador batizado","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":true,"ministryPrimary":false,"ministryHelper":false,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Luiz Felipe D. d. Nascimento","gender":"M","role":"Publicador batizado","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":true,"ministryPrimary":false,"ministryHelper":false,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Roberto P. Junior Almeida","gender":"M","role":"Publicador batizado","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":true,"ministryPrimary":false,"ministryHelper":false,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Ruston de B. N. Santos","gender":"M","role":"Publicador batizado","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":true,"ministryPrimary":false,"ministryHelper":false,"life":false,"studyConductor":false,"studyReader":true}},{"name":"Tobias Albano Florenço","gender":"M","role":"Publicador batizado","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":true,"ministryPrimary":false,"ministryHelper":false,"life":false,"studyConductor":false,"studyReader":true}},{"name":"Antônio José d. Silva","gender":"M","role":"Publicador batizado","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":true,"ministryPrimary":false,"ministryHelper":false,"life":false,"studyConductor":false,"studyReader":true}},{"name":"Daniel Menezes d. Rocha","gender":"M","role":"Publicador batizado","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":true,"ministryPrimary":false,"ministryHelper":false,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Edesio A. d. Silva","gender":"M","role":"Publicador batizado","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":true,"ministryPrimary":false,"ministryHelper":false,"life":false,"studyConductor":false,"studyReader":false}},{"name":"José B. Gonçalves (Zezé)","gender":"M","role":"Publicador batizado","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":true,"ministryPrimary":false,"ministryHelper":false,"life":false,"studyConductor":false,"studyReader":false}},{"name":"José Henrique S. d. Rocha","gender":"M","role":"Publicador batizado","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":true,"ministryPrimary":false,"ministryHelper":false,"life":false,"studyConductor":false,"studyReader":true}},{"name":"Leonardo Santos Rocha","gender":"M","role":"Publicador batizado","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":true,"ministryPrimary":false,"ministryHelper":false,"life":false,"studyConductor":false,"studyReader":true}},{"name":"Felipe Grassi","gender":"M","role":"Publicador batizado","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":true,"ministryPrimary":false,"ministryHelper":false,"life":false,"studyConductor":false,"studyReader":true}},{"name":"Ana Carolina O. de F. P. Oliveira","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Ana Maria D. Gabriel","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Andréa Cassimiro d. S. Daniel","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Ângela Aparecida Oliveira Gouveia","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Camila Fernanda D. C. Olímpio","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Elzita Vieira Costa","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Hilda Henrique Novaes","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Lifa José Vieira","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Mara Lúcia David","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Maria Virgínia Olivas de Figueiredo Pereira","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Mariuza Eva R. da Silva","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Marizete Pires Olivas de Figueiredo","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Selma Gabriel Plínio","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Tereza Rosa Ribeiro","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Zilda M. de S. Rafael","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Alana C. Daniel","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Ana Clara Q. Ribeiro","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Aparecida Donizete de Paula","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Dalva A. Gonçalves","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Dayana Paula M. Serboncini","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Elaine Cristina de O. Aguiar","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Eldilei C. de Souza","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Eliete de Castro M. de Carvalho","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Flavia Grassi Reis","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Helena L. Melo","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Jandira Grassi Dos Reis","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Jennifer de O. Coutinho","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Jéssica C. de O. Nogueira","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Laura de O. Coutinho","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Leni de F. Fonseca","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Leontina B. Fonseca","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Maria Aparecida Fonseca","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Maria Edwirges Macedo","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Vera Lucia de Moraes","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Vera Lúcia EL-Kadoun","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Ana Cláudia C. d. Silva","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Bruna Raphaela B. R. Novaes","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Carolina Ribeiro B. d. S. Castro","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Gisele H. d. S. Rocha","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Isabelli Sofia d. S. Rocha","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Larissa Cristina F. Ferreira","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Luara Cristina Ferraz","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Luciana A. O. Florenço","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Márcia Cristina de M. O. N. Fonseca","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Maria Clara de Oliveira Albano Florenço","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Maria Lucy Barbosa","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Mariana A. Ferraz","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Maysa U. Almeida","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Nancy U. Almeida","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Rosilene Gomes d. S. Lopes","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Sarah B. G. Lopes","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Yasmin R. Delmarchi","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Adriana da S. Melo","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Beatriz Santos C. d. Silva","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Elaine Gomes","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Fabiane Santos G. d. S. Rocha","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Flaviane U. D. Siqueira","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Ivonete de Castro Marcelino Alexandre","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Maria de Lurdes S. Heins (Lia)","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Mell Elisa d. S. e Sousa","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Neuza M. d. Silva","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}},{"name":"Roseli A. H. Gonçalves","gender":"F","role":"Publicadora batizada","blocked":false,"capabilities":{"chairman":false,"treasures":false,"bibleReading":false,"ministryPrimary":true,"ministryHelper":true,"life":false,"studyConductor":false,"studyReader":false}}];

const defaultParts = [
  { n: 1, section: "treasures", title: "Discurso de abertura da leitura semanal", minutes: "10 min", type: "treasures" },
  { n: 2, section: "treasures", title: "Joias espirituais", minutes: "10 min", type: "treasures" },
  { n: 3, section: "treasures", title: "Leitura da Biblia", minutes: "4 min", type: "bibleReading" },
  { n: 4, section: "ministry", title: "Iniciando conversas", minutes: "3 min", type: "ministry" },
  { n: 5, section: "ministry", title: "Cultivando o interesse", minutes: "4 min", type: "ministry" },
  { n: 6, section: "ministry", title: "Fazendo discipulos", minutes: "5 min", type: "ministry" },
  { n: 7, section: "life", title: "Necessidades locais", minutes: "6 min", type: "life" },
  { n: 8, section: "life", title: "Vida crista", minutes: "9 min", type: "life" },
  { n: 9, section: "life", title: "Estudo biblico de congregacao", minutes: "30 min", type: "study" }
];

const readingCycle = [
  "JEREMIAS 1-3", "JEREMIAS 4-6", "JEREMIAS 7-9", "JEREMIAS 10-13",
  "JEREMIAS 14-17", "JEREMIAS 18-21", "JEREMIAS 22-24", "JEREMIAS 25-27"
];

const weekImages = [
  "assets/weeks/week-1.jpg",
  "assets/weeks/week-2.jpg",
  "assets/weeks/week-3.jpg",
  "assets/weeks/week-4.jpg",
  "assets/weeks/week-5.jpg"
];

const weekCorrections = {
  "2026-06-01": {
    reading: "JEREMIAS 1-3",
    songs: { opening: "84", middle: "76", closing: "18" },
    parts: [
      { n: 1, section: "treasures", title: "Não tenha medo, pois eu estou com você", minutes: "10 min", type: "treasures" },
      { n: 2, section: "treasures", title: "Joias espirituais", minutes: "10 min", type: "treasures" },
      { n: 3, section: "treasures", title: "Leitura da Bíblia", minutes: "4 min", type: "bibleReading" },
      { n: 4, section: "ministry", title: "Iniciando conversas", minutes: "3 min", type: "ministry" },
      { n: 5, section: "ministry", title: "Cultivando o interesse", minutes: "4 min", type: "ministry" },
      { n: 6, section: "ministry", title: "Fazendo discípulos", minutes: "5 min", type: "ministry" },
      { n: 7, section: "life", title: "Seja corajoso como Jeremias", minutes: "6 min", type: "life" },
      { n: 8, section: "life", title: "Faça uma defesa com brandura e profundo respeito", minutes: "9 min", type: "life" },
      { n: 9, section: "life", title: "Estudo bíblico de congregação", minutes: "30 min", type: "study" }
    ]
  },
  "2026-06-08": {
    reading: "JEREMIAS 4-6",
    songs: { opening: "56", middle: "60", closing: "68" },
    parts: [
      { n: 1, section: "treasures", title: "O que podemos aprender da doença espiritual de Judá?", minutes: "10 min", type: "treasures" },
      { n: 2, section: "treasures", title: "Joias espirituais", minutes: "10 min", type: "treasures" },
      { n: 3, section: "treasures", title: "Leitura da Bíblia", minutes: "4 min", type: "bibleReading" },
      { n: 4, section: "ministry", title: "Iniciando conversas - testemunho público", minutes: "2 min", type: "ministry" },
      { n: 5, section: "ministry", title: "Iniciando conversas - de casa em casa", minutes: "2 min", type: "ministry" },
      { n: 6, section: "ministry", title: "Cultivando o interesse", minutes: "4 min", type: "ministry" },
      { n: 7, section: "ministry", title: "Explicando suas crenças", minutes: "3 min", type: "ministry" },
      { n: 8, section: "life", title: "Proteja seu coração contra informações falsas", minutes: "8 min", type: "life" },
      { n: 9, section: "life", title: "Necessidades locais", minutes: "7 min", type: "life" },
      { n: 10, section: "life", title: "Estudo bíblico de congregação", minutes: "30 min", type: "study" }
    ]
  },
  "2026-06-15": {
    reading: "JEREMIAS 7-8",
    songs: { opening: "152", middle: "91", closing: "71" },
    parts: [
      { n: 1, section: "treasures", title: "Eles tratavam o templo de Jeová com desprezo", minutes: "10 min", type: "treasures" },
      { n: 2, section: "treasures", title: "Joias espirituais", minutes: "10 min", type: "treasures" },
      { n: 3, section: "treasures", title: "Leitura da Bíblia", minutes: "4 min", type: "bibleReading" },
      { n: 4, section: "ministry", title: "Iniciando conversas - testemunho informal", minutes: "3 min", type: "ministry" },
      { n: 5, section: "ministry", title: "Cultivando o interesse - de casa em casa", minutes: "4 min", type: "ministry" },
      { n: 6, section: "ministry", title: "Fazendo discípulos", minutes: "5 min", type: "ministry" },
      { n: 7, section: "life", title: "Como podemos mostrar que valorizamos o nosso Salão do Reino", minutes: "5 min", type: "life" },
      { n: 8, section: "life", title: "Como seus donativos são usados - Manutenção de Salões do Reino", minutes: "10 min", type: "life" },
      { n: 9, section: "life", title: "Estudo bíblico de congregação", minutes: "30 min", type: "study" }
    ]
  },
  "2026-06-22": {
    reading: "JEREMIAS 9-10",
    songs: { opening: "5", middle: "48", closing: "58" },
    parts: [
      { n: 1, section: "treasures", title: "Do que você vai se orgulhar?", minutes: "10 min", type: "treasures" },
      { n: 2, section: "treasures", title: "Joias espirituais", minutes: "10 min", type: "treasures" },
      { n: 3, section: "treasures", title: "Leitura da Bíblia", minutes: "4 min", type: "bibleReading" },
      { n: 4, section: "ministry", title: "Iniciando conversas - testemunho informal", minutes: "4 min", type: "ministry" },
      { n: 5, section: "ministry", title: "Iniciando conversas - de casa em casa", minutes: "4 min", type: "ministry" },
      { n: 6, section: "ministry", title: "Cultivando o interesse - testemunho informal", minutes: "4 min", type: "ministry" },
      { n: 7, section: "life", title: "Não Seja Enganado e Concentre-se no Reino", minutes: "15 min", type: "life" },
      { n: 8, section: "life", title: "Estudo bíblico de congregação", minutes: "30 min", type: "study" }
    ]
  },
  "2026-06-29": {
    reading: "JEREMIAS 11-12",
    songs: { opening: "106", middle: "109", closing: "69" },
    parts: [
      { n: 1, section: "treasures", title: "Como disputar uma corrida contra cavalos", minutes: "10 min", type: "treasures" },
      { n: 2, section: "treasures", title: "Joias espirituais", minutes: "10 min", type: "treasures" },
      { n: 3, section: "treasures", title: "Leitura da Bíblia", minutes: "4 min", type: "bibleReading" },
      { n: 4, section: "ministry", title: "Iniciando conversas - testemunho informal", minutes: "3 min", type: "ministry" },
      { n: 5, section: "ministry", title: "Cultivando o interesse - de casa em casa", minutes: "4 min", type: "ministry" },
      { n: 6, section: "ministry", title: "Discurso", minutes: "5 min", type: "treasures" },
      { n: 7, section: "life", title: "Necessidades locais", minutes: "15 min", type: "life" },
      { n: 8, section: "life", title: "Estudo bíblico de congregação", minutes: "30 min", type: "study" }
    ]
  },
  "2026-07-06": {
    reading: "JEREMIAS 13-15",
    songs: { opening: "123", middle: "49", closing: "61" },
    image: "assets/weeks/mwb202607-img-07-422x257.jpg",
    parts: [
      { n: 1, section: "treasures", title: "Jeová merece nossa obediência", minutes: "10 min", type: "treasures" },
      { n: 2, section: "treasures", title: "Joias espirituais", minutes: "10 min", type: "treasures" },
      { n: 3, section: "treasures", title: "Leitura da Bíblia", minutes: "4 min", type: "bibleReading" },
      { n: 4, section: "ministry", title: "Iniciando conversas", minutes: "3 min", type: "ministry" },
      { n: 5, section: "ministry", title: "Cultivando o interesse", minutes: "4 min", type: "ministry" },
      { n: 6, section: "ministry", title: "Discurso", minutes: "5 min", type: "treasures" },
      { n: 7, section: "life", title: "Obedecer é melhor do que um sacrifício", minutes: "15 min", type: "life" },
      { n: 8, section: "life", title: "Estudo bíblico de congregação", minutes: "30 min", type: "study" }
    ]
  },
  "2026-07-13": {
    reading: "JEREMIAS 16-17",
    songs: { opening: "34", middle: "54", closing: "22" },
    image: "assets/weeks/thumb-2026-07-13.jpg",
    parts: [
      { n: 1, section: "treasures", title: "Faz diferença em quem confiamos!", minutes: "10 min", type: "treasures" },
      { n: 2, section: "treasures", title: "Joias espirituais", minutes: "10 min", type: "treasures" },
      { n: 3, section: "treasures", title: "Leitura da Bíblia", minutes: "4 min", type: "bibleReading" },
      { n: 4, section: "ministry", title: "Iniciando conversas", minutes: "3 min", type: "ministry" },
      { n: 5, section: "ministry", title: "Cultivando o interesse", minutes: "4 min", type: "ministry" },
      { n: 6, section: "ministry", title: "Fazendo discípulos", minutes: "5 min", type: "ministry" },
      { n: 7, section: "life", title: "Jovens, confiem nos conselhos da Bíblia", minutes: "15 min", type: "life" },
      { n: 8, section: "life", title: "Estudo bíblico de congregação", minutes: "30 min", type: "study" }
    ]
  },
  "2026-07-20": {
    reading: "JEREMIAS 18-19",
    songs: { opening: "44", middle: "38", closing: "153" },
    image: "assets/weeks/mwb202607-img-20-476x270.jpg",
    parts: [
      { n: 1, section: "treasures", title: "É possível se recuperar espiritualmente", minutes: "10 min", type: "treasures" },
      { n: 2, section: "treasures", title: "Joias espirituais", minutes: "10 min", type: "treasures" },
      { n: 3, section: "treasures", title: "Leitura da Bíblia", minutes: "4 min", type: "bibleReading" },
      { n: 4, section: "ministry", title: "Iniciando conversas", minutes: "4 min", type: "ministry" },
      { n: 5, section: "ministry", title: "Cultivando o interesse", minutes: "4 min", type: "ministry" },
      { n: 6, section: "ministry", title: "Explicando suas crenças", minutes: "4 min", type: "ministry" },
      { n: 7, section: "life", title: "Como se recuperar espiritualmente", minutes: "15 min", type: "life" },
      { n: 8, section: "life", title: "Estudo bíblico de congregação", minutes: "30 min", type: "study" }
    ]
  },
  "2026-07-27": {
    reading: "JEREMIAS 20-21",
    songs: { opening: "73", middle: "57", closing: "31" },
    image: "assets/weeks/mwb202607-img-22-355x263.jpg",
    parts: [
      { n: 1, section: "treasures", title: "Ele pregou com coragem", minutes: "10 min", type: "treasures" },
      { n: 2, section: "treasures", title: "Joias espirituais", minutes: "10 min", type: "treasures" },
      { n: 3, section: "treasures", title: "Leitura da Bíblia", minutes: "4 min", type: "bibleReading" },
      { n: 4, section: "ministry", title: "Iniciando conversas", minutes: "4 min", type: "ministry" },
      { n: 5, section: "ministry", title: "Cultivando o interesse", minutes: "4 min", type: "ministry" },
      { n: 6, section: "ministry", title: "Explicando suas crenças", minutes: "4 min", type: "ministry" },
      { n: 7, section: "life", title: "Seja adaptável - mostre interesse pessoal", minutes: "15 min", type: "life" },
      { n: 8, section: "life", title: "Estudo bíblico de congregação", minutes: "30 min", type: "study" }
    ]
  },
  "2026-08-03": {
    reading: "JEREMIAS 22-23",
    songs: { opening: "40", middle: "103", closing: "60" },
    image: "assets/weeks/mwb202607-img-25-355x267.jpg",
    parts: [
      { n: 1, section: "treasures", title: "A importância de ter bons pastores", minutes: "10 min", type: "treasures" },
      { n: 2, section: "treasures", title: "Joias espirituais", minutes: "10 min", type: "treasures" },
      { n: 3, section: "treasures", title: "Leitura da Bíblia", minutes: "4 min", type: "bibleReading" },
      { n: 4, section: "ministry", title: "Iniciando conversas", minutes: "4 min", type: "ministry" },
      { n: 5, section: "ministry", title: "Cultivando o interesse", minutes: "4 min", type: "ministry" },
      { n: 6, section: "ministry", title: "Discurso", minutes: "4 min", type: "treasures" },
      { n: 7, section: "life", title: "Uma História Escrita por Jeová - O Corpo Governante Unido com os Irmãos - Parte 1", minutes: "15 min", type: "life" },
      { n: 8, section: "life", title: "Estudo bíblico de congregação", minutes: "30 min", type: "study" }
    ]
  },
  "2026-08-10": {
    reading: "JEREMIAS 24-25",
    songs: { opening: "124", middle: "65", closing: "137" },
    image: "assets/weeks/mwb202607-img-30-355x268.jpg",
    parts: [
      { n: 1, section: "treasures", title: "Por que alguns figos eram bons e outros eram ruins?", minutes: "10 min", type: "treasures" },
      { n: 2, section: "treasures", title: "Joias espirituais", minutes: "10 min", type: "treasures" },
      { n: 3, section: "treasures", title: "Leitura da Bíblia", minutes: "4 min", type: "bibleReading" },
      { n: 4, section: "ministry", title: "Iniciando conversas", minutes: "4 min", type: "ministry" },
      { n: 5, section: "ministry", title: "Cultivando o interesse", minutes: "4 min", type: "ministry" },
      { n: 6, section: "ministry", title: "Fazendo discípulos", minutes: "4 min", type: "ministry" },
      { n: 7, section: "life", title: "Necessidades locais", minutes: "15 min", type: "life" },
      { n: 8, section: "life", title: "Estudo bíblico de congregação", minutes: "30 min", type: "study" }
    ]
  },
  "2026-08-17": {
    reading: "JEREMIAS 26-28",
    songs: { opening: "77", middle: "16", closing: "71" },
    image: "assets/weeks/mwb202607-img-36-355x268.jpg",
    parts: [
      { n: 1, section: "treasures", title: "Não seja enganado por falsos profetas", minutes: "10 min", type: "treasures" },
      { n: 2, section: "treasures", title: "Joias espirituais", minutes: "10 min", type: "treasures" },
      { n: 3, section: "treasures", title: "Leitura da Bíblia", minutes: "4 min", type: "bibleReading" },
      { n: 4, section: "ministry", title: "Iniciando conversas", minutes: "3 min", type: "ministry" },
      { n: 5, section: "ministry", title: "Cultivando o interesse", minutes: "4 min", type: "ministry" },
      { n: 6, section: "ministry", title: "Fazendo discípulos", minutes: "5 min", type: "ministry" },
      { n: 7, section: "life", title: "Necessidades locais", minutes: "15 min", type: "life" },
      { n: 8, section: "life", title: "Estudo bíblico de congregação", minutes: "30 min", type: "study" }
    ]
  },
  "2026-08-24": {
    reading: "JEREMIAS 29-30",
    songs: { opening: "12", middle: "3", closing: "156" },
    image: "assets/weeks/mwb202607-img-40-358x272.jpg",
    parts: [
      { n: 1, section: "treasures", title: "Jeová disciplina seus servos na medida certa", minutes: "10 min", type: "treasures" },
      { n: 2, section: "treasures", title: "Joias espirituais", minutes: "10 min", type: "treasures" },
      { n: 3, section: "treasures", title: "Leitura da Bíblia", minutes: "4 min", type: "bibleReading" },
      { n: 4, section: "ministry", title: "Iniciando conversas", minutes: "4 min", type: "ministry" },
      { n: 5, section: "ministry", title: "Iniciando conversas", minutes: "3 min", type: "ministry" },
      { n: 6, section: "ministry", title: "Discurso", minutes: "5 min", type: "treasures" },
      { n: 7, section: "life", title: "Jeová dá esperança a seus servos", minutes: "10 min", type: "life" },
      { n: 8, section: "life", title: "Campanha especial em setembro", minutes: "5 min", type: "life" },
      { n: 9, section: "life", title: "Estudo bíblico de congregação", minutes: "30 min", type: "study" }
    ]
  },
  "2026-08-31": {
    reading: "JEREMIAS 31",
    songs: { opening: "27", middle: "67", closing: "132" },
    image: "assets/weeks/mwb202607-img-41-476x270.jpg",
    parts: [
      { n: 1, section: "treasures", title: "Farei um novo pacto", minutes: "10 min", type: "treasures" },
      { n: 2, section: "treasures", title: "Joias espirituais", minutes: "10 min", type: "treasures" },
      { n: 3, section: "treasures", title: "Leitura da Bíblia", minutes: "4 min", type: "bibleReading" },
      { n: 4, section: "ministry", title: "Iniciando conversas", minutes: "3 min", type: "ministry" },
      { n: 5, section: "ministry", title: "Iniciando conversas", minutes: "4 min", type: "ministry" },
      { n: 6, section: "ministry", title: "Explicando suas crenças", minutes: "5 min", type: "ministry" },
      { n: 7, section: "life", title: "Seja adaptável - use o JW.ORG", minutes: "15 min", type: "life" },
      { n: 8, section: "life", title: "Estudo bíblico de congregação", minutes: "30 min", type: "study" }
    ]
  },
  "2026-09-07": {
    reading: "JEREMIAS 32-33",
    songs: { opening: "1", middle: "128", closing: "143" },
    image: "assets/weeks/mwb202609-img-10-357x272.jpg",
    parts: [
      { n: 1, section: "treasures", title: "Meditar nas qualidades de Jeová fortalece a nossa fé", minutes: "10 min", type: "treasures" },
      { n: 2, section: "treasures", title: "Joias espirituais", minutes: "10 min", type: "treasures" },
      { n: 3, section: "treasures", title: "Leitura da Bíblia", minutes: "4 min", type: "bibleReading" },
      { n: 4, section: "ministry", title: "Iniciando conversas", minutes: "3 min", type: "ministry" },
      { n: 5, section: "ministry", title: "Iniciando conversas", minutes: "4 min", type: "ministry" },
      { n: 6, section: "ministry", title: "Cultivando o interesse", minutes: "5 min", type: "ministry" },
      { n: 7, section: "life", title: "Use seu tempo da melhor forma durante a campanha", minutes: "15 min", type: "life" },
      { n: 8, section: "life", title: "Estudo bíblico de congregação", minutes: "30 min", type: "study" }
    ]
  },
  "2026-09-14": {
    reading: "JEREMIAS 34-35",
    songs: { opening: "161", middle: "121", closing: "28" },
    image: "assets/weeks/mwb202609-img-13-359x272.jpg",
    parts: [
      { n: 1, section: "treasures", title: "Jeová recompensa quem sempre é obediente a ele", minutes: "10 min", type: "treasures" },
      { n: 2, section: "treasures", title: "Joias espirituais", minutes: "10 min", type: "treasures" },
      { n: 3, section: "treasures", title: "Leitura da Bíblia", minutes: "4 min", type: "bibleReading" },
      { n: 4, section: "ministry", title: "Iniciando conversas", minutes: "2 min", type: "ministry" },
      { n: 5, section: "ministry", title: "Iniciando conversas", minutes: "2 min", type: "ministry" },
      { n: 6, section: "ministry", title: "Cultivando o interesse", minutes: "3 min", type: "ministry" },
      { n: 7, section: "ministry", title: "Fazendo discípulos", minutes: "4 min", type: "ministry" },
      { n: 8, section: "life", title: "O autodomínio nos ajuda a obedecer", minutes: "6 min", type: "life" },
      { n: 9, section: "life", title: "Realizações da Organização, setembro", minutes: "9 min", type: "life" },
      { n: 10, section: "life", title: "Estudo bíblico de congregação", minutes: "30 min", type: "study" }
    ]
  },
  "2026-09-21": {
    reading: "JEREMIAS 36-37",
    songs: { opening: "74", middle: "142", closing: "134" },
    image: "assets/weeks/mwb202609-img-16-356x268.jpg",
    parts: [
      { n: 1, section: "treasures", title: "Jeová apoia aqueles que apoiam o Seu Reino", minutes: "10 min", type: "treasures" },
      { n: 2, section: "treasures", title: "Joias espirituais", minutes: "10 min", type: "treasures" },
      { n: 3, section: "treasures", title: "Leitura da Bíblia", minutes: "4 min", type: "bibleReading" },
      { n: 4, section: "ministry", title: "Iniciando conversas", minutes: "3 min", type: "ministry" },
      { n: 5, section: "ministry", title: "Cultivando o interesse", minutes: "4 min", type: "ministry" },
      { n: 6, section: "ministry", title: "O que você diria?", minutes: "6 min", type: "ministry" },
      { n: 7, section: "life", title: "Continue neutro no seu coração", minutes: "15 min", type: "life" },
      { n: 8, section: "life", title: "Estudo bíblico de congregação", minutes: "30 min", type: "study" }
    ]
  },
  "2026-09-28": {
    reading: "JEREMIAS 38-39",
    songs: { opening: "102", middle: "90", closing: "56" },
    image: "assets/weeks/mwb202609-img-07-423x259.jpg",
    parts: [
      { n: 1, section: "treasures", title: "Continuem ajudando uns aos outros", minutes: "10 min", type: "treasures" },
      { n: 2, section: "treasures", title: "Joias espirituais", minutes: "10 min", type: "treasures" },
      { n: 3, section: "treasures", title: "Leitura da Bíblia", minutes: "4 min", type: "bibleReading" },
      { n: 4, section: "ministry", title: "Iniciando conversas", minutes: "3 min", type: "ministry" },
      { n: 5, section: "ministry", title: "Cultivando o interesse", minutes: "4 min", type: "ministry" },
      { n: 6, section: "ministry", title: "O que você diria?", minutes: "6 min", type: "ministry" },
      { n: 7, section: "life", title: "Quem me tocou?", minutes: "15 min", type: "life" },
      { n: 8, section: "life", title: "Estudo bíblico de congregação", minutes: "30 min", type: "study" }
    ]
  },
  "2026-10-05": {
    reading: "JEREMIAS 40-41",
    songs: { opening: "33", middle: "17", closing: "38" },
    image: "assets/weeks/mwb202609-img-25-356x272.jpg",
    parts: [
      { n: 1, section: "treasures", title: "Tenha o ponto de vista correto sobre a proteção de Jeová", minutes: "10 min", type: "treasures" },
      { n: 2, section: "treasures", title: "Joias espirituais", minutes: "10 min", type: "treasures" },
      { n: 3, section: "treasures", title: "Leitura da Bíblia", minutes: "4 min", type: "bibleReading" },
      { n: 4, section: "ministry", title: "Iniciando conversas", minutes: "2 min", type: "ministry" },
      { n: 5, section: "ministry", title: "Iniciando conversas", minutes: "2 min", type: "ministry" },
      { n: 6, section: "ministry", title: "Iniciando conversas", minutes: "4 min", type: "ministry" },
      { n: 7, section: "ministry", title: "Explicando suas crenças", minutes: "3 min", type: "ministry" },
      { n: 8, section: "life", title: "Jeová é o Protetor das viúvas", minutes: "15 min", type: "life" },
      { n: 9, section: "life", title: "Estudo bíblico de congregação", minutes: "30 min", type: "study" }
    ]
  },
  "2026-10-12": {
    reading: "JEREMIAS 42-44",
    songs: { opening: "103", middle: "47", closing: "129" },
    image: "assets/weeks/mwb202609-img-28-473x266.jpg",
    parts: [
      { n: 1, section: "treasures", title: "Eles perguntaram o que fazer, mas não obedeceram", minutes: "10 min", type: "treasures" },
      { n: 2, section: "treasures", title: "Joias espirituais", minutes: "10 min", type: "treasures" },
      { n: 3, section: "treasures", title: "Leitura da Bíblia", minutes: "4 min", type: "bibleReading" },
      { n: 4, section: "ministry", title: "Iniciando conversas", minutes: "3 min", type: "ministry" },
      { n: 5, section: "ministry", title: "Cultivando o interesse", minutes: "4 min", type: "ministry" },
      { n: 6, section: "ministry", title: "O que você diria?", minutes: "6 min", type: "ministry" },
      { n: 7, section: "life", title: "Necessidades locais", minutes: "15 min", type: "life" },
      { n: 8, section: "life", title: "Estudo bíblico de congregação", minutes: "30 min", type: "study" }
    ]
  },
  "2026-10-19": {
    reading: "JEREMIAS 45-46",
    songs: { opening: "21", middle: "117", closing: "87" },
    image: "assets/weeks/mwb202609-img-31-360x272.jpg",
    parts: [
      { n: 1, section: "treasures", title: "Ter esperança é o segredo para o contentamento", minutes: "10 min", type: "treasures" },
      { n: 2, section: "treasures", title: "Joias espirituais", minutes: "10 min", type: "treasures" },
      { n: 3, section: "treasures", title: "Leitura da Bíblia", minutes: "4 min", type: "bibleReading" },
      { n: 4, section: "ministry", title: "Iniciando conversas", minutes: "3 min", type: "ministry" },
      { n: 5, section: "ministry", title: "Iniciando conversas", minutes: "2 min", type: "ministry" },
      { n: 6, section: "ministry", title: "Iniciando conversas", minutes: "2 min", type: "ministry" },
      { n: 7, section: "ministry", title: "Discurso", minutes: "4 min", type: "treasures" },
      { n: 8, section: "life", title: "Partilhe com outros o que você tem", minutes: "15 min", type: "life" },
      { n: 9, section: "life", title: "Estudo bíblico de congregação", minutes: "30 min", type: "study" }
    ]
  },
  "2026-10-26": {
    reading: "JEREMIAS 47-48",
    songs: { opening: "125", middle: "158", closing: "54" },
    image: "assets/weeks/mwb202609-img-34-356x272.jpg",
    parts: [
      { n: 1, section: "treasures", title: "Jeová é um Juiz justo e misericordioso", minutes: "10 min", type: "treasures" },
      { n: 2, section: "treasures", title: "Joias espirituais", minutes: "10 min", type: "treasures" },
      { n: 3, section: "treasures", title: "Leitura da Bíblia", minutes: "4 min", type: "bibleReading" },
      { n: 4, section: "ministry", title: "Iniciando conversas", minutes: "3 min", type: "ministry" },
      { n: 5, section: "ministry", title: "Cultivando o interesse", minutes: "4 min", type: "ministry" },
      { n: 6, section: "ministry", title: "Fazendo discípulos", minutes: "5 min", type: "ministry" },
      { n: 7, section: "life", title: "Necessidades locais", minutes: "15 min", type: "life" },
      { n: 8, section: "life", title: "Estudo bíblico de congregação", minutes: "30 min", type: "study" }
    ]
  }
};

const defaultState = {
  church: "Vila Brasil",
  theme: "light",
  activeView: "week",
  activeWeekId: "",
  printWeekId: "",
  viewerWeekId: "",
  sync: { enabled: false, provider: "futuro", lastSync: null },
  specialEvents: {
    circuitVisit: { start: "", end: "" },
    convention: { start: "", end: "" },
    bethelAssembly: { start: "", end: "" },
    circuitAssembly: { start: "", end: "" }
  },
  rules: {
    chairmanElder: true,
    openingPrayerChairman: true,
    treasuresServants: true,
    ministrySisters: true,
    avoidSamePair: true,
    noSamePersonSameWeek: true,
    ministrySameGenderPair: true,
    bibleReadingBrothers: true,
    lifeElders: true,
    fiveMinuteTalkBrothers: true
  },
  manualRules: [
    { id: "manual-five-minute-talk-brothers", text: "Discurso de 5 minutos somente com publicadores masculinos.", active: true }
  ],
  peopleSource: PEOPLE_SOURCE,
  contentVersion: CONTENT_VERSION,
  people: basePeople.map((person, index) => ({
    id: crypto.randomUUID ? crypto.randomUUID() : `p-${index}`,
    ...person
  })),
  weeks: generateWeeks("2026-06-01", 22).filter(week => !hiddenWeekIds.has(week.id)),
  schedules: {},
  history: []
};

let state = loadState();
const view = document.getElementById("view");
const nav = document.getElementById("nav");
const pageTitle = document.getElementById("pageTitle");
const sectionLabel = document.getElementById("sectionLabel");
const churchLabel = document.getElementById("churchLabel");

if (!state.activeWeekId) state.activeWeekId = state.weeks[0]?.id || "";

function generateWeeks(startIso, count) {
  const start = parseLocalDate(startIso);
  return Array.from({ length: count }, (_, index) => {
    const from = addDays(start, index * 7);
    const to = addDays(from, 6);
    return applyWeekCorrection({
      id: iso(from),
      from: iso(from),
      to: iso(to),
      label: formatWeekRange(from, to),
      reading: readingCycle[index % readingCycle.length],
      songs: { opening: String(84 + index % 8), middle: String(76 + index % 7), closing: String(18 + index % 9) },
      imageVariant: index % 5,
      image: weekImage(index),
      parts: defaultParts.map(part => ({ ...part, title: index === 0 ? firstWeekTitle(part) : part.title }))
    });
  });
}

function weekImage(index) {
  return weekImages[index % weekImages.length];
}

function applyWeekCorrection(week) {
  const correction = weekCorrections[week.id];
  if (!correction) return week;
  const applied = { ...week, ...clone(correction) };
  return {
    ...applied,
    image: correction.image || week.image,
    imageVariant: Number.isInteger(correction.imageVariant) ? correction.imageVariant : week.imageVariant
  };
}

function firstWeekTitle(part) {
  return {
    1: "Nao tenha medo, pois eu estou com voce",
    2: "Joias espirituais",
    3: "Leitura da Biblia",
    4: "Iniciando conversas",
    5: "Cultivando o interesse",
    6: "Fazendo discipulos",
    7: "Seja corajoso como Jeremias",
    8: "Faca uma defesa com brandura",
    9: "Estudo biblico de congregacao"
  }[part.n] || part.title;
}

function parseLocalDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function addDays(date, days) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function iso(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatWeekRange(from, to) {
  const month = new Intl.DateTimeFormat("pt-BR", { month: "long" });
  if (from.getMonth() === to.getMonth()) return `${from.getDate()}-${to.getDate()} de ${month.format(from)}`;
  const toDay = to.getDate() === 1 ? "1.º" : String(to.getDate());
  return `${from.getDate()} de ${month.format(from)}–${toDay} de ${month.format(to)}`;
}

function monthKey(isoDate = "") {
  return isoDate ? isoDate.slice(0, 7) : "";
}

function monthOptions() {
  const formatter = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" });
  const byMonth = new Map();
  for (const week of state.weeks) {
    const key = monthKey(week.id);
    if (!key || byMonth.has(key)) continue;
    const label = formatter.format(parseLocalDate(`${key}-01`));
    byMonth.set(key, label.charAt(0).toUpperCase() + label.slice(1));
  }
  return [...byMonth.entries()].map(([value, label]) => ({ value, label }));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY));
    if (!saved) return clone(defaultState);
    return normalizeState(saved);
  } catch {
    return clone(defaultState);
  }
}

function normalizeState(saved) {
  const importedPeople = saved.peopleSource === PEOPLE_SOURCE
    ? saved.people
    : clone(defaultState.people);
  const savedWeeks = normalizeWeeks(Array.isArray(saved.weeks) && saved.weeks.length ? saved.weeks : clone(defaultState.weeks));
  const contentChanged = saved.contentVersion !== CONTENT_VERSION;

  return {
    ...clone(defaultState),
    ...saved,
    peopleSource: PEOPLE_SOURCE,
    contentVersion: CONTENT_VERSION,
    specialEvents: normalizeSpecialEvents(saved.specialEvents),
    rules: { ...clone(defaultState.rules), ...(saved.rules || {}) },
    manualRules: normalizeManualRules(saved.manualRules),
    people: Array.isArray(importedPeople) ? importedPeople : clone(defaultState.people),
    weeks: savedWeeks,
    schedules: normalizeSchedules(saved.schedules || {}, savedWeeks, contentChanged),
    history: Array.isArray(saved.history) ? saved.history : []
  };
}

function normalizeWeeks(weeks) {
  const defaultById = new Map(defaultState.weeks.map(week => [week.id, week]));
  const byId = new Map(weeks.map(week => [week.id, week]));
  for (const week of defaultState.weeks) {
    if (!byId.has(week.id)) byId.set(week.id, week);
  }
  return [...byId.values()].filter(week => !hiddenWeekIds.has(week.id)).sort((a, b) => parseLocalDate(a.id) - parseLocalDate(b.id)).map((week, index) => {
    const defaultWeek = defaultById.get(week.id);
    const corrected = applyWeekCorrection({
      ...week,
      label: defaultWeek?.label || week.label
    });
    return {
      ...corrected,
      imageVariant: Number.isInteger(corrected.imageVariant) ? corrected.imageVariant : index % 5,
      image: corrected.image || weekImage(index)
    };
  });
}

function normalizeSchedules(schedules, weeks, resetCorrectedWeeks = false) {
  const copy = { ...schedules };
  if (!resetCorrectedWeeks) return copy;
  for (const week of weeks) {
    if (weekCorrections[week.id]) delete copy[week.id];
  }
  return copy;
}

function normalizeSpecialEvents(events = {}) {
  const normalized = clone(defaultState.specialEvents);
  for (const key of Object.keys(specialEventLabels)) {
    normalized[key] = {
      start: events[key]?.start || "",
      end: events[key]?.end || ""
    };
  }
  return normalized;
}

function normalizeManualRules(rules) {
  const savedRules = Array.isArray(rules) ? rules : [];
  const merged = [...clone(defaultState.manualRules), ...savedRules];
  const byId = new Map();

  for (const rule of merged) {
    if (!rule?.text) continue;
    const id = rule.id || `manual-${Date.now()}-${byId.size}`;
    byId.set(id, {
      id,
      text: String(rule.text).trim(),
      active: rule.active !== false
    });
  }

  return [...byId.values()];
}

async function saveState() {
  rebuildHistory();
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
  const savedOnline = await saveStateToServer(true);
  toast(savedOnline ? "Programacao salva online." : "Programacao salva apenas neste navegador.");
  render();
}

async function saveStateToServer(showError = false) {
  try {
    const response = await fetch(API_STATE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(sessionStorage.getItem(ADMIN_TOKEN_KEY) ? { Authorization: `Bearer ${sessionStorage.getItem(ADMIN_TOKEN_KEY)}` } : {})
      },
      body: JSON.stringify(state)
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new Error(detail || "save failed");
    }
    return true;
  } catch (error) {
    if (showError) toast(`Nao consegui salvar online: ${error.message || "verifique as variaveis da Vercel"}`);
    return false;
  }
}

async function loadStateFromServer() {
  try {
    const response = await fetch(API_STATE_URL, { cache: "no-store" });
    if (response.status === 204 || response.status === 404) {
      await saveStateToServer();
      return;
    }
    if (!response.ok) return;
    const remote = await response.json();
    if (!remote || !remote.weeks) {
      await saveStateToServer();
      return;
    }
    state = normalizeState(remote);
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
    rebuildHistory();
    render();
  } catch {
    // Sem servidor: continua usando os dados deste aparelho.
  }
}

function render() {
  document.documentElement.dataset.theme = state.theme;
  document.body.classList.toggle("view-only", !CAN_EDIT);
  const menuItems = CAN_EDIT ? navItems : navItems.filter(([id]) => id === "viewer");
  if (!menuItems.some(([id]) => id === state.activeView)) state.activeView = "viewer";
  churchLabel.textContent = `Congregacao ${state.church}`;
  nav.innerHTML = menuItems.map(([id, icon, label]) => `
    <button class="${state.activeView === id ? "active" : ""}" data-view="${id}">
      <span class="nav-icon">${icon}</span><span>${label}</span>
    </button>`).join("");
  const label = menuItems.find(item => item[0] === state.activeView)?.[2] || "Programacao";
  sectionLabel.textContent = label;
  pageTitle.textContent = {
    viewer: "Visualizacao",
    week: "Semana atual",
    programs: "Programacoes do mes",
    assignments: "Designacoes individuais",
    people: "Publicadores",
    rules: "Regras de designacao",
    history: "Historico",
    printProgram: "Impressao da programacao",
    settings: "Configuracoes"
  }[state.activeView] || "Programacao";
  ({ viewer: renderViewer, week: renderWeek, programs: renderPrograms, assignments: renderAssignments, people: renderPeople, rules: renderRules, history: renderHistory, printProgram: renderPrintProgram, settings: renderSettings })[state.activeView]();
}

function setView(viewId) {
  state.activeView = viewId;
  document.body.classList.remove("menu-open");
  render();
}

function currentWeek() {
  return state.weeks.find(week => week.id === state.activeWeekId) || state.weeks[0];
}

function currentSchedule(weekId = state.activeWeekId) {
  state.schedules[weekId] ||= { chairman: "", closingPrayer: "", parts: {} };
  state.schedules[weekId].parts ||= {};
  if (!("closingPrayer" in state.schedules[weekId])) {
    state.schedules[weekId].closingPrayer = legacyStudyHelper(weekId);
  }
  syncClosingPrayerWithStudyReader(weekId);
  return state.schedules[weekId];
}

function legacyStudyHelper(weekId) {
  const week = state.weeks.find(item => item.id === weekId);
  const studyPart = week?.parts.find(part => part.type === "study");
  return studyPart ? state.schedules[weekId]?.parts?.[studyPart.n]?.helper || "" : "";
}

function studyReaderName(weekId, schedule = state.schedules[weekId]) {
  const week = state.weeks.find(item => item.id === weekId);
  const studyPart = week?.parts.find(part => part.type === "study");
  return studyPart ? schedule?.parts?.[studyPart.n]?.helper || "" : "";
}

function syncClosingPrayerWithStudyReader(weekId) {
  const schedule = state.schedules[weekId];
  if (!schedule) return;
  schedule.closingPrayer = studyReaderName(weekId, schedule);
}

function renderWeek() {
  const week = currentWeek();
  const schedule = currentSchedule(week.id);
  state.generationMonth ||= monthKey(week.id);
  view.innerHTML = `
    <div class="dashboard-grid">
      <div>
        <section class="hero-week">
          <div class="week-image variant-${week.imageVariant}" ${imageStyle(week.image)}><div><p class="eyebrow">Apostila semanal</p><h2>${esc(week.label)}</h2><p>${esc(week.reading)}</p></div></div>
          <div class="week-body"><div class="toolbar no-print">
            <button class="primary" data-action="generate-current">Gerar esta semana</button>
            <button class="ghost" data-action="clear-current-week">Limpar semana</button>
            <button class="ghost" data-action="print-week">Exportar PDF</button>
            <button class="ghost" data-action="open-assignments">S-89 desta semana</button>
          </div></div>
        </section>
        ${renderProgramSheet(week, schedule)}
      </div>
      <aside>
        <section class="panel"><h2>Resumo</h2><div class="stats">
          <div class="stat"><strong>${state.weeks.length}</strong><span>semanas</span></div>
          <div class="stat"><strong>${Object.keys(state.schedules).length}</strong><span>geradas</span></div>
          <div class="stat"><strong>${activePeople().length}</strong><span>ativos</span></div>
        </div></section>
        <section class="panel"><h2>Presidente</h2>
          <label>Nome${personSelect("chairman", schedule.chairman, eligible("chairman"), week.id, "chairman")}</label>
          <p class="muted">A oracao inicial acompanha o presidente quando a regra esta ligada.</p>
        </section>
        <section class="panel"><h2>Oracao final</h2>
          <label>Nome${personSelect("closingPrayer", schedule.closingPrayer || "", eligibleClosingPrayer(), week.id, "closingPrayer")}</label>
        </section>
      </aside>
    </div>`;
}

function renderProgramSheet(week, schedule) {
  return `<section class="program" id="programSheet">
    <div class="print-program-header">
      <div class="jw-logo">JW<br><span>.ORG</span></div>
      <div class="print-title">
        <h2>CONGREGAÇÃO ${esc(state.church).toUpperCase()} | PROGRAMAÇÃO DA REUNIÃO (QUARTA)</h2>
        <p>Reunião Vida e Ministério Cristão</p>
      </div>
    </div>
    <img class="print-week-image" src="${esc(week.image || weekImage(week.imageVariant || 0))}" alt="">
    ${renderSpecialEventBanner(week)}
    <div class="program-head"><div><h2>${esc(week.label)} | ${esc(week.reading)}</h2><p class="muted">Congregacao ${esc(state.church)}</p></div>
    <div><strong>Presidente</strong><p>${nameOrBlank(schedule.chairman)}</p><strong>Oracao inicial</strong><p>${state.rules.openingPrayerChairman ? nameOrBlank(schedule.chairman) : "A definir"}</p></div></div>
    <p><strong>Cantico ${week.songs.opening}</strong> | Comentarios iniciais</p>
    ${renderSection(week, schedule, "treasures", "TESOUROS DA PALAVRA DE DEUS")}
    ${renderSection(week, schedule, "ministry", "FACA SEU MELHOR NO MINISTERIO")}
    <p><strong>Cantico ${week.songs.middle}</strong></p>
    ${renderSection(week, schedule, "life", "NOSSA VIDA CRISTA")}
    <p><strong>Comentarios finais</strong> | Cantico ${week.songs.closing} | Oracao final: ${closingPrayerName(schedule, week)}</p>
  </section>`;
}

function renderViewer() {
  const week = state.weeks.find(item => item.id === (state.viewerWeekId || state.activeWeekId)) || currentWeek();
  state.viewerWeekId = week.id;
  const schedule = currentSchedule(week.id);
  view.innerHTML = `<section class="viewer-screen">
    ${!CAN_EDIT && ADMIN_MODE ? `<section class="admin-login-panel">
      <label>Senha do administrador<input id="adminPasswordInput" type="password" autocomplete="current-password" placeholder="Digite a senha"></label>
      <button class="primary" data-action="admin-login">Entrar como administrador</button>
    </section>` : ""}
    <section class="viewer-selector">
      <label>Escolha a semana<select id="viewerWeekSelect">${state.weeks.map(item => `<option value="${esc(item.id)}" ${item.id === week.id ? "selected" : ""}>${esc(item.label)} - ${esc(item.reading)}</option>`).join("")}</select></label>
    </section>
    <div class="viewer-hero" ${imageStyle(week.image)}>
      <div>
        <p class="eyebrow">Congregacao ${esc(state.church)}</p>
        <h2>${esc(week.label)}</h2>
        <p>${esc(week.reading)}</p>
      </div>
    </div>
    <div class="viewer-meta">
      <div><span>Presidente</span><strong>${nameOrBlank(schedule.chairman)}</strong></div>
      <div><span>Oracao inicial</span><strong>${state.rules.openingPrayerChairman ? nameOrBlank(schedule.chairman) : "A definir"}</strong></div>
      <div><span>Oracao final</span><strong>${esc(closingPrayerName(schedule, week))}</strong></div>
    </div>
    <div class="viewer-program">
      <p class="viewer-song"><strong>Cantico ${esc(week.songs.opening)}</strong> | Comentarios iniciais</p>
      ${renderViewerSection(week, schedule, "treasures", "TESOUROS DA PALAVRA DE DEUS")}
      ${renderViewerSection(week, schedule, "ministry", "FACA SEU MELHOR NO MINISTERIO")}
      <p class="viewer-song"><strong>Cantico ${esc(week.songs.middle)}</strong></p>
      ${renderViewerSection(week, schedule, "life", "NOSSA VIDA CRISTA")}
      <p class="viewer-song"><strong>Comentarios finais</strong> | Cantico ${esc(week.songs.closing)}</p>
    </div>
  </section>`;
}

function renderViewerSection(week, schedule, section, title) {
  return `<div class="section-title ${section}">${title}</div>${week.parts.filter(part => part.section === section).map(part => renderViewerPartRow(schedule, part)).join("")}`;
}

function renderViewerPartRow(schedule, part) {
  const assignment = schedule.parts?.[part.n] || {};
  return `<article class="viewer-part">
    <div class="viewer-number">${part.n}</div>
    <div class="viewer-part-main"><strong>${esc(part.title)}</strong><span>${esc(part.minutes)}</span></div>
    <div class="viewer-names">${printAssignmentNames(part, assignment)}</div>
  </article>`;
}

function renderSpecialEventBanner(week) {
  const events = specialEventsForWeek(week);
  if (!events.length) return "";
  return `<div class="special-events">${events.map(event => `<div class="special-event"><strong>${esc(event.label)}</strong><span>${esc(event.range)}</span></div>`).join("")}</div>`;
}

function specialEventsForWeek(week) {
  const weekStart = parseLocalDate(week.from);
  const weekEnd = parseLocalDate(week.to);
  return Object.entries(state.specialEvents || {}).flatMap(([key, event]) => {
    if (!event?.start) return [];
    const start = parseLocalDate(event.start);
    const end = parseLocalDate(event.end || event.start);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return [];
    if (end < weekStart || start > weekEnd) return [];
    return [{ label: specialEventLabels[key] || "Data especial", range: formatSpecialEventRange(event.start, event.end || event.start) }];
  });
}

function formatSpecialEventRange(startIso, endIso) {
  const start = parseLocalDate(startIso);
  const end = parseLocalDate(endIso);
  const month = new Intl.DateTimeFormat("pt-BR", { month: "long" });
  if (startIso === endIso) return `${start.getDate()} de ${month.format(start)}`;
  if (start.getMonth() === end.getMonth()) return `${start.getDate()}-${end.getDate()} de ${month.format(start)}`;
  return `${start.getDate()} de ${month.format(start)}–${end.getDate()} de ${month.format(end)}`;
}

function renderSection(week, schedule, section, title) {
  return `<div class="section-title ${section}">${title}</div>${week.parts.filter(part => part.section === section).map(part => renderPartRow(week, schedule, part)).join("")}`;
}

function renderPartRow(week, schedule, part) {
  const assignment = schedule.parts[part.n] || {};
  const primaryType = part.type === "study" ? "studyConductor" : part.type;
  const helperType = part.type === "study" ? "studyReader" : "ministry";
  const primaryPeople = state.rules.fiveMinuteTalkBrothers && isFiveMinuteTalk(part)
    ? eligibleFiveMinuteTalk()
    : part.type === "life"
      ? eligibleLifePart(week.id)
    : eligible(primaryType);
  const primaryLabel = part.type === "study" ? "Dirigente" : "Designado";
  const helperLabel = part.type === "study" ? "Leitor" : "Ajudante";
  return `<div class="part-row"><div class="part-number">${part.n}</div><div class="part-title"><strong>${esc(part.title)}</strong><span>${esc(part.minutes)}</span></div>
    ${assignmentSelect(primaryLabel, `part-${part.n}-primary`, assignment.primary || "", primaryPeople, week.id, part.n, "primary")}
    ${part.type === "ministry" || part.type === "study" ? assignmentSelect(helperLabel, `part-${part.n}-helper`, assignment.helper || "", part.type === "ministry" ? eligibleMinistryHelper(assignment.primary) : eligible(helperType), week.id, part.n, "helper") : "<span></span>"}
  </div>`;
}

function assignmentSelect(label, id, selected, people, weekId, partNumber, field) {
  return `<div class="assignment-slot"><span>${esc(label)}</span>${personSelect(id, selected, people, weekId, partNumber, field)}</div>`;
}

function personSelect(id, selected, people, weekId, partNumber, field) {
  const options = [`<option value="">A definir</option>`].concat(people.map(person => {
    const recent = lastAssignment(person.name);
    const usedThisMonth = monthlyAssignmentCount(person.name, weekId) > 0;
    const weekDetails = state.rules.noSamePersonSameWeek ? weeklyAssignmentDetails(person.name, weekId, partNumber, field) : [];
    const usedThisWeek = weekDetails.length > 0 && person.name !== selected;
    const genderClass = person.gender === "M" ? "gender-m" : "gender-f";
    const suffix = usedThisWeek
      ? ` - ja esta em ${weekDetails[0].part}`
      : usedThisMonth ? " - usado neste mes" : recent ? ` - ultima: ${recent}` : " - sem historico";
    const optionClass = [usedThisMonth ? "used-month" : "", usedThisWeek ? "used-week" : "", genderClass].filter(Boolean).join(" ");
    const optionStyle = person.gender === "M"
      ? " style=\"color:#22815a;font-weight:800\""
      : " style=\"color:#c34d4d;font-weight:800\"";
    return `<option value="${esc(person.name)}" ${person.name === selected ? "selected" : ""}${usedThisWeek ? " disabled" : ""} class="${optionClass}"${optionStyle}>${esc(person.name + suffix)}</option>`;
  }));
  const selectedUsed = selected && monthlyAssignmentCount(selected, weekId) > 0;
  const selectedPerson = state.people.find(person => person.name === selected);
  const selectedGenderClass = selectedPerson?.gender === "M" ? "selected-male" : selectedPerson?.gender === "F" ? "selected-female" : "";
  return `<div class="person-select-wrap"><select class="${[selectedUsed ? "used-month-select" : "", selectedGenderClass].filter(Boolean).join(" ")}" data-week="${weekId}" data-part="${partNumber}" data-field="${field}" id="${id}">${options.join("")}</select>${selectedUsed ? `<button class="used-month-info ${selectedPerson?.gender === "M" ? "male" : ""}" type="button" data-used-details="${esc(selected)}" data-used-week="${esc(weekId)}">Ver parte</button>` : ""}</div>`;
}

function renderPrograms() {
  state.generationMonth ||= monthKey(state.activeWeekId || state.weeks[0]?.id);
  view.innerHTML = `<section class="panel"><div class="month-generate-bar">
    <label>Mes para gerar<select id="generationMonthSelect">${monthOptions().map(option => `<option value="${esc(option.value)}" ${option.value === state.generationMonth ? "selected" : ""}>${esc(option.label)}</option>`).join("")}</select></label>
    <div class="toolbar">
    <button class="primary" data-action="generate-selected-month">Gerar mes escolhido</button>
    <button class="ghost" data-action="add-month">Adicionar mes</button>
    <button class="ghost" data-action="print-week">Exportar PDF</button>
  </div></div></section><div class="week-list">${state.weeks.map(week => {
    const events = specialEventsForWeek(week);
    const hasSpecialEvent = events.length > 0;
    return `
    <button class="week-card variant-${week.imageVariant} ${hasSpecialEvent ? "special-week-card" : ""}" data-week-card="${week.id}">
      <img class="week-thumb" src="${esc(week.image || weekImage(week.imageVariant || 0))}" alt="">
      <div class="week-card-content">
        <span class="badge ${hasSpecialEvent ? "event-badge" : ""}">${hasSpecialEvent ? esc(events.map(event => event.label).join(" / ")) : state.schedules[week.id] ? "Gerada" : "Pendente"}</span>
        <h3>${esc(week.label)}</h3>
        <p>${esc(week.reading)}</p>
      </div>
    </button>`;
  }).join("")}</div>`;
}

function renderPrintProgram() {
  const week = state.weeks.find(item => item.id === (state.printWeekId || state.activeWeekId)) || state.weeks[0];
  if (!week) {
    view.innerHTML = emptyState("Nenhuma semana cadastrada para imprimir.");
    return;
  }
  state.printWeekId = week.id;
  const schedule = currentSchedule(week.id);
  view.innerHTML = `<section class="panel no-print"><div class="print-control-grid">
    <label>Escolha a semana<select id="printWeekSelect">${state.weeks.map(item => `<option value="${esc(item.id)}" ${item.id === week.id ? "selected" : ""}>${esc(item.label)} - ${esc(item.reading)}</option>`).join("")}</select></label>
    <div class="toolbar">
      <button class="ghost" data-action="generate-print-week">Gerar esta semana</button>
      <button class="primary" data-action="print-program-sheet">Imprimir programacao</button>
    </div>
  </div></section>
  <div class="print-preview-shell">${renderProgramPrintSheet(week, schedule)}</div>`;
}

function renderProgramPrintSheet(week, schedule) {
  return `<section class="program-print-sheet" id="printProgramSheet">
    <div class="print-program-header">
      <div class="jw-logo">JW<br><span>.ORG</span></div>
      <div class="print-title">
        <h2>CONGREGAÇÃO ${esc(state.church).toUpperCase()} | PROGRAMAÇÃO DA REUNIÃO (QUARTA)</h2>
        <p>Reunião Vida e Ministério Cristão</p>
      </div>
    </div>
    <img class="print-week-image" src="${esc(week.image || weekImage(week.imageVariant || 0))}" alt="">
    <div class="print-sheet-body">
      <aside class="print-sheet-meta">
        <strong>${esc(week.label).toUpperCase()}</strong>
        <div><b>Presidente:</b><span>${nameOrBlank(schedule.chairman)}</span></div>
        <div><b>Oracao inicial:</b><span>${state.rules.openingPrayerChairman ? nameOrBlank(schedule.chairman) : "A definir"}</span></div>
        <div><b>Oracao final:</b><span>${esc(closingPrayerName(schedule, week))}</span></div>
      </aside>
      <div class="print-sheet-program">
        <p><strong>Cantico ${esc(week.songs.opening)}</strong> | Comentarios iniciais</p>
        ${renderPrintSection(week, schedule, "treasures", "TESOUROS DA PALAVRA DE DEUS")}
        ${renderPrintSection(week, schedule, "ministry", "FACA SEU MELHOR NO MINISTERIO")}
        <p><strong>Cantico ${esc(week.songs.middle)}</strong></p>
        ${renderPrintSection(week, schedule, "life", "NOSSA VIDA CRISTA")}
        <p><strong>Comentarios finais</strong> | Cantico ${esc(week.songs.closing)}</p>
      </div>
    </div>
  </section>`;
}

function renderPrintSection(week, schedule, section, title) {
  return `<div class="section-title ${section}">${title}</div>${week.parts.filter(part => part.section === section).map(part => renderPrintPartRow(schedule, part)).join("")}`;
}

function renderPrintPartRow(schedule, part) {
  const assignment = schedule.parts?.[part.n] || {};
  return `<div class="print-part-row">
    <div><strong>${part.n}.</strong></div>
    <div>${esc(part.title)}</div>
    <div>${printAssignmentNames(part, assignment)}</div>
  </div>`;
}

function printAssignmentNames(part, assignment) {
  const names = [];
  if (part.type === "study") {
    if (assignment.primary) names.push(`<span class="print-role-label">Dirigente:</span> ${esc(assignment.primary)}`);
    if (assignment.helper) names.push(`<span class="print-role-label">Leitor:</span> ${esc(assignment.helper)}`);
    return names.length ? names.join("<br>") : "A definir";
  }
  if (assignment.primary) names.push(esc(assignment.primary));
  if (part.type === "ministry" && assignment.helper) names.push(esc(assignment.helper));
  return names.length ? names.join("<br>") : "A definir";
}

function renderAssignments() {
  const cards = [];
  for (const week of state.weeks) {
    const schedule = state.schedules[week.id];
    if (!schedule) continue;
    for (const part of week.parts) {
      const item = schedule.parts[part.n] || {};
      if (!item.primary) continue;
      cards.push(renderAssignmentCard(week, part, item));
      if (item.helper && part.type === "ministry") cards.push(renderAssignmentCard(week, part, { primary: item.helper, helper: item.primary, helperLabel: "Companheiro" }));
    }
  }
  view.innerHTML = `<section class="panel no-print"><div class="toolbar">
    <button class="primary" data-action="print-assignments">Exportar S-89 em PDF</button>
    <button class="ghost" data-action="generate-selected-month">Gerar mes escolhido</button>
  </div></section><div class="assignment-grid">${cards.length ? cards.join("") : emptyState("Gere a programacao para criar as designacoes individuais.")}</div>`;
}

function renderAssignmentCard(week, part, item) {
  return `<article class="assignment-card"><header><h2>DESIGNACAO PARA A REUNIAO</h2><p>NOSSA VIDA E MINISTERIO CRISTAO</p></header>
    <dl><dt>Nome</dt><dd>${esc(item.primary)}</dd>${item.helper ? `<dt>${item.helperLabel || "Ajudante"}</dt><dd>${esc(item.helper)}</dd>` : ""}
    <dt>Data</dt><dd>${esc(week.label)}</dd><dt>Parte</dt><dd>${part.n}. ${esc(part.title)}</dd><dt>Tempo</dt><dd>${esc(part.minutes)}</dd><dt>Local</dt><dd>Salao principal</dd></dl>
    <p class="muted">Use a fonte de materia indicada na Apostila da Reuniao Vida e Ministerio.</p></article>`;
}

function emptyCapabilities() {
  return Object.fromEntries(Object.keys(capabilityLabels).map(key => [key, false]));
}

function defaultCapabilitiesFor(role, gender) {
  const capabilities = emptyCapabilities();
  if (role === "Anciao") {
    Object.assign(capabilities, { chairman: true, treasures: true, life: true, studyConductor: true });
  }
  if (role === "Servo ministerial") {
    capabilities.treasures = true;
  }
  if (role === "Publicador batizado") {
    Object.assign(capabilities, { bibleReading: true, ministryPrimary: true, ministryHelper: true });
  }
  if (role === "Publicadora batizada" || gender === "F") {
    Object.assign(capabilities, { ministryPrimary: true, ministryHelper: true });
  }
  return capabilities;
}

function personCapabilities(person) {
  const defaults = defaultCapabilitiesFor(person.role, person.gender);
  const saved = person.capabilities || {};
  const capabilities = { ...emptyCapabilities(), ...saved };
  if (!person.capabilitiesManaged) {
    if (person.role === "Publicador batizado") {
      capabilities.ministryPrimary = true;
      capabilities.ministryHelper = true;
    }
    if (person.role === "Publicadora batizada") {
      capabilities.ministryPrimary = true;
      capabilities.ministryHelper = true;
    }
  }
  return { ...defaults, ...capabilities };
}

function personCapabilitySummary(person) {
  const capabilities = personCapabilities(person);
  const active = Object.entries(capabilityLabels).filter(([key]) => capabilities[key]).map(([, label]) => label);
  return active.length ? `<span class="capability-summary">${active.map(esc).join(", ")}</span>` : `<span class="muted">Sem partes marcadas</span>`;
}

function renderPeople() {
  view.innerHTML = `<section class="panel"><div class="toolbar"><button class="primary" data-action="new-person">Novo publicador</button><button class="ghost" data-action="export-backup">Backup</button></div></section>
    <section class="panel table-wrap"><table><thead><tr><th>Nome</th><th>Sexo</th><th>Privilegio</th><th>Permissoes</th><th>Status</th><th></th></tr></thead><tbody>
    ${state.people.map(person => `<tr><td>${esc(person.name)}</td><td>${person.gender === "M" ? "Masculino" : "Feminino"}</td><td>${esc(person.role)}</td><td>${personCapabilitySummary(person)}</td><td>${person.blocked ? "Indisponivel" : "Ativo"}</td><td><div class="row-actions"><button class="ghost" data-edit-person="${person.id}">Editar</button><button class="ghost" data-toggle-person="${person.id}">${person.blocked ? "Ativar" : "Indispor"}</button></div></td></tr>`).join("")}
    </tbody></table></section>`;
}

function renderRules() {
  const labels = {
    chairmanElder: "Presidente somente anciao",
    openingPrayerChairman: "Oracao inicial acompanha o presidente",
    treasuresServants: "Tesouros prioriza anciaos e servos ministeriais",
    ministrySisters: "Partes do ministerio com publicadores batizados",
    avoidSamePair: "Evitar repetir a mesma dupla",
    noSamePersonSameWeek: "Nao repetir a mesma pessoa na semana",
    ministrySameGenderPair: "Ministerio sem misturar irmaos com irmas",
    bibleReadingBrothers: "Leitura da Biblia com publicadores masculinos",
    lifeElders: "Nossa Vida Crista com anciaos e servos ministeriais",
    fiveMinuteTalkBrothers: "Discurso de 5 minutos somente com publicadores masculinos"
  };
  view.innerHTML = `<section class="panel"><h2>Regras automáticas</h2>${Object.entries(labels).map(([key, label]) => `<div class="rule-row"><strong>${label}</strong><button class="${state.rules[key] ? "primary" : "ghost"}" data-rule="${key}">${state.rules[key] ? "Ligada" : "Desligada"}</button></div>`).join("")}</section>
    <section class="panel"><h2>Regras manuais</h2>
      <div class="manual-rule-form"><input id="manualRuleInput" placeholder="Digite uma nova regra"><button class="primary" data-action="add-manual-rule">Nova regra</button></div>
      <div class="manual-rule-list">${state.manualRules.length ? state.manualRules.map(rule => `<div class="rule-row"><span class="${rule.active ? "" : "muted"}">${esc(rule.text)}</span><div class="toolbar"><button class="${rule.active ? "primary" : "ghost"}" data-toggle-manual-rule="${esc(rule.id)}">${rule.active ? "Ativa" : "Inativa"}</button><button class="ghost" data-delete-manual-rule="${esc(rule.id)}">Remover</button></div></div>`).join("") : `<p class="muted">Nenhuma regra manual cadastrada.</p>`}</div>
    </section>`;
}

function renderHistory() {
  rebuildHistory();
  view.innerHTML = `<section class="panel"><label>Pesquisar<input id="historySearch" placeholder="Digite um nome ou parte"></label></section><section class="panel table-wrap" id="historyTable">${historyTable(state.history)}</section>`;
}

function historyTable(rows) {
  return `<table><thead><tr><th>Data</th><th>Parte</th><th>Funcao</th><th>Nome</th></tr></thead><tbody>${rows.length ? rows.map(row => `<tr><td>${esc(row.week)}</td><td>${esc(row.part)}</td><td>${esc(row.role)}</td><td>${esc(row.name)}</td></tr>`).join("") : `<tr><td colspan="4">Sem registros.</td></tr>`}</tbody></table>`;
}

function renderSettings() {
  view.innerHTML = `<section class="panel settings-grid">
    <label>Congregacao<input id="churchInput" value="${esc(state.church)}"></label>
    <label>Tema<select id="themeInput"><option value="light" ${state.theme === "light" ? "selected" : ""}>Claro</option><option value="dark" ${state.theme === "dark" ? "selected" : ""}>Escuro</option></select></label>
    <label>Inicio do proximo mes<input type="date" id="monthStartInput" value="${state.weeks[0]?.from || "2026-06-01"}"></label>
    <label>Quantidade de semanas<input type="number" id="weekCountInput" min="1" max="16" value="${state.weeks.length}"></label>
  </section><section class="panel"><h2>Datas especiais</h2>
    <div class="special-settings">${Object.entries(specialEventLabels).map(([key, label]) => specialEventInputs(key, label)).join("")}</div>
  </section><section class="panel"><h2>Sincronizacao futura</h2><p class="muted">A base ja separa os dados locais de uma configuracao de sincronizacao. Quando houver servidor ou nuvem definidos, esta tela pode receber login e envio seguro.</p>
    <div class="toolbar"><button class="ghost" data-action="export-backup">Exportar backup</button><label class="button ghost">Importar backup<input type="file" id="importBackup" accept="application/json" hidden></label><button class="danger" data-action="reset-data">Reiniciar dados</button></div></section>`;
}

function specialEventInputs(key, label) {
  const event = state.specialEvents?.[key] || { start: "", end: "" };
  return `<div class="special-setting">
    <strong>${esc(label)}</strong>
    <label>Inicio<input type="date" data-special-event="${key}" data-special-field="start" value="${esc(event.start)}"></label>
    <label>Fim<input type="date" data-special-event="${key}" data-special-field="end" value="${esc(event.end)}"></label>
  </div>`;
}

function generateScheduleForWeek(week) {
  const used = new Set();
  const schedule = { chairman: "", closingPrayer: "", parts: {} };
  const chairman = pickPerson(eligible("chairman"), used, "Presidente");
  if (chairman) { schedule.chairman = chairman.name; used.add(chairman.name); }
  for (const part of week.parts) {
    const primaryType = part.type === "study" ? "studyConductor" : part.type;
    const primaryPeople = state.rules.fiveMinuteTalkBrothers && isFiveMinuteTalk(part)
      ? eligibleFiveMinuteTalk()
      : part.type === "life"
        ? eligibleLifePart(week.id)
      : eligible(primaryType);
    const primary = pickPerson(primaryPeople, used);
    if (primary) used.add(primary.name);
    const assignment = { primary: primary?.name || "" };
    if (part.type === "ministry") {
      const helper = pickPerson(eligibleMinistryHelper(primary?.name), used, "Ajudante");
      if (helper) used.add(helper.name);
      assignment.helper = helper?.name || "";
    }
    if (part.type === "study") {
      const reader = pickPerson(eligible("studyReader"), used);
      if (reader) used.add(reader.name);
      assignment.helper = reader?.name || "";
    }
    schedule.parts[part.n] = assignment;
  }
  schedule.closingPrayer = studyReaderName(week.id, schedule);
  state.schedules[week.id] = schedule;
  rebuildHistory();
}

function generateScheduleForSingleWeek(week) {
  delete state.schedules[week.id];
  rebuildHistory();
  generateScheduleForWeek(week);
}

function generateSelectedMonth(month = state.generationMonth || monthKey(state.activeWeekId || state.weeks[0]?.id)) {
  const weeks = state.weeks.filter(week => monthKey(week.id) === month);
  if (!weeks.length) {
    toast("Escolha um mes com semanas cadastradas.");
    return;
  }
  weeks.forEach(week => delete state.schedules[week.id]);
  rebuildHistory();
  weeks.forEach(generateScheduleForWeek);
  state.generationMonth = month;
  state.activeWeekId = weeks[0].id;
}

function clearCurrentWeek() {
  const week = currentWeek();
  if (!week) return;
  delete state.schedules[week.id];
  rebuildHistory();
  render();
  toast("Semana limpa.");
}

function eligible(type) {
  const people = activePeople();
  return people.filter(person => {
    const capabilities = personCapabilities(person);
    if (type === "ministry") return ["Publicador batizado", "Publicadora batizada"].includes(person.role) && (capabilities.ministryPrimary || capabilities.ministryHelper);
    if (type in capabilities) return capabilities[type];
    if (type === "chairman") return person.role === "Anciao";
    if (type === "treasures") return ["Anciao", "Servo ministerial"].includes(person.role);
    if (type === "bibleReading") return person.gender === "M" && person.role === "Publicador batizado";
    if (type === "life") return person.role === "Anciao";
    if (type === "studyConductor") return person.role === "Anciao";
    if (type === "studyReader") return person.gender === "M" && person.role === "Publicador batizado";
    return true;
  });
}

function eligibleMinistryHelper(primaryName = "") {
  const people = eligible("ministry");
  if (!state.rules.ministrySameGenderPair || !primaryName) return people;
  const primary = state.people.find(person => person.name === primaryName);
  if (!primary) return people;
  return people.filter(person => person.gender === primary.gender);
}

function isFiveMinuteTalk(part) {
  return /\b5\s*min\b/i.test(part.minutes || "") && /discurso/i.test(part.title || "");
}

function eligibleFiveMinuteTalk() {
  return activePeople().filter(person => person.gender === "M" && person.role === "Publicador batizado");
}

function eligibleClosingPrayer() {
  return activePeople().filter(person => person.gender === "M");
}

function eligibleLifePart(weekId) {
  const people = activePeople();
  const lifeBrothers = people.filter(person => person.role === "Anciao" || person.role === "Servo ministerial");
  if (!state.rules.lifeElders) return lifeBrothers;
  const availableBrothers = lifeBrothers.filter(person => monthlyAssignmentCount(person.name, weekId) === 0);
  return availableBrothers.length ? availableBrothers : lifeBrothers;
}

function activePeople() { return state.people.filter(person => !person.blocked); }
function pickPerson(people, used, role = "") {
  const sorted = [...people].sort((a, b) =>
    assignmentCount(a.name, role) - assignmentCount(b.name, role) ||
    lastAssignmentOrder(a.name, role) - lastAssignmentOrder(b.name, role) ||
    a.name.localeCompare(b.name)
  );
  return sorted.find(person => !used.has(person.name)) || sorted[0];
}
function assignmentCount(name, role = "") {
  return state.history.filter(item => item.name === name && (!role || item.role === role)).length;
}
function lastAssignment(name) { return [...state.history].reverse().find(item => item.name === name)?.week || ""; }
function lastAssignmentOrder(name, role = "") {
  const index = state.history.findLastIndex(item => item.name === name && (!role || item.role === role));
  return index === -1 ? -1 : index;
}

function monthlyAssignmentCount(name, weekId) {
  return monthlyAssignmentDetails(name, weekId).length;
}

function monthlyAssignmentDetails(name, weekId) {
  const targetWeek = state.weeks.find(week => week.id === weekId);
  if (!targetWeek || !name) return [];
  const targetDate = parseLocalDate(targetWeek.from);
  const rows = [];
  for (const week of state.weeks) {
    const date = parseLocalDate(week.from);
    if (date.getFullYear() !== targetDate.getFullYear() || date.getMonth() !== targetDate.getMonth()) continue;
    const schedule = state.schedules[week.id];
    if (!schedule) continue;
    if (schedule.chairman === name) rows.push({ week: week.label, part: "Presidente e oração inicial", role: "Presidente" });
    if (schedule.closingPrayer === name) rows.push({ week: week.label, part: "Oração final", role: "Oração" });
    for (const [partNumber, item] of Object.entries(schedule.parts || {})) {
      const part = week.parts.find(candidate => String(candidate.n) === String(partNumber));
      const partTitle = part?.title || "Parte";
      if (item.primary === name) rows.push({ week: week.label, part: partTitle, role: part?.type === "study" ? "Dirigente" : "Principal" });
      if (item.helper === name && (part?.type === "ministry" || part?.type === "study")) rows.push({ week: week.label, part: partTitle, role: part?.type === "study" ? "Leitor" : "Ajudante" });
    }
  }
  return rows;
}

function weeklyAssignmentDetails(name, weekId, ignorePartNumber = "", ignoreField = "") {
  const week = state.weeks.find(item => item.id === weekId);
  const schedule = state.schedules[weekId];
  if (!week || !schedule || !name) return [];
  const rows = [];
  if (schedule.chairman === name && ignorePartNumber !== "chairman") {
    rows.push({ week: week.label, part: "Presidente e oração inicial", role: "Presidente" });
  }
  if (schedule.closingPrayer === name && ignorePartNumber !== "closingPrayer") {
    rows.push({ week: week.label, part: "Oração final", role: "Oração" });
  }
  for (const [partNumber, item] of Object.entries(schedule.parts || {})) {
    const part = week.parts.find(candidate => String(candidate.n) === String(partNumber));
    const partTitle = part?.title || "Parte";
    if (item.primary === name && !(String(partNumber) === String(ignorePartNumber) && ignoreField === "primary")) {
      rows.push({ week: week.label, part: partTitle, role: part?.type === "study" ? "Dirigente" : "Principal" });
    }
    if (item.helper === name && (part?.type === "ministry" || part?.type === "study") && !(String(partNumber) === String(ignorePartNumber) && ignoreField === "helper")) {
      rows.push({ week: week.label, part: partTitle, role: part?.type === "study" ? "Leitor" : "Ajudante" });
    }
  }
  return rows;
}

function rebuildHistory() {
  const rows = [];
  for (const week of state.weeks) {
    const schedule = state.schedules[week.id];
    if (!schedule) continue;
    syncClosingPrayerWithStudyReader(week.id);
    if (schedule.chairman) rows.push({ week: week.label, part: "Presidente e oracao inicial", role: "Presidente", name: schedule.chairman });
    if (schedule.closingPrayer) rows.push({ week: week.label, part: "Oracao final", role: "Oracao", name: schedule.closingPrayer });
    for (const part of week.parts) {
      const item = schedule.parts?.[part.n];
      if (!item) continue;
      if (item.primary) rows.push({ week: week.label, part: part.title, role: part.type === "study" ? "Dirigente" : "Principal", name: item.primary });
      if (item.helper && (part.type === "ministry" || part.type === "study")) rows.push({ week: week.label, part: part.title, role: part.type === "study" ? "Leitor" : "Ajudante", name: item.helper });
    }
  }
  state.history = rows;
}

function addMonth() {
  const last = state.weeks[state.weeks.length - 1];
  const start = last ? addDays(parseLocalDate(last.from), 7) : new Date();
  state.weeks.push(...generateWeeks(iso(start), 4));
  render();
}

function updateAssignment(target) {
  const { week, part, field } = target.dataset;
  if (part !== "closingPrayer" && state.rules.noSamePersonSameWeek && target.value && weeklyAssignmentDetails(target.value, week, part, field).length) {
    toast("Esta pessoa ja esta designada nesta semana.");
    render();
    return;
  }
  const schedule = currentSchedule(week);
  if (part === "chairman") schedule.chairman = target.value;
  else if (part === "closingPrayer") {
    const studyPart = state.weeks.find(item => item.id === week)?.parts.find(item => item.type === "study");
    if (studyPart) {
      schedule.parts[studyPart.n] ||= {};
      schedule.parts[studyPart.n].helper = target.value;
    }
    syncClosingPrayerWithStudyReader(week);
  }
  else {
    schedule.parts[part] ||= {};
    schedule.parts[part][field] = target.value;
    enforceMinistryPairRule(week, part, field);
    syncClosingPrayerWithStudyReader(week);
  }
  rebuildHistory();
  render();
}

function enforceMinistryPairRule(weekId, partNumber, changedField = "") {
  if (!state.rules.ministrySameGenderPair) return;
  const week = state.weeks.find(item => item.id === weekId);
  const part = week?.parts.find(item => String(item.n) === String(partNumber));
  if (part?.type !== "ministry") return;
  const assignment = state.schedules[weekId]?.parts?.[partNumber];
  if (!assignment?.primary || !assignment?.helper) return;
  const primary = state.people.find(person => person.name === assignment.primary);
  const helper = state.people.find(person => person.name === assignment.helper);
  if (!primary || !helper || primary.gender === helper.gender) return;
  assignment.helper = "";
  toast(changedField === "helper" ? "Escolha uma pessoa do mesmo sexo para esta parte." : "Ajudante removido para nao misturar irmao com irma.");
}

function closingPrayerName(schedule, week = currentWeek()) {
  return studyReaderName(week.id, schedule) || schedule.closingPrayer || "A definir";
}
function nameOrBlank(value) { return value ? esc(value) : "A definir"; }
function emptyState(text) { return `<section class="panel"><p class="muted">${text}</p></section>`; }

function imageStyle(src) {
  return src ? `style="--week-image: url('${esc(src)}')"` : "";
}

function toast(message) {
  const node = document.createElement("div");
  node.textContent = message;
  node.style.cssText = "position:fixed;right:18px;bottom:18px;background:var(--text);color:var(--surface);padding:12px 14px;border-radius:8px;z-index:20;box-shadow:var(--shadow)";
  document.body.appendChild(node);
  setTimeout(() => node.remove(), 2400);
}

function confirmAction(title, message, onConfirm) {
  const dialog = document.getElementById("dialog");
  document.getElementById("dialogTitle").textContent = title;
  document.getElementById("dialogMessage").textContent = message;
  dialog.showModal();
  dialog.onclose = () => { if (dialog.returnValue === "confirm") onConfirm(); };
}

function showUsedMonthDetails(name, weekId) {
  const rows = monthlyAssignmentDetails(name, weekId);
  const dialog = document.getElementById("dialog");
  document.getElementById("dialogTitle").textContent = `${name} neste mês`;
  document.getElementById("dialogMessage").innerHTML = rows.length
    ? `<div class="used-detail-list">${rows.map(row => `<div class="used-detail-card"><strong>${esc(row.part)}</strong><span>${esc(row.role)} - ${esc(row.week)}</span></div>`).join("")}</div>`
    : `<p class="muted">Nao encontrei parte cadastrada para este mes.</p>`;
  dialog.showModal();
  dialog.onclose = null;
}

function addManualRule() {
  const input = document.getElementById("manualRuleInput");
  const text = input?.value.trim();
  if (!text) {
    toast("Digite a regra antes de adicionar.");
    return;
  }
  state.manualRules.push({
    id: crypto.randomUUID ? crypto.randomUUID() : `manual-${Date.now()}`,
    text,
    active: true
  });
  render();
}

async function loginAdmin() {
  const password = document.getElementById("adminPasswordInput")?.value || "";
  if (!password.trim()) {
    toast("Digite a senha do administrador.");
    return;
  }
  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });
    if (!response.ok) throw new Error("login failed");
    const data = await response.json();
    sessionStorage.setItem(ADMIN_TOKEN_KEY, data.token);
    CAN_EDIT = true;
    state.activeView = "week";
    render();
    toast("Modo administrador liberado.");
  } catch {
    toast("Senha incorreta ou servidor indisponivel.");
  }
}

function openPersonForm(personId = "") {
  const person = state.people.find(item => item.id === personId);
  const template = document.getElementById("personFormTemplate");
  const cloneNode = template.content.cloneNode(true);
  const dialog = document.getElementById("dialog");
  document.getElementById("dialogTitle").textContent = person ? "Editar publicador" : "Novo publicador";
  document.getElementById("dialogMessage").replaceChildren(cloneNode);
  const form = document.getElementById("personForm");
  if (person) {
    form.querySelector('[name="name"]').value = person.name;
    form.querySelector('[name="gender"]').value = person.gender;
    form.querySelector('[name="role"]').value = person.role;
    form.querySelector('[name="status"]').value = person.blocked ? "blocked" : "active";
  }
  form.insertAdjacentHTML("beforeend", capabilityFields(person || {
    role: form.querySelector('[name="role"]').value,
    gender: form.querySelector('[name="gender"]').value,
    capabilities: defaultCapabilitiesFor(form.querySelector('[name="role"]').value, form.querySelector('[name="gender"]').value)
  }));
  dialog.showModal();
  dialog.onclose = () => {
    if (dialog.returnValue !== "confirm") return;
    const form = document.getElementById("personForm");
    const name = form.querySelector('[name="name"]').value.trim();
    if (!name) {
      toast("Digite o nome do publicador.");
      return;
    }
    const data = {
      name,
      gender: form.querySelector('[name="gender"]').value,
      role: form.querySelector('[name="role"]').value,
      status: form.querySelector('[name="status"]').value,
      capabilities: readCapabilityFields(form)
    };
    if (person) {
      Object.assign(person, {
        name: data.name,
        gender: data.gender,
        role: data.role,
        blocked: data.status === "blocked",
        capabilities: data.capabilities,
        capabilitiesManaged: true
      });
    } else {
      state.people.push({
        id: crypto.randomUUID ? crypto.randomUUID() : `p-${Date.now()}`,
        name: data.name,
        gender: data.gender,
        role: data.role,
        blocked: data.status === "blocked",
        capabilities: data.capabilities,
        capabilitiesManaged: true
      });
    }
    render();
  };
}

function capabilityFields(person) {
  const capabilities = personCapabilities(person);
  return `<div class="capability-editor"><h3>Permissoes de designacao</h3>${Object.entries(capabilityLabels).map(([key, label]) => `
    <label class="check-row"><input type="checkbox" name="capability" value="${key}" ${capabilities[key] ? "checked" : ""}><span>${esc(label)}</span></label>`).join("")}</div>`;
}

function readCapabilityFields(form) {
  const capabilities = emptyCapabilities();
  form.querySelectorAll('[name="capability"]').forEach(input => {
    capabilities[input.value] = input.checked;
  });
  return capabilities;
}

function applyRoleCapabilitiesToForm(form) {
  const capabilities = defaultCapabilitiesFor(form.querySelector('[name="role"]').value, form.querySelector('[name="gender"]').value);
  form.querySelectorAll('[name="capability"]').forEach(input => {
    input.checked = Boolean(capabilities[input.value]);
  });
}

function exportBackup() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `programacao-vida-ministerio-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
}

function importBackup(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try { state = normalizeState(JSON.parse(String(reader.result))); saveState(); }
    catch { toast("Nao foi possivel importar este arquivo."); }
  };
  reader.readAsText(file);
}

function resetData() {
  confirmAction("Reiniciar dados?", "Isso limpa os dados salvos neste navegador e volta ao modelo inicial.", () => {
    state = clone(defaultState);
    localStorage.removeItem(STORE_KEY);
    render();
  });
}

function regenerateWeeksFromSettings() {
  const start = document.getElementById("monthStartInput")?.value;
  const count = Number(document.getElementById("weekCountInput")?.value || 8);
  if (!start) return;
  state.weeks = generateWeeks(start, count);
  state.activeWeekId = state.weeks[0].id;
  state.schedules = {};
  rebuildHistory();
  render();
}

function updateSpecialEvent(target) {
  const key = target.dataset.specialEvent;
  const field = target.dataset.specialField;
  state.specialEvents ||= normalizeSpecialEvents();
  state.specialEvents[key] ||= { start: "", end: "" };
  state.specialEvents[key][field] = target.value;
  if (field === "start" && target.value && !state.specialEvents[key].end) {
    state.specialEvents[key].end = target.value;
  }
  render();
}

function esc(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

document.addEventListener("click", event => {
  const navButton = event.target.closest("[data-view]");
  if (navButton) {
    if (!CAN_EDIT && navButton.dataset.view !== "viewer") return;
    setView(navButton.dataset.view);
  }
  const action = event.target.closest("[data-action]")?.dataset.action;
  if (action === "admin-login") { loginAdmin(); return; }
  if (!CAN_EDIT) return;
  const weekCard = event.target.closest("[data-week-card]");
  if (weekCard) { state.activeWeekId = weekCard.dataset.weekCard; setView("week"); }
  if (action === "generate-current") { generateScheduleForSingleWeek(currentWeek()); render(); }
  if (action === "clear-current-week") clearCurrentWeek();
  if (action === "generate-selected-month") { generateSelectedMonth(); render(); }
  if (action === "generate-month") { generateSelectedMonth(monthKey(state.activeWeekId || state.weeks[0]?.id)); render(); }
  if (action === "generate-print-week") {
    const week = state.weeks.find(item => item.id === state.printWeekId) || currentWeek();
    generateScheduleForSingleWeek(week);
    render();
  }
  if (action === "print-week" || action === "print-assignments") window.print();
  if (action === "print-program-sheet") window.print();
  if (action === "open-assignments") setView("assignments");
  if (action === "add-month") addMonth();
  if (action === "new-person") openPersonForm();
  if (action === "add-manual-rule") addManualRule();
  if (action === "export-backup") exportBackup();
  if (action === "reset-data") resetData();
  const togglePerson = event.target.closest("[data-toggle-person]");
  if (togglePerson) {
    const person = state.people.find(item => item.id === togglePerson.dataset.togglePerson);
    if (person) person.blocked = !person.blocked;
    render();
  }
  const editPerson = event.target.closest("[data-edit-person]");
  if (editPerson) openPersonForm(editPerson.dataset.editPerson);
  const rule = event.target.closest("[data-rule]");
  if (rule) { state.rules[rule.dataset.rule] = !state.rules[rule.dataset.rule]; render(); }
  const usedDetails = event.target.closest("[data-used-details]");
  if (usedDetails) showUsedMonthDetails(usedDetails.dataset.usedDetails, usedDetails.dataset.usedWeek);
  const toggleManualRule = event.target.closest("[data-toggle-manual-rule]");
  if (toggleManualRule) {
    const ruleItem = state.manualRules.find(item => item.id === toggleManualRule.dataset.toggleManualRule);
    if (ruleItem) ruleItem.active = !ruleItem.active;
    render();
  }
  const deleteManualRule = event.target.closest("[data-delete-manual-rule]");
  if (deleteManualRule) {
    state.manualRules = state.manualRules.filter(item => item.id !== deleteManualRule.dataset.deleteManualRule);
    render();
  }
});

document.addEventListener("change", event => {
  if (event.target.id === "viewerWeekSelect") { state.viewerWeekId = event.target.value; render(); return; }
  if (!CAN_EDIT) return;
  if (event.target.id === "generationMonthSelect") { state.generationMonth = event.target.value; render(); return; }
  if (event.target.closest("#personForm") && (event.target.name === "role" || event.target.name === "gender")) {
    applyRoleCapabilitiesToForm(event.target.closest("#personForm"));
    return;
  }
  if (event.target.matches("select[data-week]")) updateAssignment(event.target);
  if (event.target.id === "printWeekSelect") { state.printWeekId = event.target.value; render(); }
  if (event.target.id === "themeInput") { state.theme = event.target.value; render(); }
  if (event.target.id === "churchInput") { state.church = event.target.value; render(); }
  if (event.target.matches("[data-special-event]")) updateSpecialEvent(event.target);
  if (event.target.id === "monthStartInput" || event.target.id === "weekCountInput") confirmAction("Recriar semanas?", "As semanas e designacoes geradas serao reiniciadas.", regenerateWeeksFromSettings);
  if (event.target.id === "importBackup" && event.target.files[0]) importBackup(event.target.files[0]);
});

document.addEventListener("input", event => {
  if (!CAN_EDIT) return;
  if (event.target.id === "historySearch") {
    const term = event.target.value.toLowerCase();
    const rows = state.history.filter(row => `${row.week} ${row.part} ${row.role} ${row.name}`.toLowerCase().includes(term));
    document.getElementById("historyTable").innerHTML = historyTable(rows);
  }
});

document.getElementById("saveButton").addEventListener("click", () => { if (CAN_EDIT) saveState(); });
document.getElementById("generateButton").addEventListener("click", () => {
  if (CAN_EDIT) {
    generateSelectedMonth(monthKey(state.activeWeekId || state.weeks[0]?.id));
    render();
  }
});
document.getElementById("menuButton").addEventListener("click", () => document.body.classList.toggle("menu-open"));

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}

rebuildHistory();
render();
loadStateFromServer();
