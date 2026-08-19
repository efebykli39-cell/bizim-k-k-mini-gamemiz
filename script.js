/* =========================================================
   BİZİM KÜÇÜK MACERAMIZ
   2D PLATFORMER ENGINE
   FINAL / POLISHED VERSION
========================================================= */


/* =========================================================
   CANVAS
========================================================= */

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

ctx.imageSmoothingEnabled = false;

const GAME_WIDTH = 960;
const GAME_HEIGHT = 540;


/* =========================================================
   CANVAS ROUNDRECT FALLBACK
========================================================= */

if (
    !CanvasRenderingContext2D.prototype.roundRect
) {

    CanvasRenderingContext2D.prototype.roundRect =
        function (
            x,
            y,
            width,
            height,
            radius
        ) {

            radius =
                Math.min(
                    radius,
                    width / 2,
                    height / 2
                );

            this.beginPath();

            this.moveTo(
                x + radius,
                y
            );

            this.lineTo(
                x + width - radius,
                y
            );

            this.quadraticCurveTo(
                x + width,
                y,
                x + width,
                y + radius
            );

            this.lineTo(
                x + width,
                y + height - radius
            );

            this.quadraticCurveTo(
                x + width,
                y + height,
                x + width - radius,
                y + height
            );

            this.lineTo(
                x + radius,
                y + height
            );

            this.quadraticCurveTo(
                x,
                y + height,
                x,
                y + height - radius
            );

            this.lineTo(
                x,
                y + radius
            );

            this.quadraticCurveTo(
                x,
                y,
                x + radius,
                y
            );

            this.closePath();
        };

}


/* =========================================================
   OYUN DURUMU
========================================================= */

const game = {

    started: false,

    paused: true,

    currentCheckpoint: 0,

    dialogueActive: false,

    quizActive: false,

    codeActive: false,

    ending: false,

    venusTriggered: false,

    policeTriggered: false,

    finalTriggered: false,

    finalHouseInterior: false

};


/* =========================================================
   FİNAL ŞİFRESİ
========================================================= */

const FINAL_CODE = "2206";


/* =========================================================
   KLAVYE
========================================================= */

const keys = {

    left: false,

    right: false,

    jump: false,

    interact: false

};


document.addEventListener(
    "keydown",
    (event) => {

        const key =
            event.key.toLowerCase();


        if (
            key === "arrowleft" ||
            key === "a"
        ) {

            keys.left = true;

        }


        if (
            key === "arrowright" ||
            key === "d"
        ) {

            keys.right = true;

        }


        if (
            key === " " ||
            key === "w" ||
            key === "arrowup"
        ) {

            keys.jump = true;

        }


        if (
            key === "e" ||
            key === "enter"
        ) {

            keys.interact = true;

        }

    }
);


document.addEventListener(
    "keyup",
    (event) => {

        const key =
            event.key.toLowerCase();


        if (
            key === "arrowleft" ||
            key === "a"
        ) {

            keys.left = false;

        }


        if (
            key === "arrowright" ||
            key === "d"
        ) {

            keys.right = false;

        }


        if (
            key === " " ||
            key === "w" ||
            key === "arrowup"
        ) {

            keys.jump = false;

        }


        if (
            key === "e" ||
            key === "enter"
        ) {

            keys.interact = false;

        }

    }
);


/* =========================================================
   OYUNCU
========================================================= */

const player = {

    x: 100,

    y: 470,

    width: 30,

    height: 95,

    velocityX: 0,

    velocityY: 0,

    speed: 2.4,

    jumpPower: 10,

    gravity: 0.4,

    onGround: false,

    facing: "right",

    spawnX: 100,

    spawnY: 420,

    animationTimer: 0,

    animationFrame: 0

};


/* =========================================================
   SPRITE
========================================================= */

const playerSprite = new Image();

playerSprite.src =
    "assets/characters/player.png";

const SPRITE_FRAME_WIDTH = 128;
const SPRITE_FRAME_HEIGHT = 192;

const IDLE_FRAMES = 8;
const RUN_FRAMES = 7;
const JUMP_FRAMES = 7;

let playerAnimationFrame = 0;
let playerAnimationTimer = 0;


/* =========================================================
   DÜNYA / KAMERA
========================================================= */

const world = {

    width: 7000,

    height: GAME_HEIGHT,

    cameraX: 0

};


/* =========================================================
   PLATFORMLAR
========================================================= */

const platforms = [

    {
        x: 0,
        y: 470,
        width: 650,
        height: 70
    },

    {
        x: 720,
        y: 430,
        width: 180,
        height: 30
    },

    {
        x: 970,
        y: 390,
        width: 180,
        height: 30
    },

    {
        x: 1220,
        y: 440,
        width: 220,
        height: 30
    },

    {
        x: 1480,
        y: 470,
        width: 500,
        height: 70
    },

    {
        x: 2040,
        y: 430,
        width: 180,
        height: 30
    },

    {
        x: 2290,
        y: 370,
        width: 180,
        height: 30
    },

    {
        x: 2540,
        y: 430,
        width: 220,
        height: 30
    },

    {
        x: 2800,
        y: 470,
        width: 500,
        height: 70
    },

    {
        x: 3360,
        y: 420,
        width: 180,
        height: 30
    },

    {
        x: 3600,
        y: 350,
        width: 170,
        height: 30
    },

    {
        x: 3840,
        y: 410,
        width: 200,
        height: 30
    },

    {
        x: 4110,
        y: 470,
        width: 550,
        height: 70
    },

    {
        x: 4720,
        y: 430,
        width: 190,
        height: 30
    },

    {
        x: 4980,
        y: 370,
        width: 180,
        height: 30
    },

    {
        x: 5230,
        y: 420,
        width: 200,
        height: 30
    },

    {
        x: 5500,
        y: 470,
        width: 450,
        height: 70
    },

    {
        x: 6000,
        y: 450,
        width: 350,
        height: 90
    },

    {
        x: 6390,
        y: 470,
        width: 610,
        height: 70

    }

];


/* =========================================================
   CHECKPOINTLER
========================================================= */

const checkpoints = [

    {
        id: 1,
        x: 2900,
        y: 420,
        spawnX: 2860,
        spawnY: 410
    },

    {
        id: 2,
        x: 4750,
        y: 420,
        spawnX: 4720,
        spawnY: 410
    },

    {
        id: 3,
        x: 6050,
        y: 400,
        spawnX: 6020,
        spawnY: 410
    }

];


/* =========================================================
   VENÜS
========================================================= */

const venus = {

    x: 1520,

    y: 395,

    width: 60,

    height: 80,

    active: false

};


/* =========================================================
   POLİS
========================================================= */

const police = {

    x: 4450,

    y: 395,

    width: 60,

    height: 80,

    active: false

};


/* =========================================================
   FİNAL EVİ
========================================================= */

const finalHouse = {

    x: 6390,

    y: 345,

    width: 190,

    height: 125,

    roofHeight: 65

};


/* =========================================================
   DİALOGLAR
========================================================= */

const dialogues = {

    venusStart: [

        {
            speaker: "Venüs",
            portrait: "🐱",
            text: "Annecim! Babamı Bulamıyorum nerede gidip bulabilir misin babişkomu ?"
        },

        {
            speaker: "Sen",
            portrait: "👧",
            text: "Venüstoşşumm! Annecim Ben bulurum yavşak babanı merak etme  oğluşuuummm"
        },

        {
            speaker: "Venüs",
            portrait: "🐱",
            text: "Tamam Anneciiimm babamı çok özledim bana onu bulup getirirmisin ama dikkat et ilerde polis var anniş"
        }

    ],


    checkpoint1: [

        {
            speaker: "Sen",
            portrait: "👧",
            text: "Şimdi Aklıma geldi kesin senin salak baban uyuya kaldı gidip bi eve bakiyim"
        },

        {
            speaker: "Venüs",
            portrait: "🐱",
            text: "Tamammm annişkoloşkom ama babamada salak deme üzülürrrrrr❤️"
        }

    ],


    policeIntro: [

        {
            speaker: "Polis",
            portrait: "👮",
            text: "Dur Bakalım Efe Bey Hazretlerine kavuşmak o kadar kolay değil önce onu ne kadar tanıyosun görelim"
        },

        {
            speaker: "Polis",
            portrait: "👮",
            text: "Sana bir kaç soru soracağım."
        }

    ],


    checkpoint2: [

        {
            speaker: "Sen",
            portrait: "👧",
            text: "Buraya kadar geldik bakalım uyuyomu yoksa napıyo habeş maymunu"
        }

    ],


    finalDoor: [

        {
            speaker: "Sen",
            portrait: "👧",
            text: "Sonunda eve geldim..."
        },

        {
            speaker: "Sen",
            portrait: "❤️",
            text: "Bunca yolun sonunda aslında aradığım yer hep burasıymış sevgilimin yanı kızsamda küssemde seviyorum oğluşumuuu❤️"
        }

    ]

};


/* =========================================================
   QUIZ
========================================================= */

const quizQuestions = [

    {
        question:
            "OĞLUŞUNUN DOĞUM GÜNÜ",

        answers: [
            "21.08.06",
            "20.08.26",
            "29.09.06",
            "20.08.06"
        ],

        correct: 3
    },

    {
        question:
            "OĞLUŞUN VALORANTTA EN ÇOK HANGİ AJANLA OYNAR",

        answers: [
            "JETT",
            "SAGE",
            "RAZE",
            "VETO"
        ],

        correct: 1
    },

    {
        question:
            "OĞLUŞUNLA SİZİN ŞARKIMIZ NE",

        answers: [
            "DİLERİM Kİ",
            "ÇİKİTA MUZ",
            "LUXURİA",
            "GECENİN KÖR SAATLERİ"
        ],

        correct: 0
    }

];


