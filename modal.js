// Function to show the modal
export function showCrudeOilModal() {
    const modal = document.getElementById('myModal2');
    const catConversation = document.getElementById('catConversation2');
   
    modal.style.display = 'block'; 

    catConversation.innerHTML = `
        <h2>Crude Oil</h2>
        <p>Crude oil is a valuable resource used for many purposes.</p>
        <p>In space exploration, crude oil could be useful as an energy resource.</p>
    `;


    document.getElementById('closeModal2').onclick = function() {
        modal.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none'; // Hide the modal
        }
    };
}

window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    
    const intersects = raycaster.intersectObjects(objectsToRaycast, true);

    if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        if (clickedObject.name === 'barrel') {
            showCrudeOilModal(); // Show the modal when barrel is clicked
        }
    }
});
