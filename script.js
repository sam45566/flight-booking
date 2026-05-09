document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#round-trip .flight-search-form");
    const resultsContainer = document.getElementById("roundtrip-results"); // make sure you have this div in HTML

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const from = document.getElementById("from-roundtrip").value.trim();
        const to = document.getElementById("to-roundtrip").value.trim();
        const depart = document.getElementById("depart-roundtrip").value;

        if (!from || !to || !depart) {
            alert("Please fill all fields");
            return;
        }

        // Use relative path instead of Windows path
        fetch("/endpoints/search-flights.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `departure=${encodeURIComponent(from)}&arrival=${encodeURIComponent(to)}&date=${encodeURIComponent(depart)}`
        })
        .then(res => res.json())
        .then(data => {
            console.log("Flights:", data);

            // Clear previous results
            resultsContainer.innerHTML = "";

            if (data.length === 0) {
                resultsContainer.innerHTML = "<p>No flights found.</p>";
                return;
            }

            // Render flight cards
            data.forEach(flight => {
                const card = document.createElement("div");
                card.classList.add("flight-card");

                card.innerHTML = `
                    <h3>Flight: ${flight.flight_number}</h3>
                    <p><b>From:</b> ${flight.departure}</p>
                    <p><b>To:</b> ${flight.arrival}</p>
                    <p><b>Date:</b> ${flight.date}</p>
                    <p><b>Time:</b> ${flight.time}</p>
                    <p class="price">$${flight.price}</p>
                    <button class="book-btn">Book Now</button>
                `;

                resultsContainer.appendChild(card);
            });
        })
        .catch(err => {
            console.error("Error:", err);
            resultsContainer.innerHTML = "<p>Something went wrong. Please try again.</p>";
        });
    });

    // Tab functionality
    document.querySelectorAll('.tab-btn').forEach(button => {
        button.addEventListener('click', () => {
            // Remove 'active' class from all tabs
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.search-form-tab').forEach(tab => tab.classList.remove('active'));
            
            // Add 'active' class to the clicked tab
            button.classList.add('active');

            // Show the corresponding form
            const tabToShow = button.getAttribute('data-tab');
            document.getElementById(tabToShow).classList.add('active');
        });
    });
});