let currentQuizQuestion = 0;


/* =========================================================
   DİALOG
========================================================= */

let currentDialogue = [];

let dialogueIndex = 0;

let dialogueAction = null;


function startDialogue(dialogue) {

    if (
        !dialogue ||
        dialogue.length === 0
    ) {

        return;

    }


    game.dialogueActive = true;

    game.paused = true;

    currentDialogue = dialogue;

    dialogueIndex = 0;

    showDialogueLine();

}


function showDialogueLine() {

    const line =
        currentDialogue[
            dialogueIndex
        ];


    const speaker =
        document.getElementById(
            "dialogSpeaker"
        );

    const portrait =
        document.getElementById(
            "dialogPortrait"
        );

    const text =
        document.getElementById(
            "dialogText"
        );

    const box =
        document.getElementById(
            "dialogBox"
        );


    if (speaker)
        speaker.textContent =
            line.speaker;

    if (portrait)
        portrait.textContent =
            line.portrait;

    if (text)
        text.textContent =
            line.text;

    if (box)
        box.classList.remove(
            "hidden"
        );

}


function advanceDialogue() {

    if (
        !game.dialogueActive
    ) {

        return;

    }


    dialogueIndex++;


    if (
        dialogueIndex >=
        currentDialogue.length
    ) {

        closeDialogue();

        return;

    }


    showDialogueLine();

}


function closeDialogue() {

    game.dialogueActive = false;

    game.paused = false;


    const box =
        document.getElementById(
            "dialogBox"
        );

    if (box) {

        box.classList.add(
            "hidden"
        );

    }


    afterDialogue();

}


function afterDialogue() {

    if (
        dialogueAction
    ) {

        const action =
            dialogueAction;

        dialogueAction =
            null;

        action();

    }

}


const dialogBox =
    document.getElementById(
        "dialogBox"
    );


if (dialogBox) {

    dialogBox.addEventListener(
        "click",
        advanceDialogue
    );

}


/* =========================================================
   ÇARPIŞMA
========================================================= */

function checkCollision(
    a,
    b
) {

    return (

        a.x <
        b.x + b.width &&

        a.x + a.width >
        b.x &&

        a.y <
        b.y + b.height &&

        a.y + a.height >
        b.y

    );

}


/* =========================================================
   OYUNCU FİZİĞİ
========================================================= */

function updatePlayer() {

    if (
        game.paused ||
        game.dialogueActive ||
        game.quizActive ||
        game.codeActive ||
        game.ending
    ) {

        return;

    }


    if (keys.left) {

        player.velocityX =
            -player.speed;

        player.facing =
            "left";

    }

    else if (keys.right) {

        player.velocityX =
            player.speed;

        player.facing =
            "right";

    }

    else {

        player.velocityX *= 0.75;

    }


    if (
        keys.jump &&
        player.onGround
    ) {

        player.velocityY =
            -player.jumpPower;

        player.onGround =
            false;

    }


    keys.jump = false;


    player.velocityY +=
        player.gravity;


    if (
        player.velocityY > 12
    ) {

        player.velocityY = 12;

    }


    player.x +=
        player.velocityX;


    resolveHorizontalCollisions();


    player.y +=
        player.velocityY;


    player.onGround =
        false;


    resolveVerticalCollisions();


    if (
        player.y >
        GAME_HEIGHT + 100
    ) {

        respawnPlayer();

    }


    player.animationTimer +=
        0.1;


    updateCamera();

}


/* =========================================================
   YATAY ÇARPIŞMA
========================================================= */

function resolveHorizontalCollisions() {

    for (
        const platform of platforms
    ) {

        if (
            checkCollision(
                player,
                platform
            )
        ) {

            if (
                player.velocityX > 0
            ) {

                player.x =
                    platform.x -
                    player.width;

            }

            else if (
                player.velocityX < 0
            ) {

                player.x =
                    platform.x +
                    platform.width;

            }


            player.velocityX =
                0;

        }

    }

}


/* =========================================================
   DİKEY ÇARPIŞMA
========================================================= */

function resolveVerticalCollisions() {

    for (
        const platform of platforms
    ) {

        if (
            checkCollision(
                player,
                platform
            )
        ) {

            if (
                player.velocityY >= 0
            ) {

                player.y =
                    platform.y -
                    player.height;

                player.velocityY =
                    0;

                player.onGround =
                    true;

            }

            else {

                player.y =
                    platform.y +
                    platform.height;

                player.velocityY =
                    0;

            }

        }

    }

}


/* =========================================================
   CHECKPOINT
========================================================= */

function updateCheckpoints() {

    for (
        const checkpoint of checkpoints
    ) {

        if (
            checkpoint.id <=
            game.currentCheckpoint
        ) {

            continue;

        }


        const checkpointBox = {

            x: checkpoint.x,

            y: checkpoint.y,

            width: 35,

            height: 50

        };


        if (
            checkCollision(
                player,
                checkpointBox
            )
        ) {

            activateCheckpoint(
                checkpoint
            );

        }

    }

}


function activateCheckpoint(
    checkpoint
) {

    game.currentCheckpoint =
        checkpoint.id;


    player.spawnX =
        checkpoint.spawnX;

    player.spawnY =
        checkpoint.spawnY;


    const checkpointElement =
        document.getElementById(
            "checkpoint"
        );


    if (checkpointElement) {

        checkpointElement.textContent =
            `CHECKPOINT: ${checkpoint.id}`;

    }


    showCheckpointMessage();


    if (
        checkpoint.id === 1
    ) {

        setTimeout(
            () => {

                startDialogue(
                    dialogues.checkpoint1
                );

            },
            800
        );

    }


    if (
        checkpoint.id === 2
    ) {

        setTimeout(
            () => {

                startDialogue(
                    dialogues.checkpoint2
                );

            },
            800
        );

    }

}


function showCheckpointMessage() {

    const element =
        document.getElementById(
            "checkpointMessage"
        );


    if (!element)
        return;


    element.classList.remove(
        "hidden"
    );


    setTimeout(
        () => {

            element.classList.add(
                "hidden"
            );

        },
        1800
    );

}


/* =========================================================
   RESPAWN
========================================================= */

function respawnPlayer() {

    player.x =
        player.spawnX;

    player.y =
        player.spawnY;

    player.velocityX =
        0;

    player.velocityY =
        0;

}


/* =========================================================
   VENÜS TETİKLEYİCİ
========================================================= */

function updateVenus() {

    if (
        game.venusTriggered
    ) {

        return;

    }


    if (
        player.x >
        venus.x - 180
    ) {

        game.venusTriggered =
            true;

        game.paused =
            true;

        venus.active =
            true;


        setTimeout(
            () => {

                startDialogue(
                    dialogues.venusStart
                );

            },
            300
        );

    }

}


/* =========================================================
   POLİS TETİKLEYİCİ
========================================================= */

function updatePolice() {

    if (
        game.policeTriggered
    ) {

        return;

    }


    if (
        player.x >
        police.x - 180
    ) {

        game.policeTriggered =
            true;

        police.active =
            true;

        game.paused =
            true;


        setTimeout(
            () => {

                dialogueAction =
                    () => {

                        openQuiz();

                    };


                startDialogue(
                    dialogues.policeIntro
                );

            },
            300
        );

    }

}


/* =========================================================
   QUIZ
========================================================= */

function openQuiz() {

    game.quizActive =
        true;

    game.paused =
        true;

    currentQuizQuestion =
        0;


    const screen =
        document.getElementById(
            "quizScreen"
        );


    if (screen) {

        screen.classList.remove(
            "hidden"
        );

    }


    showQuizQuestion();

}


function showQuizQuestion() {

    const question =
        quizQuestions[
            currentQuizQuestion
        ];


    if (!question)
        return;


    const questionElement =
        document.getElementById(
            "quizQuestion"
        );


    const answers =
        document.getElementById(
            "quizAnswers"
        );


    const result =
        document.getElementById(
            "quizResult"
        );


    if (questionElement) {

        questionElement.textContent =
            question.question;

    }


    if (!answers)
        return;


    answers.innerHTML =
        "";


    question.answers.forEach(
        (
            answer,
            index
        ) => {

            const button =
                document.createElement(
                    "button"
                );


            button.textContent =
                answer;


            button.addEventListener(
                "click",
                () => {

                    answerQuiz(
                        index
                    );

                }
            );


            answers.appendChild(
                button
            );

        }
    );


    if (result) {

        result.textContent =
            `Soru ${currentQuizQuestion + 1} / ${quizQuestions.length}`;

    }

}


function answerQuiz(
    answer
) {

    const question =
        quizQuestions[
            currentQuizQuestion
        ];


    const result =
        document.getElementById(
            "quizResult"
        );


    if (
        answer ===
        question.correct
    ) {

        if (result) {

            result.textContent =
                "❤️ Doğru!";

            result.style.color =
                "#8fd694";

        }


        setTimeout(
            () => {

                currentQuizQuestion++;


                if (
                    currentQuizQuestion >=
                    quizQuestions.length
                ) {

                    finishQuiz();

                }

                else {

                    showQuizQuestion();

                }

            },
            700
        );

    }

    else {

        if (result) {

            result.textContent =
                "❌ Yanlış cevap. Tekrar dene.";

            result.style.color =
                "#ff8b9e";

        }

    }

}


