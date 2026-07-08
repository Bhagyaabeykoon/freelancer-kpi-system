// Load Data

const projects =
    JSON.parse(localStorage.getItem("projects")) || [];

const selectedProjectId =
    Number(
        localStorage.getItem("selectedProjectId")
    );


// Find Selected Project

const project =
    projects.find(
        p => p.id === selectedProjectId
    );


// Elements

const projectTitle =
    document.getElementById("projectTitle");

const totalTasksEl =
    document.getElementById("projectTotalTasks");

const completedTasksEl =
    document.getElementById("projectCompletedTasks");

const pendingTasksEl =
    document.getElementById("projectPendingTasks");

const achievementEl =
    document.getElementById("projectAchievement");

const tasksTable =
    document.getElementById("tasksTable");


// Render Page

function renderProject() {

    if (!project) {

        projectTitle.textContent =
            "Project Not Found";

        return;
    }

    // Title

    projectTitle.textContent =
        project.projectName;
    
    document.getElementById("projectInfo").innerHTML = `
        Project ID : <strong>${project.projectId}</strong> |
        Uploaded : <strong>${project.uploadDate}</strong> |
        Tasks : <strong>${project.tasks.length}</strong>
    `;


    // KPI

    const totalTasks =
        project.tasks.length;

    const completedTasks =
        project.tasks.filter(
            task => task.status === "Completed"
        ).length;

    const pendingTasks =
        totalTasks - completedTasks;

    const achievement =
        totalTasks > 0
            ? Math.round(
                (completedTasks / totalTasks) * 100
            )
            : 0;


    totalTasksEl.textContent =
        totalTasks;

    completedTasksEl.textContent =
        completedTasks;

    pendingTasksEl.textContent =
        pendingTasks;

    achievementEl.textContent =
        achievement + "%";


    // Tasks Table

    tasksTable.innerHTML = "";

    project.tasks.forEach(task => {

        tasksTable.innerHTML += `

            <tr>

                <td>${task.freelancer}</td>

                <td>${task.task}</td>

                <td>${task.expectedDate}</td>

                <td>

                    <input
                        type="date"
                        value="${task.actualDate || ""}"

                        onchange="updateActualDate(${task.id}, this.value)">

                </td>

                <td>

                    <select
                        onchange="updateStatus(${task.id}, this.value)">

                        <option value="Pending"
                            ${task.status === "Pending" ? "selected" : ""}>
                            Pending
                        </option>

                        <option value="Completed"
                            ${task.status === "Completed" ? "selected" : ""}>
                            Completed
                        </option>

                        <option value="Repeat"
                            ${task.status === "Repeat" ? "selected" : ""}>
                            Repeat
                        </option>

                        <option value="Rejected"
                            ${task.status === "Rejected" ? "selected" : ""}>
                            Rejected
                        </option>

                        <option value="Cancelled"
                            ${task.status === "Cancelled" ? "selected" : ""}>
                            Cancelled
                        </option>

                    </select>

                </td>

            </tr>

        `;

    });

}


// Initialize

renderProject();

function updateStatus(taskId, newStatus) {

    const task =
        project.tasks.find(
            t => t.id === taskId
        );

    if (!task) return;

    task.status = newStatus;

    if (newStatus !== "Completed") {

    task.actualDate = "";

    } else {

        task.actualDate = "";

    }

    const projectIndex =
        projects.findIndex(
            p => p.id === project.id
        );

    projects[projectIndex] = project;

    localStorage.setItem(
        "projects",
        JSON.stringify(projects)
    );

    renderProject();

}

function updateActualDate(taskId, date) {

    const task =
        project.tasks.find(
            t => t.id === taskId
        );

    if (!task) return;

    task.actualDate = date;

    if (date !== "") {

        task.status = "Completed";

    }

    const projectIndex =
        projects.findIndex(
            p => p.id === project.id
        );

    projects[projectIndex] = project;

    localStorage.setItem(
        "projects",
        JSON.stringify(projects)
    );

    renderProject();

}

function exportCSV() {

    let csv =
        "Freelancer,Task,Expected Date,Actual Date,Status\n";

    project.tasks.forEach(task => {

        csv +=
            `${task.freelancer},` +
            `${task.task},` +
            `${task.expectedDate},` +
            `${task.actualDate || ""},` +
            `${task.status}\n`;

    });

    const blob =
        new Blob([csv], { type: "text/csv" });

    const url =
        URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;

    a.download =
        `${project.projectName}-report.csv`;

    a.click();

}