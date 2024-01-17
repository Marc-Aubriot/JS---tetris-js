/*  PROJET 3 - TETRIS avec API CANVA
/
/   RECAP : construire un tétris avec l'api canva, il doit être déployable dynamiquement dans un div ciblé 
/   - il faut un un menu avec login, accès aux scores, options (musique etc), commencer le jeu, un tuto
/   - dans le jeu il faut une fenêtre de jeu, une fenêtre qui annonce la prochaine pièce, un compteur de ligne, un score, un compteur
/   de niveau de difficulté, une fenêtre 'hold' qui permet de retenir une pièce pour utiliser plus tard, un timer 
/   - il faut un menu pause, avec options, recommencer, continuer, tutorial
/   - il faut un menu game over avec recommencer, score 
/
/   1 - Créer les différentes fenètres et interfaces
/       A - le div conteneur (#tetrisJSBox) => 
/                           le menu (#menuBox) => loginBtn (#menuBtn-login), scoreBtn (#menuBtn-scores), optionsBtn (#menuBtn-options), jouerBtn (#menuBtn-play), tutoBtn (#menuBtn-tuto)
/                           la fenetre de jeu (#gameBox) en canvas =>  4 zones : hold pcs, tetris, next pcs et score
/       B - attribuer les classes aux éléments créer 
/       C - créer le menu (#menuBox) avec le bouton qui lance le jeu jouerBtn (#menuBtn-play)
/
/   2 - Créer la fenêtre de jeu et le jeu avec canva
/       A - dessiner la fenêtre de jeu, et la représenter avec un array tetrisBoxArray
/       B - dessiner les pièces, et les représenter avec des array ( O , I , S , Z , L , J , T )
/       C - Créer le mouvement des pièces avec requestanimationframe() 1tick/1sec
/       D1 - stocker les mouvements dans un array pour détection
/       D2 - détecter quand les pièces touchent le fond ou une autre pièce puis passer à la pièce suivante
/       D3 - Créer la fonction validerLignes() qui validera et effacera la ligne et donnera des points
/       E - afficher les pièces dans nextDiv (#gameboxDiv-next)
/       F - afficher les scores dans scoreDiv (#gameboxDiv-score)
/       G - créer une fonction holdPcs() qui permet de garder une pièce et display dans holdDiv (#gameboxDiv-hold)
/
/   3 - Créer les fonctions annexes pauseGame() et gameOver()
/       A - créer pauseGame() qui met le jeu en pause et affiche le menu pause (#pauseBox)
/       B - créer gameOver() qui met fin au jeu et affiche le game over (#gameoverBox)
/       C - le menu pause (#pauseBox) => optionsBtn (#pauseboxBtn-options), recommencerBtn (#pauseboxBtn-replay), continuerBtn (#pauseboxBtn-continue), tutorialBtn (#pauseboxBtn-tuto)
/       D - le game over (#gameoverBox) => recommencerBtn (#gameoverBox-replay), scoreDisplayDiv (#gameoverBox-scores)

/   4 - Créer les boutons annexes dans le menu (#menuBox) et les menus associés
/       A - pour connecter le joueur avec loginBtn (#menuBtn-login) et un simple formulaire
/       B - pour afficher l'écran des scores avec scoreBtn (#menuBtn-scores) et son display scoreDisplayDiv (#scoreBox)
/       C - pour afficher les options avec optionsBtn (#menuBtn-options) et son display optionsDisplayDiv (#optionsBox)
/       D - pour afficher le tutorial avec tutoBtn (#menuBtn-tuto) et son display tutoDisplayDiv (#tutoBox)
/
/   5 - réorganiser le code
/   6 - optimiser le code (function use arguments plutot que des variables globales)
*/

const tetrisJS = document.querySelector('#tetrisJSBox'); // on commence par target le div dans lequel on va créer le jeu
tetrisJS.setAttribute('class','tetrisJSBox');

