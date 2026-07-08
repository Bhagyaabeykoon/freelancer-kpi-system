// Load Freelancers

let freelancers =
    JSON.parse(localStorage.getItem("freelancers")) || [];

// Elements

const freelancerTable =
    document.getElementById("freelancerTable");

const totalFreelancers =
    document.getElementById("totalFreelancers");

const availableFreelancers =
    document.getElementById("availableFreelancers");

const busyFreelancers =
    document.getElementById("busyFreelancers");

const inactiveFreelancers =
    document.getElementById("inactiveFreelancers");

const searchInput =
    document.getElementById("searchFreelancer");


// =========================
// Render Freelancers
// =========================

function renderFreelancers(data = freelancers) {

    freelancerTable.innerHTML = "";

    totalFreelancers.textContent = freelancers.length;

    availableFreelancers.textContent =
        freelancers.filter(f => f.status === "Available").length;

    busyFreelancers.textContent =
        freelancers.filter(f => f.status === "Busy").length;

    inactiveFreelancers.textContent =
        freelancers.filter(f => f.status === "Inactive").length;

    if (data.length === 0) {

        freelancerTable.innerHTML = `

            <tr>

                <td colspan="7">
                    No Freelancers Found
                </td>

            </tr>

        `;

        return;

    }

    data.forEach(freelancer => {

        freelancerTable.innerHTML += `

            <tr>

                <td>${freelancer.fullName}</td>

                <td>${freelancer.email}</td>

                <td>${freelancer.phone}</td>

                <td>${freelancer.city}</td>

                <td>${freelancer.skills}</td>

                <td>
                    <span class="status ${freelancer.status.toLowerCase()}">
                        ${freelancer.status}
                    </span>
                </td>

                <td>

                    <button
                        class="btn btn-primary"
                        onclick="editFreelancer(${freelancer.id})">

                        Edit

                    </button>

                    <button
                        class="btn btn-danger"
                        onclick="deleteFreelancer(${freelancer.id})">

                        Delete

                    </button>

                </td>

            </tr>

        `;

    });

}


// =========================
// Search
// =========================

searchInput.addEventListener("input", () => {

    const keyword =
        searchInput.value.toLowerCase();

    const filtered =
        freelancers.filter(f =>

            f.fullName.toLowerCase().includes(keyword) ||

            f.email.toLowerCase().includes(keyword) ||

            f.skills.toLowerCase().includes(keyword)

        );

    renderFreelancers(filtered);

});


// =========================
// Delete
// =========================

function deleteFreelancer(id) {

    if (!confirm("Delete this freelancer?"))
        return;

    freelancers =
        freelancers.filter(f => f.id !== id);

    localStorage.setItem(
        "freelancers",
        JSON.stringify(freelancers)
    );

    renderFreelancers();

}


// =========================
// Edit
// =========================

function editFreelancer(id) {

    localStorage.setItem(
        "selectedFreelancerId",
        id
    );

    window.location.href =
        "edit-freelancer.html";

}


// Initial Render

renderFreelancers();