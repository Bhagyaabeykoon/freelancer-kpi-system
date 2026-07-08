// Load Freelancers

let freelancers =
    JSON.parse(localStorage.getItem("freelancers")) || [];

// Selected Freelancer

const selectedId =
    Number(localStorage.getItem("selectedFreelancerId"));

const freelancer =
    freelancers.find(f => f.id === selectedId);

// Form

const freelancerForm =
    document.getElementById("freelancerForm");

// Load Data

if (freelancer) {

    document.getElementById("fullName").value =
        freelancer.fullName;

    document.getElementById("email").value =
        freelancer.email;

    document.getElementById("phone").value =
        freelancer.phone;

    document.getElementById("city").value =
        freelancer.city;

    document.getElementById("skills").value =
        freelancer.skills;

    document.getElementById("status").value =
        freelancer.status;

}

// Update Freelancer

freelancerForm.addEventListener("submit", (e) => {

    e.preventDefault();

    freelancer.fullName =
        document.getElementById("fullName").value.trim();

    freelancer.email =
        document.getElementById("email").value.trim();

    freelancer.phone =
        document.getElementById("phone").value.trim();

    freelancer.city =
        document.getElementById("city").value.trim();

    freelancer.skills =
        document.getElementById("skills").value.trim();

    freelancer.status =
        document.getElementById("status").value;

    localStorage.setItem(
        "freelancers",
        JSON.stringify(freelancers)
    );

    alert("Freelancer updated successfully.");

    window.location.href = "freelancers.html";

});