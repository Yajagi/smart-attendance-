document.addEventListener("DOMContentLoaded", () => {
    const loginContainer = document.getElementById("loginContainer");
    const loginForm = document.getElementById("loginForm");
    const message = document.getElementById("message");
    const dashboard = document.getElementById("dashboard");
    const dashboardTitle = document.getElementById("dashboardTitle");
    const userInfo = document.getElementById("userInfo");
    const logoutBtn = document.getElementById("logoutBtn");
    const navigationButtons = document.getElementById("navigationButtons");
    const dashboardContent = document.getElementById("dashboardContent");

    let currentUser = null;

    
    const users = [
        {
            role: "admin",
            loginId: "admin",
            password: "password",
            name: "Administrator"
        },
        {
            role: "teacher",
            loginId: "EMP001",
            password: "password",
            name: "Demo Teacher"
        },
        {
            role: "student",
            loginId: "CS001",
            password: "password",
            name: "Alice Student"
        },
        {
            role: "parent",
            loginId: "alice.parent@email.com",
            password: "password",
            name: "Alice's Parent"
        }
    ];

    
    let attendanceRecords = [
        {
            studentId: "CS001",
            name: "Alice Student",
            date: new Date().toLocaleDateString("en-CA"),
            status: "Present"
        },
        {
            studentId: "CS002",
            name: "Bob Student",
            date: new Date().toLocaleDateString("en-CA"),
            status: "Absent"
        }
    ];

    
    function showMessage(text, type) {
        message.textContent = text;
        message.className = type;
    }

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const role = document.getElementById("role").value;
        const loginId = document.getElementById("loginId").value.trim();
        const password = document.getElementById("password").value;

        const user = users.find(account =>
            account.role === role &&
            account.loginId.toLowerCase() === loginId.toLowerCase() &&
            account.password === password
        );

        if (!user) {
            showMessage(
                "Invalid role, Login ID, or password.",
                "error"
            );
            return;
        }

        currentUser = user;

        loginContainer.classList.add("hidden");
        dashboard.classList.remove("hidden");

        dashboardTitle.textContent =
            user.role.charAt(0).toUpperCase() +
            user.role.slice(1) +
            " Dashboard";

        userInfo.textContent =
            "Welcome, " + user.name + " (" + user.loginId + ")";

        createNavigation(user.role);
        showSection("Dashboard");
    });

    // Navigation options for each role
    function createNavigation(role) {
        navigationButtons.innerHTML = "";

        const sections = {
            admin: [
                "Dashboard",
                "Attendance Records",
                "Manage Students",
                "Reports"
            ],
            teacher: [
                "Dashboard",
                "Mark Attendance",
                "Attendance Records",
                "Generate QR"
            ],
            student: [
                "Dashboard",
                "My Attendance",
                "My Profile"
            ],
            parent: [
                "Dashboard",
                "Child Attendance",
                "Attendance Reports"
            ]
        };

        sections[role].forEach(section => {
            const button = document.createElement("button");

            button.className = "nav-button";
            button.textContent = section;

            button.addEventListener("click", () => {
                document.querySelectorAll(".nav-button")
                    .forEach(btn => btn.classList.remove("active"));

                button.classList.add("active");
                showSection(section);
            });

            navigationButtons.appendChild(button);
        });
    }


    function showSection(section) {
        dashboardContent.innerHTML = "";

        const heading = document.createElement("h2");
        heading.textContent = section;
        dashboardContent.appendChild(heading);

        if (section === "Dashboard") {
            showDashboardHome();
        } else if (
            section === "Attendance Records" ||
            section === "My Attendance" ||
            section === "Child Attendance" ||
            section === "Attendance Reports" ||
            section === "Reports"
        ) {
            showAttendanceRecords();
        } else if (section === "Mark Attendance") {
            showMarkAttendance();
        } else if (section === "Manage Students") {
            showManageStudents();
        } else if (section === "Generate QR") {
            showQRSection();
        } else if (section === "My Profile") {
            showProfile();
        }
    }


    function createCard(title, value) {
        const card = document.createElement("div");
        card.className = "card";

        const cardTitle = document.createElement("h3");
        cardTitle.textContent = title;

        const cardValue = document.createElement("p");
        cardValue.textContent = value;

        card.append(cardTitle, cardValue);
        return card;
    }

    
    function showDashboardHome() {
        const intro = document.createElement("p");
        intro.textContent =
            "Manage and monitor attendance from your dashboard.";
        dashboardContent.appendChild(intro);

        const grid = document.createElement("div");
        grid.className = "grid";

        const total = attendanceRecords.length;
        const present = attendanceRecords.filter(
            record => record.status === "Present"
        ).length;
        const absent = attendanceRecords.filter(
            record => record.status === "Absent"
        ).length;

        grid.appendChild(createCard("Total Records", String(total)));
        grid.appendChild(createCard("Present", String(present)));
        grid.appendChild(createCard("Absent", String(absent)));

        dashboardContent.appendChild(grid);

        const today = document.createElement("p");
        today.style.marginTop = "20px";
        today.textContent =
            "Today's Date: " + new Date().toLocaleDateString();

        dashboardContent.appendChild(today);
    }

    // Attendance records table
    function showAttendanceRecords() {
        let records = attendanceRecords;

        // Students can only see their own records
        if (currentUser.role === "student") {
            records = records.filter(
                record => record.studentId === currentUser.loginId
            );
        }

        
        if (currentUser.role === "parent") {
            records = records.filter(
                record => record.studentId === "CS001"
            );
        }

        if (records.length === 0) {
            const empty = document.createElement("p");
            empty.textContent = "No attendance records found.";
            empty.style.marginTop = "15px";
            dashboardContent.appendChild(empty);
            return;
        }

        const wrapper = document.createElement("div");
        wrapper.style.overflowX = "auto";

        const table = document.createElement("table");
        table.className = "attendance-table";

        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");

        ["Student ID", "Student Name", "Date", "Status"].forEach(text => {
            const th = document.createElement("th");
            th.textContent = text;
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");

        records.forEach(record => {
            const row = document.createElement("tr");

            [
                record.studentId,
                record.name,
                record.date,
                record.status
            ].forEach((value, index) => {
                const td = document.createElement("td");
                td.textContent = value;

                if (index === 3) {
                    td.className = value === "Present"
                        ? "status-present"
                        : "status-absent";
                }

                row.appendChild(td);
            });

            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        wrapper.appendChild(table);
        dashboardContent.appendChild(wrapper);
    }

    // Teacher: mark student attendance
    function showMarkAttendance() {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <h3>Mark Student Attendance</h3>
            <form id="attendanceForm">
                <div class="form-group">
                    <label for="studentId">Student ID:</label>
                    <input id="studentId" required
                           placeholder="Example: CS001">
                </div>

                <div class="form-group">
                    <label for="studentName">Student Name:</label>
                    <input id="studentName" required
                           placeholder="Enter student name">
                </div>

                <div class="form-group">
                    <label for="attendanceStatus">Status:</label>
                    <select id="attendanceStatus" required>
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                    </select>
                </div>

                <button class="btn" type="submit">
                    Save Attendance
                </button>
            </form>
            <p id="attendanceMessage" role="status"></p>
        `;

        dashboardContent.appendChild(card);

        document.getElementById("attendanceForm")
            .addEventListener("submit", event => {
                event.preventDefault();

                const studentId =
                    document.getElementById("studentId").value.trim();

                const name =
                    document.getElementById("studentName").value.trim();

                const status =
                    document.getElementById("attendanceStatus").value;

                const date = new Date().toLocaleDateString("en-CA");

                // One attendance entry per student per day
                const existing = attendanceRecords.find(record =>
                    record.studentId.toLowerCase() ===
                        studentId.toLowerCase() &&
                    record.date === date
                );

                if (existing) {
                    existing.name = name;
                    existing.status = status;
                } else {
                    attendanceRecords.push({
                        studentId,
                        name,
                        date,
                        status
                    });
                }

                document.getElementById("attendanceMessage").textContent =
                    "Attendance saved successfully for " + name + ".";

                event.target.reset();
            });
    }

    
    function showManageStudents() {
        const card = document.createElement("div");
        card.className = "card";

        const heading = document.createElement("h3");
        heading.textContent = "Registered Demo Students";
        card.appendChild(heading);

        const students = [
            { id: "CS001", name: "Alice Student" },
            { id: "CS002", name: "Bob Student" }
        ];

        const list = document.createElement("ul");
        list.style.paddingLeft = "20px";

        students.forEach(student => {
            const item = document.createElement("li");
            item.style.marginBottom = "10px";
            item.textContent = student.id + " — " + student.name;
            list.appendChild(item);
        });

        card.appendChild(list);

        const note = document.createElement("p");
        note.style.marginTop = "15px";
        note.textContent =
            "This is a sample student list, not a database.";
        card.appendChild(note);

        dashboardContent.appendChild(card);
    }

    
    function showQRSection() {
        const card = document.createElement("div");
        card.className = "qr-container";

        const heading = document.createElement("h3");
        heading.textContent = "Attendance QR Code";

        const description = document.createElement("p");
        description.style.marginTop = "10px";
        description.textContent =
            "QR attendance generation can be connected to a QR library and a server.";

        const note = document.createElement("p");
        note.style.marginTop = "10px";
        note.textContent =
            "No QR code is generated by this demo yet.";

        card.append(heading, description, note);
        dashboardContent.appendChild(card);
    }

    
    function showProfile() {
        const card = document.createElement("div");
        card.className = "card";

        const name = document.createElement("p");
        name.textContent = "Name: " + currentUser.name;

        const id = document.createElement("p");
        id.style.marginTop = "10px";
        id.textContent = "Login ID: " + currentUser.loginId;

        const role = document.createElement("p");
        role.style.marginTop = "10px";
        role.textContent = "Role: " + currentUser.role;

        card.append(name, id, role);
        dashboardContent.appendChild(card);
    }

    
    logoutBtn.addEventListener("click", () => {
        currentUser = null;

        dashboard.classList.add("hidden");
        loginContainer.classList.remove("hidden");

        loginForm.reset();
        message.textContent = "";
        message.className = "hidden";

        dashboardContent.innerHTML = "";
        navigationButtons.innerHTML = "";
    });
});
