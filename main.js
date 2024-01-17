//target le div dans lequel on va créer le jeu
const tetrisJS = document.querySelector('#tetrisJSBox'); 
tetrisJS.setAttribute('class','tetrisJSBox');

// ============================================================================================================================
const LIGNE = 20;
const COLONNE =  10;
const VIDE = 'rgb(23, 125, 184)'; //les cases vides
const O = [
    [   [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0],
    ],
    [   [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0],
    ],
    [   [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0],
    ],
    [   [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0],
    ]
];
const I = [
    [   [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ],
    [   [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
    ],
    [   [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ],
    [   [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
    ]
];
const S = [
    [   [0, 0, 0],
        [0, 1, 1],
        [1, 1, 0],
    ],
    [   [1, 0, 0],
        [1, 1, 0],
        [0, 1, 0],
    ],
    [   [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
    ],
    [   [0, 1, 0],
        [0, 1, 1],
        [0, 0, 1],
    ]
];
const Z = [
    [   [0, 0, 0],
        [1, 1, 0],
        [0, 1, 1],
    ],
    [   [0, 1, 0],
        [1, 1, 0],
        [1, 0, 0],
    ],
    [   [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
    ],
    [   [0, 0, 1],
        [0, 1, 1],
        [0, 1, 0],
    ]
];
const L = [
    [   [0, 0, 0],
        [1, 1, 1],
        [1, 0, 0],
    ],
    [   [1, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
    ],
    [   [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
    ],
    [   [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1],
    ]
];
const J = [
    [   [0, 0, 0],
        [1, 1, 1],
        [0, 0, 1],
    ],
    [   [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0],
    ],
    [   [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
    ],
    [   [0, 1, 1],
        [0, 1, 0],
        [0, 1, 0],
    ]
];
const T = [
    [   [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0],
    ],
    [   [0, 1, 0],
        [1, 1, 0],
        [0, 1, 0],
    ],
    [   [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
    ],
    [   [0, 1, 0],
        [0, 1, 1],
        [0, 1, 0],
    ]
];
const tetrominoes = [ [Z,'red'], [S,'green'], [T,'cyan'], [O,'indigo'], [I,'blue'], [L,'purple'], [J,'orange']];
//représente le plateau de tetris comme une grille avec colonnes = x et lignes = y
let plateau = []; 
//remplit le plateau de case vide
for ( let l = 0; l < LIGNE; l++) { plateau[l] = [];
    for ( let c = 0; c < COLONNE; c++) { plateau[l][c] = VIDE;
    };
};
let game;
let timer;
let timerMs = 1000;
let piece;
let score = 0;
let nextPiece;
let subMenuOpen = false;
let audioOnOff = false;
let animationTimer;
let menuAnimationGridDisplay = []
let horlogeID;
let minutesLabel;  
let secondsLabel; 
let totalSeconds = 0;
let animationX;
let animationY;
let loop = 0;
let pause = false;
let sample;
let niveau = 0;
let holdSlot = false;
let holdPcs;
let holdPcsUse = 1;
let userName;
userName = localStorage.getItem('userNameTetrisJSData');
let options = JSON.parse(localStorage.getItem('options'));
if ( options == null ) { options = [0.5]; };

//reset les variables
function clearVariables() {
    //on vide le tableau
    plateau = []; 
    //remplit le plateau de case vide
    for ( let l = 0; l < LIGNE; l++) { plateau[l] = [];
        for ( let c = 0; c < COLONNE; c++) { plateau[l][c] = VIDE;
        };
    };

    game = false;
    timer;
    piece;
    score = 0;
    animationTimer;
    menuAnimationGridDisplay = []
    animationX;
    animationY;
    loop = 0;
    audioOnOff = false;
    pause = false;
    niveau = 0;
    timerMs = 1000;
    minutesLabel;
    secondsLabel;
    totalSeconds = 0;
    horlogeID;
    nextPiece;
    holdSlot = false;
    holdPcs;
    holdPcsUse = 1;
    subMenuOpen = false;
};

//le menu qui contiendra 5 boutons puis on appelle la fonction une première fois
function menu() { 

    //le conteneur principal
    const menuTetrisJS = document.createElement('div');
    menuTetrisJS.setAttribute('id', 'menuBox');
    menuTetrisJS.setAttribute('class','menuBox');
    tetrisJS.appendChild(menuTetrisJS);

    //bouton audio mute
    const playAudioBtn1 = document.createElement('button'); //bouton audio sur ecran d'accueil
    playAudioBtn1.id = 'btnPlayer1';
    playAudioBtn1.setAttribute('class','audioPlayer');
    playAudioBtn1.addEventListener('click',function() { audio('accueil','btnPlayer1');})
    tetrisJS.appendChild(playAudioBtn1);

    //le titre du jeu
    const title = document.createElement('h1');
    title.textContent = 'TETRIS JS';
    menuTetrisJS.appendChild(title);

    boutonDisplay('menuBox',true,true,true,true,true,false);

    //information console
    console.log('Menu ouvert');
};

//affiche les boutons du menu - input='string', bool,bool,bool,bool,bool
function boutonDisplay(targetDivID,jouerBtnBol,tutoBtnBol,optionsBtnBol,scoreBtnBol,userBtnBol,closeBtnBol) {

    const targetDiv = document.getElementById(targetDivID);

    //liste les boutons du menu
    const ul = document.createElement('ul');
    targetDiv.appendChild(ul);
    

    //bouton jouer
    if ( jouerBtnBol == true ) {
        const li1 = document.createElement('li');
        ul.appendChild(li1);
        
        const jouerBtn = document.createElement('button');
        jouerBtn.textContent = 'Jouer';
        jouerBtn.setAttribute('class', 'bouton');
        jouerBtn.setAttribute('id','menuBtn-play');
        jouerBtn.addEventListener('click', function() 
            { 
                Jeu(); 
                targetDiv.remove(); 
                document.getElementById('animationMenu').remove(); 
                document.getElementById('btnPlayer1').remove();
                clearTimeout(animationTimer);
                if ( sample != undefined ) { sample.pause(); };
                audioOnOff = false;
                audio('theme');
            }
        );
        li1.appendChild(jouerBtn);
    };
    

    //bouton tutorial
    if ( tutoBtnBol == true ) {
        const li2 = document.createElement('li');
        ul.appendChild(li2);

        const tutoBtn = document.createElement('button');
        tutoBtn.textContent = 'Tutorial';
        tutoBtn.setAttribute('class', 'bouton');
        tutoBtn.setAttribute('id','menuBtn-tuto');
        tutoBtn.addEventListener('click', () => { tutorialMenu(); });
        li2.appendChild(tutoBtn);
    };
    

    //bouton options
    if ( optionsBtnBol == true ) {
         const li3 = document.createElement('li');
        ul.appendChild(li3);
        
        const optionsBtn = document.createElement('button');
        optionsBtn.textContent ='Options';
        optionsBtn.setAttribute('class', 'bouton');
        optionsBtn.setAttribute('id','menuBtn-options');
        optionsBtn.addEventListener('click', () => { optionsMenu(); });
        li3.appendChild(optionsBtn);
    };
   


    //bouton score
    if ( scoreBtnBol == true ) {
        const li4 = document.createElement('li');
        ul.appendChild(li4);
        
        const scoreBtn = document.createElement('button');
        scoreBtn.textContent = 'Score';
        scoreBtn.setAttribute('class', 'bouton');
        scoreBtn.setAttribute('id','menuBtn-scores');
        scoreBtn.addEventListener('click', ()=> { scoreMenu(); });
        li4.appendChild(scoreBtn);
    };
    


    //bouton utilisateur
    if ( userBtnBol == true ) {
        const li5 = document.createElement('li');
        ul.appendChild(li5);

        const loginBtn = document.createElement('button');
        loginBtn.textContent = 'User';
        loginBtn.setAttribute('class', 'bouton');
        loginBtn.setAttribute('id','menuBtn-login');
        if ( userName != null ) {
            loginBtn.textContent = `${userName}`; 
            } else {
                loginBtn.textContent = 'User'; 
        };
        loginBtn.addEventListener('click', () => { registerUser(); })
        li5.appendChild(loginBtn);
    };
    
    
    //bouton de fermeture
    if ( closeBtnBol == true ) {
        const li6 = document.createElement('li');
        ul.appendChild(li6);

        const closeBtn = document.createElement('button');
        closeBtn.setAttribute('id', 'closeBtn');
        closeBtn.textContent = 'Retour';
        closeBtn.addEventListener('click', () => { 
            if ( game == true ) { 
                pauseMod(); 
            } else {
                //document.getElementById('subMenuDiv').remove();
                this.parentNode.remove();
            };
            subMenuOpen = false; });
        li6.appendChild(closeBtn);
    };
    
};

menu(); 

//menu des score
function scoreMenu() {

    //la fenêtre du menu
    const subMenuDiv = document.createElement('div');
    subMenuDiv.setAttribute('class', 'subMenu');
    subMenuDiv.setAttribute('id', 'subMenuDiv');
    tetrisJS.appendChild(subMenuDiv);
 
    //bouton fermer
    const closeBtn = document.createElement('button');
    closeBtn.setAttribute('id', 'closeBtn');
    closeBtn.textContent = 'Retour';
    closeBtn.addEventListener('click', () => { 
        if ( game == true ) { 
            pauseMod(); 
        } else {
            subMenuDiv.remove();
        };
     });
    subMenuDiv.appendChild(closeBtn);
 
    //wrapper pour le contenu
    const contentDiv = document.createElement('div');
    contentDiv.setAttribute('class', 'subMenuContentDiv');
    contentDiv.setAttribute('id', 'subMenuContentDiv');
    subMenuDiv.appendChild(contentDiv);
 
    scoreTab(false);
};

//une animation dans le menu, des pieces de tetris qui tombent par exemple
function menuAnimation() {

    //div transparente sur laquelle on fera notre animation en CSS
    const animationDiv = document.createElement('div');
    animationDiv.setAttribute('class', 'animationMenu');
    animationDiv.setAttribute('id', 'animationMenu');
    tetrisJS.appendChild(animationDiv);

    animationX = 15;
    animationY = 2;

    //array qui représente la grid 20*40 avec value 0 qui se represénte une case vide
    for ( c = 0; c < 40; c++ ) {
        menuAnimationGridDisplay[c] = [];
        for ( l = 0; l < 20; l++ ) {
            menuAnimationGridDisplay[c][l] = 0;
            const para = document.createElement('p');
            para.textContent = '0';
            para.setAttribute('id', `${c} ${l}`);
            animationDiv.appendChild(para);
        };
    };

    //commence l'animation
    animationLoop();

};
menuAnimation();

//la loop de l'animation
function animationLoop() {
    
    if ( animationY <= 35 && loop == 0 ) { tetrominoesFall(O,'indigo'); 
    } else if ( animationY == 36 && loop == 0 ) {
        animationX = 8;
        animationY = 2; 
        loop++;
    };

    if ( animationY <= 35 && loop == 1 ) { tetrominoesFall(S,'green');
    } else if ( animationY == 36 && loop == 1 ) { 
        animationX = 0;
        animationY = 2; 
        loop++;
    }; 

    if ( animationY <= 34 && loop == 2 ) { tetrominoesFall(J,'orange');
    } else if ( animationY == 35 && loop == 2 ) {
        animationX = 0;
        animationY = 2; 
        loop++;
    };

    if ( loop >= 1 ) { drawTetrominoes(O,'indigo',15,37); };
    if ( loop >= 2 ) { drawTetrominoes(S,'green',8,36); };
    if ( loop >= 3 ) { drawTetrominoes(J,'orange',0,35); };
    drawTetrominoes(L,'purple',12,37);
    drawTetrominoes(I,'blue',8,38);
    drawTetrominoes(T,'cyan',2,37);
    drawTetrominoes(Z,'red',5,37);
    animationTimer = setTimeout( function() { animationLoop(); },1000);
};

//démarre le jeu 
function Jeu() { 

    //déclaration et setup du canvas
    const gameboxTetrisJS = document.createElement('canvas'); 
    gameboxTetrisJS.setAttribute('id', 'gameBox');
    gameboxTetrisJS.setAttribute('class','gameBox');
    gameboxTetrisJS.width = 800;
    gameboxTetrisJS.height = 1000;
    tetrisJS.appendChild(gameboxTetrisJS);
    const ctx = gameboxTetrisJS.getContext('2d'); //le canvas se place dans un contexte 2D


    //dessine le fond d'écran du jeu en bleu
    ctx.fillStyle = 'rgb(29, 68, 175)'; 
    ctx.fillRect(0, 0, 800, 1000);


    //la zone de jeu du tetris
    
    //ctx.fillRect(320, 160, 400, 800); 
    //ctx.strokeRect(320, 160, 400, 800);

    //la zone des scores et information
    ctx.fillStyle = 'rgb(23, 125, 184)'; 
    ctx.strokeStyle = 'white';
    ctx.fillRect(25, 25, 750, 100);  
    ctx.strokeRect(25, 25, 750, 100);

    //la zone qui affiche la prochaine piece 
    ctx.fillRect(60, 160, 200, 200);
    ctx.strokeRect(60, 160, 200, 200);

    //la zone qui affiche la piece en rétension
    ctx.fillRect(60, 425, 200, 200);
    ctx.strokeRect(60, 425, 200, 200);

    let rdm = Math.floor(Math.random() * tetrominoes.length );
    nextPiece = tetrominoes[rdm];
    piece = randomPiece();

    //démarre le jeu
    timer = setInterval(gameLoop, timerMs);
    horlogeID = setInterval(setTime, 1000);

    requestAnimationFrame(drawBoard);
    requestAnimationFrame(drawScoreNinfos);
    requestAnimationFrame(drawNextPiece);
    
    game = true;
    //gameLoop();

    //pour information
    console.log('Lancement du jeu');

};

//dessine un carré/rectangle - input= num, num, 'string', 'string,  num, 'string'
function drawSquare(numbersquareX,numbersquareY,fillcolor,strokecolor,squaresizepx,canvasID) { 
    
    //valeur par défaut
    if ( numbersquareX == undefined ) { numbersquareX = 0; };
    if ( numbersquareY == undefined ) { numbersquareY = 0; };
    if ( fillcolor == undefined ) { fillcolor = 'white'; };
    if ( strokecolor == undefined ) { strokecolor = 'black'; };
    if ( squaresizepx == undefined ) { squaresizepx = 40; };
    if ( canvasID == undefined ) { canvasID = `gameBox`};
    
    const ctx = document.getElementById(canvasID).getContext('2d');
    const square = squaresizepx; //40px

    ctx.strokeStyle = strokecolor;
    ctx.fillStyle = fillcolor;
    if ( numbersquareY >= 4 ) { ctx.fillRect(numbersquareX*square, numbersquareY*square, square, square); };
    if ( numbersquareY >= 4 ) { ctx.strokeRect(numbersquareX*square, numbersquareY*square, square, square); };
    

};

//dessine le plateau de jeu
function drawBoard() { 

    for ( let l = 0; l < LIGNE; l++) {
        for ( let c = 0; c < COLONNE; c++) {
            drawSquare(8+c, 4+l, plateau[l][c], 'white');
        };
    };

};

//dessine la zone des scores et autres infos 
function drawScoreNinfos() {

    let ctx = document.getElementById(`gameBox`).getContext('2d');

    //efface la zone
    ctx.fillStyle = 'rgb(23, 125, 184)'; 
    ctx.strokeStyle = 'white';
    ctx.fillRect(25, 25, 750, 100);  
    ctx.strokeRect(25, 25, 750, 100);

    //remplit le score avec les informations à jour
    ctx.font = "40px Arial";
    ctx.fillStyle = "rgb(29, 68, 175)";
    ctx.strokeStyle = 'black';
    ctx.fillText(`Score ${score}`, 50, 85);
    ctx.strokeText(`Score ${score}`, 50, 85);

    //remplit le niveau avec les informations à jour
    ctx.font = "40px Arial";
    ctx.fillStyle = "rgb(29, 68, 175)";
    ctx.strokeStyle = 'black';
    ctx.fillText(`Niveau ${niveau}`, 425, 85);
    ctx.strokeText(`Niveau ${niveau}`, 425, 85);

    //remplit le niveau avec les informations à jour
    ctx.font = "40px Arial";
    ctx.fillStyle = "rgb(29, 68, 175)";
    ctx.strokeStyle = 'black';
    if ( minutesLabel != undefined || secondsLabel != undefined ) {
        ctx.fillText(`${minutesLabel} : ${secondsLabel}`, 625, 85);
        ctx.strokeText(`${minutesLabel} : ${secondsLabel}`, 625, 85);
    };
    
}

//dessine une piece dans le menu d'animation
function drawTetrominoes(piece,couleur,coordonnéesX,coordonnéesY) {
    for ( l = 0; l < 40; l++ ) {
        for ( c = 0; c < 20; c++ ) {

            //case correspondant aux coordonnées demandées on imprime la pièce
            if ( c == coordonnéesX && l == coordonnéesY ) { 
                for ( let i = 0; i < piece[0].length; i++) {
                    for ( let j = 0; j < piece[0][i].length; j++) {

                        //on passe les cases 0 
                        if (piece[0][i][j]) {
                            menuAnimationGridDisplay[l+i][c+j] = 1;
                            document.getElementById(`${l+i} ${c+j}`).style.backgroundColor = `${couleur}`;   
                            document.getElementById(`${l+i} ${c+j}`).style.border = '1px solid black';                   
                        };
                    };
                };
            };
        };
    }; 
};

//la fenêtre de sous menu qui apparait quand on appuit sur les boutons options etc
function subMenu(content) {

    //la fenêtre du menu
    const subMenuDiv = document.createElement('div');
    subMenuDiv.setAttribute('class', 'subMenu');
    subMenuDiv.setAttribute('id', 'subMenuDiv');
    tetrisJS.appendChild(subMenuDiv);

    //bouton continuer
    const closeBtn = document.createElement('button');
    closeBtn.setAttribute('id', 'closeBtn');
    closeBtn.textContent = 'Retour';
    closeBtn.addEventListener('click', () => { 
        if ( game == true ) { 
            pauseMod(); 
        } else {
            subMenuDiv.remove();
        };
    });
    subMenuDiv.appendChild(closeBtn);

    //bouton retour ecran titre
    //bouton options


    //wrapper pour le contenu
    const contentDiv = document.createElement('div');
    contentDiv.setAttribute('class', 'subMenuContentDiv');
    contentDiv.setAttribute('id', 'subMenuContentDiv');
    subMenuDiv.appendChild(contentDiv);

    //grid pour le contenu
    const contentTarget = document.createElement('div');
    contentTarget.setAttribute('class', 'optionsMenu');
    contentDiv.appendChild(contentTarget);
};

function pauseMenu2() {
    const subMenuDiv = document.createElement('div');
    subMenuDiv.setAttribute('class', 'pauseDiv');
    subMenuDiv.setAttribute('id', 'subMenuDiv');
    tetrisJS.appendChild(subMenuDiv);

    const para = document.createElement('p');
    para.textContent = 'PAUSE';
    para.id = 'pausePara'
    subMenuDiv.appendChild(para);
};

//la fenêtre de fin du jeu
function endGameMenu() {

    //la fenêtre du menu
    const subMenuDiv = document.createElement('div');
    subMenuDiv.setAttribute('class', 'subMenu');
    subMenuDiv.setAttribute('id', 'subMenuDiv');
    tetrisJS.appendChild(subMenuDiv);

    const ul = document.createElement('ul');
    subMenuDiv.appendChild(ul);
    const li1 = document.createElement('li');
    ul.appendChild(li1);
    const li2 = document.createElement('li');
    ul.appendChild(li2);

    //bouton retour à l'écran titre
    const retourMenu = document.createElement('button');
    retourMenu.setAttribute('id', 'retourMenu');
    retourMenu.textContent = 'Retour accueil';
    retourMenu.addEventListener('click', () => { 
        subMenuDiv.remove();
        document.getElementById(`gameBox`).remove();
        clearVariables();
        clearInterval(timer);
        clearInterval(horlogeID);
        menu(); 
        menuAnimation();
    });
    li2.appendChild(retourMenu);

    //bouton recommencer
    const recommencerBtn = document.createElement('button');
    recommencerBtn.setAttribute('id', 'recommencerBtn');
    recommencerBtn.textContent = 'Recommencer';
    recommencerBtn.addEventListener('click', () => { 
        subMenuDiv.remove();
        document.getElementById(`gameBox`).remove();
        clearVariables();
        clearInterval(timer);
        clearInterval(horlogeID);
        Jeu();
        
    });
    li1.appendChild(recommencerBtn);

    //wrapper pour le contenu
    const contentDiv = document.createElement('div');
    contentDiv.setAttribute('class', 'subMenuContentDiv');
    contentDiv.setAttribute('id', 'subMenuContentDiv');
    subMenuDiv.appendChild(contentDiv);

    scoreTab(true);
};

//les différentes options et réglages du jeu
function optionsMenu() {

    //la fenêtre du menu
    const subMenuDiv = document.createElement('div');
    subMenuDiv.setAttribute('class', 'subMenu');
    subMenuDiv.setAttribute('id', 'subMenuDiv');
    tetrisJS.appendChild(subMenuDiv);

    //bouton fermer
    const closeBtn = document.createElement('button');
    closeBtn.setAttribute('id', 'closeBtn');
    closeBtn.textContent = 'Retour';
    closeBtn.addEventListener('click', () => { subMenuDiv.remove(); });
    subMenuDiv.appendChild(closeBtn);

    //wrapper pour le contenu
    const contentDiv = document.createElement('div');
    contentDiv.setAttribute('class', 'subMenuContentDiv');
    contentDiv.setAttribute('id', 'subMenuContentDiv');
    subMenuDiv.appendChild(contentDiv);

    //grid pour le contenu
    const contentTarget = document.createElement('div');
    contentTarget.setAttribute('class', 'optionsMenu');
    contentDiv.appendChild(contentTarget);


    // première ligne = volume avec slider 
    const para = document.createElement('p');
    para.textContent = 'Volume';
    contentTarget.appendChild(para);

    const slider = document.createElement('INPUT');
    slider.setAttribute('type', 'range');
    slider.id = 'volume-control';
    slider.addEventListener('change', function(e) {
        sample.volume = e.currentTarget.value / 100;
        options[0] = sample.volume;
        localStorage.setItem("options", JSON.stringify(options)); 
    });
    contentTarget.appendChild(slider);
};

//le tuto
function tutorialMenu() {

    //la fenêtre du menu
    const subMenuDiv = document.createElement('div');
    subMenuDiv.setAttribute('class', 'subMenu');
    subMenuDiv.setAttribute('id', 'subMenuDiv');
    tetrisJS.appendChild(subMenuDiv);

    //bouton fermer
    const closeBtn = document.createElement('button');
    closeBtn.setAttribute('id', 'closeBtn');
    closeBtn.textContent = 'Retour';
    closeBtn.addEventListener('click', () => { 
        if ( game == true ) { 
            pauseMod(); 
        } else {
            subMenuDiv.remove();
        };
    });
    subMenuDiv.appendChild(closeBtn);

    const para = document.createElement('p');
    para.textContent = 'Utilisez les flèches directionnelles pour bouger les pièces de Tetris. Haut pour pivoter, et Bas pour accélèrer. La touche "0" du clavier numérique permet de garder la pièce actuelle pour la rejouer plus tard.';
    subMenuDiv.appendChild(para);

    const br = document.createElement('br');
    subMenuDiv.appendChild(br);

    const para2 = document.createElement('p');
    para2.textContent = 'Il faut faire des lignes complète pour gagner des points. Essayez de faire plusieurs lignes d\'un coup pour faire plus de point d\'un coup.';
    subMenuDiv.appendChild(para2);
};

//le contenu qui apparait dans subMenu>contentDiv (espace réservé au contenu modulable)
function scoreTab(updateScoreBol) {

    const contentTarget = document.getElementById('subMenuContentDiv');

    //vide la page et lui attribue la bonne classe
    contentTarget.setAttribute('class','scoreTable');

    //on récupère le tableau des scores stocker dans localStorage sous forme de string
    let scoreTable = JSON.parse(localStorage.getItem('scoreTableData'));
    //if ( scoreTable ==  null ) { scoreTable = [['Score','User', 'rank'],[[], [], []], [[], [], []], [[], [], []], [[], [], []], [[], [], []]]; };
    if ( scoreTable ==  null ) { scoreTable = [['Score','User', 'rank']]; };
    if ( scoreTable.length > 6 ) { scoreTable = scoreTable.splice(0,5); };
    

    if ( updateScoreBol == true ) {
        //récupère le nom d'utilisateur
        let userName;
        userName = localStorage.getItem('userNameTetrisJSData');
        if ( userName  == null ) { userName = 'No name'; };

        //on pousse les données dans l'array, qu'on poussera ensuite dans scoreTable une fois complet
        let newData = [];
        let check = false;
        newData.push(score);
        newData.push(userName);
        newData.push(1);
        
        //met à jour le tableau 
        for ( let i = 1; i < 6; i++ ) {
            if ( scoreTable[i] == undefined && check == false ) { 
                scoreTable.push(newData); 
                check = true; 
            } else if ( scoreTable[i] == undefined || scoreTable[i] == null ) { 
                continue; 
            } else 

            if ( (score >= scoreTable[i][0] && check == false) || (scoreTable[i][0] == undefined && check == false) ) { 
                scoreTable.splice(i,0,newData); //on le pousse dans scoreTable
                check = true;
            };
        };

        for ( let i = 1; i < 6; i++ ) {
            if ( scoreTable[i] != null || scoreTable[i] != undefined ) { scoreTable[i].splice(2,1,i); };
        };

        if ( scoreTable.length > 6 ) { scoreTable.pop(); };

        //supprime l'ancien tableau et renvoit nouveau dans la DB
        localStorage.removeItem("scoreTableData");
        localStorage.setItem("scoreTableData", JSON.stringify(scoreTable)); 
    };

    //display le tableau des scores
    for ( let i = 0; i < 6; i++ ) {
        for ( let j = 0; j < 3; j++ ) {
            if ( i == 0 ) { 
                const h3 = document.createElement('h3'); 
                h3.textContent = scoreTable[i][j];
                contentTarget.appendChild(h3);
            } else { 
                if ( scoreTable[i] == undefined || scoreTable[i] == null ) { continue; }
                const para = document.createElement('p');
                para.textContent = scoreTable[i][j];
                contentTarget.appendChild(para);
            };
        };
    };
};

//mode pause quand on appuit sur espace
function pauseMod() {
    let ctx = document.getElementById(`gameBox`).getContext('2d');

    if ( pause == false ) {
        clearInterval(timer); 
        clearInterval(horlogeID);
        pause = true;
        //ctx.font = "40px Arial";
        //ctx.strokeText("PAUSE", 100, 800); 
        pauseMenu2();
        //subMenuOpen = true;
        console.log('Pause on');

    } else {
        timer = setInterval(gameLoop, timerMs);// sert à tick le plateau toutes les demi secondes 
        horlogeID = setInterval(setTime, 1000);
        pause = false;
        //subMenuOpen =  false;
        //ctx.fillStyle = 'rgb(29, 68, 175)';
        //ctx.fillRect(80, 750, 200, 200);
        document.getElementById('subMenuDiv').remove();
        console.log('Pause off')
    };
};

//enregistre l'utilisateur
function registerUser() {
    let person = prompt("Please enter your name", " ");
    let text;
    if (person == null || person == "") {
      text = "User cancelled the prompt.";
      if ( userName == null ) { 
        person = "HP LoveCraft";  
    } else { 
        person = userName; };
    };
    
    userName = person;
    document.getElementById('menuBtn-login').textContent = `${userName}`;
    localStorage.setItem('userNameTetrisJSData',userName);
};

//fait tomber la piece dans le menu animation
function tetrominoesFall(piece,couleur) {

    //on efface la pièce à la position précèdente 
    for ( l = 0; l < 40; l++ ) {
        for ( c = 0; c < 20; c++ ) {
            menuAnimationGridDisplay[l][c] = 0;
            document.getElementById(`${l} ${c}`).style.backgroundColor = 'rgba(255,0,0,0)';
            document.getElementById(`${l} ${c}`).style.border = 'none';  
        };
    }; 

    //on descend d'une case
    animationY++;
    animationX = animationX;

    // et on redessine
    drawTetrominoes(piece,couleur,animationX,animationY);
};

//génère une nouvelle pièce
function randomPiece(firepcsBol) {
    let rdm = Math.floor(Math.random() * tetrominoes.length );
    let rdmPcs = nextPiece;
    nextPiece = tetrominoes[rdm];
    requestAnimationFrame(drawNextPiece);
    //let rdmPcs = Math.floor(Math.random() * tetrominoes.length );
    //return new Piece( tetrominoes[rdmPcs][0], tetrominoes[rdmPcs][1]);
    if ( firepcsBol == undefined ) { firepcsBol = true ; };

    if ( firepcsBol == true ) { 
        return new Piece( rdmPcs[0], rdmPcs[1]);
    };
    
};

//dessine la prochaine pièce
function drawNextPiece() {
    let ctx = document.getElementById(`gameBox`).getContext('2d');

    //nettoie la zone qui affiche la prochaine piece 
    ctx.fillStyle = 'rgb(23, 125, 184)'; 
    ctx.strokeStyle = 'white';
    ctx.fillRect(60, 160, 200, 200);
    ctx.strokeRect(60, 160, 200, 200);

    for ( l = 0; l < nextPiece[0][0].length; l++ ) {
        for ( c = 0; c < nextPiece[0][0].length; c++ ) {
            if( nextPiece[0][0][l][c] ) {
                drawSquare( 2+ c, 5+ l, nextPiece[1] );
            };
        };
    };
};

//génère une nouvelle pièce
function randomPiece2(type,color) {
    let rdmPcs = Math.floor(Math.random() * tetrominoes.length );
    piece.unDraw();

    if ( type == undefined || color == undefined ) { 
        piece = new Piece( tetrominoes[rdmPcs][0], tetrominoes[rdmPcs][1]);
    } else {
        piece = new Piece( type, color);
        piece.draw();
    };
    
    return piece;
};

//hold la piece active
function hold2() {

    let temp;
    if ( holdSlot == true && holdPcsUse == 1 ) { 
        temp = holdPcs;
        holdPcs = piece;
        piece = randomPiece2(temp.tetromino, temp.color);
        holdPcsUse--;
        requestAnimationFrame(drawNextPiece);
        requestAnimationFrame(drawHoldNextPiece2);
    } else if ( holdSlot == false && holdPcsUse == 1 ) {
        holdPcs = piece;
        holdSlot = true;
        holdPcsUse--;
        randomPiece2();
        requestAnimationFrame(drawHoldNextPiece2);
    };


};
//dessine la prochaine pièce
function drawHoldNextPiece2() {
    let ctx = document.getElementById(`gameBox`).getContext('2d');

    //nettoie la zone qui affiche la prochaine piece 
    ctx.fillStyle = 'rgb(23, 125, 184)'; 
    ctx.strokeStyle = 'white';
    ctx.fillRect(60, 425, 200, 200);
    ctx.strokeRect(60, 425, 200, 200);

    if ( holdSlot == true ) { 
        for ( l = 0; l < holdPcs.tetromino[0].length; l++ ) {
            for ( c = 0; c < holdPcs.tetromino[0].length; c++ ) {
                if( holdPcs.tetromino[0][l][c] ) {
                    drawSquare( 2+ c, 12+ l, holdPcs.color );
                };
            };
        };
    };
};

//gameover
function gameOver() {
    //met le jeu en pause
    //pauseMod();
    game = false;
    endGameMenu();
    clearInterval(timer);
    console.log('Fin du jeu');
    



};

//difficulty level
function difficulty() {

    if ( score >= 10000 && niveau == 0 ) { 
        niveau++; 
        timerMs = 950; 
        requestAnimationFrame(drawScoreNinfos); 
        clearInterval(timer); 
        timer = setInterval(gameLoop, timerMs);
    };

    if ( score >= 20000 && niveau == 1 ) { 
        niveau++; 
        timerMs = 900; 
        requestAnimationFrame(drawScoreNinfos); 
        clearInterval(timer);
        timer = setInterval(gameLoop, timerMs);
    };

    if ( score >= 40000 && niveau == 2 ) { 
        niveau++; 
        timerMs = 850; 
        requestAnimationFrame(drawScoreNinfos); 
        clearInterval(timer);
        timer = setInterval(gameLoop, timerMs);
    };

    if ( score >= 80000 && niveau == 3 ) { 
        niveau++; 
        timerMs = 800; 
        requestAnimationFrame(drawScoreNinfos);
        clearInterval(timer);
        timer = setInterval(gameLoop, timerMs);
    };

    if ( score >= 160000 && niveau == 4 ) { 
        niveau++; 
        timerMs = 750; 
        requestAnimationFrame(drawScoreNinfos);
        clearInterval(timer);
        timer = setInterval(gameLoop, timerMs);
    };

    if ( score >= 320000 && niveau == 5 ) { 
        niveau++; 
        timerMs = 700; 
        requestAnimationFrame(drawScoreNinfos); 
        clearInterval(timer);
        timer = setInterval(gameLoop, timerMs);
    };
};

//calcul des score
function scoreUpdate(nbrrowvalid) {

    score += 100; //augmentation normale par ligne

    score += (niveau*100); //bonus pour la difficulté

    if ( nbrrowvalid > 1 ) { //bonus combo pour chaque ligne en plus de 1
        score += (nbrrowvalid*200);
    };

    difficulty();
     

};

// TIMER
function setTime() {
    ++totalSeconds;
    secondsLabel = pad(totalSeconds % 60);
    minutesLabel = pad(parseInt(totalSeconds / 60));
};
  
function pad(val) {
    var valString = val + "";
    if (valString.length < 2) {
      return "0" + valString;
    } else {
      return valString;
    }
};

//constructeur de pièce
function Piece(type,color) { 

    this.tetromino = type;
    this.tetrominoN = 0;
    this.activeTetromino = this.tetromino[this.tetrominoN],
    this.color = color;
    this.x = 3;
    this.y = -2;

};

Piece.prototype.draw = function() {
    for ( l = 0; l < this.activeTetromino.length; l++ ) {
        for ( c = 0; c < this.activeTetromino.length; c++ ) {
            if( this.activeTetromino[l][c] ) {
                drawSquare( 8+ this.x + c, 4+ this.y + l, this.color );
            };
        };
    };
};

Piece.prototype.unDraw = function() {
    for ( l = 0; l < this.activeTetromino.length; l++ ) {
        for ( c = 0; c < this.activeTetromino.length; c++ ) {
            if( this.activeTetromino[l][c] ) {
                drawSquare( 8+ this.x + c, 4+ this.y + l, VIDE, 'white' );
            };
        };
    };
};

Piece.prototype.moveDown = function() {
    if ( !this.collision(0, 1, this.activeTetromino) ) {
        if ( this.y >= -1 ) { this.unDraw(); };
        this.y++;
        this.draw();
    } else {
        this.lock();
        piece = randomPiece();;
        if ( holdPcsUse == 0 ) { holdPcsUse++; };
    };
};

Piece.prototype.moveLeft = function() {
    if ( !this.collision(-1, 0, this.activeTetromino) ) {
        this.unDraw();
        this.x--;
        this.draw();
    };
};

Piece.prototype.moveRight = function() {
    if ( !this.collision(1, 0, this.activeTetromino) ) {
        this.unDraw();
        this.x++;
        this.draw();
    };
};

Piece.prototype.rotate = function() {
    let prochaineForme = this.tetromino[ ( this.tetrominoN + 1 ) % this.tetromino.length];
    let kick = 0;

    if ( !this.collision(0, 0, prochaineForme ) ) {
        if ( this.x > COLONNE/2 ) { kick = -1; } else { kick = 1; };
    };

    if ( !this.collision(0, 0, prochaineForme ) ) {
        this.unDraw();
        this.tetrominoN = ( this.tetrominoN + 1 ) % this.tetromino.length;
        this.activeTetromino = this.tetromino[this.tetrominoN];
        this.draw();
    };
};

Piece.prototype.collision = function(x, y, piece) {
    for ( l = 0; l < piece.length; l++ ) {
        for ( c = 0; c < piece.length; c++ ) {
            if ( !piece[l][c] ) { continue; };

            let newX = this.x + c + x ;
            let newY = this.y + l + y ;

            if ( newX < 0 || newX >= COLONNE || newY >= LIGNE ) { return true; } else
            if ( newY < 0 ) { continue; } //else
            if ( plateau[newY][newX] != VIDE ) { return true; };
        };
    };
};

Piece.prototype.lock = function() {
    for ( l = 0; l < this.activeTetromino.length; l++ ) {
        for ( c = 0; c < this.activeTetromino.length; c++ ) {
            if ( !this.activeTetromino[l][c] ) { continue; };
            if ( this.y + l < 0 ) {
                gameOver();
                break;
            };

            plateau[this.y + l][this.x + c] = this.color;
        };
    };

    //efface et compte les lignes complète
    let nombreDeLignes = 0;

    for ( l = 0; l < LIGNE; l++ ) {
        let ligneComplete = true;
        for ( c = 0; c < COLONNE; c++ ) {
            ligneComplete = ligneComplete && (plateau[l][c] != VIDE);
        };

        if (ligneComplete){
            nombreDeLignes++;

            for ( y = l; y > 1; y-- ) {
                for ( c = 0; c < COLONNE; c++) { plateau[y][c] = plateau[y-1][c]; };  
            }; 

            for ( c = 0; c < COLONNE; c++) { plateau[0][c] = VIDE; };

            scoreUpdate(nombreDeLignes);
            requestAnimationFrame(drawScoreNinfos);
        };
    };
    drawBoard();
};

document.addEventListener('keydown', CONTROL );
function CONTROL(event) {

    if ( event.keyCode == 37 ) { piece.moveLeft(); //gauche
    } else if ( event.keyCode == 39 && game == true ) { piece.moveRight(); //droite
    } else if ( event.keyCode == 40 && game == true ) { piece.moveDown(); //bas
    } else if ( event.keyCode == 38 && game == true ) { piece.rotate(); 
    } else if ( event.keyCode == 32 && game == true ) { 
        pauseMod();
    } else if ( event.keyCode == 96 && game == true ) { 
        hold2();
    };
};

function gameLoop() {
    if ( game == false ) { return; };
    requestAnimationFrame(drawScoreNinfos);
    requestAnimationFrame(drawNextPiece);
    piece.moveDown();
};

function audio(trackID,btnID) { //sert à lire une piste audio
    if ( audioOnOff == false ) {
        sample = document.getElementById(trackID); 
        sample.volume = options[0];
        sample.play(); 
        audioOnOff = true;
        if ( btnID != undefined ) { document.getElementById(`${btnID}`).style.backgroundImage = 'url(image/audioOn.png)'; }; 
    } else {
        audioOnOff = false;
        if ( btnID != undefined ) { document.getElementById(`${btnID}`).style.backgroundImage = 'url(image/audioOff.png)'; };
        sample.pause();
    }
}

const track1 = document.createElement('audio'); // ecran d'accueil
track1.src = 'son/Chiptronical.ogg';
track1.id = 'accueil';
track1.loop = true;
tetrisJS.appendChild(track1);

const track2 = document.createElement('audio'); // ingame
track2.src = 'son/Tetris.mp3';
track2.id = 'theme';
track2.loop = true;
tetrisJS.appendChild(track2);
