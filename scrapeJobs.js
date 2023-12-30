// const nodemailer = require('nodemailer');
// const axios = require('axios');
// const cheerio = require('cheerio');
// const mysql = require('mysql2/promise');
// const he = require('he'); // for HTML entity decoding

// // Set up nodemailer transporter with your email credentials
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'captainpriceb6goingdark@gmail.com',
//     pass: 'muaf txuf vnvl ftev'
//   }
// });

// // Function to connect to MySQL and retrieve job seeker emails
// const getJobSeekerEmails = async (connection) => {
//   // const connection = await mysql.createConnection({
//   //   host: 'localhost',
//   //   user: 'root',
//   //   password: '12345',
//   //   database: 'project'
//   // });

//   try {
//     const [rows, fields] = await connection.execute('SELECT job_seeker_email FROM jobseeker');
//     return rows.map(row => row.job_seeker_email);
//   } catch (error) {
//     console.error('Error retrieving job seeker emails:', error);
//     throw error;
//   } finally {
//     // connection.end();
//     console.log('Hoga');
//   }
// };

// // Function to scrape job information
// const scrapeJobInformation = async () => {
//   const headers = {
//     'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; Win 64 ; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Safari/537.36'
//   };

//   const url = 'https://jobs.bdjobs.com/jobsearch.asp?fcatId=8&icatId=';

//   try {
//     const response = await axios.get(url, { headers });
//     const webpage = response.data;
//     const $ = cheerio.load(webpage);


//     const title = $('div.job-title-text').first().text().trim();
//     const companyText = $('div.comp-name-text').first().text().trim();
//     const decodedCompany = he.decode(companyText);
//     const company = decodedCompany;
//     const requirement = $('div.edu-text-d ul li').first().text().trim();
//     const experience = $('div.exp-text-d').first().text().trim();
//     const platform = 'BD Jobs';
//     const link = 'https://jobs.bdjobs.com/jobsearch.asp?fcatId=8&icatId=';




//     return {
//       Platform: platform,
//       Title: title,
//       Company: company,
//       Requirement: requirement,
//       Experience: experience,
//       Link: link
//     };
//   } catch (error) {
//     console.error('Error scraping job information:', error);
//     throw error;
//   }
// };


// // Function to send email to each job seeker
// const sendJobInfoEmails = async (jobseekerEmails, jobInfo) => {
//   for (const jobseekerEmail of jobseekerEmails) {

//     console.log(`Attempting to send email to ${jobseekerEmail}`);
//     const mailOptions = {
//       from: 'captainpriceb6goingdark@gmail.com',
//       to: jobseekerEmail,
//       subject: 'Job Opportunity',
//       // text: `Job Information:\n\nTitle: ${jobInfo.Title}\nCompany: ${jobInfo.Company}\nRequirement: ${jobInfo.Requirement}\nExperience: ${jobInfo.Experience}\nPlatform: ${jobInfo.Platform}\nLink: ${jobInfo.Link}`
//       html: `
//       <html>
//           <body style="font-family: 'Arial', sans-serif;">
//             <p style="font-size: 16px;">Hi there!</p>
//             <p style="font-size: 14px;">We're excited to share some new job offers with you:</p>
            
//             <table style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
//               <tr>
//                 <th style="border: 1px solid #dddddd; text-align: left; padding: 8px; background-color: #f2f2f2;">Job Information</th>
//               </tr>
//               <tr>
//                 <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Title: ${jobInfo.Title}</td>
//               </tr>
//               <tr>
//                 <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Company: ${jobInfo.Company}</td>
//               </tr>
//               <tr>
//                 <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Requirement: ${jobInfo.Requirement}</td>
//               </tr>
//               <tr>
//                 <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Experience: ${jobInfo.Experience}</td>
//               </tr>
//               <tr>
//                 <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Platform: ${jobInfo.Platform}</td>
//               </tr>
//               <tr>
//                 <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Link: ${jobInfo.Link}</td>
//               </tr>
//             </table>

//             <p style="font-size: 14px;">Feel free to reach out if you have any questions or if you're interested in any of these opportunities.</p>
//             <p style="font-size: 14px;">Best regards,<br>Company Catcher</p>
//           </body>
//         </html>
//       `,
//     };

//     try {
//       // Send OTP to user's email
//       await transporter.sendMail(mailOptions);
//       console.log(`Email sent successfully to ${jobseekerEmail}`);
//     } catch (error) {
//       console.error(`Error sending email to ${jobseekerEmail}:`, error);
//     }
//   }
// };

// // Example usage
// // (async () => {
// //   try {
// //     // Retrieve job seeker emails from the database
// //     const jobseekerEmails = await getJobSeekerEmails();

// //     // Scrape job information
// //     const jobInfo = await scrapeJobInformation();

// //     // Send emails to job seekers
// //     await sendJobInfoEmails(jobseekerEmails, jobInfo);
// //   } catch (error) {
// //     console.error('An error occurred:', error);
// //   }
// // })();

// (async () => {
//   let connection;

//   try {
//     // Connect to MySQL
//     connection = await mysql.createConnection({
//       host: 'localhost',
//       user: 'root',
//       password: '12345',
//       database: 'project'
//     });

//     // Retrieve job seeker emails from the database
//     const jobseekerEmails = await getJobSeekerEmails(connection);

//     // Scrape job information
//     const jobInfo = await scrapeJobInformation();

//     // Insert job information into the database
//     const [insertResult] = await connection.execute(
//       'INSERT INTO job_info (Platform, Title, Company, Requirement, Experience, Link) VALUES (?, ?, ?, ?, ?, ?)',
//       [jobInfo.Platform, jobInfo.Title, jobInfo.Company, jobInfo.Requirement, jobInfo.Experience, jobInfo.Link]
//     );

