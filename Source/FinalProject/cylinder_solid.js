function init()
{
    var scene = new THREE.Scene();
    var gui = new dat.GUI();
    var camera = new THREE.PerspectiveCamera(
        45,window.innerWidth/window.innerHeight,
        1,
        1000
    );

    camera.position.x = 1;
    camera.position.y = 2;
    camera.position.z = 5;

    camera.lookAt(new THREE.Vector3(0,0,0));

    var cylinder = getSolidCylinder(0.5,0.5,1,16);

    var plane = getPlane(20);
    plane.rotation.x = Math.PI/2;
    plane.position.y = -2;

    var pointLight = getPointLight(1);
    pointLight.position.y = 1.5;
    var sphere1 = getSphere(0.05);
    cylinder.name = 'cylinder';

    scene.add(cylinder);
    scene.add(pointLight);
    scene.add(plane);
    pointLight.add(sphere1);

    const pointLightFolder = gui.addFolder("pointLight");
    const cylinderFolder = gui.addFolder("cylinder");
    pointLightFolder.add(pointLight, 'intensity', 0, 10);
    pointLightFolder.add(pointLight.position, 'x', 0, 5);
    pointLightFolder.add(pointLight.position, 'y', 0, 5);
    pointLightFolder.add(pointLight.position, 'z', 0, 5);
    
    cylinderFolder.add(cylinder.scale, 'x', 0, 2);
    cylinderFolder.add(cylinder.scale, 'y', 0, 2);
    cylinderFolder.add(cylinder.scale, 'z', 0, 2);

    var renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;

    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.setClearColor('rgb(164, 164, 164)');

    document.getElementById('webgl').appendChild(renderer.domElement);

    var controls = new THREE.OrbitControls(camera, renderer.domElement)
    var controls1 = new THREE.DragControls([cylinder], camera, renderer.domElement);
    update(renderer, scene, camera, controls);

    return scene;
}

function getPlane(size)
{
    var geometry = new THREE.PlaneGeometry(size, size);
    var textureLoader = new THREE.TextureLoader();
    var image = textureLoader.load('./image/plane.jpg');
    var material = new THREE.MeshStandardMaterial({
        color: 'rgb(219, 201, 174)',
        side: THREE.DoubleSide,
        map: image
    });
    var texture = material.map;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);
    var mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;
    return mesh;
}

function getSphere(size)
{
    var geometry = new THREE.SphereGeometry(size, 24, 24);
    var material = new THREE.MeshBasicMaterial({
        color: 'rgb(255, 255, 255)'
    })
    var mesh = new THREE.Mesh(geometry,material);
    return mesh;
}

function getSolidCylinder(rt,rb,h,rs)
{
    var geometry = new THREE.CylinderGeometry(rt,rb,h,rs);
    var textureLoader = new THREE.TextureLoader();
    image = textureLoader.load('./image/cylinder.jpg');

    var material = new THREE.MeshPhongMaterial({
        color: 'rgb(120, 120, 120)',
        map: image
    })

    var mesh = new THREE.Mesh(geometry,material);
    mesh.castShadow = true;
    return mesh;
}


function getLineCylinder(rt,rb,h,rs)
{
    var geometry = new THREE.CylinderGeometry(rt,rb,h,rs,10);
    var wireframe = new THREE.WireframeGeometry( geometry );
    var line = new THREE.LineSegments( wireframe );
    line.material.depthTest = false;
    line.material.opacity = 0.25;
    line.material.transparent = true;
    line.material.color = 'rgb(120,120,120)';
    line.castShadow = true;

    return line;
}

function getPointCylinder(rt,rb,h,rs)
{
    var geometry = new THREE.CylinderGeometry(rt,rb,h,rs,20);
    var material = new THREE.PointsMaterial( { color: 0x888888, size: 0.1} );
    var point = new THREE.Points( geometry, material );
    point.castShadow = true;
    return point;
}

function getPointLight(intensity){
    var light = new THREE.PointLight(0xffffff, intensity);
    light.castShadow = true;
    return light;
}

function update(renderer, scene, camera, controls)
{
    renderer.render(scene,camera);

    var cylinder = scene.getObjectByName('cylinder');
    cylinder.rotation.z += 0.01;
    cylinder.rotation.y += 0.01;

    controls.update();
    requestAnimationFrame(function(){
        update(renderer, scene, camera, controls);
    })
}
var scene = init();