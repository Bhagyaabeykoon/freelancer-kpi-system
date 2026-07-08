// Load tasks from LocalStorage
const projects =
    JSON.parse(localStorage.getItem("projects")) || [];

let tasks = [];

projects.forEach(project => {

    project.tasks.forEach(task => {

        tasks.push({

            ...task,

            projectName: project.projectName

        });

    });

});

const taskTableBody = document.getElementById("tasksBody");
const searchInput = document.getElementById("searchTask");
const filterStatus = document.getElementById("statusFilter");

const taskForm = document.getElementById("taskForm");


// ==========================
// Render Tasks
// ==========================

function renderTasks(filteredTasks = tasks) {

    taskTableBody.innerHTML = "";

    if (filteredTasks.length === 0) {
        taskTableBody.innerHTML = `
            <tr>
                <td colspan="7">No Tasks Found</td>
            </tr>
        `;
        return;
    }

    filteredTasks.forEach(task => {

        taskTableBody.innerHTML += `
            <tr>
                <td>${task.projectName}</td>
                <td>${task.freelancer}</td>
                <td>${task.task}</td>
                <td>${task.expectedDate}</td>
                <td>${task.actualDate || "-"}</td>

                <td>

                    <span class="status-badge ${task.status.toLowerCase()}">

                        ${task.status}

                    </span>

                </td>

                <td>

                    <div class="action-dropdown">

                        <button
                            class="manage-btn">

                            ⚙ Manage

                        </button>

                        <div class="dropdown-menu">

                            <div onclick="changeStatus(${task.id}, 'Pending')">
                                🟡 Pending
                            </div>
                                                    
                            <div onclick="changeStatus(${task.id}, 'Completed')">
                                ✓ Complete
                            </div>

                            <div onclick="changeStatus(${task.id}, 'Repeat')">
                                ↻ Repeat
                            </div>

                            <div onclick="changeStatus(${task.id}, 'Rejected')">
                                ✖ Reject
                            </div>

                            <div onclick="changeStatus(${task.id}, 'Cancelled')">
                                🚫 Cancel
                            </div>

                            <div
                                class="delete-item"
                                onclick="deleteTask(${task.id})">

                                🗑 Delete

                            </div>

                        </div>

                    </div>

                </td>

            </tr>
        `;
    });
}


// ==========================
// Change Status
// ==========================

function changeStatus(id, status) {

    projects.forEach(project => {

        const task =
            project.tasks.find(t => t.id === id);

        if (task) {

            task.status = status;

            if (status === "Completed") {

                task.actualDate =
                    new Date()
                        .toISOString()
                        .split("T")[0];

            } else {

                task.actualDate = "";

            }

        }

    });

    localStorage.setItem(
        "projects",
        JSON.stringify(projects)
    );

    location.reload();
}


// ==========================
// Delete Task
// ==========================

function deleteTask(id) {

    if (!confirm("Delete this task?"))
        return;

    projects.forEach(project => {

        project.tasks =
            project.tasks.filter(
                task => task.id !== id
            );

    });

    localStorage.setItem(
        "projects",
        JSON.stringify(projects)
    );

    location.reload();
}


// ==========================
// Search
// ==========================

searchInput.addEventListener("input", () => {

    console.log("Searching:", searchInput.value);

    const keyword = searchInput.value.toLowerCase();

    const filtered = tasks.filter(task =>

        task.projectName.toLowerCase().includes(keyword) ||
        task.freelancer.toLowerCase().includes(keyword) ||
        task.task.toLowerCase().includes(keyword)

    );

    console.log("Filtered:", filtered.length);
    console.table(filtered.map(task => ({
        project: task.projectName,
        freelancer: task.freelancer,
        task: task.task
    })));

    renderTasks(filtered);

});


// ==========================
// Filter Status
// ==========================

filterStatus.addEventListener("change", () => {

    const status = filterStatus.value;

    if (status === "All") {
        renderTasks();
        return;
    }

    const filtered = tasks.filter(
        task => task.status === status
    );

    renderTasks(filtered);

});


// Initial Render
renderTasks();
console.log(tasks);

taskForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const projectId = document.getElementById("projectId").value;
    const projectName = document.getElementById("projectName").value;
    const freelancer = document.getElementById("freelancer").value;
    const taskName = document.getElementById("taskName").value;
    const expectedDate = document.getElementById("expectedDate").value;

    const newProject = {
        id: Date.now(),
        projectId: projectId,
        projectName: projectName,
        uploadDate: new Date().toLocaleDateString(),
        tasks: [
            {
                id: Date.now() + 1,
                freelancer: freelancer,
                task: taskName,
                expectedDate: expectedDate,
                actualDate: "",
                status: "Pending"
            }
        ]
    };

    projects.push(newProject);

    localStorage.setItem(
        "projects",
        JSON.stringify(projects)
    );

    tasks.push({
        ...newProject.tasks[0],
        projectName: newProject.projectName
    });

    taskForm.reset();

    renderTasks();
});