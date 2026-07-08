// ==============================
// Load Projects
// ==============================

const projects =
    JSON.parse(localStorage.getItem("projects")) || [];

// ==============================
// Elements
// ==============================

const totalTasksEl =
    document.getElementById("analyticsTotalTasks");

const completedEl =
    document.getElementById("analyticsCompleted");

const pendingEl =
    document.getElementById("analyticsPending");

const achievementEl =
    document.getElementById("analyticsAchievement");

const onTimeDeliveryEl =
    document.getElementById("onTimeDelivery");

// ==============================
// Variables
// ==============================

let totalTasks = 0;
let completedTasks = 0;
let pendingTasks = 0;
let repeatTasks = 0;
let rejectedTasks = 0;
let cancelledTasks = 0;

let onTimeTasks = 0;
let lateTasks = 0;

const freelancerStats = {};

// ==============================
// Process Data
// ==============================

projects.forEach(project => {

    project.tasks.forEach(task => {

        totalTasks++;

        // --------------------
        // Status Counts
        // --------------------

        switch (task.status) {

            case "Completed":

                completedTasks++;

                if (
                    task.actualDate &&
                    task.actualDate <= task.expectedDate
                ) {

                    onTimeTasks++;

                } else {

                    lateTasks++;

                }

                break;

            case "Pending":

                pendingTasks++;
                break;

            case "Repeat":

                repeatTasks++;
                break;

            case "Rejected":

                rejectedTasks++;
                break;

            case "Cancelled":

                cancelledTasks++;
                break;

        }

        // --------------------
        // Freelancer KPI
        // --------------------

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

// ==============================
// KPI Calculations
// ==============================

const effectiveTasks =
    totalTasks - cancelledTasks;

const achievement =
    effectiveTasks > 0
        ? Math.round(
            (completedTasks / effectiveTasks) * 100
        )
        : 0;

const onTimeDelivery =
    totalTasks > 0
        ? Math.round(
            (onTimeTasks / totalTasks) * 100
        )
        : 0;

// ==============================
// KPI Cards
// ==============================

totalTasksEl.textContent =
    totalTasks;

completedEl.textContent =
    completedTasks;

pendingEl.textContent =
    pendingTasks;

achievementEl.textContent =
    achievement + "%";

if (onTimeDeliveryEl) {

    onTimeDeliveryEl.textContent =
        onTimeDelivery + "%";

}

// ==============================
// Status Chart
// ==============================

new Chart(

    document.getElementById("statusChart"),

    {

        type: "doughnut",

        data: {

            labels: [

                "Completed",
                "Pending",
                "Repeat",
                "Rejected",
                "Cancelled"

            ],

            datasets: [{

                data: [

                    completedTasks,
                    pendingTasks,
                    repeatTasks,
                    rejectedTasks,
                    cancelledTasks

                ]

            }]

        },

        options: {

            responsive: true

        }

    }

);

// ==============================
// Freelancer KPI Chart
// ==============================

const labels = [];
const kpiValues = [];

Object.keys(freelancerStats).forEach(name => {

    labels.push(name);

    const f = freelancerStats[name];

    const kpi =
        f.total > 0
            ? Math.round(
                (f.completed / f.total) * 100
            )
            : 0;

    kpiValues.push(kpi);

});

new Chart(

    document.getElementById("performanceChart"),

    {

        type: "bar",

        data: {

            labels,

            datasets: [{

                label: "KPI %",

                data: kpiValues

            }]

        },

        options: {

            responsive: true,

            scales: {

                y: {

                    beginAtZero: true,

                    max: 100

                }

            }

        }

    }

);