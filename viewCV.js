// document.addEventListener("DOMContentLoaded", function () {
//     // Make a fetch request to get CV data
//     fetch("/getCV")
//         .then((response) => response.json())
//         .then((CVs) => {
//             // Get the table body element
//             const tableBody = document.getElementById("cvTableBody");

//             // Iterate through the CVs and create table rows
//             CVs.forEach((CV) => {
//                 const row = tableBody.insertRow();

//                 // Create table cells for each column
//                 const emailCell = row.insertCell(0);
//                 emailCell.textContent = CV.job_seeker_email;

//                 const dateCell = row.insertCell(1);
//                 dateCell.textContent = CV.upload_date;

//                 const cvCell = row.insertCell(2);
//                 const viewButton = document.createElement("button");
//                 viewButton.textContent = "View CV";
//                 viewButton.addEventListener("click", () => {
//                     // Handle the logic to view the CV
//                     console.log(CV.job_seeker_email);
//                     viewCV(CV.job_seeker_email); // Corrected parameter
//                 });

//                 const downloadButton = document.createElement("button");
//                 downloadButton.textContent = "Download CV";
//                 downloadButton.addEventListener("click", () => {
//                     // Handle the logic to download the CV
//                     downloadCV(CV.job_seeker_email);
//                 });

//                 cvCell.appendChild(viewButton);
//                 cvCell.appendChild(downloadButton);
//             });
//         })
//         .catch((error) => {
//             console.error("Error fetching CVs:", error);
//         });

//     function viewCV(jobSeekerEmail) {
//         // Make a fetch request to the new endpoint
//         fetch(`/getCV/${encodeURIComponent(jobSeekerEmail)}`)
//             .then((response) => {
//                 if (!response.ok) {
//                     throw new Error(`Server error: ${response.status}`);
//                 }
//                 return response.blob(); // Assuming the response is a blob (binary data)
//             })
//             .then((cvBlob) => {
//                 // Create an object URL for the blob and open it in a new window
//                 // Create an object URL for the blob and open it in a new window
//                 const cvUrl = URL.createObjectURL(new Blob([cvBlob], { type: 'application/pdf' }));

//                 window.open(cvUrl, '_blank');
//             })
//             .catch((error) => {
//                 console.error("Error fetching CV:", error);
//             });
//     }

//     function downloadCV(jobSeekerEmail) {
//         // Make a fetch request to the new endpoint
//         fetch(`/getCV/${encodeURIComponent(jobSeekerEmail)}`)
//             .then((response) => {
//                 if (!response.ok) {
//                     throw new Error(`Server error: ${response.status}`);
//                 }
//                 return response.blob(); // Assuming the response is a blob (binary data)
//             })
//             .then((cvBlob) => {
//                 // Create a temporary anchor element
//                 const link = document.createElement("a");
//                 link.href = URL.createObjectURL(cvBlob);
//                 link.download = `${jobSeekerEmail}_CV.pdf`; // Customize the downloaded file name
//                 document.body.appendChild(link);
//                 link.click();
//                 document.body.removeChild(link);
//             })
//             .catch((error) => {
//                 console.error("Error fetching CV:", error);
//             });
//     }
// });


document.addEventListener("DOMContentLoaded", function () {
    // Make a fetch request to get CV data
    fetch("/getCV")
        .then((response) => response.json())
        .then((CVs) => {
            // Get the table body element
            const tableBody = document.getElementById("cvTableBody");

            // Iterate through the CVs and create table rows
            CVs.forEach((CV) => {
                const row = tableBody.insertRow();

                // Create table cells for each column
                const emailCell = row.insertCell(0);
                emailCell.textContent = CV.job_seeker_email;

                const dateCell = row.insertCell(1);
                dateCell.textContent = CV.upload_date;

                const cvCell = row.insertCell(2);
                const viewButton = document.createElement("button");
                viewButton.textContent = "View CV";
                viewButton.addEventListener("click", () => {
                    // Handle the logic to view the CV
                    viewCV(CV.job_seeker_email);
                });
                console.log(CV.CV);
                const downloadButton = document.createElement("button");
                downloadButton.textContent = "Download CV";
                downloadButton.addEventListener("click", () => {
                    // Handle the logic to download the CV
                    downloadCV(CV.CV, CV.job_seeker_email);
                });

                cvCell.appendChild(viewButton);
                cvCell.appendChild(downloadButton);
            });
        })
        .catch((error) => {
            console.error("Error fetching CVs:", error);
        });

    function viewCV(jobSeekerEmail) {
        // Navigate to the PDF URL for viewing
        window.open(`/getCV/${encodeURIComponent(jobSeekerEmail)}`, '_blank');
    }

    function downloadCV(cvFileName, jobSeekerEmail) {
        // Create a temporary anchor element for downloading
        const link = document.createElement("a");
        link.href = `/getCV/${encodeURIComponent(jobSeekerEmail)}`;
        link.download = `${jobSeekerEmail}_CV.pdf`; // Customize the downloaded file name
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
});


