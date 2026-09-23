
let tickets = [];




function openTicketForm() {

    document
        .getElementById("ticket")
        .scrollIntoView({
            behavior: "smooth"
        });

}



function scrollToTrack() {

    document
        .getElementById("track")
        .scrollIntoView({
            behavior: "smooth"
        });

}




function generateTicketId() {

    return Math.floor(
        1000 + Math.random() * 9000
    );

}




document
    .getElementById("ticketForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();


        const customerName =
            document.getElementById(
                "customerName"
            ).value;


        const customerEmail =
            document.getElementById(
                "customerEmail"
            ).value;


        const issue =
            document.getElementById(
                "issue"
            ).value;


        const complaint =
            document.getElementById(
                "complaint"
            ).value;


       

        const ticketId =
            generateTicketId();


      

        const newTicket = {

            id: ticketId,

            customer: customerName,

            email: customerEmail,

            issue: issue,

            complaint: complaint,

            status: "Open",

            severity: "Pending",

            urgency: "Normal"

        };


      

        tickets.push(newTicket);


      

        const success =
            document.getElementById(
                "successMessage"
            );


        success.style.display = "block";


        success.innerHTML = `

            ✅ Ticket Created Successfully!

            <br><br>

            Your Ticket ID is:

            <strong>#${ticketId}</strong>

            <br>

            Please save this ID to track your ticket.

        `;


      

        document
            .getElementById("ticketForm")
            .reset();

});




function trackTicket() {

    const enteredId =
        document.getElementById(
            "ticketId"
        ).value.trim();


    const result =
        document.getElementById(
            "trackResult"
        );


    const cleanId =
        enteredId.replace("#", "");


    const ticket =
        tickets.find(
            t => t.id.toString() === cleanId
        );


    if (ticket) {

        result.innerHTML = `

            🎫 Ticket #${ticket.id}

            <br><br>

            Customer:
            ${ticket.customer}

            <br>

            Issue:
            ${ticket.issue}

            <br>

            Status:
            <strong>${ticket.status}</strong>

        `;

    }

    else {

        result.innerHTML = `

            ❌ Ticket not found.

            <br>

            Please check your Ticket ID.

        `;

    }

}