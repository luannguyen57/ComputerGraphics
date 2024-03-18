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

    var torus = getSolidTorus(1, 0.2, 16, 100);

    var plane = getPlane(20);
    plane.rotation.x = Math.PI/2;
    plane.position.y = -2;

    var pointLight = getPointLight(1);
    pointLight.position.y = 1.5;
    var sphere1 = getSphere(0.05);
    torus.name = 'torus';

    scene.add(torus);
    scene.add(pointLight);
    scene.add(plane);
    pointLight.add(sphere1);

    const pointLightFolder1 = gui.addFolder("pointLight");
    const torusFolder = gui.addFolder("torus");
    pointLightFolder1.add(pointLight, 'intensity', 0, 10);
    pointLightFolder1.add(pointLight.position, 'x', 0, 5);
    pointLightFolder1.add(pointLight.position, 'y', 0, 5);
    pointLightFolder1.add(pointLight.position, 'z', 0, 5);
    
    torusFolder.add(torus.scale, 'x', 0, 2);
    torusFolder.add(torus.scale, 'y', 0, 2);
    torusFolder.add(torus.scale, 'z', 0, 2);

    var renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;

    renderer.setSize(window.innerWidth, window.innerHeight);

    // Thay đổi màu nền
    renderer.setClearColor('rgb(164, 164, 164)');

    document.getElementById('webgl').appendChild(renderer.domElement);

    // Khởi tạo biến điều khiển camera
    var controls = new THREE.OrbitControls(camera, renderer.domElement)
    // Khởi tạo biến điều khiển object
    var controls1 = new THREE.DragControls([torus], camera, renderer.domElement);
    // Gọi hàm update để có thể kết xuất ảnh liên tục
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

function getSolidTorus(r, t, rs, ts)
{
    var geometry = new THREE.TorusGeometry( r, t, rs, ts );
    var textureLoader = new THREE.TextureLoader();
    image = textureLoader.load('./image/torus.jpg');

    var material = new THREE.MeshPhongMaterial({
        color: 'rgb(120, 120, 120)',
        map: image
    })
    
    var texture = material.map;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 0.5);

    var mesh = new THREE.Mesh(geometry,material);
    mesh.castShadow = true;
    return mesh;
}

function getPointLight(intensity){
    var light = new THREE.PointLight(0xffffff, intensity);
    light.castShadow = true;
    return light;
}

function update(renderer, scene, camera, controls)
{
    renderer.render(scene,camera);

    var torus = scene.getObjectByName('torus');
    torus.rotation.z += 0.01;
    torus.rotation.y += 0.01;

    controls.update();
    requestAnimationFrame(function(){
        update(renderer, scene, camera, controls);
    })
}
var scene = init();