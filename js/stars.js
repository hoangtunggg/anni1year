const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

// Objects
function Heart(x, y, radius) {
    this.x = x;
    this.y = y;
    this.size = radius;
    this.velocity = {
        x: (Math.random() - 0.5) * 8,
        y: (Math.random() * 1) + 2
    };
    this.friction = 1;
    this.gravity = 0.05;
}

Heart.prototype.draw = function() {
    drawHeart(this.x, this.y, this.size);
};

Heart.prototype.update = function() {
    this.draw();

    if (this.y + this.size + this.velocity.y > canvas.height - groundHeight) {
        this.velocity.y = -this.velocity.y * this.friction;
        this.y = canvas.height - groundHeight - this.size;
        this.shatter();
    } else {
        this.velocity.y += this.gravity;
    }

    if (this.x + this.size + this.velocity.x > canvas.width) {
        this.x = canvas.width - this.size;
        this.velocity.x = -this.velocity.x * this.friction;
        this.shatter();
    } else if (this.x - this.size < 0) {
        this.x = this.size;
        this.velocity.x = -this.velocity.x * this.friction;
        this.shatter();
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;
};

Heart.prototype.shatter = function() {
    this.size -= 3;
    for (let i = 0; i < 8; i++) {
        miniHearts.push(new MiniHeart(this.x, this.y, 2));
    }
};

function MiniHeart(x, y, radius) {
    Heart.call(this, x, y, radius);
    this.velocity = {
        x: (Math.random() - 0.5) * 10,
        y: (Math.random() - 0.5) * 30
    };
    this.friction = 0.8;
    this.gravity = 0.1;
    this.ttl = 100;
    this.opacity = 1;
}

MiniHeart.prototype.draw = function() {
    c.save();
    c.globalAlpha = this.opacity;
    drawHeart(this.x, this.y, this.size);
    c.restore();
};

MiniHeart.prototype.update = function() {
    this.draw();

    if (this.y + this.size + this.velocity.y > canvas.height - groundHeight) {
        this.velocity.y = -this.velocity.y * this.friction;
    } else {
        this.velocity.y += this.gravity;
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.ttl -= 1;
    this.opacity -= 0.01;
};

function drawHeart(x, y, size) {
    c.save();
    c.beginPath();
    c.moveTo(x, y);
    c.bezierCurveTo(x, y + size / 2, x - size, y + size / 2, x - size, y);
    c.bezierCurveTo(x - size, y - size, x, y - size / 2, x, y - size);
    c.bezierCurveTo(x, y - size / 2, x + size, y - size, x + size, y);
    c.bezierCurveTo(x + size, y + size, x, y + size / 2, x, y);
    c.fillStyle = 'red';
    c.fill();
    c.closePath();
    c.restore();
}

function drawHeart2(x, y, size) {
    c.save();
    c.beginPath();
    c.moveTo(x, y);

    // Điều chỉnh các đường cong Bézier để tạo hình trái tim hoàn hảo
    c.bezierCurveTo(x, y - size / 3, x - size / 2, y - size / 3, x - size / 2, y); // Bên trái
    c.bezierCurveTo(x - size / 2, y + size / 2, x, y + size / 4, x, y + size / 2); // Dưới trái
    c.bezierCurveTo(x, y + size / 4, x + size / 2, y + size / 2, x + size / 2, y); // Dưới phải
    c.bezierCurveTo(x + size / 2, y - size / 3, x, y - size / 3, x, y); // Bên phải

    c.fillStyle = '#A00000';// Đặt màu trái tim thành màu đỏ
    c.fill(); // Đổ màu vào hình đã vẽ
    c.closePath(); // Đóng đường vẽ
    c.restore(); // Khôi phục trạng thái canvas trước đó
}




 
// Hàm vẽ một trái tim tĩnh duy nhất trong nền
function drawStaticHeart() {
    const x = canvas.width / 2;
    const y = canvas.height / 2.5;
    const size = 700; // Kích thước của trái tim
    drawHeart2(x, y, size);
}

// Đổi màu background
const backgroundGradient = c.createLinearGradient(0, 0, canvas.width, canvas.height);
backgroundGradient.addColorStop(0, '#ff9a9e');
backgroundGradient.addColorStop(1, '#fad0c4');

let hearts = [];
let miniHearts = [];
let ticker = 0;
let randomSpawnRate = 75;
const groundHeight = 0.09 * canvas.height;
let inf = 1e9;

function init() {
    hearts = [];
    miniHearts = [];

    for (let i = 0; i < 200; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height * 0.5;
        const radius = Math.random() * 8 + 2;
        hearts.push(new Heart(x, y, radius));
    }
}

function animate() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = backgroundGradient;
    c.fillStyle = 'black'; // Đặt màu nền là đen
    c.fillRect(0, 0, canvas.width, canvas.height); // Tô nền

    // Vẽ một trái tim tĩnh trong nền
    drawStaticHeart();

    hearts.forEach(heart => {
        heart.update();
    });

    miniHearts.forEach((miniHeart, index) => {
        miniHeart.update();
        if (miniHeart.ttl <= 0) {
            miniHearts.splice(index, 1);
        }
    });

    ticker++;
    if (ticker >= inf) {
        ticker = 0;
    }
    if (ticker % randomSpawnRate === 0) {
        const radius = Math.random() * 8 + 2;
        const x = Math.random() * canvas.width;
        hearts.push(new Heart(x, -10, radius));
        randomSpawnRate = Math.floor(Math.random() * (200 - 125 + 1) + 125);
    }

    requestAnimationFrame(animate);
}

init();
animate();