function ouvrirMenu() { // on créer la box du menu qui contiendra 5 boutons
    const menuTetrisJS = document.createElement('div');
    menuTetrisJS.setAttribute('id', 'menuBox');
    menuTetrisJS.setAttribute('class','menuBox');
    tetrisJS.appendChild(menuTetrisJS);

    const title = document.createElement('h1');
    title.textContent = 'TETRIS JS';
    menuTetrisJS.appendChild(title);

    const ul = document.createElement('ul');
    menuTetrisJS.appendChild(ul);

    const li1 = document.createElement('li');
    ul.appendChild(li1);

    const jouerBtn = document.createElement('button');
    jouerBtn.textContent = 'Jouer';
    jouerBtn.setAttribute('class', 'bouton');
    jouerBtn.setAttribute('id','menuBtn-play');
    jouerBtn.addEventListener('click', function() { ouvrirJeu(); menuTetrisJS.remove(); logiqueLoop(); animationLoop(); });
    li1.appendChild(jouerBtn);

    const li2 = document.createElement('li');
    ul.appendChild(li2);

    const tutoBtn = document.createElement('button');
    tutoBtn.textContent = 'Tutorial';
    tutoBtn.setAttribute('class', 'bouton');
    tutoBtn.setAttribute('id','menuBtn-tuto');
    li2.appendChild(tutoBtn);

    const li3 = document.createElement('li');
    ul.appendChild(li3);

    const optionsBtn = document.createElement('button');
    optionsBtn.textContent ='Options';
    optionsBtn.setAttribute('class', 'bouton');
    optionsBtn.setAttribute('id','menuBtn-options');
    li3.appendChild(optionsBtn);

    const li4 = document.createElement('li');
    ul.appendChild(li4);

    const scoreBtn = document.createElement('button');
    scoreBtn.textContent = 'Score';
    scoreBtn.setAttribute('class', 'bouton');
    scoreBtn.setAttribute('id','menuBtn-scores');
    li4.appendChild(scoreBtn);

    const li5 = document.createElement('li');
    ul.appendChild(li5);

    const loginBtn = document.createElement('button');
    loginBtn.textContent = 'User';
    loginBtn.setAttribute('class', 'bouton');
    loginBtn.setAttribute('id','menuBtn-login');
    li5.appendChild(loginBtn);

    console.log('ouvrirMenu OK');
};
ouvrirMenu(); //on appelle la fonction une première fois

function randomNumber(number) { // génère un nombre aléatoire
    return Math.floor(Math.random()*number );
};

function radtodegree(degree) { // converti les degrées en radians
    var number = (degree * Math.PI / 180);
    return number;

};

document.addEventListener('keydown', keyLog, false); // KEYBOARD SUPPORT
function keyLog(e) { 
    let keyCode = e.keyCode;

    if ( keyCode === 37 ) {  //gauche : deplace le tetromino
        if ( x >= 275 && lock != true ) {
            if ( Xcount == 1 && (form[0][0] == 1 || form[1][0] == 1 || form[2][0] == 1) ) {
                return;
            } else {
                if  ( checkCollision('gauche') == false ) { return; };
                x = x - 50; 
                Xcount--; 
                updateTetrisBoxArray(); 
            };
        };
    };

    if ( keyCode === 39 ) { // droite : deplace le tetromino
        if ( x <= 625 && lock != true) {
            if ( ( Xcount == 9 && (form[0][2] == 1 || form[1][2] == 1 || form[2][2] == 1) ) //check le bord droit
            || ( Xcount == 8 && (form[0][2] == 1 || form[1][2] == 1 || form[2][2] == 1) )  
            || ( tetromino.name === 'I' && Xcount == 7 && (form[0][3] == 1 || form[1][3] == 1 || form[2][3] == 1 || form[3][3] == 1) ) //check le tetromino 'I'
            ) { 
                return;
            } else {
                if  ( checkCollision('droite') == false ) { return; };
                x = x + 50; Xcount++; updateTetrisBoxArray(); 
            };
        };
    }; 

    if ( keyCode === 38 ) { // haut : rotation du tetromino

        if ( ( Xcount == 9 && (form[0][0] == 1 || form[0][1] == 1 || form[0][2] == 1) ) //check bord droit
        || ( Xcount == 0 && (form[2][0] == 1 || form[2][1] == 1 || form[2][2] == 1) ) && lock != true ) { //check bord gauche
            return;
        } else {
            if ( tetrominoRotate != 3 ) {
                tetrominoRotate++; 
            } else { 
                tetrominoRotate = 0 ; form = tetromino.form1; 
            };

            if ( tetrominoRotate == 1 ) { //check la forme correcte du tetromino en fonction des rotations de 90°
                form = tetromino.form2;
                updateTetrisBoxArray(); 
            } else if ( tetrominoRotate == 2 ) {
                form = tetromino.form3;
                updateTetrisBoxArray(); 
            } else if ( tetrominoRotate == 3 ) {
                form = tetromino.form4;
                updateTetrisBoxArray(); 
            } else {
                form = tetromino.form1;
                updateTetrisBoxArray(); 
            };
    };

    }; 
    
    if ( keyCode === 40 ) { // bas : descend de 1 case
        if ( y <= 825 && Ycount <= 20 && lock != true ) {  
            clearTimeout(timeoutLogiqueLoop);
            logiqueLoop(); 
        };
    };
};