function finishQuiz() {

    game.quizActive =
        false;

    game.paused =
        false;


    const screen =
        document.getElementById(
            "quizScreen"
        );


    if (screen) {

        screen.classList.add(
            "hidden"
        );

    }


    game.currentCheckpoint =
        Math.max(
            game.currentCheckpoint,
            2
        );


    const checkpointElement =
        document.getElementById(
            "checkpoint"
        );


    if (checkpointElement) {

        checkpointElement.textContent =
            "CHECKPOINT: 2";

    }


    player.spawnX =
        4720;

    player.spawnY =
        410;

}


/* =========================================================
   FINAL EVİ
========================================================= */

function updateFinalHouse() {

    if (
        game.finalTriggered
    ) {

        return;

    }


    if (
        player.x >
        finalHouse.x - 100
    ) {

        game.finalTriggered =
            true;

        game.paused =
            true;


        dialogueAction =
            () => {

                openCodeScreen();

            };


        startDialogue(
            dialogues.finalDoor
        );

    }

}


/* =========================================================
   ŞİFRE
========================================================= */

let enteredCode = "";


function openCodeScreen() {

    game.codeActive =
        true;

    game.paused =
        true;

    enteredCode =
        "";


    updateCodeDisplay();


    const screen =
        document.getElementById(
            "codeScreen"
        );


    if (screen) {

        screen.classList.remove(
            "hidden"
        );

    }

}


function updateCodeDisplay() {

    let display =
        "";


    for (
        let i = 0;
        i < 4;
        i++
    ) {

        if (
            enteredCode[i]
        ) {

            display +=
                enteredCode[i] +
                " ";

        }

        else {

            display +=
                "_ ";

        }

    }


    const element =
        document.getElementById(
            "codeDisplay"
        );


    if (element) {

        element.textContent =
            display.trim();

    }

}


/* =========================================================
   NUMPAD
========================================================= */

const codeButtons =
    document.getElementById(
        "codeButtons"
    );


if (codeButtons) {

    codeButtons.addEventListener(
        "click",
        (event) => {

            const button =
                event.target.closest(
                    "button"
                );


            if (!button)
                return;


            const number =
                button.dataset.number;


            if (
                number !== undefined &&
                enteredCode.length < 4
            ) {

                enteredCode +=
                    number;

                updateCodeDisplay();

            }

        }
    );

}


/* =========================================================
   ŞİFRE TEMİZLE
========================================================= */

const codeClear =
    document.getElementById(
        "codeClear"
    );


if (codeClear) {

    codeClear.addEventListener(
        "click",
        () => {

            enteredCode =
                "";

            updateCodeDisplay();


            const message =
                document.getElementById(
                    "codeMessage"
                );


            if (message) {

                message.textContent =
                    "";

            }

        }
    );

}


/* =========================================================
   ŞİFRE KONTROL
========================================================= */

const codeEnter =
    document.getElementById(
        "codeEnter"
    );


if (codeEnter) {

    codeEnter.addEventListener(
        "click",
        checkFinalCode
    );

}


function checkFinalCode() {

    const message =
        document.getElementById(
            "codeMessage"
        );


    if (
        enteredCode ===
        FINAL_CODE
    ) {

        if (message) {

            message.textContent =
                "🔓 Kapı açıldı!";

            message.style.color =
                "#8fd694";

        }


        setTimeout(
            () => {

                closeCodeScreen();

                game.finalHouseInterior =
                    true;

                showEnding();

            },
            1000
        );

    }

    else {

        if (message) {

            message.textContent =
                "❌ Bu tarih değil...";

            message.style.color =
                "#ff8b9e";

        }

    }

}


function closeCodeScreen() {

    game.codeActive =
        false;


    const screen =
        document.getElementById(
            "codeScreen"
        );


    if (screen) {

        screen.classList.add(
            "hidden"
        );

    }

}


/* =========================================================
   FİNAL
========================================================= */

function showEnding() {

    game.ending =
        true;

    game.paused =
        true;


    const endingText =
        document.getElementById(
            "endingText"
        );


    if (endingText) {

        endingText.textContent =
            "Bunca yolun sonunda vardığımız yer yine birbirimizin yanıydı. ❤️";

    }


    const endingScreen =
        document.getElementById(
            "endingScreen"
        );


    if (endingScreen) {

        endingScreen.classList.remove(
            "hidden"
        );

    }

}


/* =========================================================
   KAMERA
========================================================= */

function updateCamera() {

    const target =
        player.x -
        GAME_WIDTH / 2;


    world.cameraX +=
        (
            target -
            world.cameraX
        ) * 0.08;


    if (
        world.cameraX < 0
    ) {

        world.cameraX =
            0;

    }


    const maxCamera =
        world.width -
        GAME_WIDTH;


    if (
        world.cameraX >
        maxCamera
    ) {

        world.cameraX =
            maxCamera;

    }

}


/* =========================================================
   ARKA PLAN
========================================================= */

function drawBackground() {

    /* Gökyüzü */

    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            GAME_HEIGHT
        );


    gradient.addColorStop(
        0,
        "#8CC9D8"
    );


    gradient.addColorStop(
        1,
        "#D8E9D2"
    );


    ctx.fillStyle =
        gradient;


    ctx.fillRect(
        0,
        0,
        GAME_WIDTH,
        GAME_HEIGHT
    );


    /* Güneş */

    const sunX =
        760 -
        world.cameraX * 0.08;

    const sunY =
        90;


    ctx.fillStyle =
        "rgba(255, 230, 150, 0.65)";


    ctx.beginPath();

    ctx.arc(
        sunX,
        sunY,
        35,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* Uzak tepeler */

    ctx.fillStyle =
        "#8AB48C";


    for (
        let x = -200;
        x < world.width + 400;
        x += 320
    ) {

        const screenX =
            x -
            world.cameraX * 0.22;


        ctx.beginPath();

        ctx.moveTo(
            screenX,
            390
        );

        ctx.lineTo(
            screenX + 150,
            235
        );

        ctx.lineTo(
            screenX + 320,
            390
        );

        ctx.closePath();

        ctx.fill();

    }


    /* Yakın tepeler */

    ctx.fillStyle =
        "#78A47B";


    for (
        let x = -300;
        x < world.width + 400;
        x += 420
    ) {

        const screenX =
            x -
            world.cameraX * 0.38;


        ctx.beginPath();

        ctx.moveTo(
            screenX,
            420
        );

        ctx.lineTo(
            screenX + 180,
            300
        );

        ctx.lineTo(
            screenX + 420,
            420
        );

        ctx.closePath();

        ctx.fill();

    }


    /* Bulutlar */

    drawCloud(
        150 -
        world.cameraX * 0.12,
        100
    );

    drawCloud(
        600 -
        world.cameraX * 0.10,
        150
    );

    drawCloud(
        1100 -
        world.cameraX * 0.08,
        90
    );

}


/* =========================================================
   BULUT
========================================================= */

function drawCloud(
    x,
    y
) {

    ctx.fillStyle =
        "rgba(255,255,255,0.62)";


    ctx.beginPath();

    ctx.roundRect(
        x,
        y,
        90,
        20,
        10
    );

    ctx.fill();


    ctx.beginPath();

    ctx.arc(
        x + 25,
        y,
        17,
        0,
        Math.PI * 2
    );

    ctx.arc(
        x + 50,
        y - 7,
        22,
        0,
        Math.PI * 2
    );

    ctx.arc(
        x + 72,
        y,
        15,
        0,
        Math.PI * 2
    );

    ctx.fill();

}


/* =========================================================
   PLATFORM
========================================================= */

function drawPlatforms() {

    for (
        const platform of platforms
    ) {

        const x =
            platform.x -
            world.cameraX;


        /* Toprak */

        ctx.fillStyle =
            "#76533F";


        ctx.fillRect(
            x,
            platform.y,
            platform.width,
            platform.height
        );


        /* Çimen */

        ctx.fillStyle =
            "#5E934F";


        ctx.fillRect(
            x,
            platform.y,
            platform.width,
            10
        );


        /* Çimen detay */

        ctx.fillStyle =
            "#83B968";


        for (
            let localX = 0;
            localX < platform.width;
            localX += 20
        ) {

            ctx.fillRect(
                x + localX,
                platform.y,
                8,
                4
            );

        }


        /* Toprak noktaları */

        ctx.fillStyle =
            "rgba(60,40,30,0.18)";


        for (
            let localX = 10;
            localX < platform.width;
            localX += 35
        ) {

            ctx.fillRect(
                x + localX,
                platform.y + 25,
                4,
                3
            );

        }

    }

}


/* =========================================================
   CHECKPOINT
========================================================= */

function drawCheckpoints() {

    for (
        const checkpoint of checkpoints
    ) {

        const x =
            checkpoint.x -
            world.cameraX;


        ctx.fillStyle =
            "#68473E";


        ctx.fillRect(
            x,
            checkpoint.y - 20,
            5,
            55
        );


        ctx.fillStyle =
            checkpoint.id <=
            game.currentCheckpoint
                ? "#F08BA7"
                : "#B7A0AA";


        ctx.fillRect(
            x + 5,
            checkpoint.y - 20,
            25,
            16
        );


        /* Kalp */

        if (
            checkpoint.id <=
            game.currentCheckpoint
        ) {

            ctx.fillStyle =
                "#FFE0E8";

            ctx.font =
                "10px Arial";

            ctx.textAlign =
                "center";

            ctx.fillText(
                "♥",
                x + 17,
                checkpoint.y - 8
            );

        }

    }

}


/* =========================================================
   VENÜS
========================================================= */

