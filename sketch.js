let yesButton;
let noButton;
let message = "你愛我嗎？";
let hearts = [];
let textColor;
let sadImage;
let showImage = false;
let imageScale = 1;
let messageBox = {
    show: false,
    alpha: 0,
    y: 30
};
let buttonPressed = false; // 保留此變數用於控制訊息框顯示

function preload() {
    sadImage = loadImage('sad.jpeg');
}

function setup() {
    createCanvas(400, 200);
    textAlign(CENTER, CENTER);
    textFont('Noto Sans TC');
    imageMode(CENTER);
    
    textColor = color('#FF69B4');
    
    let centerY = height/2 + 20;
    let buttonSpacing = 20;
    let totalButtonWidth = 160;
    let startX = width/2 - totalButtonWidth/2;
    
    yesButton = createButton('愛');
    yesButton.position(startX, centerY);
    yesButton.mousePressed(showLoveMessage);
    yesButton.id('yesButton');
    
    noButton = createButton('不愛');
    noButton.position(startX + totalButtonWidth - 60, centerY);
    noButton.mouseOver(moveNoButton); // 直接綁定 mouseOver 事件
    noButton.mousePressed(showSadImage);
    noButton.id('noButton');
}

function draw() {
    background(255, 255, 255, 220);
    
    // 繪製愛心背景
    for (let i = hearts.length - 1; i >= 0; i--) {
        hearts[i].display();
        hearts[i].update();
        if (hearts[i].isOffscreen()) {
            hearts.splice(i, 1);
        }
    }
    
    // 繪製主要內容
    if (showImage && sadImage) {
        let baseScale = min(width/sadImage.width, height/sadImage.height) * 0.8;
        let currentScale = baseScale * imageScale;
        
        image(sadImage, 
              width/2, 
              height/2, 
              sadImage.width * currentScale, 
              sadImage.height * currentScale);
        
        if (imageScale < 1.2) {
            imageScale += 0.01;
        }
    } else {
        textSize(32);
        drawTextWithShadow(message, width/2, height/2 - 40);
    }
    
    // 只在按下按鈕後顯示訊息框
    if (messageBox.show && buttonPressed) {
        push();
        fill(255, 255, 255, messageBox.alpha);
        stroke('#FF6B6B');
        strokeWeight(2);
        rectMode(CENTER);
        rect(width/2, messageBox.y, 200, 40, 10);
        
        noStroke();
        fill('#FF6B6B');
        textSize(20);
        text("再給你一次機會", width/2, messageBox.y);
        pop();
        
        messageBox.alpha = min(messageBox.alpha + 15, 255);
    }
}

function moveNoButton() {
    let windowW = windowWidth - 100;
    let windowH = windowHeight - 100;
    
    let buttonW = noButton.width;
    let buttonH = noButton.height;
    
    let newX = random(50, windowW - buttonW);
    let newY = random(50, windowH - buttonH);
    
    let yesPos = yesButton.position();
    while (abs(newX - yesPos.x) < 100 && abs(newY - yesPos.y) < 50) {
        newX = random(50, windowW - buttonW);
        newY = random(50, windowH - buttonH);
    }
    
    noButton.style('transition', 'all 0.3s ease');
    noButton.position(newX, newY);
}

function showSadImage() {
    buttonPressed = true; // 只有在實際按下按鈕時才顯示訊息
    showImage = true;
    message = "嗚嗚...";
    imageScale = 0.5;
    showMessageBox();
}

function showMessageBox() {
    messageBox.show = true;
    messageBox.alpha = 0;
    
    setTimeout(() => {
        messageBox.show = false;
    }, 3000);
}

function drawTextWithShadow(txt, x, y) {
    push();
    fill(0, 0, 0, 30);
    text(txt, x + 2, y + 2);
    pop();
    
    fill(textColor);
    text(txt, x, y);
}

function showLoveMessage() {
    showImage = false;
    imageScale = 1;
    message = "我就知道你一定愛我～";
    messageBox.show = false;
    buttonPressed = false;
    textColor = color('#FF1493');
    for (let i = 0; i < 15; i++) {
        hearts.push(new Heart());
    }
}

// Heart 類別保持不變
class Heart {
    constructor() {
        this.x = random(width);
        this.y = height + 20;
        this.speed = random(1, 3);
        this.size = random(10, 20);
        this.opacity = 255;
    }
    
    update() {
        this.y -= this.speed;
        this.opacity -= 2;
    }
    
    display() {
        push();
        translate(this.x, this.y);
        fill(255, 105, 180, this.opacity);
        noStroke();
        beginShape();
        vertex(0, -this.size/2);
        bezierVertex(this.size/2, -this.size, this.size/2, 0, 0, this.size/2);
        bezierVertex(-this.size/2, 0, -this.size/2, -this.size, 0, -this.size/2);
        endShape(CLOSE);
        pop();
    }
    
    isOffscreen() {
        return this.y < -20 || this.opacity <= 0;
    }
}