import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {physics} from './physics.js'
import * as dat from 'dat.gui' ; 

// Create the scene
const scene = new THREE.Scene();

// Create the camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 40000);
camera.position.z = 30;


//Display the value in screen 
var div = document.createElement('div');

// Set the position and styling of the div element
div.style.position = 'absolute';
div.style.top = '10px';
div.style.left = '10px';
div.style.color = 'black';
div.style.fontFamily = 'Arial';
div.style.fontSize = '20px';


document.body.appendChild(div);

// Create the renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// skybox
let materialArray = [];
let texture_ft = new THREE.TextureLoader().load( 'images/haze_ft.jpg');
let texture_bk = new THREE.TextureLoader().load( 'images/haze_bk.jpg');
let texture_up = new THREE.TextureLoader().load( 'images/haze_up.jpg') ;
let texture_dn = new THREE.TextureLoader().load( 'images/haze_dn.jpg');
let texture_rt = new THREE.TextureLoader().load( 'images/haze_rt.jpg');
let texture_lf = new THREE.TextureLoader().load( 'images/haze_lf.jpg');
  
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_ft }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_bk }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_up }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_dn }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_rt }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_lf }));

for (let i = 0; i < 6; i++)
  materialArray[i].side = THREE.BackSide;
   
let skyboxGeo = new THREE.BoxGeometry( 10000,10000 , 10000);
let skybox = new THREE.Mesh( skyboxGeo, materialArray );
skybox.position.y = 5000
scene.add( skybox );  



const loader = new GLTFLoader();

var airplane ; 
//init position 
var position = new THREE.Vector3( 0,5000, 5000) ;
loader.load('/models/Airplane/scene.gltf', (gltf) => {
  airplane = gltf.scene.children[0];
  airplane.position.copy(position) ;
  airplane.scale.set(1.2, 1.2,1.2); 
  airplane.rotation.set(5, 0 , 4.7)
  scene.add(gltf.scene) ; 
}, 
(xhr) => {
  // actions to perform whilst the file is loading
  console.log('GLB file is loading');
},
(error) => {
  // actions to perform if there's an error loading the file
 console.log('An error happened while loading GLB file');
});
var human ;  
var parachute ;     
function loadparachute()
{

    //load parachute 
    loader.load('/models/parachute/scene.gltf', (gltf) => {
      parachute = gltf.scene.children[0];
      parachute.scale.set(0.2 , 0.2 , 0.2)
      parachute.rotation.set(4.7 ,0 ,0 )
      parachute.position.set(position.x , position.y+ 5.5 ,position.z)
      scene.add(gltf.scene);
    }, 
    (xhr) => {
      // actions to perform whilst the file is loading
      console.log('GLB file is loading');
    },
    (error) => {
      // actions to perform if there's an error loading the file
    console.log('An error happened while loading GLB file');
    });
    

}
function loadhuman()
{
  loader.load('./models/Human/scene.gltf', (gltf) => {
    human = gltf.scene.children[0];
    human.rotation.set(4.72 ,0 ,1.7)
    human.position.set(position.x , position.y,position.z)
    scene.add(gltf.scene);
  }, 
  (xhr) => {
    // actions to perform whilst the file is loading
    console.log('GLB file is loading');
  },
  (error) => {
    // actions to perform if there's an error loading the file
  console.log('An error happened while loading GLB file');
});

}
window.addEventListener('resize' ,() =>
{
    renderer.setSize( window.innerWidth, window.innerHeight );
}) ; 

var velocity = new THREE.Vector3( 0, 0, 0) ;

const gui = new dat.GUI();
const controls = {
  windspeedx :0,    
  windspeedz :0 
}

gui.add(controls, 'windspeedx', -5, 5).name('windspeedx'); 
gui.add(controls, 'windspeedz', -5, 5).name('windspeedz'); 

// mass ,  density , delta time  , radius  
var physic = new physics(150 , 1.25  , 0.06 , 1 )


// Set up keyboard listener
document.addEventListener("keydown", keyboardcontrol, false);
var X_Y_Angle = 90 ; 
var Z_Y_Angle= 90 ; 
var is_down = false  ; 
var is_open = false ; 


