document.addEventListener("DOMContentLoaded", function () {
    const destinationForm = document.getElementById("destination-form");
    const destinationList = document.getElementById("destination-list");
    const progressBar = document.getElementById("progress-bar");
    
    function loadDestinations() {
        const destinations = JSON.parse(localStorage.getItem("destinations")) || [];
        destinationList.innerHTML = ""; 
        destinations.forEach(destination => addDestinationToDOM(destination));
        updateProgress(destinations);
        updateMap(destinations);
    }
    
    function saveDestinations(destinations) {
        localStorage.setItem("destinations", JSON.stringify(destinations));
    }
    
    function addDestinationToDOM(destination) {
        const li = document.createElement("li");
        li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
        
        li.innerHTML = `
            <span>
                <input type="checkbox" class="visited-checkbox" ${destination.visited ? "checked" : ""}> 
                <strong>${destination.place}</strong>: ${destination.notes}
            </span>
            <button class="btn btn-danger btn-sm delete-btn">Delete</button>
        `;
        
        li.querySelector(".delete-btn").addEventListener("click", function () {
            removeDestination(destination.place);
        });
        
        li.querySelector(".visited-checkbox").addEventListener("change", function () {
            toggleVisited(destination.place, this.checked);
        });
        
        destinationList.appendChild(li);
    }
    
    function removeDestination(place) {
        let destinations = JSON.parse(localStorage.getItem("destinations")) || [];
        destinations = destinations.filter(dest => dest.place !== place);
        saveDestinations(destinations);
        loadDestinations();
    }
    
    function toggleVisited(place, visited) {
        let destinations = JSON.parse(localStorage.getItem("destinations")) || [];
        destinations = destinations.map(dest => 
            dest.place === place ? { ...dest, visited } : dest
        );
        saveDestinations(destinations);
        updateProgress(destinations);
    }
    
    function updateProgress(destinations) {
        const total = destinations.length;
        const visitedCount = destinations.filter(dest => dest.visited).length;
        const percentage = total > 0 ? Math.round((visitedCount / total) * 100) : 0;
        
        progressBar.style.width = percentage + "%";
        progressBar.setAttribute("aria-valuenow", percentage);
        progressBar.textContent = percentage + "% Visited";
    }
    
    function updateMap(destinations) {
        if (!window.google || !google.maps) return;
        
        const map = new google.maps.Map(document.getElementById("map-container"), {
            center: { lat: 20.5937, lng: 78.9629 }, // Default to India
            zoom: 3,
        });
        
        destinations.forEach(destination => {
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ address: destination.place }, function (results, status) {
                if (status === "OK") {
                    new google.maps.Marker({
                        position: results[0].geometry.location,
                        map: map,
                        title: destination.place,
                    });
                }
            });
        });
    }
    
    destinationForm.addEventListener("submit", function (event) {
        event.preventDefault();
        
        const place = document.getElementById("place").value.trim();
        const notes = document.getElementById("notes").value.trim();
        
        if (place === "") {
            alert("Please enter a destination name.");
            return;
        }
        
        const newDestination = { place, notes, visited: false };
        let destinations = JSON.parse(localStorage.getItem("destinations")) || [];
        destinations.push(newDestination);
        saveDestinations(destinations);
        loadDestinations();
        
        destinationForm.reset();
    });
    
    loadDestinations();
});


window.onload = function () {
    initMap();
};

function initMap() {
    var mapDiv = document.getElementById("map-container");

    if (!mapDiv) {
        console.error("Map container not found!");
        return;
    }

    var map = new google.maps.Map(mapDiv, {
        center: { lat: 20.5937, lng: 78.9629 }, // Centered on India
        zoom: 5
    });
}