// ============================================================================================================================
var tetrisBoxArray = [];
for (let y = 0; y <= 20; y++) {
    tetrisBoxArray[y] = new Array();
    for (let x = 0; x <10; x++) {
        tetrisBoxArray[y][x] = new Array();
        tetrisBoxArray[y][x] = 0;

        if ( y == 20 ) { tetrisBoxArray[y][x] = 2; }
    };
};

var tetrominoes = [
{
    name:  'O',
    form1:
    [   [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0],
    ],
    form2:
    [   [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0],
    ],
    form3:
    [   [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0],
    ],
    form4:
    [   [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0],
    ],
    couleur: 'yellow', 
    currentForm: 
    [   [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0],
    ],
    coordx: 0,
    coordy: 0,
    Xcount: Xcount,
    Ycount: Ycount,
}, 
{
    name:  'I',
    form1:
    [   [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ],
    form2:
    [   [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
    ],
    form3:
    [   [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ],
    form4:
    [   [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
    ],
    couleur: 'green',
    currentForm:
    [   [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ],
    coordx: 0,
    coordy: 0,
    Xcount: Xcount,
    Ycount: Ycount,
},
{
    name:  'S',
    form1:
    [   [0, 0, 0],
        [0, 1, 1],
        [1, 1, 0],
    ],
    form2:
    [   [1, 0, 0],
        [1, 1, 0],
        [0, 1, 0],
    ],
    form3:
    [   [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
    ],
    form4:
    [   [0, 1, 0],
        [0, 1, 1],
        [0, 0, 1],
    ],
    couleur: 'red',
    currentForm: 
    [   [0, 0, 0],
        [0, 1, 1],
        [1, 1, 0],
    ],
    coordx: 0,
    coordy: 0,
    Xcount: Xcount,
    Ycount: Ycount,
},
{
    name:  'Z',
    form1:
    [   [0, 0, 0],
        [1, 1, 0],
        [0, 1, 1],
    ],
    form2:
    [   [0, 1, 0],
        [1, 1, 0],
        [1, 0, 0],
    ],
    form3:
    [   [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
    ],
    form4:
    [   [0, 0, 1],
        [0, 1, 1],
        [0, 1, 0],
    ],
    couleur: 'orange',
    currentForm: 
    [   [0, 0, 0],
        [1, 1, 0],
        [0, 1, 1],
    ],
    coordx: 0,
    coordy: 0,
    Xcount: Xcount,
    Ycount: Ycount,
},
{
    name:  'L',
    form1:
    [   [0, 0, 0],
        [1, 1, 1],
        [1, 0, 0],
    ],
    form2:
    [   [1, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
    ],
    form3:
    [   [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
    ],
    form4:
    [   [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1],
    ],
    couleur: 'purple',
    currentForm:
    [   [0, 0, 0],
        [1, 1, 1],
        [1, 0, 0],
    ],
    coordx: 0,
    coordy: 0,
    Xcount: Xcount,
    Ycount: Ycount,
},
{
    name:  'J',
    form1:
    [   [0, 0, 0],
        [1, 1, 1],
        [0, 0, 1],
    ],
    form2:
    [   [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0],
    ],
    form3:
    [   [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
    ],
    form4:
    [   [0, 1, 1],
        [0, 1, 0],
        [0, 1, 0],
    ],
    couleur: 'pink',
    currentForm:
    [   [0, 0, 0],
        [1, 1, 1],
        [0, 0, 1],
    ],
    coordx: 0,
    coordy: 0,
    Xcount: Xcount,
    Ycount: Ycount,
},
{
    name:  'T',
    form1:
    [   [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0],
    ],
    form2:
    [   [0, 1, 0],
        [1, 1, 0],
        [0, 1, 0],
    ],
    form3:
    [   [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
    ],
    form4:
    [   [0, 1, 0],
        [0, 1, 1],
        [0, 1, 0],
    ],
    couleur: 'blue',
    currentForm: 
    [   [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0],
    ],
    coordx: 0,
    coordy: 0,
    Xcount: Xcount,
    Ycount: Ycount,
}
];

var tetrominoRotate = 0;
var x; //x s'update quand on bouge de chaque côté, 
var y; //y s'update à chaque tick, ou quand on fait 'tomber' la pièce
var checkTetromino = false; // tetromino est actif ou non
var tetromino;
var timeoutLogiqueLoop;
var Ycount;
var Xcount;
var form;
var nextTetromino;
var lock = false;
var lockedTetromino = []; //sauvegarder les tetromino bloqués
var score = 0;

function ouvrirJeu() { // on créer le canvas de jeu, qui contiendra 4 zones 
    const gameboxTetrisJS = document.createElement('canvas'); //déclaration et setup du canvas
    gameboxTetrisJS.setAttribute('id', 'gameBox');
    gameboxTetrisJS.setAttribute('class','gameBox');
    gameboxTetrisJS.width = 800;
    gameboxTetrisJS.height = 1000;
    tetrisJS.appendChild(gameboxTetrisJS);

    const ctx = gameboxTetrisJS.getContext('2d'); //le canvas se place dans un contexte 2D

    ctx.fillStyle = 'rgb(29, 68, 175)'; //dessine l'écran de jeu bleu
    ctx.fillRect(0, 0, 800, 1000);

    ctx.fillStyle = 'rgb(23, 125, 184)'; //la zone de tetris
    ctx.strokeStyle = 'white';
    ctx.fillRect(275, 175, 500, 800); // un rectangle 500px / 800px avec 275px de marge left/top et 25px right/bot
    ctx.strokeRect(275, 175, 500, 800);

    //ctx.fillStyle = 'black'; //la zone des scores et information
    ctx.fillRect(25, 25, 750, 125);  //un rectangle 750px / 125px avec 25px de marge
    ctx.strokeRect(25, 25, 750, 125);

    //ctx.fillStyle = 'black'; //la zone de next pcs
    ctx.fillRect(25, 175, 175, 225);
    ctx.strokeRect(25, 175, 175, 225);

    //ctx.fillStyle = 'black';  //la zone de hold pcs
    ctx.fillRect(25, 425, 175, 225);
    ctx.strokeRect(25, 425, 175, 225);

    ctx.save(); //sauvegarde la page de jeu

    console.log('ouvrirJeu OK');
};

function logiqueLoop() { //le programme
    tetrominoSpawn(); //check si checkTetromino = false spawn un nouveau et checkTetromino = true, lock = false

    tetrominoFall(); // descend le tetromino à chaque tick si lock = false

    updateTetrisBoxArray(); //update la position du tetromino dans l'array

    checkCollision('bas'); //check si collision lock=true

    lockTetromino();  //si lock = true, alors checkTetromino = false et lock le tetromino dans l'array

    const lignesASupprimer = validerLigne(); //check les lignes à valider et retourne le numero de ligne dans un array

    if ( lignesASupprimer => 0 ) { supprimerLigne(lignesASupprimer); }; //si il y'a des lignes, envoit l'array pour les supprimer

   
    

    timeoutLogiqueLoop = setTimeout( () => { logiqueLoop(); }, 1000); //relance le timer
};

function animationLoop() { //anime le canvas
    drawTetrisBox(); //dessine la tetrisbox
    drawTetrominoes(); //dessine le tetromino
    drawLockedTetrominoes(); //dessine les tetromino bloqués

    requestAnimationFrame(animationLoop);
};

// LOGIQUE LOOP
function checkCollision(direction) { //check la collision (input: 'bas', 'gauche', 'droite') (output: lock=true, false, false)

    if ( direction == 'bas' ) { //check une collision en bas
        for ( let i = 0; i < tetrisBoxArray.length; i++ ) { 
            for ( let j = 0; j < tetrisBoxArray[i].length; j++ ) {
                if ( tetrisBoxArray[i][j] === 1 && tetrisBoxArray[i+1][j] === 2 && lock != true ) { // si le tetromino n'est pas lock
                    lock = true; // lock le tetromino actif en place
                    console.log('Collision bas - Lock en place');  
                };
            };
        };
    };
    
    if ( direction == 'gauche') { //check une collision à gauche
        for ( let i = 0; i < tetrisBoxArray.length; i++ ) { 
            for ( let j = 0; j < tetrisBoxArray[i].length; j++ ) {
                if ( tetrisBoxArray[i][j] === 1 && tetrisBoxArray[i][j-1] === 2 ) { 
                    console.log('Collision gauche');
                    return false;
                };
            };
        };
    };

    if ( direction == 'droite') { //check une collision à droite
        for ( let i = 0; i < tetrisBoxArray.length; i++ ) { 
            for ( let j = 0; j < tetrisBoxArray[i].length; j++ ) {
                if ( tetrisBoxArray[i][j] === 1 && tetrisBoxArray[i][j+1] === 2 ) { 
                    console.log('Collision droite');
                    return false;
                };
            };
        };
    };
    
};

function lockTetromino() { //lock le tetromino en place et génère un nouveau tetromino si collision
    if ( lock == true ) { //passe tout les 1 en 2 (carré bloqué)
        for ( let i = 0; i < tetrisBoxArray.length; i++ ) { 
            for ( let j = 0; j < tetrisBoxArray[i].length; j++ ) {
                if ( tetrisBoxArray[i][j] == 1 ) { tetrisBoxArray[i][j] = 2; };
            };
        };

        //sauvegarde la forme et les coordonnées 
        tetromino.currentForm = form;
        tetromino.coordx = x;
        tetromino.coordy = y;
        tetromino.Xcount = Xcount;
        tetromino.Ycount = Ycount;

        //clone le tetromino et l'injecte dans l'array des pièces bloquées
        const clone = structuredClone(tetromino); 
        lockedTetromino.push(clone);

        // permet de génèrer un nouveau tetromino
        checkTetromino = false;  

        console.log(`Tetromino fini. x${Xcount}(${x}) y${Ycount}(${y}) `);
    };
};

function tetrominoSpawn() { //check si il faut spawn un tetromino, reset les variables et le timer de descente
    if ( checkTetromino != true ) { //appelle un nouveau tetromino et initie la descente
        nextTetromino = tetrominoes[randomNumber(tetrominoes.length-1)];
        tetromino = tetrominoes[randomNumber(tetrominoes.length)];
        
        form = tetromino.form1;
        tetrominoRotate = 0;
        checkTetromino = true;
        y = 135;
        x = 425;
        
        console.log(tetrisBoxArray);
        Ycount = 0;
        Xcount = 4;
        lock = false;
        console.log(`Nouveau tetromino! '${tetromino.name}' x${Xcount} y${Ycount}`);
    }
};

function tetrominoFall() { // descend le tetromino à chaque tick 
    //if ( lock != true ) {
        //if ( y <= 1000 ) { y = y + 40; } // descend d'une case dans la canvas 825/865
        //if ( Ycount <= 25 ) { Ycount++; } // descend d'une case dans l'array 19
    //}
    y = y + 40;
    Ycount++;

};

function updateTetrisBoxArray() { //update la position du tetromino dans l'array
    //  X min max = 0 9  / Y min max = 1 19

    for ( let i = 0; i < tetrisBoxArray.length; i++ ) { // clean l'array
        for ( let j = 0; j < tetrisBoxArray[i].length; j++ ) {
            if ( tetrisBoxArray[i][j] == 1) { tetrisBoxArray[i][j] = 0; };
        };
    };
    
    for ( let i = 0; i < tetrisBoxArray.length; i++ ) { // insère le tetromino en fonction de ses coordonnées 
        for ( let j = 0; j < tetrisBoxArray[i].length; j++ ) {
            if ( j == Xcount && i == Ycount ) { //quand l'array itère la case ou se situe X et Y
                
                
                if ( form[0][0] != 0 && tetrisBoxArray[i-1][j-1] != 2 ) { tetrisBoxArray[i-1][j-1] = form[0][0]; };
                if ( form[0][1] != 0 && tetrisBoxArray[i-1][j] != 2 ) { tetrisBoxArray[i-1][j] = form[0][1]; };
                if ( form[0][2] != 0 && tetrisBoxArray[i-1][j+1] != 2 ) { tetrisBoxArray[i-1][j+1] = form[0][2]; };
                if ( tetromino.name === 'I' && form[0][3] != 0 && tetrisBoxArray[i-1][j+2] != 2) { tetrisBoxArray[i-1][j+2] = form[0][3]; };

                if ( form[1][0] != 0 && tetrisBoxArray[i][j-1] != 2 ) { tetrisBoxArray[i][j-1] = form[1][0]; };
                if ( form[1][1] != 0 && tetrisBoxArray[i][j] != 2 ) { tetrisBoxArray[i][j] = form[1][1]; };
                if ( form[1][2] != 0 && tetrisBoxArray[i][j+1] != 2 ) { tetrisBoxArray[i][j+1] = form[1][2]; };
                if ( tetromino.name === 'I' && form[1][3] != 0 && tetrisBoxArray[i][j+2] != 2) { tetrisBoxArray[i][j+2] = form[1][3]; };

                if ( form[2][0] != 0 && tetrisBoxArray[i+1][j-1] != 2 ) { tetrisBoxArray[i+1][j-1] = form[2][0]; };
                if ( form[2][1] != 0 && tetrisBoxArray[i+1][j] != 2 ) { tetrisBoxArray[i+1][j] = form[2][1]; };
                if ( form[2][2] != 0 && tetrisBoxArray[i+1][j+1] != 2 ) { tetrisBoxArray[i+1][j+1] = form[2][2]; };
                if ( tetromino.name === 'I' && form[2][3] != 0 && tetrisBoxArray[i+1][j+2] != 2) { tetrisBoxArray[i+1][j+2] = form[2][3]; };

                
                if ( tetromino.name === 'I' && form[3][0] != 0 && tetrisBoxArray[i+2][j-1] != 2) { tetrisBoxArray[i+2][j-1] = form[3][0]; };
                if ( tetromino.name === 'I' && form[3][1] != 0 && tetrisBoxArray[i+2][j] != 2) { tetrisBoxArray[i+2][j] = form[3][1]; };
                if ( tetromino.name === 'I' && form[3][2] != 0 && tetrisBoxArray[i+2][j+1] != 2) { tetrisBoxArray[i+2][j+1] = form[3][2]; };
                if ( tetromino.name === 'I' && form[3][3] != 0 && tetrisBoxArray[i+2][j+2] != 2) { tetrisBoxArray[i+2][j+2] = form[3][3]; };
            };
        };
    };
};

function validerLigne() { // check si la ligne est pleine, augmente le score et retourne un array contenant les lignes valider
    let lignesValide = [];
    
    for ( let i = 0; i < tetrisBoxArray.length; i++ ) { // check si la ligne est pleine

        if ( tetrisBoxArray[i][0] == 2 && tetrisBoxArray[i][1] == 2 && tetrisBoxArray[i][2] == 2 && tetrisBoxArray[i][3] == 2 && tetrisBoxArray[i][4] == 2 && 
        tetrisBoxArray[i][5] == 2 && tetrisBoxArray[i][6] == 2 && tetrisBoxArray[i][7] == 2 && tetrisBoxArray[i][8] == 2 && tetrisBoxArray[i][9] == 2 
        && i != 20 ) {

            let ligne = i;
            lignesValide.push(ligne);

            score +=  100;
            //console.log(score);

        };
        
    };
    
    return lignesValide;
};

function supprimerLigne(lignesValiderASupprimer) {

    const ctx = document.getElementById(`gameBox`).getContext('2d');

    for ( ligne of lignesValiderASupprimer ) { // pour chaque ligne à supprimer

        let h = structuredClone(ligne);

        for ( h; h >= 0; h-- ) { //pour chaque ligne au dessus de la ligne à supprimer

            // remplit chaque case de la ligne a supprimer avec la valeur de la case du dessus
            for ( let i = 0; i < tetrisBoxArray[ligne].length; i++) { 
                
                tetrisBoxArray[ligne][i] = 0;
            
                // efface chaque case de la ligne sur le canva
                //ctx.fillStyle = 'rgb(23, 125, 184)';
                //ctx.fillRect(275, (175+(40+(ligne*40))), 50+(i*50), 40);
                //console.log('effacement');
            }; 

            

        };
        


        for ( tetro of lockedTetromino ) { //pour chaque tetromino bloqué
            
            // détermine l'index de la ligne a supprimer dans la forme du tetromino
            let index = ligne - tetro.Ycount;

            //si le tetromino est comprit entre la ligne a supprimer et 2 lignes au dessus ( un tetromino comprenant 3 lignes minimum )
            if ( (ligne -2 <= tetro.Ycount && tetro.Ycount <= ligne) || (tetro.name == 'I' && ligne -3 <= tetro.Ycount && tetro.Ycount <= ligne)) {

                //on peut donc supprimer la ligne dans la forme
                tetro.currentForm.splice(index, 1); 

                console.log(`splice nom-${tetro.name} ligne-${ligne} index-${index} pour tetroY-${Ycount}`);
                console.log(tetro.currentForm);
            };
        
        };
    };
};

// ANIMATION LOOP
function drawTetrisBox() { //dessine la tetrisbox

    const ctx = document.getElementById(`gameBox`).getContext('2d');

    ctx.clearRect(275, 175, 500, 800); //nettoie le canvas

    ctx.fillStyle = 'rgb(23, 125, 184)'; //peint en bleu clair
    ctx.strokeStyle = 'white'; //contour blanc
    ctx.fillRect(275, 175, 500, 800); //la zone de tetris
    ctx.strokeRect(275, 175, 500, 800); // un rectangle 500px / 800px avec 275px de marge left/top et 25px right/bot

};

function drawTetrominoes() { //dessine le tetromino

    const ctx = document.getElementById(`gameBox`).getContext('2d');


    for ( let i=0; i < form.length ; i++ ) {
        for ( let j=0; j < form[i].length ; j++ ) {
            if ( form[i][j] == 1 ) { 
                ctx.strokeStyle = 'black';
                ctx.fillStyle = tetromino.couleur;
                ctx.fillRect( ( x + ( j * 50 ) ) , ( y + ( i * 40 ) ) , 50, 40); 
                ctx.strokeRect( ( x + ( j * 50 ) ) , ( y + ( i * 40 ) ) , 50, 40); 
            };
        };
    };



};

function drawLockedTetrominoes() { //dessine les tetromino bloqués

    const ctx = document.getElementById(`gameBox`).getContext('2d');

    for ( tetro of lockedTetromino ) { 

        for ( let i=0; i < tetro.currentForm.length ; i++ ) {
            for ( let j=0; j < tetro.currentForm[i].length ; j++ ) {
                if ( tetro.currentForm[i][j] == 1 ) { 
                    ctx.strokeStyle = 'black';
                    ctx.fillStyle = tetro.couleur;
                    ctx.fillRect( ( tetro.coordx + ( j * 50 ) ) , ( tetro.coordy + ( i * 40 ) ) , 50, 40); 
                    ctx.strokeRect( ( tetro.coordx + ( j * 50 ) ) , ( tetro.coordy + ( i * 40 ) ) , 50, 40); 
                };
            };
        };
    };
};