//     console.log(`Job information inserted into the database. Insert ID: ${insertResult.insertId}`);

//     // Send emails to job seekers
//     await sendJobInfoEmails(jobseekerEmails, jobInfo);
//   } catch (error) {
//     console.error('An error occurred:', error);
//   } finally {
//     // Close the database connection
//     if (connection) {
//       // connection.end();
//       console.log('Hoga');
//     }
//   }
// })();







const nodemailer = require('nodemailer');
const axios = require('axios');
const cheerio = require('cheerio');
const mysql = require('mysql2/promise');
const he = require('he'); // for HTML entity decoding

// Set up nodemailer transporter with your email credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'captainpriceb6goingdark@gmail.com',
    pass: 'muaf txuf vnvl ftev'
  }
});

// Function to connect to MySQL and retrieve job seeker emails
const getJobSeekerEmails = async (connection) => {

  try {
    const [rows, fields] = await connection.execute('SELECT job_seeker_email FROM jobseeker');
    return rows.map(row => row.job_seeker_email);
  } catch (error) {
    console.error('Error retrieving job seeker emails:', error);
    throw error;
  } finally {
    // connection.end();
    console.log('Pari na Kisu');
  }
};

// Function to scrape job information
const scrapeJobInformation = async () => {
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; Win 64 ; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Safari/537.36'
  };

  const url = 'https://jobs.bdjobs.com/jobsearch.asp?fcatId=8&icatId=';

  try {
    const response = await axios.get(url, { headers });
    const webpage = response.data;
    const $ = cheerio.load(webpage);


    const title = $('div.job-title-text').first().text().trim();
    const companyText = $('div.comp-name-text').first().text().trim();
    const decodedCompany = he.decode(companyText);
    const company = decodedCompany;
    const requirement = $('div.edu-text-d ul li').first().text().trim();
    const experience = $('div.exp-text-d').first().text().trim();
    const platform = 'BD Jobs';
    const link = 'https://jobs.bdjobs.com/jobsearch.asp?fcatId=8&icatId=';




    return {
      Platform: platform,
      Title: title,
      Company: company,
      Requirement: requirement,
      Experience: experience,
      Link: link
    };
  } catch (error) {
    console.error('Error scraping job information:', error);
    throw error;
  }
};


// Function to send email to each job seeker
const sendJobInfoEmails = async (jobseekerEmails, jobInfo) => {
  for (const jobseekerEmail of jobseekerEmails) {

    console.log(`Attempting to send email to ${jobseekerEmail}`);
    const mailOptions = {
      from: 'captainpriceb6goingdark@gmail.com',
      to: jobseekerEmail,
      subject: 'Job Opportunity',
      // text: `Job Information:\n\nTitle: ${jobInfo.Title}\nCompany: ${jobInfo.Company}\nRequirement: ${jobInfo.Requirement}\nExperience: ${jobInfo.Experience}\nPlatform: ${jobInfo.Platform}\nLink: ${jobInfo.Link}`
      html: `
      <html>
          <body style="font-family: 'Arial', sans-serif;">
            <p style="font-size: 16px;">Hi there!</p>
            <p style="font-size: 14px;">We're excited to share some new job offers with you:</p>
            
            <table style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
              <tr>
                <th style="border: 1px solid #dddddd; text-align: left; padding: 8px; background-color: #f2f2f2;">Job Information</th>
              </tr>
              <tr>
                <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Title: ${jobInfo.Title}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Company: ${jobInfo.Company}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Requirement: ${jobInfo.Requirement}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Experience: ${jobInfo.Experience}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Platform: ${jobInfo.Platform}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Link: ${jobInfo.Link}</td>
              </tr>
            </table>

            <p style="font-size: 14px;">Feel free to reach out if you have any questions or if you're interested in any of these opportunities.</p>
            <p style="font-size: 14px;">Best regards,<br>Company Catcher</p>
          </body>
        </html>
      `,
    };

    try {
      // Send OTP to user's email
      await transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${jobseekerEmail}`);
    } catch (error) {
      console.error(`Error sending email to ${jobseekerEmail}:`, error);
    }
  }
};

const isJobInfoExists = async (connection, jobInfo) => {
  try {
    const [rows, fields] = await connection.execute(
      'SELECT * FROM job_info WHERE Platform = ? AND Title = ? AND Company = ? AND Requirement = ? AND Experience = ? AND Link = ?',
      [jobInfo.Platform, jobInfo.Title, jobInfo.Company, jobInfo.Requirement, jobInfo.Experience, jobInfo.Link]
    );

    return rows.length > 0;
  } catch (error) {
    console.error('Error checking if job info exists:', error);
    throw error;
  }
};




(async () => {
  let connection;

  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '12345',
      database: 'project'
    });

    const jobseekerEmails = await getJobSeekerEmails(connection);
    const jobInfo = await scrapeJobInformation();
    const jobInfoExists = await isJobInfoExists(connection, jobInfo);

    if (!jobInfoExists) {
          
      const [insertResult] = await connection.execute(
        'INSERT INTO job_info (Platform, Title, Company, Requirement, Experience, Link) VALUES (?, ?, ?, ?, ?, ?)',
        [jobInfo.Platform, jobInfo.Title, jobInfo.Company, jobInfo.Requirement, jobInfo.Experience, jobInfo.Link]
      );

      console.log(`Job information inserted into the database. Insert ID: ${insertResult.insertId}`);

      await sendJobInfoEmails(jobseekerEmails, jobInfo);
    } else {
      console.log('Job information already exists in the database. Ignoring.');
    }
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    if (connection) {
      console.log('Closing database connection.');
      connection.end();
    }
  }
})();