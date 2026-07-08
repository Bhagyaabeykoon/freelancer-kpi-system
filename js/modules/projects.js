// LocalStorage

let projects =
    JSON.parse(localStorage.getItem("projects")) || [];


// Elements

const uploadBtn =
    document.getElementById("uploadBtn");

const projectsContainer =
    document.getElementById("projectsContainer");

const browseBtn =
    document.getElementById("browseBtn");

const excelFile =
    document.getElementById("excelFile");

const selectedFile =
    document.getElementById("selectedFile");

browseBtn.addEventListener("click",()=>{

    excelFile.click();

});

excelFile.addEventListener("change",()=>{

    if(excelFile.files.length>0){

        selectedFile.innerHTML=
        "📄 "+excelFile.files[0].name;

    }

});



function formatExcelDate(value) {

    if (!value) return "";

    // Excel serial number
    if (!isNaN(value)) {

        const date = XLSX.SSF.parse_date_code(Number(value));

        if (!date) return "";

        return `${date.y}-${String(date.m).padStart(2, "0")}-${String(date.d).padStart(2, "0")}`;
    }

    // String date (7/1/26 or 7/1/2026)
    if (typeof value === "string" && value.includes("/")) {

        const parts = value.split("/");

        let month = parts[0].padStart(2, "0");
        let day = parts[1].padStart(2, "0");
        let year = parts[2];

        // Convert 2-digit year to 4-digit year
        if (year.length === 2) {
            year = "20" + year;
        }

        return `${year}-${month}-${day}`;
    }

    return "";
}

// Upload Excel

uploadBtn.addEventListener("click", () => {

    const file =
        document.getElementById("excelFile").files[0];

    if (!file) {
        alert("Please select an Excel file");
        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {

        const data =
            new Uint8Array(e.target.result);

        const workbook =
            XLSX.read(data, { type: "array" });

        const sheet =
            workbook.Sheets[
                workbook.SheetNames[0]
            ];

        const rows =
            XLSX.utils.sheet_to_json(sheet, {
                raw: false
            });

        if (rows.length === 0) {
            alert("Excel file is empty");
            return;
        }

        // Group Projects

const groupedProjects = {};

    rows.forEach((row) => {

        const projectId =
            row["Project ID"] || "N/A";

        if (!groupedProjects[projectId]) {

            groupedProjects[projectId] = {

                id: Date.now() + Math.random(),

                projectId: projectId,

                projectName:
                    row["Project Name"] || "Unnamed Project",

                uploadDate:
                    new Date().toLocaleDateString(),

                tasks: []

            };

        }

        groupedProjects[projectId].tasks.push({

            id: Date.now() + Math.random(),

            freelancer:
                row["Freelancer Name"] || "",

            task:
                row["Task"] || "",

            expectedDate:
                formatExcelDate(
                    row["Expected Date"]
                ),

            actualDate:
                formatExcelDate(
                    row["Actual Date"]
                ),

            status:
                row["Actual Date"]
                    ? "Completed"
                    : "Pending"

        });

    });

    // Add all projects

    Object.values(groupedProjects).forEach(project => {

        projects.push(project);

    });

        localStorage.setItem(
            "projects",
            JSON.stringify(projects)
        );

        renderProjects();

        alert("Project Uploaded Successfully");

    };

    reader.readAsArrayBuffer(file);

});


// Render Projects

function renderProjects(){

    projectsContainer.innerHTML = "";

    if(projects.length === 0){

        projectsContainer.innerHTML = `
            <p>No Projects Uploaded Yet</p>
        `;

        return;
    }

    projects.forEach(project => {

        const completedTasks =
            project.tasks.filter(
                task => task.status === "Completed"
            ).length;

        let projectStatus = "";
        let statusClass = "";

        if (project.tasks.length === 0) {

            projectStatus = "Not Started";
            statusClass = "not-started";

        }
        else if (completedTasks === project.tasks.length) {

            projectStatus = "Completed";
            statusClass = "completed";

        }
        else {

            projectStatus = "In Progress";
            statusClass = "in-progress";

        }

        projectsContainer.innerHTML += `

            <div class="project-card">

                <h3>${project.projectName}</h3>

                <span class="project-status ${statusClass}">
                    ${projectStatus}
                </span>

                <p>
                    <strong>Project ID:</strong>
                    ${project.projectId}
                </p>

                <p>
                    <strong>Upload Date:</strong>
                    ${project.uploadDate}
                </p>

                <p>
                    <strong>Total Tasks:</strong>
                    ${project.tasks.length}
                </p>

                <div class="project-actions">

                    <button
                        class="btn btn-primary"
                        onclick="viewProject(${project.id})">

                        View Details

                    </button>

                    <button
                        class="btn btn-warning"
                        onclick="editProject(${project.id})">

                        Edit

                    </button>
                    
                    <button
                        class="btn btn-danger"
                        onclick="deleteProject(${project.id})">

                        Delete

                    </button>

                </div>

            </div>

        `;

    });

}


// View Project

function viewProject(id) {

    localStorage.setItem(
        "selectedProjectId",
        id
    );

    window.location.href =
        "project-details.html";

}



function editProject(id) {

    const project =
        projects.find(
            p => p.id === id
        );

    if (!project) return;

    const newProjectName =
        prompt(
            "Enter new project name:",
            project.projectName
        );

    if (
        !newProjectName ||
        newProjectName.trim() === ""
    ) {
        return;
    }

    project.projectName =
        newProjectName.trim();

    localStorage.setItem(
        "projects",
        JSON.stringify(projects)
    );

    renderProjects();

}
// Delete Project

function deleteProject(id) {

    if (!confirm("Delete this project?"))
        return;

    projects =
        projects.filter(
            project => project.id !== id
        );

    localStorage.setItem(
        "projects",
        JSON.stringify(projects)
    );

    renderProjects();

}


// Initial Render

renderProjects();

const manualProjectForm =
    document.getElementById(
        "manualProjectForm"
    );

manualProjectForm.addEventListener(
    "submit",
    function(e){

        e.preventDefault();

        const projectId =
            document.getElementById(
                "manualProjectId"
            ).value;

        const projectName =
            document.getElementById(
                "manualProjectName"
            ).value;

        const newProject = {

            id: Date.now(),

            projectId: projectId,

            projectName: projectName,

            uploadDate:
                new Date()
                    .toLocaleDateString(),

            tasks: []

        };

        projects.push(newProject);

        localStorage.setItem(
            "projects",
            JSON.stringify(projects)
        );

        renderProjects();

        manualProjectForm.reset();

        alert(
            "Project Created Successfully"
        );

    }
);