// Define the keyboard event handler
function keyboardcontrol(event) {
  // Get the key code
  var key = event.key; 
 
  if(key=='w'&& !is_down)
  {
      airplane.position.y += 3
      position.y +=3 
  }
  if(key=='s'&& !is_down)
  {
      airplane.position.y -= 3
      position.y -=3
  }
  if(key == 'd'&& !is_down)
  {
    airplane.position.x +=3 
    position.x +=3
  }
  if(key== 'a'&& !is_down)
  {
    airplane.position.x -=3
    position.x -=3
  }
  if(key == 'c' && !is_down)
  {
    is_down = true ; 
    loadhuman() ; 
  }
  if(key == 'o' && is_down && !is_open)
  {
    is_open = true ;
    loadparachute() ; 
  }

  if (key == 'w'  && is_open) {
    X_Y_Angle +=0.1
    if(X_Y_Angle < 89.6 || X_Y_Angle > 90.4 )
    {
        X_Y_Angle -=0.1
    }
  }
  else if (key === 'd'  && is_open) {
      Z_Y_Angle +=0.5
      if(Z_Y_Angle < 89.6 || Z_Y_Angle > 90.4 )
      {
          Z_Y_Angle -=0.5
      }
      
  }else if (key == 'a'&& is_open) {
      Z_Y_Angle -=0.5
      if(Z_Y_Angle < 89.6 || Z_Y_Angle > 90.4 )
      {
          Z_Y_Angle +=0.5
      }
      
  }else if (key == 's' && is_open) {
    X_Y_Angle -=0.1
    if(X_Y_Angle < 89.6 || X_Y_Angle > 90.4 )
    {
        X_Y_Angle +=0.1
    }
  }


}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  airplane.position.z = airplane.position.z -3 ;
  if (airplane &&!is_down )
  {
     
    position.z -=3
  
  }
    
  if(!is_down)
    if(airplane)
        camera.position.set(airplane.position.x , airplane.position.y +4 , airplane.position.z+20)
  
  if(is_down)
  {
    if(human)
    {
      camera.position.set(9 , human.position.y+2  , human.position.z)   
      camera.lookAt( new THREE.Vector3(human.position.x,human.position.y, human.position.z)) ; 
    }
    physic.updateAngle(X_Y_Angle , Z_Y_Angle)
    
  
    var eularequation ; 
    if(is_open)
      eularequation = physic.calculate_euler_equation(velocity , position , controls.windspeedx , controls.windspeedz ,true) ; 
    else 
      eularequation = physic.calculate_euler_equation(velocity , position , controls.windspeedx , controls.windspeedz ,false) ;

    var accleration = eularequation[0] ; 
    velocity = eularequation[1] ; 
    position = eularequation[2] ;
  }

   if(position.y < 0)
   {
      accleration.set(0, 0, 0) 
      velocity.set(0,0,0)
      position.set(0,0,0);
   }

   if(is_down && human && !is_open)
   {
      human.position.set(position.x, position.y , position.z);
   }
   if(is_down && human  && parachute&&is_open)
   {
      human.position.set(position.x, position.y , position.z);
      parachute.position.set(position.x , position.y+3.3 , position.z) ; 
   }

   //Display in the screen 
   div.innerHTML = 'position  ( ' +  (position.x).toFixed(3)  + '  , ' + position.y.toFixed(3) + '  ,  ' +( position.z).toFixed(3)   + ' ) '
   + '<br>' + 'velocity  ( ' +  (velocity.x).toFixed(3)  + '  , ' + (velocity.y).toFixed(3) + '  ,  ' +( velocity.z).toFixed(3) + ' ) '
    +'<br>'+ 'Drag Force ( ' +  physic.calculate_dragForce(velocity).x.toFixed(3) + '  ,  ' + ( physic.calculate_dragForce(velocity).y).toFixed(3) + '  ,  ' +( physic.calculate_dragForce(velocity).z).toFixed(3) + ' ) '
   +'<br>' + 'Wind Force ( ' + ( physic.calculate_Wind_Force(controls.windspeedx , controls.windspeedz).x).toFixed(3) + '  ,  ' + ( physic.calculate_Wind_Force(controls.windspeedx , controls.windspeedz).y).toFixed(3) + '  ,  ' +( physic.calculate_Wind_Force(controls.windspeedx , controls.windspeedz).z).toFixed(3) + ' ) '
   
   renderer.render(scene, camera);


}
// Add lights
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

animate();
