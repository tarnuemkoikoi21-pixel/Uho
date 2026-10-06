/* =========================

   UHO MAIN JAVASCRIPT

========================= */

// MOBILE MENU

const menuBtn = document.getElementById("menuBtn");

const navMenu = document.getElementById("navMenu");

menuBtn.addEventListener("click", function () {

  navMenu.classList.toggle("active");

});

// CLOSE MOBILE MENU

// when a navigation link is clicked

const navLinks = document.querySelectorAll("#navMenu a");

navLinks.forEach(function (link) {

  link.addEventListener("click", function () {

    navMenu.classList.remove("active");

  });

});

// CONTACT FORM

const contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", function (event) {

  event.preventDefault();

  const name = document.getElementById("name").value;

  alert(

    "Thank you, " + name +

    "! Your message has been received by UHO."

  );

  contactForm.reset();

});

// SIMPLE SCROLL EFFECT

window.addEventListener("scroll", function () {

  const header = document.querySelector(".header");

  if (window.scrollY > 50) {

    header.style.boxShadow =

      "0 5px 20px rgba(0,0,0,0.2)";

  } else {

    header.style.boxShadow =

      "0 3px 15px rgba(0,0,0,0.15)";

  }

});

async function loadDashboard() {

  const response =

    await fetch("/api/dashboard");

  if (response.status === 401) {

    window.location.href = "/admin/login.html";

    return;

  }

  const data = await response.json();

  document.getElementById("total").textContent =

    data.total;

  document.getElementById("pending").textContent =

    data.pending;

  document.getElementById("approved").textContent =

    data.approved;

  document.getElementById("rejected").textContent =

    data.rejected;

  loadMembers();

}

async function loadMembers() {

  const response =

    await fetch("/api/members");

  if (response.status === 401) {

    window.location.href = "/admin/login.html";

    return;

  }

  const members =

    await response.json();

  const table =

    document.getElementById("membersTable");

  table.innerHTML = "";

  members.forEach(member => {

    const row = document.createElement("tr");

    row.innerHTML = `

      <td>${member.full_name}</td>

      <td>${member.phone || ""}</td>

      <td>${member.email || ""}</td>

      <td>

        ${member.city || ""}

        ${member.county || ""}

      </td>

      <td>

        <span class="status ${member.status.toLowerCase()}">

          ${member.status}

        </span>

      </td>

      <td>

        <button

          onclick="updateStatus(${member.id}, 'Approved')">

          Approve

        </button>

        <button

          onclick="updateStatus(${member.id}, 'Rejected')">

          Reject

        </button>

        <button

          onclick="deleteMember(${member.id})">

          Delete

        </button>

      </td>

    `;

    table.appendChild(row);

  });

}

async function updateStatus(id, status) {

  await fetch(`/api/members/${id}/status`, {

    method: "PUT",

    headers: {

      "Content-Type": "application/json"

    },

    body: JSON.stringify({

      status

    })

  });

  loadDashboard();

}

async function deleteMember(id) {

  if (!confirm("Delete this member?")) {

    return;

  }

  await fetch(`/api/members/${id}`, {

    method: "DELETE"

  });

  loadDashboard();

}

function filterMembers() {

  const search =

    document.getElementById("search")

      .value

      .toLowerCase();

  const rows =

    document.querySelectorAll("#membersTable tr");

  rows.forEach(row => {

    row.style.display =

      row.textContent

        .toLowerCase()

        .includes(search)

        ? ""

        : "none";

  });

}

async function logout() {

  await fetch("/api/logout", {

    method: "POST"

  });

  window.location.href =

    "/admin/login.html";

}

loadDashboard();