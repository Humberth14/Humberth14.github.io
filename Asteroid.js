function Asteroid(scene, scale, difficulty, viewportSize, time, audioContext, largeExplosionBuffer, mediumExplosionBuffer, smallExplosionBuffer){

try{
//Se define la direccion del asteroide
var xDMod = Math.random() > .5 ? 1 : -1;
var yDMod = Math.random() > .5 ? 1 : -1;
//Se define un vector de 3 elementos para definir la posicion del asteroide
var asteroidVector = new THREE.Vector3(Math.random() * difficulty * 75 * xDMod, Math.random() * difficulty * 75 * yDMod, -5);
this.position = new THREE.Vector3();
this.Difficulty = difficulty;
var that = this;
//Se crea una funcion para el tiempo de regeneracion del asteroide
var lastTime = time;
var timeDelta;
function updateTime(t){
if(lastTime == t) return;
else{
timeDelta = (t - lastTime) / 1000;
lastTime = t;
}
}

//se genera una funcion que cargue al buffer los archivos de sonido
function loadSounds(i){
var request = new XMLHttpRequest();
if(i == 0)request.open('GET', "Sounds/Ahhh!.wav", true);
if(i == 1)request.open('GET', "Sounds/Ahhh!.wav", true);
if(i == 2)request.open('GET', "Sounds/Ahhh!.wav", true);
request.responseType = 'arraybuffer';
request.onload = function() {
audioContext.decodeAudioData(request.response, function(buffer) {
if(i == 0){
largeExplosionBuffer = buffer;
loadSounds(1);
}
if(i == 1){
mediumExplosionBuffer = buffer;
loadSounds(2);
}
if(i == 2){
smallExplosionBuffer = buffer;
}
});
}
request.send();
}
if(largeExplosionBuffer == null)loadSounds(0); 
// Se cargan las 6 texturas de manera aleatoria
var textureRandom=Math.random();
if(textureRandom<0.16)
var asteroidTexture =new THREE.ImageUtils.loadTexture( 'images/aste.jpg' );
else if(0.16<=textureRandom && textureRandom<0.32)
var asteroidTexture =new THREE.ImageUtils.loadTexture( 'images/aste2.jpg' );
else if(0.32<=textureRandom && textureRandom<0.48)
var asteroidTexture =new THREE.ImageUtils.loadTexture( 'images/aste3.jpg' );
else if(0.48<=textureRandom && textureRandom<0.64)
var asteroidTexture =new THREE.ImageUtils.loadTexture( 'images/aste4.jpg' );
else if(0.64<=textureRandom && textureRandom<0.80)
var asteroidTexture =new THREE.ImageUtils.loadTexture( 'images/aste5.jpg' );
else if(0.8<textureRandom)
var asteroidTexture =new THREE.ImageUtils.loadTexture( 'images/aste6.jpg' );
//se crea el asteroide
var mainAsteroid = new THREE.Mesh(new THREE.SphereGeometry(10,4,4),new THREE.MeshLambertMaterial({map:asteroidTexture}));   
//Se crea mediante 4 vectores la hitbox
var bulletHitboxVertices = [];
bulletHitboxVertices.push(new THREE.Vector3(-4 * scale,-4 * scale,0));
bulletHitboxVertices.push(new THREE.Vector3(-4 * scale,4 * scale,0));
bulletHitboxVertices.push(new THREE.Vector3(4 * scale,4 * scale,0));
bulletHitboxVertices.push(new THREE.Vector3(4 * scale,-4 * scale,0));
//checa si alguno de los puntos choco con la hitbox
this.checkCollision = function(points){
for(var i = 0; i < points.length; i ++){
//vertical
if(points[i].y < bulletHitboxVertices[1].y && points[i].y > bulletHitboxVertices[0].y ){
//horizontal
if(points[i].x < bulletHitboxVertices[2].x && points[i].x > bulletHitboxVertices[0].x ) {
return true;
}}}
return false;
}
//Funcion para un comienzo aleatorio de los asteroides
this.randomStart = function(){
var startX = 0;
var startY = 0;
while(that.checkCollision([new THREE.Vector3(10, 10, 0)])){
startX = Math.random() * viewportSize;
startY = Math.random() * viewportSize;
startX = startX > viewportSize / 2 ? (startX - (viewportSize/2)) * -1 : startX;
startY = startY > viewportSize / 2 ? (startY - (viewportSize/2)) * -1 : startY;
bulletHitboxVertices = [];
bulletHitboxVertices.push(new THREE.Vector3((-4 * scale) + startX,(-4 * scale) + startY,0));
bulletHitboxVertices.push(new THREE.Vector3((-4 * scale) + startX,(4 * scale) + startY,0));
bulletHitboxVertices.push(new THREE.Vector3((4 * scale) + startX,(4 * scale) + startY,0));
bulletHitboxVertices.push(new THREE.Vector3((4 * scale) + startX,(-4 * scale) + startY,0));
mainAsteroid.position.set(startX, startY, 750);
that.position.copy(mainAsteroid.position);
}}
//funcion para un comienzo fijo de los asteroides (mini asteroides)
this.fixedStart = function(location){
var startX = location.x;
var startY = location.y;
bulletHitboxVertices = [];
bulletHitboxVertices.push(new THREE.Vector3((-4 * scale) + startX,(-4 * scale) + startY,0));
bulletHitboxVertices.push(new THREE.Vector3((-4 * scale) + startX,(4 * scale) + startY,0));
bulletHitboxVertices.push(new THREE.Vector3((4 * scale) + startX,(4 * scale) + startY,0));
bulletHitboxVertices.push(new THREE.Vector3((4 * scale) + startX,(-4 * scale) + startY,0));
mainAsteroid.position.set(startX, startY, 750);
if(isNaN(mainAsteroid.position.x)) alert("bFUCK");
that.position.copy(mainAsteroid.position);
if(isNaN(that.position.x)) alert("cFUCK");
}
//escalar el asteroide
if(isNaN(mainAsteroid.position.x)) alert("aFUCK");
mainAsteroid.scale.set(scale,scale,1);
scene.add(mainAsteroid);
//escalar hitboxes
function setHitboxXY(xValue, yValue){
bulletHitboxVertices = [];
bulletHitboxVertices.push(new THREE.Vector3((-4 * scale) + xValue,(-4 * scale) + yValue,0));
bulletHitboxVertices.push(new THREE.Vector3((-4 * scale) + xValue,(4 * scale) + yValue,0));
bulletHitboxVertices.push(new THREE.Vector3((4 * scale) + xValue,(4 * scale) + yValue,0));
bulletHitboxVertices.push(new THREE.Vector3((4 * scale) + xValue,(-4 * scale) + yValue,0));
}
//funcion que dibuja el escenario
this.draw = function(t){
updateTime(t);
var vec = new THREE.Vector3();
vec.copy(asteroidVector);
vec.multiplyScalar(timeDelta);
mainAsteroid.position.add(vec);
that.position.copy(mainAsteroid.position);
//checar si esta en los limites del tablero
if(mainAsteroid.position.x < viewportSize / -2){
mainAsteroid.position.x = viewportSize / 2;
}
if(mainAsteroid.position.x > viewportSize / 2){ 
mainAsteroid.position.x = viewportSize / -2;
}
if(mainAsteroid.position.y < viewportSize / -2){ 
mainAsteroid.position.y = viewportSize / 2;
}
if(mainAsteroid.position.y > viewportSize / 2){ 
mainAsteroid.position.y = viewportSize / -2;
}
setHitboxXY(mainAsteroid.position.x, mainAsteroid.position.y);
}
//funciones de sonido de destruccion de acuerdo al asteroide destruido
this.destroy = function(sound){
scene.remove(mainAsteroid);
var childAsteroids = [];
if(scale == 5){
var explosionSource = audioContext.createBufferSource();
explosionSource.buffer = largeExplosionBuffer;
explosionSource.connect(audioContext.destination);
 if(sound)explosionSource.start(0);
var seedDate = Date.now();
for(var i = 0; i < 3; i ++){
var a = new Asteroid(scene,3,that.Difficulty,viewportSize,seedDate, audioContext, largeExplosionBuffer, mediumExplosionBuffer, smallExplosionBuffer);
a.fixedStart(that.position)
childAsteroids.push(a);
}}
if(scale == 3){
var explosionSource = audioContext.createBufferSource();
explosionSource.buffer = mediumExplosionBuffer;
explosionSource.connect(audioContext.destination);
if(sound)explosionSource.start(0);
var seedDate = Date.now();
for(var i = 0; i < 3; i ++){
var a = new Asteroid(scene,2,that.Difficulty,viewportSize,seedDate, audioContext, largeExplosionBuffer, mediumExplosionBuffer, smallExplosionBuffer);
a.fixedStart(that.position)
childAsteroids.push(a);
}}
if(scale == 2){
var explosionSource = audioContext.createBufferSource();
explosionSource.buffer = smallExplosionBuffer;
explosionSource.connect(audioContext.destination);
if(sound)explosionSource.start(0);
}
return childAsteroids;
}
}
catch(err){
alert(err);
}	
}
