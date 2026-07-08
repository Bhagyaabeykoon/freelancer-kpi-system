// Load Projects

const projects =
    JSON.parse(localStorage.getItem("projects")) || [];


// Elements

const reportProjects =
    document.getElementById("reportProjects");

const reportTasks =
    document.getElementById("reportTasks");

const reportCompleted =
    document.getElementById("reportCompleted");

const reportPending =
    document.getElementById("reportPending");

const performanceTable =
    document.getElementById("performanceTable");


// Render Reports

function renderReports() {

    // Summary Cards

    reportProjects.textContent =
        projects.length;

    let totalTasks = 0;
    let completedTasks = 0;
    let pendingTasks = 0;

    const freelancerStats = {};
    let topPerformer = "";
    let topKPI = 0;

    projects.forEach(project => {

        project.tasks.forEach(task => {

            totalTasks++;

            if (task.status === "Completed")
                completedTasks++;

            if (task.status === "Pending")
                pendingTasks++;

            // Freelancer Stats

            if (!freelancerStats[task.freelancer]) {

                freelancerStats[task.freelancer] = {

                    total: 0,
                    completed: 0,
                    repeat: 0,
                    rejected: 0

                };

            }

            freelancerStats[task.freelancer].total++;

            if (task.status === "Completed")
                freelancerStats[task.freelancer].completed++;

            if (task.status === "Repeat")
                freelancerStats[task.freelancer].repeat++;

            if (task.status === "Rejected")
                freelancerStats[task.freelancer].rejected++;

        });

    });


    reportTasks.textContent = totalTasks;
    reportCompleted.textContent = completedTasks;
    reportPending.textContent = pendingTasks;


    // Performance Table

    performanceTable.innerHTML = "";

        Object.keys(freelancerStats)
        .forEach(name => {

            const f = freelancerStats[name];

            const kpi =
                f.total > 0
                ? Math.round(
                    (f.completed / f.total) * 100
                )
                : 0;

                if (kpi > topKPI) {

                    topKPI = kpi;
                    topPerformer = name;

                }

            performanceTable.innerHTML += `

                <tr>

                    <td>${name}</td>

                    <td>${f.total}</td>

                    <td>${f.completed}</td>

                    <td>${f.repeat}</td>

                    <td>${f.rejected}</td>

                    <td>

                        <span class="
                            ${kpi >= 80 ? 'excellent' :
                            kpi >= 50 ? 'good' :
                            kpi >= 30 ? 'average' :
                            'poor'}">

                            ${kpi}%

                        </span>

                    </td>

                </tr>

            `;

        });
        document.getElementById(
            "topPerformerName"
        ).textContent = topPerformer || "-";

        document.getElementById(
            "topPerformerKPI"
        ).textContent = topKPI + "%";
}


// Export CSV

function exportReport() {

    let csv =
        "Freelancer,Total Tasks,Completed,Repeat,Rejected,KPI%\n";

    const rows =
        performanceTable.querySelectorAll("tr");

    rows.forEach(row => {

        const cols = row.querySelectorAll("td");

        let rowData = [];

        cols.forEach(col => {

            rowData.push(col.innerText);

        });

        csv += rowData.join(",") + "\n";

    });

    const blob =
        new Blob([csv], { type: "text/csv" });

    const url =
        URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;

    a.download =
        "freelancer-performance-report.csv";

    a.click();

}


// Initialize

renderReports();