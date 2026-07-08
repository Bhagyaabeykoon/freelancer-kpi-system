// Load Projects from LocalStorage

const projects =
    JSON.parse(localStorage.getItem("projects")) || [];


// Dashboard Elements

const totalProjectsEl =
    document.getElementById("totalProjects");

const totalTasksEl =
    document.getElementById("totalTasks");

const completedTasksEl =
    document.getElementById("completedTasks");

const achievementEl =
    document.getElementById("achievement");

const recentProjectsCards =
    document.getElementById("recentProjectsCards");

const deadlineCards =
    document.getElementById("deadlineCards");

const topPerformerCard =
    document.getElementById("topPerformerCard");


// Render Dashboard

function renderDashboard() {

    // Total Projects

    totalProjectsEl.textContent =
        projects.length;


    // Total Tasks & Completed Tasks

    let totalTasks = 0;
    let completedTasks = 0;

    projects.forEach(project => {

        totalTasks += project.tasks.length;

        completedTasks += project.tasks.filter(
            task => task.status === "Completed"
        ).length;

    });

    totalTasksEl.textContent = totalTasks;
    completedTasksEl.textContent = completedTasks;


    // Achievement %

    let cancelledTasks = 0;

        projects.forEach(project => {

            cancelledTasks += project.tasks.filter(
                task => task.status === "Cancelled"
            ).length;

        });

        const effectiveTasks =
            totalTasks - cancelledTasks;

        const achievement =
            effectiveTasks > 0
                ? Math.round(
                    (completedTasks / effectiveTasks) * 100
                )
                : 0;

    achievementEl.textContent =
        achievement + "%";


    // Recent Projects

    recentProjectsCards.innerHTML = "";

    projects
        .slice(-3)
        .reverse()
        .forEach(project => {

            recentProjectsCards.innerHTML += `

                <div class="project-card">

                    <h3>${project.projectName}</h3>

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

                </div>

            `;

        });
// Top Performer

let freelancerStats = {};

projects.forEach(project => {

    project.tasks.forEach(task => {

        if (!freelancerStats[task.freelancer]) {

            freelancerStats[task.freelancer] = {
                total: 0,
                completed: 0
            };

        }

        freelancerStats[task.freelancer].total++;

        if (task.status === "Completed") {
            freelancerStats[task.freelancer].completed++;
        }

    });

});

let topFreelancer = null;
let highestScore = 0;

for (let freelancer in freelancerStats) {

    let stats = freelancerStats[freelancer];

    let score =
        Math.round(
            (stats.completed / stats.total) * 100
        );

    if (score > highestScore) {

        highestScore = score;

        topFreelancer = freelancer;

    }

}

if (topFreelancer) {

    topPerformerCard.innerHTML = `

        <div class="project-card">

            <h3>🏆 ${topFreelancer}</h3>

            <p>
                Achievement Score:
                <strong>${highestScore}%</strong>
            </p>

        </div>

    `;

}

    // Upcoming Deadlines

    // Upcoming Deadlines

deadlineCards.innerHTML = "";

let upcomingTasks = [];

projects.forEach(project => {

    project.tasks.forEach(task => {

        // Show only active tasks

        const today = new Date();
            today.setHours(0, 0, 0, 0);

            const dueDate = new Date(task.expectedDate);
            dueDate.setHours(0, 0, 0, 0);

            if (

                (
                    task.status === "Pending" ||
                    task.status === "Repeat" ||
                    task.status === "Rejected"
                )

                &&

                dueDate >= today

            ) {

            upcomingTasks.push({

                projectName: project.projectName,
                freelancer: task.freelancer,
                task: task.task,
                expectedDate: task.expectedDate

            });

        }

    });

});

// Sort by nearest due date
projects.forEach(project => {

    project.tasks.forEach(task => {

        console.log(task.task, task.expectedDate, task.status);

    });

});

upcomingTasks.sort((a, b) => {

    return new Date(a.expectedDate) - new Date(b.expectedDate);

});

// Display first 4 tasks

upcomingTasks
    .slice(0, 4)
    .forEach(task => {

            deadlineCards.innerHTML += `

                <div class="project-card">

                    <h3>🔔 ${task.task}</h3>

                    <p>
                        <strong>Project:</strong>
                        ${task.projectName}
                    </p>

                    <p>
                        <strong>Freelancer:</strong>
                        ${task.freelancer}
                    </p>

                    <p>
                        <strong>Due Date:</strong>
                        ${task.expectedDate}
                    </p>

                </div>

            `;

        });

}


// Chart

function renderChart() {

    let completed = 0;
    let pending = 0;

    projects.forEach(project => {

        project.tasks.forEach(task => {

            if (task.status === "Completed") {
                completed++;
            } else {
                pending++;
            }

        });

    });

    new Chart(
        document.getElementById("statusChart"),
        {

            type: "doughnut",

            data: {

                labels: [
                    "Completed",
                    "Pending"
                ],

                datasets: [{

                    data: [
                        completed,
                        pending
                    ],

                    backgroundColor: [
                        "#16a34a",
                        "#f59e0b"
                    ]

                }]

            },

            options: {

                responsive: true,

                plugins: {

                    legend: {
                        position: "bottom"
                    }

                }

            }

        }
    );

}


// Initialize Dashboard

renderDashboard();
renderChart();