function drawVenus() {

    if (
        !venus.active &&
        game.started &&
        player.x < venus.x - 250
    ) {

        return;

    }


    const x =
        Math.floor(
            venus.x -
            world.cameraX
        );

    const y =
        Math.floor(
            venus.y
        );


    const time =
        performance.now();


    const idle =
        Math.sin(
            time * 0.003
        ) * 1.8;


    const tail =
        Math.sin(
            time * 0.006
        ) * 0.25;


    const blink =
        Math.sin(
            time * 0.0015
        ) > 0.97;


    const centerX =
        x + 30;

    const bodyY =
        y + 35 + idle;


    ctx.save();


    /* Gölge */

    ctx.fillStyle =
        "rgba(0,0,0,0.16)";


    ctx.beginPath();

    ctx.ellipse(
        centerX,
        y + 78,
        24,
        5,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* Kuyruk */

    ctx.save();

    ctx.translate(
        centerX + 20,
        bodyY + 12
    );

    ctx.rotate(
        tail
    );


    ctx.strokeStyle =
        "#D8B4D8";

    ctx.lineWidth =
        7;

    ctx.lineCap =
        "round";


    ctx.beginPath();

    ctx.moveTo(
        0,
        0
    );

    ctx.bezierCurveTo(
        20,
        -10,
        28,
        15,
        18,
        25
    );

    ctx.bezierCurveTo(
        12,
        31,
        25,
        32,
        28,
        20
    );

    ctx.stroke();

    ctx.restore();


    /* Arka bacaklar */

    ctx.fillStyle =
        "#C9A1C9";


    ctx.beginPath();

    ctx.roundRect(
        centerX - 17,
        bodyY + 24,
        10,
        25,
        5
    );

    ctx.fill();


    ctx.beginPath();

    ctx.roundRect(
        centerX + 7,
        bodyY + 24,
        10,
        25,
        5
    );

    ctx.fill();


    /* Gövde */

    ctx.fillStyle =
        "#D8B4D8";


    ctx.beginPath();

    ctx.ellipse(
        centerX,
        bodyY + 10,
        25,
        23,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* Karın */

    ctx.fillStyle =
        "#EBD5EB";


    ctx.beginPath();

    ctx.ellipse(
        centerX,
        bodyY + 15,
        14,
        17,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* Ön bacaklar */

    ctx.fillStyle =
        "#D8B4D8";


    ctx.beginPath();

    ctx.roundRect(
        centerX - 18,
        bodyY + 22,
        9,
        27,
        5
    );

    ctx.fill();


    ctx.beginPath();

    ctx.roundRect(
        centerX + 9,
        bodyY + 22,
        9,
        27,
        5
    );

    ctx.fill();


    /* Patiler */

    ctx.fillStyle =
        "#C49BC4";


    ctx.beginPath();

    ctx.ellipse(
        centerX - 13,
        bodyY + 49,
        7,
        4,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.beginPath();

    ctx.ellipse(
        centerX + 13,
        bodyY + 49,
        7,
        4,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* Kulaklar */

    ctx.fillStyle =
        "#D8B4D8";


    ctx.beginPath();

    ctx.moveTo(
        centerX - 20,
        y + 28
    );

    ctx.lineTo(
        centerX - 17,
        y + 3
    );

    ctx.lineTo(
        centerX - 3,
        y + 20
    );

    ctx.closePath();

    ctx.fill();


    ctx.beginPath();

    ctx.moveTo(
        centerX + 3,
        y + 20
    );

    ctx.lineTo(
        centerX + 18,
        y + 3
    );

    ctx.lineTo(
        centerX + 21,
        y + 28
    );

    ctx.closePath();

    ctx.fill();


    /* Kulak içleri */

    ctx.fillStyle =
        "#F0AFC7";


    ctx.beginPath();

    ctx.moveTo(
        centerX - 15,
        y + 10
    );

    ctx.lineTo(
        centerX - 14,
        y + 22
    );

    ctx.lineTo(
        centerX - 7,
        y + 19
    );

    ctx.closePath();

    ctx.fill();


    ctx.beginPath();

    ctx.moveTo(
        centerX + 15,
        y + 10
    );

    ctx.lineTo(
        centerX + 14,
        y + 22
    );

    ctx.lineTo(
        centerX + 7,
        y + 19
    );

    ctx.closePath();

    ctx.fill();


    /* Kafa */

    ctx.fillStyle =
        "#D8B4D8";


    ctx.beginPath();

    ctx.arc(
        centerX,
        y + 27,
        22,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* Gözler */

    ctx.fillStyle =
        "#51405D";


    if (blink) {

        ctx.strokeStyle =
            "#51405D";

        ctx.lineWidth =
            2;


        ctx.beginPath();

        ctx.moveTo(
            centerX - 12,
            y + 27
        );

        ctx.lineTo(
            centerX - 5,
            y + 27
        );

        ctx.stroke();


        ctx.beginPath();

        ctx.moveTo(
            centerX + 5,
            y + 27
        );

        ctx.lineTo(
            centerX + 12,
            y + 27
        );

        ctx.stroke();

    }

    else {

        ctx.beginPath();

        ctx.ellipse(
            centerX - 9,
            y + 27,
            4,
            6,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.beginPath();

        ctx.ellipse(
            centerX + 9,
            y + 27,
            4,
            6,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.fillStyle =
            "#FFFFFF";


        ctx.fillRect(
            centerX - 10,
            y + 25,
            2,
            2
        );

        ctx.fillRect(
            centerX + 8,
            y + 25,
            2,
            2
        );

    }


    /* Burun */

    ctx.fillStyle =
        "#E89CB8";


    ctx.beginPath();

    ctx.moveTo(
        centerX,
        y + 32
    );

    ctx.lineTo(
        centerX - 4,
        y + 29
    );

    ctx.lineTo(
        centerX + 4,
        y + 29
    );

    ctx.closePath();

    ctx.fill();


    /* Ağız */

    ctx.strokeStyle =
        "#76526D";

    ctx.lineWidth =
        1.5;


    ctx.beginPath();

    ctx.moveTo(
        centerX,
        y + 33
    );

    ctx.lineTo(
        centerX - 3,
        y + 37
    );

    ctx.moveTo(
        centerX,
        y + 33
    );

    ctx.lineTo(
        centerX + 3,
        y + 37
    );

    ctx.stroke();


    /* Bıyıklar */

    ctx.strokeStyle =
        "#927A95";

    ctx.lineWidth =
        1;


    ctx.beginPath();

    ctx.moveTo(
        centerX - 6,
        y + 33
    );

    ctx.lineTo(
        centerX - 24,
        y + 29
    );

    ctx.moveTo(
        centerX - 6,
        y + 36
    );

    ctx.lineTo(
        centerX - 24,
        y + 37
    );

    ctx.stroke();


    ctx.beginPath();

    ctx.moveTo(
        centerX + 6,
        y + 33
    );

    ctx.lineTo(
        centerX + 24,
        y + 29
    );

    ctx.moveTo(
        centerX + 6,
        y + 36
    );

    ctx.lineTo(
        centerX + 24,
        y + 37
    );

    ctx.stroke();


    /* Alın detayı */

    ctx.fillStyle =
        "#C39BC3";


    ctx.beginPath();

    ctx.moveTo(
        centerX - 5,
        y + 10
    );

    ctx.lineTo(
        centerX,
        y + 15
    );

    ctx.lineTo(
        centerX + 5,
        y + 10
    );

    ctx.closePath();

    ctx.fill();


    ctx.restore();

}


/* =========================================================
   POLİS
========================================================= */

function drawPolice() {

    const x =
        Math.floor(
            police.x -
            world.cameraX
        );

    const y =
        Math.floor(
            police.y
        );


    const time =
        performance.now();


    const idle =
        Math.sin(
            time * 0.003
        ) * 1.2;


    const centerX =
        x + 30;

    const bodyY =
        y + 38 + idle;


    ctx.save();


    /* Gölge */

    ctx.fillStyle =
        "rgba(0,0,0,0.18)";


    ctx.beginPath();

    ctx.ellipse(
        centerX,
        y + 78,
        22,
        5,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* Bacaklar */

    ctx.fillStyle =
        "#26395C";


    ctx.fillRect(
        centerX - 11,
        bodyY + 35,
        10,
        20
    );

    ctx.fillRect(
        centerX + 1,
        bodyY + 35,
        10,
        20
    );


    /* Ayakkabı */

    ctx.fillStyle =
        "#202331";


    ctx.beginPath();

    ctx.ellipse(
        centerX - 7,
        bodyY + 56,
        10,
        5,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.beginPath();

    ctx.ellipse(
        centerX + 8,
        bodyY + 56,
        10,
        5,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* Üniforma */

    ctx.fillStyle =
        "#304A75";


    ctx.beginPath();

    ctx.roundRect(
        centerX - 17,
        bodyY,
        34,
        38,
        7
    );

    ctx.fill();


    /* Gömlek */

    ctx.fillStyle =
        "#E8EEF7";


    ctx.fillRect(
        centerX - 10,
        bodyY + 3,
        20,
        12
    );


    /* Kravat */

    ctx.fillStyle =
        "#B83B52";


    ctx.beginPath();

    ctx.moveTo(
        centerX,
        bodyY + 7
    );

    ctx.lineTo(
        centerX - 4,
        bodyY + 20
    );

    ctx.lineTo(
        centerX,
        bodyY + 25
    );

    ctx.lineTo(
        centerX + 4,
        bodyY + 20
    );

    ctx.closePath();

    ctx.fill();


    /* Kemer */

    ctx.fillStyle =
        "#202331";


    ctx.fillRect(
        centerX - 17,
        bodyY + 31,
        34,
        6
    );


    ctx.fillStyle =
        "#E1B84C";


    ctx.fillRect(
        centerX - 4,
        bodyY + 31,
        8,
        6
    );


    /* Kollar */

    ctx.fillStyle =
        "#304A75";


    ctx.save();

    ctx.translate(
        centerX - 17,
        bodyY + 7
    );

    ctx.rotate(
        -0.08
    );

    ctx.roundRect(
        -5,
        0,
        10,
        29,
        5
    );

    ctx.fill();

    ctx.restore();


    ctx.save();

    ctx.translate(
        centerX + 17,
        bodyY + 7
    );

    ctx.rotate(
        0.08
    );

    ctx.roundRect(
        -5,
        0,
        10,
        29,
        5
    );

    ctx.fill();

    ctx.restore();


    /* Eller */

    ctx.fillStyle =
        "#E7B99D";


    ctx.beginPath();

    ctx.arc(
        centerX - 20,
        bodyY + 37,
        6,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.beginPath();

    ctx.arc(
        centerX + 20,
        bodyY + 37,
        6,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* Boyun */

    ctx.fillRect(
        centerX - 6,
        y + 30,
        12,
        10
    );


    /* Kulak */

    ctx.beginPath();

    ctx.arc(
        centerX - 21,
        y + 25,
        6,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.beginPath();

    ctx.arc(
        centerX + 21,
        y + 25,
        6,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* Kafa */

    ctx.beginPath();

    ctx.arc(
        centerX,
        y + 25,
        21,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* Saç */

    ctx.fillStyle =
        "#3A2A28";


    ctx.beginPath();

    ctx.arc(
        centerX,
        y + 17,
        21,
        Math.PI,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillRect(
        centerX - 20,
        y + 17,
        7,
        13
    );

    ctx.fillRect(
        centerX + 13,
        y + 17,
        7,
        13
    );


    /* Şapka */

    ctx.fillStyle =
        "#263F68";


    ctx.beginPath();

    ctx.roundRect(
        centerX - 21,
        y + 1,
        42,
        16,
        6
    );

    ctx.fill();


    ctx.fillStyle =
        "#1D304F";


    ctx.beginPath();

    ctx.ellipse(
        centerX,
        y + 17,
        25,
        6,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* Rozet */

    ctx.fillStyle =
        "#E6C45A";


    ctx.beginPath();

    ctx.arc(
        centerX,
        y + 8,
        5,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle =
        "#FFF0A5";


    ctx.fillRect(
        centerX - 2,
        y + 6,
        4,
        4
    );


    /* Gözler */

    ctx.fillStyle =
        "#342A32";


    ctx.beginPath();

    ctx.ellipse(
        centerX - 8,
        y + 27,
        3,
        4,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.beginPath();

    ctx.ellipse(
        centerX + 8,
        y + 27,
        3,
        4,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* Göz parlamaları */

    ctx.fillStyle =
        "#FFFFFF";


    ctx.fillRect(
        centerX - 9,
        y + 26,
        2,
        2
    );

    ctx.fillRect(
        centerX + 7,
        y + 26,
        2,
        2
    );


    /* Burun */

    ctx.fillStyle =
        "#C98D78";


    ctx.fillRect(
        centerX - 1,
        y + 32,
        2,
        2
    );


    /* Bıyık */

    ctx.fillStyle =
        "#4A3532";


    ctx.beginPath();

    ctx.ellipse(
        centerX - 5,
        y + 36,
        7,
        3,
        -0.15,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.beginPath();

    ctx.ellipse(
        centerX + 5,
        y + 36,
        7,
        3,
        0.15,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* Üniforma rozeti */

    ctx.fillStyle =
        "#E4C35B";


    ctx.beginPath();

    ctx.arc(
        centerX + 10,
        bodyY + 13,
        4,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* Telsiz */

    ctx.fillStyle =
        "#202331";


    ctx.roundRect(
        centerX - 13,
        bodyY + 19,
        6,
        10,
        2
    );

    ctx.fill();


    ctx.strokeStyle =
        "#202331";

    ctx.lineWidth =
        2;


    ctx.beginPath();

    ctx.moveTo(
        centerX - 10,
        bodyY + 19
    );

    ctx.lineTo(
        centerX - 8,
        bodyY + 12
    );

    ctx.stroke();


    /* Gülümseme */

    ctx.strokeStyle =
        "#80544F";

    ctx.lineWidth =
        1.4;


    ctx.beginPath();

    ctx.arc(
        centerX,
        y + 36,
        5,
        0.2,
        Math.PI - 0.2
    );

    ctx.stroke();


    ctx.restore();

}


/* =========================================================
   ÇİÇEK
========================================================= */

function drawFlower(
    x,
    y,
    color
) {

    ctx.strokeStyle =
        "#5D8A4F";

    ctx.lineWidth =
        2;


    ctx.beginPath();

    ctx.moveTo(
        x,
        y
    );

    ctx.lineTo(
        x,
        y - 15
    );

    ctx.stroke();


    ctx.fillStyle =
        color;


    ctx.beginPath();

    ctx.arc(
        x - 4,
        y - 17,
        4,
        0,
        Math.PI * 2
    );

    ctx.arc(
        x + 4,
        y - 17,
        4,
        0,
        Math.PI * 2
    );

    ctx.arc(
        x,
        y - 21,
        4,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle =
        "#F4C95D";


    ctx.beginPath();

    ctx.arc(
        x,
        y - 17,
        3,
        0,
        Math.PI * 2
    );

    ctx.fill();

}


/* =========================================================
   ÇALI
========================================================= */

function drawBush(
    x,
    y,
    scale = 1
) {

    ctx.fillStyle =
        "#5E8F58";


    ctx.beginPath();

    ctx.arc(
        x,
        y,
        14 * scale,
        0,
        Math.PI * 2
    );

    ctx.arc(
        x + 15 * scale,
        y - 4 * scale,
        17 * scale,
        0,
        Math.PI * 2
    );

    ctx.arc(
        x + 31 * scale,
        y,
        13 * scale,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle =
        "#78A866";


    ctx.beginPath();

    ctx.arc(
        x + 10 * scale,
        y - 8 * scale,
        5 * scale,
        0,
        Math.PI * 2
    );

    ctx.fill();

}


/* =========================================================
   UYUYAN ERKEK
========================================================= */

function drawSleepingBoy(
    x,
    y
) {

    const time =
        performance.now();


    const breathing =
        Math.sin(
            time * 0.0025
        ) * 1.2;


    const zFloat =
        Math.sin(
            time * 0.002
        ) * 4;


    ctx.save();


    /* =====================================================
       YATAK GÖLGESİ
    ===================================================== */

    ctx.fillStyle =
        "rgba(0,0,0,0.22)";


    ctx.beginPath();

    ctx.ellipse(
        x + 78,
        y + 64,
        80,
        11,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* =====================================================
       YATAK AYAKLARI
    ===================================================== */

    ctx.fillStyle =
        "#6F493F";


    ctx.fillRect(
        x + 8,
        y + 47,
        8,
        28
    );


    ctx.fillRect(
        x + 134,
        y + 47,
        8,
        28
    );


    /* =====================================================
       YATAK
    ===================================================== */

    ctx.fillStyle =
        "#A76E67";


    ctx.beginPath();

    ctx.roundRect(
        x,
        y + 28,
        150,
        34,
        7
    );

    ctx.fill();


    /* Yatak üstü */

    ctx.fillStyle =
        "#F0D8DD";


    ctx.beginPath();

    ctx.roundRect(
        x + 4,
        y + 9,
        142,
        40,
        8
    );

    ctx.fill();


    /* =====================================================
       YASTIK
    ===================================================== */

    ctx.fillStyle =
        "#FFF3F5";


    ctx.beginPath();

    ctx.roundRect(
        x + 9,
        y + 12,
        43,
        24,
        8
    );

    ctx.fill();


    ctx.fillStyle =
        "rgba(180,120,135,0.13)";


    ctx.fillRect(
        x + 14,
        y + 29,
        33,
        3
    );


    /* =====================================================
       ERKEK
    ===================================================== */

    const boyX =
        x + 46;

    const boyY =
        y + 17 +
        breathing;


    /* Saç arkası */

    ctx.fillStyle =
        "#382725";


    ctx.beginPath();

    ctx.arc(
        boyX,
        boyY + 5,
        17,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* Yüz */

    ctx.fillStyle =
        "#FFD0B4";


    ctx.beginPath();

    ctx.arc(
        boyX + 7,
        boyY + 5,
        14,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* Kulak */

    ctx.beginPath();

    ctx.arc(
        boyX + 20,
        boyY + 7,
        5,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* Saç */

    ctx.fillStyle =
        "#382725";


    ctx.beginPath();

    ctx.arc(
        boyX + 6,
        boyY,
        15,
        Math.PI,
        Math.PI * 2
    );

    ctx.fill();


    /* Saç tutamları */

    ctx.beginPath();

    ctx.moveTo(
        boyX - 8,
        boyY
    );

    ctx.quadraticCurveTo(
        boyX,
        boyY + 8,
        boyX + 4,
        boyY
    );

    ctx.quadraticCurveTo(
        boyX + 9,
        boyY + 7,
        boyX + 13,
        boyY - 1
    );

    ctx.fill();


    /* Kapalı gözler */

    ctx.strokeStyle =
        "#4A3434";

    ctx.lineWidth =
        1.7;


    ctx.beginPath();

    ctx.moveTo(
        boyX,
        boyY + 7
    );

    ctx.quadraticCurveTo(
        boyX + 3,
        boyY + 10,
        boyX + 6,
        boyY + 7
    );

    ctx.stroke();


    ctx.beginPath();

    ctx.moveTo(
        boyX + 10,
        boyY + 7
    );

    ctx.quadraticCurveTo(
        boyX + 13,
        boyY + 10,
        boyX + 16,
        boyY + 7
    );

    ctx.stroke();


    /* Burun */

    ctx.fillStyle =
        "#E8A98F";


    ctx.fillRect(
        boyX + 7,
        boyY + 10,
        2,
        2
    );


    /* Gülümseme */

    ctx.strokeStyle =
        "#925E68";

    ctx.lineWidth =
        1.2;


    ctx.beginPath();

    ctx.arc(
        boyX + 9,
        boyY + 13,
        4,
        0.2,
        Math.PI - 0.2
    );

    ctx.stroke();


    /* Boyun */

    ctx.fillStyle =
        "#FFD0B4";


    ctx.fillRect(
        boyX + 1,
        boyY + 16,
        10,
        8
    );


    /* Tişört */

    ctx.fillStyle =
        "#7896B5";


    ctx.beginPath();

    ctx.roundRect(
        boyX - 3,
        boyY + 18,
        50,
        28,
        8
    );

    ctx.fill();


    /* Tişört detayı */

    ctx.fillStyle =
        "#B4C7D9";


    ctx.fillRect(
        boyX + 14,
        boyY + 23,
        22,
        4
    );


    /* Kol */

    ctx.fillStyle =
        "#FFD0B4";


    ctx.beginPath();

    ctx.roundRect(
        boyX + 30,
        boyY + 27,
        31,
        8,
        5
    );

    ctx.fill();


    /* El */

    ctx.beginPath();

    ctx.arc(
        boyX + 61,
        boyY + 31,
        5,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* =====================================================
       BATTANİYE
    ===================================================== */

    ctx.fillStyle =
        "#D596AB";


    ctx.beginPath();

    ctx.roundRect(
        boyX + 31,
        boyY + 18,
        68,
        31,
        10
    );

    ctx.fill();


    /* Battaniye ışık */

    ctx.fillStyle =
        "rgba(255,235,242,0.25)";


    ctx.beginPath();

    ctx.roundRect(
        boyX + 37,
        boyY + 22,
        54,
        8,
        5
    );

    ctx.fill();


    /* Battaniye kalbi */

    ctx.fillStyle =
        "#F3C5D5";

    ctx.font =
        "bold 12px Arial";

    ctx.textAlign =
        "center";


    ctx.fillText(
        "♥",
        boyX + 66,
        boyY + 43
    );


    /* Ayak */

    ctx.fillStyle =
        "#FFD0B4";


    ctx.beginPath();

    ctx.ellipse(
        boyX + 101,
        boyY + 39,
        10,
        6,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* =====================================================
       UYKU Z
    ===================================================== */

    ctx.fillStyle =
        "#8D769B";

    ctx.font =
        "bold 13px Arial";

    ctx.textAlign =
        "center";


    ctx.fillText(
        "Z",
        boyX + 29,
        boyY - 10 - zFloat
    );


    ctx.font =
        "bold 9px Arial";


    ctx.fillText(
        "Z",
        boyX + 41,
        boyY - 20 - zFloat
    );


    ctx.restore();

}


/* =========================================================
   EV İÇİ
========================================================= */

function drawHouseInterior(
    x,
    y
) {

    const time =
        performance.now();


    /* Oda zemini */

    ctx.fillStyle =
        "#B97865";


    ctx.fillRect(
        x + 8,
        y + 70,
        174,
        50
    );


    /* Duvar iç ışığı */

    ctx.fillStyle =
        "#FFE5C2";


    ctx.fillRect(
        x + 8,
        y + 65,
        174,
        55
    );


    /* Ahşap zemin çizgileri */

    ctx.strokeStyle =
        "rgba(100,65,50,0.18)";

    ctx.lineWidth =
        2;


    for (
        let i = 0;
        i < 7;
        i++
    ) {

        ctx.beginPath();

        ctx.moveTo(
            x + 10,
            y + 75 + i * 7
        );

        ctx.lineTo(
            x + 180,
            y + 75 + i * 7
        );

        ctx.stroke();

    }


    /* Gece lambası */

    const lampGlow =
        25 +
        Math.sin(
            time * 0.003
        ) * 2;


    ctx.fillStyle =
        "rgba(255,200,120,0.10)";


    ctx.beginPath();

    ctx.arc(
        x + 155,
        y + 82,
        lampGlow,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* Komodin */

    ctx.fillStyle =
        "#8B5C4C";


    ctx.fillRect(
        x + 142,
        y + 82,
        28,
        35
    );


    /* Çekmece */

    ctx.fillStyle =
        "#A86F5D";


    ctx.fillRect(
        x + 146,
        y + 88,
        20,
        10
    );


    ctx.fillStyle =
        "#E0B765";


    ctx.beginPath();

    ctx.arc(
        x + 156,
        y + 93,
        2,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* Lamba */

    ctx.fillStyle =
        "#E4C17B";


    ctx.fillRect(
        x + 154,
        y + 65,
        3,
        18
    );


    ctx.beginPath();

    ctx.moveTo(
        x + 145,
        y + 68
    );

    ctx.lineTo(
        x + 166,
        y + 68
    );

    ctx.lineTo(
        x + 161,
        y + 80
    );

    ctx.lineTo(
        x + 150,
        y + 80
    );

    ctx.closePath();

    ctx.fill();


    /* Duvar kalpleri */

    ctx.fillStyle =
        "#E98DAE";

    ctx.font =
        "14px Arial";

    ctx.textAlign =
        "center";


    ctx.fillText(
        "♥",
        x + 95,
        y + 84
    );


    ctx.fillStyle =
        "#C58CD6";

    ctx.font =
        "9px Arial";


    ctx.fillText(
        "♥",
        x + 111,
        y + 92
    );


    /* Uyuyan erkek */

    drawSleepingBoy(
        x + 18,
        y + 47
    );

}


/* =========================================================
   FİNAL EVİ
========================================================= */

function drawFinalHouse() {

    const x =
        Math.floor(
            finalHouse.x -
            world.cameraX
        );


    const y =
        Math.floor(
            finalHouse.y
        );


    const width =
        finalHouse.width;

    const height =
        finalHouse.height;

    const roofHeight =
        finalHouse.roofHeight;


    const centerX =
        x + width / 2;


    ctx.save();


    /* =====================================================
       EV GÖLGESİ
    ===================================================== */

    ctx.fillStyle =
        "rgba(0,0,0,0.17)";


    ctx.beginPath();

    ctx.ellipse(
        centerX,
        y + height + 10,
        110,
        12,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* =====================================================
       BACA
    ===================================================== */

    ctx.fillStyle =
        "#8A5B52";


    ctx.fillRect(
        x + 140,
        y - 45,
        24,
        55
    );


    ctx.fillStyle =
        "#714842";


    ctx.fillRect(
        x + 136,
        y - 49,
        32,
        8
    );


    ctx.strokeStyle =
        "#A56E61";

    ctx.lineWidth =
        2;


    for (
        let i = 0;
        i < 2;
        i++
    ) {

        ctx.beginPath();

        ctx.moveTo(
            x + 140,
            y - 30 + i * 15
        );

        ctx.lineTo(
            x + 164,
            y - 30 + i * 15
        );

        ctx.stroke();

    }


    /* =====================================================
       DUVAR
    ===================================================== */

    ctx.fillStyle =
        "#DDAF78";


    ctx.fillRect(
        x,
        y + roofHeight,
        width,
        height - roofHeight
    );


    /* Ahşap kirişler */

    ctx.fillStyle =
        "#9B684A";


    ctx.fillRect(
        x + 8,
        y + roofHeight,
        8,
        height - roofHeight
    );


    ctx.fillRect(
        x + width - 16,
        y + roofHeight,
        8,
        height - roofHeight
    );


    ctx.fillRect(
        x,
        y + roofHeight,
        width,
        9
    );


    ctx.fillRect(
        x,
        y + height - 10,
        width,
        10
    );


    /* =====================================================
       DUVAR ÇİZGİLERİ
    ===================================================== */

    ctx.strokeStyle =
        "rgba(120,75,45,0.18)";

    ctx.lineWidth =
        2;


    for (
        let i = 25;
        i < height - roofHeight;
        i += 20
    ) {

        ctx.beginPath();

        ctx.moveTo(
            x + 16,
            y + roofHeight + i
        );

        ctx.lineTo(
            x + width - 16,
            y + roofHeight + i
        );

        ctx.stroke();

    }


    /* =====================================================
       EV İÇİ
    ===================================================== */

    drawHouseInterior(
        x,
        y
    );


    /* =====================================================
       SOL PENCERE
    ===================================================== */

    const windowY =
        y + 75;


    ctx.fillStyle =
        "#704C3D";


    ctx.fillRect(
        x + 25,
        windowY,
        45,
        38
    );


    ctx.fillStyle =
        "#9ED9E8";


    ctx.fillRect(
        x + 30,
        windowY + 5,
        35,
        28
    );


    ctx.fillStyle =
        "rgba(255,255,255,0.45)";


    ctx.fillRect(
        x + 33,
        windowY + 7,
        12,
        5
    );


    ctx.strokeStyle =
        "#704C3D";

    ctx.lineWidth =
        4;


    ctx.beginPath();

    ctx.moveTo(
        x + 47,
        windowY + 5
    );

    ctx.lineTo(
        x + 47,
        windowY + 33
    );

    ctx.moveTo(
        x + 30,
        windowY + 19
    );

    ctx.lineTo(
        x + 65,
        windowY + 19
    );

    ctx.stroke();


    /* =====================================================
       SAĞ PENCERE
    ===================================================== */

    ctx.fillStyle =
        "#704C3D";


    ctx.fillRect(
        x + 120,
        windowY,
        45,
        38
    );


    ctx.fillStyle =
        "#9ED9E8";


    ctx.fillRect(
        x + 125,
        windowY + 5,
        35,
        28
    );


    ctx.fillStyle =
        "rgba(255,255,255,0.45)";


    ctx.fillRect(
        x + 128,
        windowY + 7,
        12,
        5
    );


    ctx.strokeStyle =
        "#704C3D";

    ctx.lineWidth =
        4;


    ctx.beginPath();

    ctx.moveTo(
        x + 142,
        windowY + 5
    );

    ctx.lineTo(
        x + 142,
        windowY + 33
    );

    ctx.moveTo(
        x + 125,
        windowY + 19
    );

    ctx.lineTo(
        x + 160,
        windowY + 19
    );

    ctx.stroke();


    /* =====================================================
       KAPI
    ===================================================== */

    const doorX =
        centerX - 22;

    const doorY =
        y + 65;


    ctx.fillStyle =
        "#71493C";


    ctx.fillRect(
        doorX,
        doorY,
        44,
        60
    );


    ctx.strokeStyle =
        "#9B6851";

    ctx.lineWidth =
        3;


    ctx.strokeRect(
        doorX + 7,
        doorY + 7,
        30,
        45
    );


    ctx.fillStyle =
        "#9ED9E8";


    ctx.fillRect(
        doorX + 12,
        doorY + 11,
        20,
        14
    );


    ctx.fillStyle =
        "#E4BD62";


    ctx.beginPath();

    ctx.arc(
        doorX + 33,
        doorY + 34,
        3,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* Kapı saçağı */

    ctx.fillStyle =
        "#633F35";


    ctx.fillRect(
        doorX - 7,
        doorY - 6,
        58,
        7
    );


    /* =====================================================
       ÇATI
    ===================================================== */

    ctx.fillStyle =
        "#87545C";


    ctx.beginPath();

    ctx.moveTo(
        x - 18,
        y + roofHeight
    );

    ctx.lineTo(
        centerX,
        y
    );

    ctx.lineTo(
        x + width + 18,
        y + roofHeight
    );

    ctx.closePath();

    ctx.fill();


    /* Çatı kenarı */

    ctx.fillStyle =
        "#633F47";


    ctx.beginPath();

    ctx.moveTo(
        x - 20,
        y + roofHeight
    );

    ctx.lineTo(
        centerX,
        y - 4
    );

    ctx.lineTo(
        x + width + 20,
        y + roofHeight
    );

    ctx.lineTo(
        x + width + 20,
        y + roofHeight + 8
    );

    ctx.lineTo(
        centerX,
        y + 5
    );

    ctx.lineTo(
        x - 20,
        y + roofHeight + 8
    );

    ctx.closePath();

    ctx.fill();


    /* Çatı detayları */

    ctx.strokeStyle =
        "rgba(255,220,190,0.18)";

    ctx.lineWidth =
        2;


    for (
        let row = 0;
        row < 4;
        row++
    ) {

        const yy =
            y + 15 + row * 12;


        ctx.beginPath();

        ctx.moveTo(
            centerX - 15 - row * 18,
            yy
        );

        ctx.lineTo(
            centerX + 15 + row * 18,
            yy
        );

        ctx.stroke();

    }


    /* =====================================================
       ÇİÇEKLER
    ===================================================== */

    drawFlower(
        x + 12,
        y + height - 3,
        "#E88EAC"
    );


    drawFlower(
        x + 25,
        y + height - 4,
        "#F2C86B"
    );


    drawFlower(
        x + width - 25,
        y + height - 4,
        "#B78DDA"
    );


    drawFlower(
        x + width - 12,
        y + height - 3,
        "#E88EAC"
    );


    /* Çalılar */

    drawBush(
        x - 8,
        y + height - 3,
        0.8
    );


    drawBush(
        x + width + 3,
        y + height - 3,
        0.8
    );


    /* =====================================================
       KAPI ÜSTÜ KALP
    ===================================================== */

    const heartFloat =
        Math.sin(
            performance.now() * 0.002
        ) * 2;


    ctx.fillStyle =
        "#E98DAE";

    ctx.font =
        "bold 16px Arial";

    ctx.textAlign =
        "center";


    ctx.fillText(
        "♥",
        centerX,
        doorY - 12 + heartFloat
    );


    ctx.restore();

}


/* =========================================================
   OYUNCU
========================================================= */

function drawPlayer() {

    const x =
        Math.floor(
            player.x -
            world.cameraX
        );


    const y =
        Math.floor(
            player.y
        );


    const moving =
        Math.abs(
            player.velocityX
        ) > 0.1;


    const time =
        performance.now();


    const walk =
        moving &&
        player.onGround
            ? Math.sin(
                time * 0.015
            )
            : 0;


    const breathing =
        !moving &&
        player.onGround
            ? Math.sin(
                time * 0.003
            ) * 1.2
            : 0;


    const jumping =
        !player.onGround;


    const centerX =
        x + 32;


    const bodyY =
        y + 40 +
        breathing;


    ctx.save();


    /* Gölge */

    if (
        player.onGround
    ) {

        ctx.fillStyle =
            "rgba(0,0,0,0.18)";


        ctx.beginPath();

        ctx.ellipse(
            centerX,
            y + 94,
            20,
            5,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }


    let leftLegOffset = 0;
    let rightLegOffset = 0;
    let leftArmOffset = 0;
    let rightArmOffset = 0;


    if (jumping) {

        leftLegOffset = -4;
        rightLegOffset = -2;

        leftArmOffset = -7;
        rightArmOffset = -7;

    }

    else {

        leftLegOffset =
            walk * 5;

        rightLegOffset =
            -walk * 5;

        leftArmOffset =
            -walk * 4;

        rightArmOffset =
            walk * 4;

    }


    /* Saç arkası */

    ctx.fillStyle =
        "#5A3828";


    ctx.beginPath();

    ctx.arc(
        centerX,
        y + 25,
        24,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillRect(
        centerX - 23,
        y + 25,
        9,
        28
    );

    ctx.fillRect(
        centerX + 14,
        y + 25,
        9,
        28
    );


    /* Boyun */

    ctx.fillStyle =
        "#FFD4B8";


    ctx.fillRect(
        centerX - 6,
        y + 39,
        12,
        10
    );


    /* Sol kol */

    ctx.save();

    ctx.translate(
        centerX - 16,
        bodyY + 8
    );

    ctx.rotate(
        leftArmOffset * 0.025
    );


    ctx.fillStyle =
        "#F3A9C5";


    ctx.roundRect(
        -5,
        0,
        10,
        28,
        5
    );

    ctx.fill();


    ctx.fillStyle =
        "#FFD4B8";


    ctx.beginPath();

    ctx.arc(
        0,
        30,
        6,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.restore();


    /* Sağ kol */

    ctx.save();

    ctx.translate(
        centerX + 16,
        bodyY + 8
    );

    ctx.rotate(
        rightArmOffset * 0.025
    );


    ctx.fillStyle =
        "#F3A9C5";


    ctx.roundRect(
        -5,
        0,
        10,
        28,
        5
    );

    ctx.fill();


    ctx.fillStyle =
        "#FFD4B8";


    ctx.beginPath();

    ctx.arc(
        0,
        30,
        6,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.restore();


    /* Gövde */

    ctx.fillStyle =
        "#F29FC1";


    ctx.beginPath();

    ctx.roundRect(
        centerX - 16,
        bodyY,
        32,
        34,
        8
    );

    ctx.fill();


    /* Elbise */

    ctx.fillStyle =
        "#FFD6E7";


    ctx.fillRect(
        centerX - 13,
        bodyY + 7,
        26,
        5
    );


    /* Etek */

    ctx.fillStyle =
        "#D982AA";


    ctx.beginPath();

    ctx.moveTo(
        centerX - 19,
        bodyY + 28
    );

    ctx.lineTo(
        centerX + 19,
        bodyY + 28
    );

    ctx.lineTo(
        centerX + 24,
        bodyY + 42
    );

    ctx.lineTo(
        centerX - 24,
        bodyY + 42
    );

    ctx.closePath();

    ctx.fill();


    /* Bacaklar */

    ctx.fillStyle =
        "#FFD4B8";


    ctx.save();

    ctx.translate(
        centerX - 8,
        bodyY + 40
    );

    ctx.rotate(
        leftLegOffset * 0.035
    );

    ctx.fillRect(
        -5,
        0,
        10,
        16
    );

    ctx.restore();


    ctx.save();

    ctx.translate(
        centerX + 8,
        bodyY + 40
    );

    ctx.rotate(
        rightLegOffset * 0.035
    );

    ctx.fillRect(
        -5,
        0,
        10,
        16
    );

    ctx.restore();


    /* Ayakkabılar */

    ctx.fillStyle =
        "#6E527F";


    ctx.beginPath();

    ctx.ellipse(
        centerX - 9 +
        leftLegOffset * 0.05,
        bodyY + 58,
        9,
        5,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.beginPath();

    ctx.ellipse(
        centerX + 9 +
        rightLegOffset * 0.05,
        bodyY + 58,
        9,
        5,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* Yüz */

    ctx.fillStyle =
        "#FFD4B8";


    ctx.beginPath();

    ctx.arc(
        centerX,
        y + 26,
        20,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* Saç */

    ctx.fillStyle =
        "#5A3828";


    ctx.beginPath();

    ctx.arc(
        centerX,
        y + 20,
        22,
        Math.PI,
        Math.PI * 2
    );

    ctx.fill();


    /* Perçem */

    ctx.beginPath();

    ctx.moveTo(
        centerX - 21,
        y + 20
    );

    ctx.quadraticCurveTo(
        centerX - 10,
        y + 30,
        centerX - 4,
        y + 19
    );

    ctx.quadraticCurveTo(
        centerX + 2,
        y + 30,
        centerX + 8,
        y + 18
    );

    ctx.quadraticCurveTo(
        centerX + 16,
        y + 28,
        centerX + 21,
        y + 20
    );

    ctx.fill();


    /* Gözler */

    ctx.fillStyle =
        "#39263B";


    ctx.beginPath();

    ctx.ellipse(
        centerX - 8,
        y + 28,
        3.5,
        5,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.beginPath();

    ctx.ellipse(
        centerX + 8,
        y + 28,
        3.5,
        5,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* Göz ışığı */

    ctx.fillStyle =
        "#FFFFFF";


    ctx.fillRect(
        centerX - 9,
        y + 26,
        2,
        2
    );


    ctx.fillRect(
        centerX + 7,
        y + 26,
        2,
        2
    );


    /* Burun */

    ctx.fillStyle =
        "#E9A88D";


    ctx.fillRect(
        centerX - 1,
        y + 34,
        2,
        2
    );


    /* Gülümseme */

    ctx.strokeStyle =
        "#8E5262";

    ctx.lineWidth =
        1.5;


    ctx.beginPath();

    ctx.arc(
        centerX,
        y + 35,
        5,
        0.2,
        Math.PI - 0.2
    );

    ctx.stroke();


    /* Yanaklar */

    ctx.fillStyle =
        "rgba(255,130,160,0.35)";


    ctx.beginPath();

    ctx.ellipse(
        centerX - 14,
        y + 36,
        5,
        3,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.beginPath();

    ctx.ellipse(
        centerX + 14,
        y + 36,
        5,
        3,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* Fiyonk */

    ctx.fillStyle =
        "#E98DB5";


    ctx.beginPath();

    ctx.moveTo(
        centerX - 18,
        y + 9
    );

    ctx.lineTo(
        centerX - 28,
        y + 4
    );

    ctx.lineTo(
        centerX - 27,
        y + 16
    );

    ctx.closePath();

    ctx.fill();


    ctx.beginPath();

    ctx.moveTo(
        centerX - 18,
        y + 9
    );

    ctx.lineTo(
        centerX - 8,
        y + 4
    );

    ctx.lineTo(
        centerX - 9,
        y + 16
    );

    ctx.closePath();

    ctx.fill();


    ctx.restore();

}


/* =========================================================
   DÜNYAYI ÇİZ
========================================================= */

function drawWorld() {

    ctx.clearRect(
        0,
        0,
        GAME_WIDTH,
        GAME_HEIGHT
    );


    drawBackground();

    drawPlatforms();

    drawCheckpoints();


    /* Venüs */

    if (
        venus.active ||
        player.x > venus.x - 250
    ) {

        drawVenus();

    }


    /* Polis */

    if (
        police.active ||
        player.x > police.x - 250
    ) {

        drawPolice();

    }


    /* Ev */

    drawFinalHouse();


    /* Oyuncu */

    drawPlayer();

    /* =========================================================
   FİNAL EVİ + YATAKTAKİ ERKEK ETKİLEŞİMİ
   EK MODÜL - MEVCUT KOD DEĞİŞTİRİLMEDİ
========================================================= */
/* =========================================================
   EVİ E İLE AÇ
========================================================= */

function updateFinalHouse() {

    if (
        game.finalTriggered ||
        game.finalHouseInterior ||
        game.ending
    ) {

        return;

    }


    const distance =
        Math.abs(
            player.x -
            finalHouse.x
        );


    if (
        distance < 120 &&
        keys.interact
    ) {

        keys.interact = false;

        game.finalTriggered = true;

        game.paused = true;


        dialogueAction =
            () => {

                openCodeScreen();

            };


        startDialogue(
            dialogues.finalDoor
        );

    }

}


/* =========================================================
   ŞİFRE BAŞARILI OLDUKTAN SONRA
   OYUNU BİTİRME — OYUNCUYU EVİN İÇİNE AL
========================================================= */

function showEnding() {

    /*
       Burada artık direkt THE END göstermiyoruz.
       Önce oyuncuyu evin içine alıyoruz.
    */

    game.ending = false;

    game.paused = false;

    game.finalHouseInterior = true;


    /*
       Oyuncuyu evin içine taşı.
    */

    player.x = 6460;
    player.y = 408;

    player.velocityX = 0;
    player.velocityY = 0;

    player.spawnX = 6460;
    player.spawnY = 408;


    finalBoyInteractionTriggered = false;


    showFinalBoyMessage();

}


/* =========================================================
   "EVİN İÇİNE GİRDİN" MESAJI
========================================================= */

function showFinalBoyMessage() {

    const element =
        document.getElementById(
            "checkpointMessage"
        );


    if (!element)
        return;


    element.textContent =
        "❤️ Eve geldin... Yanındaki kişiyle konuşmak için E'ye bas.";


    element.classList.remove(
        "hidden"
    );


    setTimeout(
        () => {

            element.classList.add(
                "hidden"
            );

        },
        3500
    );

}


/* =========================================================
   YATAKTAKİ ERKEKLE ETKİLEŞİM
========================================================= */

function updateFinalBoy() {

    if (
        !game.finalHouseInterior ||
        game.ending ||
        finalBoyInteractionTriggered
    ) {

        return;

    }


    /*
       drawSleepingBoy() içerisindeki konuma göre
       yatağın/erkeğin yaklaşık etkileşim alanı.
    */

    const boyX =
        finalHouse.x + 18 + 46;


    const boyWidth =
        120;


    const distance =
        Math.abs(
            player.x -
            boyX
        );


    if (
        distance < boyWidth &&
        keys.interact
    ) {

        keys.interact = false;

        finalBoyInteractionTriggered =
            true;


        showFinalEnding();

    }

}

let finalBoyInteractionTriggered = false;
let finalHouseInteractionTriggered = false;




/* =========================================================
   GERÇEK OYUN SONU
========================================================= */

function showFinalEnding() {

    game.ending = true;

    game.paused = true;


    const endingText =
        document.getElementById(
            "endingText"
        );


    if (endingText) {

        endingText.textContent =
            "❤️ SENİ ÇOOOOK SEVİYORRRUMM KADINIMMM İYİ Kİ VARSIN HEP BENİMLE KAL ❤️";

    }


    const endingScreen =
        document.getElementById(
            "endingScreen"
        );


    if (endingScreen) {

        endingScreen.classList.remove(
            "hidden"
        );

    }

}


/* =========================================================
   UPDATE SİSTEMİNE ERKEĞİ EKLE
========================================================= */

const originalUpdate =
    update;


/*
   Mevcut update fonksiyonunu bozmadan
   yeni etkileşimi üzerine ekliyoruz.
*/

function update() {

    if (
        game.started
    ) {

        updatePlayer();

        updateCheckpoints();

        updateVenus();

        updatePolice();

        updateFinalHouse();

        updateFinalBoy();

    }

}


/* =========================================================
   FINAL EVİ ÇİZİMİ
   Zaten mevcut drawHouseInterior()
   burada otomatik olarak çalışıyor.
========================================================= */


/* =========================================================
   OYUN DÖNGÜSÜ
========================================================= */

function gameLoop() {

    update();

    drawWorld();

    requestAnimationFrame(
        gameLoop
    );

}


    /* =====================================================
       FINAL PARILTISI
    ===================================================== */

    if (
        game.finalHouseInterior
    ) {

        const alpha =
            0.08 +
            Math.sin(
                performance.now() * 0.003
            ) * 0.03;


        ctx.fillStyle =
            `rgba(255,220,235,${alpha})`;


        ctx.fillRect(
            0,
            0,
            GAME_WIDTH,
            GAME_HEIGHT
        );

    }

}


/* =========================================================
   UPDATE
========================================================= */

function update() {

    if (
        game.started
    ) {

        updatePlayer();

        updateCheckpoints();

        updateVenus();

        updatePolice();

        updateFinalHouse();

    }

}


/* =========================================================
   GAME LOOP
========================================================= */

function gameLoop() {

    update();

    drawWorld();

    requestAnimationFrame(
        gameLoop
    );

}


/* =========================================================
   START
========================================================= */

const startButton =
    document.getElementById(
        "startButton"
    );


if (startButton) {

    startButton.addEventListener(
        "click",
        () => {

            game.started =
                true;

            game.paused =
                false;


            const startScreen =
                document.getElementById(
                    "startScreen"
                );


            if (startScreen) {

                startScreen.classList.add(
                    "hidden"
                );

            }


            player.x =
                100;

            player.y =
                350;

            player.spawnX =
                100;

            player.spawnY =
                350;

            player.velocityX =
                0;

            player.velocityY =
                0;


            world.cameraX =
                0;

        }
    );

}


/* =========================================================
   DİALOG KLAVYE
========================================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            !game.dialogueActive
        ) {

            return;

        }


        if (
            event.key === " " ||
            event.key === "Enter" ||
            event.key.toLowerCase() === "e"
        ) {

            event.preventDefault();

            advanceDialogue();

        }

    }
);


/* =========================================================
   BAŞLANGIÇ
========================================================= */

gameLoop();