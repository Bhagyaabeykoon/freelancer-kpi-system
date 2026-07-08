// Load Freelancers

let freelancers =
    JSON.parse(localStorage.getItem("freelancers")) || [];

// Form

const freelancerForm =
    document.getElementById("freelancerForm");

freelancerForm.addEventListener("submit", (e) => {

    e.preventDefault();

    const freelancer = {

        id: Date.now(),

        fullName:
            document.getElementById("fullName").value.trim(),

        email:
            document.getElementById("email").value.trim(),

        phone:
            document.getElementById("phone").value.trim(),

        city:
            document.getElementById("city").value.trim(),

        skills:
            document.getElementById("skills").value.trim(),

        status:
            document.getElementById("status").value

    };

    // Duplicate Email Check

    const exists = freelancers.some(f =>
        f.email.toLowerCase() ===
        freelancer.email.toLowerCase()
    );

    if (exists) {

        alert("A freelancer with this email already exists.");

        return;

    }

    freelancers.push(freelancer);

    localStorage.setItem(
        "freelancers",
        JSON.stringify(freelancers)
    );

    alert("Freelancer added successfully.");

    window.location.href = "freelancers.html";

});