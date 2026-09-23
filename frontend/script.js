
const tickets = [

    {
        id: "2323",
        customer: "Garima singh",
        email: "garima@gmail.com",
        issue: "Payment issue",
        severity: "High",
        urgency: "Immediate",
        status: "Escalated",
        assigned: "Payments Team",
        updated: "1:24 AM",
        intent: "Payment Issue",
        complaint:
            "I was charged twice but my order wasn't created. Please help me."
    },

    {
        id: "2828",
        customer: "DRISHTI",
        email: "drishti@gmail.com",
        issue: "Order not received",
        severity: "Low",
        urgency: "Normal",
        status: "Resolved",
        assigned: "AI",
        updated: "10:45 AM",
        intent: "Order / Delivery",
        complaint:
            "My order has not arrived yet."
    },

    {
        id: "2020",
        customer: "Drishti singh",
        email: "drishtisingh@gmail.com",
        issue: "App not working",
        severity: "High",
        urgency: "High",
        status: "In Progress",
        assigned: "Tech Team",
        updated: "8:32 AM",
        intent: "Technical Issue",
        complaint:
            "The application is not opening on my phone."
    },

    {
        id: "1313",
        customer: "Gauri garg",
        email: "gauri@gmail.com",
        issue: "Refund not received",
        severity: "Medium",
        urgency: "Normal",
        status: "Open",
        assigned: "Support Queue",
        updated: "11:20 AM",
        intent: "Refund",
        complaint:
            "My refund has not arrived."
    },

    {
        id: "1414",
        customer: "Upma singh",
        email: "upma@gmail.com",
        issue: "Product damaged",
        severity: "Medium",
        urgency: "High",
        status: "In Progress",
        assigned: "Logistics Team",
        updated: "08:56 AM",
        intent: "Product Issue",
        complaint:
            "The product I received was damaged."
    },

    {
        id: "2207",
        customer: "Anshuman singh",
        email: "anshuman@gmail.com",
        issue: "Login issue",
        severity: "Low",
        urgency: "Normal",
        status: "Resolved",
        assigned: "AI",
        updated: "08:40 AM",
        intent: "Technical Issue",
        complaint:
            "I cannot login to my account."
    },

    {
        id: "1919",
        customer: "Aarya Singh",
        email: "aarya@gmail.com",
        issue: "Feature request",
        severity: "Low",
        urgency: "Low",
        status: "Open",
        assigned: "Product Team",
        updated: "08:15 AM",
        intent: "General",
        complaint:
            "I have a suggestion for a new feature."
    },

    {
        id: "1021",
        customer: "gungun kumari",
        email: "gungun@gmail.com",
        issue: "Technical error",
        severity: "High",
        urgency: "High",
        status: "In Progress",
        assigned: "Tech Team",
        updated: "10:50 AM",
        intent: "Technical Issue",
        complaint:
            "I am getting an unexpected technical error."
    },

    {
        id: "2120",
        customer: "Gunjun tomer",
        email: "gunjun@gmail.com",
        issue: "Account blocked",
        severity: "Medium",
        urgency: "High",
        status: "Escalated",
        assigned: "Security Team",
        updated: "12:22 AM",
        intent: "Account Issue",
        complaint:
            "My account has been blocked."
    },

    {
        id: "4144",
        customer: "Vanshika",
        email: "vanshika@gmail.com",
        issue: "Billing confusion",
        severity: "Low",
        urgency: "Normal",
        status: "Open",
        assigned: "Support Queue",
        updated: "06:58 AM",
        intent: "Billing",
        complaint:
            "I do not understand a charge on my bill."
    }

];




const table = document.getElementById("ticketTable");
const search = document.getElementById("search");
const filter = document.getElementById("filter");




function displayTickets() {

    const searchText =
        search.value.toLowerCase();

    const selectedStatus =
        filter.value;


    const filteredTickets = tickets.filter(ticket => {

        const matchesSearch =

            ticket.id.toLowerCase().includes(searchText) ||

            ticket.customer
                .toLowerCase()
                .includes(searchText) ||

            ticket.issue
                .toLowerCase()
                .includes(searchText);


        const matchesStatus =

            selectedStatus === "all" ||

            ticket.status === selectedStatus;


        return matchesSearch && matchesStatus;

    });


    table.innerHTML = "";


    filteredTickets.forEach(ticket => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                <strong>#${ticket.id}</strong>
            </td>

            <td>
                ${ticket.customer}
            </td>

            <td>
                ${ticket.issue}
            </td>

            <td>
                <span class="badge severity-${ticket.severity.toLowerCase()}">
                    ${ticket.severity}
                </span>
            </td>

            <td>
                <span class="badge urgency-${ticket.urgency.toLowerCase()}">
                    ${ticket.urgency}
                </span>
            </td>

            <td>
                <span class="badge status-${ticket.status
                    .toLowerCase()
                    .replace(" ", "-")}">
                    ${ticket.status}
                </span>
            </td>

            <td>
                ${ticket.assigned}
            </td>

            <td>
                ${ticket.updated}
            </td>

        `;


       

        row.addEventListener(
            "click",
            () => showTicket(ticket)
        );


        table.appendChild(row);

    });

}




function showTicket(ticket) {

   

    document.getElementById(
        "ticketNumber"
    ).innerText =
        `Ticket #${ticket.id}`;


   

    document.getElementById(
        "issueTitle"
    ).innerText =
        ticket.issue;


  

    document.getElementById(
        "complaint"
    ).innerText =
        ticket.complaint;


   

    document.getElementById(
        "customerName"
    ).innerText =
        ticket.customer;


    

    document.getElementById(
        "customerEmail"
    ).innerText =
        ticket.email;


  

    document.getElementById(
        "intent"
    ).innerText =
        ticket.intent;

}




search.addEventListener(
    "input",
    displayTickets
);




filter.addEventListener(
    "change",
    displayTickets
);




function assignAgent() {

    alert(
        "Ticket successfully assigned to Payments Team!"
    );

}



function resolveTicket() {

    alert(
        "Ticket marked as resolved!"
    );

}


displayTickets();