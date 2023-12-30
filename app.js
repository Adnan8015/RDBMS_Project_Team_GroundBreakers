const express = require("express");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bodyParser = require("body-parser");
const NodeCache = require("node-cache");
const dbConnection = require("./dbConnection");
const path = require("path");
const bcrypt = require("bcrypt");
const app = express();
const mysql = require('mysql2/promise');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const multer = require('multer');

// const cors = require('cors');


// app.use(cors());
app.use(fileUpload());
app.use(express.static(__dirname)); // Serve static files from the current directory
app.use(express.static('public')); // Serve static files from the current directory
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Parse JSON requests

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Set your upload directory
    },
    filename: (req, file, cb) => {
      // Use a unique filename, or you can keep the original name if it's unique
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  
  const upload = multer({ storage: storage });
  
  // Serve static files in the uploads directory
  app.use('/uploads', express.static('uploads'));
  
  // Handle file upload using multer middleware
  app.post('/upload', upload.single('pdf'), (req, res) => {
    res.send('File uploaded!');
  });
  
  // Handle file download
  app.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', filename);
  
    // Check if the file exists
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).send('File not found');
    }
  });

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'project',
};

let globalEmail = null;
let globalEmailJobseeker = null;
let globalEmailEmployee = null;


// Create a new instance of NodeCache
const otpCache = new NodeCache();

const otpData = {
    forgot: "",
    signup: ""
};

let storedOTP_forgot; // Global variable to store OTP for forgot password flow
let storedOTP_signup; // Global variable to store OTP for signup flow

// JOB SEEKER
app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "signup.html"));
});
app.get("/signin", (req, res) => {
    res.sendFile(path.join(__dirname, "signin.html"));
});
app.get("/forgot-password", (req, res) => {
    res.sendFile(path.join(__dirname, "forgot-password.html"));
});
app.get("/verify-otp", (req, res) => {
    res.sendFile(path.join(__dirname, "verify-otp.html"));
});
app.get("/reset-password", (req, res) => {
    res.sendFile(path.join(__dirname, "resetpassword.html"));
});
app.get("/verify-otp-signup", (req, res) => {
    res.sendFile(path.join(__dirname, "verify-otp-signup.html"));
});
app.get("/profile", (req, res) => {
    res.sendFile(path.join(__dirname, "profile.html"));
});

// HOME
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "first_page.html"));
});


// ADMIN
app.get("/admin-signin", (req, res) => {
    res.sendFile(path.join(__dirname, "admin-signin.html"));
});
app.get("/admin-profile", (req, res) => {
    res.sendFile(path.join(__dirname, "admin-profile.html"));
});

// EMPLOYEE
app.get("/employee-signup", (req, res) => {
    res.sendFile(path.join(__dirname, "employee-signup.html"));
});
app.get("/employee-signin", (req, res) => {
    res.sendFile(path.join(__dirname, "employee-signin.html"));
});
app.get("/employee-forgot-password", (req, res) => {
    res.sendFile(path.join(__dirname, "employee-forgot-password.html"));
});
app.get("/employee-verify-otp", (req, res) => {
    res.sendFile(path.join(__dirname, "employee-verify-otp.html"));
});
app.get("/employee-resetpassword", (req, res) => {
    res.sendFile(path.join(__dirname, "employee-resetpassword.html"));
});
app.get("/employee-verify-otp-signup", (req, res) => {
    res.sendFile(path.join(__dirname, "employee-verify-otp-signup.html"));
});
app.get("/employee-profile", (req, res) => {
    res.sendFile(path.join(__dirname, "employee-profile.html"));
});


// EMPLOYER

app.get("/employer-signup", (req, res) => {
    res.sendFile(path.join(__dirname, "employer-signup.html"));
});
app.get("/employer-signin", (req, res) => {
    res.sendFile(path.join(__dirname, "employer-signin.html"));
});
app.get("/employer-forgot-password", (req, res) => {
    res.sendFile(path.join(__dirname, "employer-forgot-password.html"));
});
app.get("/employer-verify-otp", (req, res) => {
    res.sendFile(path.join(__dirname, "employer-verify-otp.html"));
});
app.get("/employer-resetpassword", (req, res) => {
    res.sendFile(path.join(__dirname, "employer-resetpassword.html"));
});
app.get("/employer-verify-otp-signup", (req, res) => {
    res.sendFile(path.join(__dirname, "employer-verify-otp-signup.html"));
});
app.get("/employer-profile", (req, res) => {
    res.sendFile(path.join(__dirname, "employer-profile.html"));
});


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "captainpriceb6goingdark@gmail.com",
        pass: "muaf txuf vnvl ftev"
    }
});






app.post("/admin-signup", async (req, res) => {
    const { admin_email, admin_password } = req.body;
    console.log('Received password:', admin_password); 
    console.log('Received email:', admin_email); 
    const hashedPassword = await bcrypt.hash(admin_password, 10); // Hash the password with a salt of 10 rounds
    storedOTP_signup = generateOTP(); // Store OTP for signup flow
    otpData.signup = storedOTP_signup; // Store OTP for signup flow
    
    try {
        // const salt = await bcrypt.genSalt(10);
        // const hashedPassword = await bcrypt.hash(password, salt);
        const [existingUser] = await dbConnection.query("SELECT * FROM admin WHERE admin_email = ?", [admin_email]);
        
        if (existingUser.length > 0) {
            return res.status(400).send("User with this email already exists.");
        }
        
       
        await dbConnection.query("INSERT INTO admin (admin_email, admin_password, otp) VALUES (?, ?)", [admin_email, hashedPassword, storedOTP_signup]);
        
        const mailOptions = {
            from: "captainpriceb6goingdark@gmail.com",
            to: admin_email,
            subject: "Signup OTP",
            text: `Your OTP for password reset is: ${storedOTP_signup}`
        };
        
        // Send OTP to user's email
        await transporter.sendMail(mailOptions);
        
        res.send(`
        <script>
        window.location.href = '/verify-otp-signup.html';
        </script>
        `);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});


app.post("/verify-otp-signup", async (req, res) => {
    console.log("verify-otp-signup");
    const { otp } = req.body;
    
    if (otp && otp.toString() === otpData.signup.toString()) {
       
        console.log("Correct OTP for signup flow");
        return res.redirect('/admin-signin');
    } else {
        return res.status(400).send("Incorrect OTP. Please try again.");
    }
});










app.post("/admin-signin", async (req, res) => {
    const { admin_email, admin_password } = req.body;
    EMAIL = admin_email;
    console.log(admin_email);
    console.log(admin_password);
    try {
        // Check if the provided email and password match any user in the database
        // const [user] = await dbConnection.query("SELECT * FROM admin WHERE admin_email = ?", [admin_email]);

        console.log("Executing SQL query:", "SELECT * FROM admin WHERE admin_password = ?", [admin_password]);
const [user] = await dbConnection.query("SELECT * FROM admin WHERE admin_password = ?", [admin_password]);

        
        console.log(user.length);
        // console.log(user[0].admin_password);
        // console.log(user[0].admin_email);
        if (user.length > 0) {
            console.log(admin_password);
            console.log(user[0].admin_password);
            const isPasswordValid = (admin_password == user[0].admin_password) ;
            console.log(isPasswordValid);
            if (isPasswordValid) {
                
                res.send(`
                <script>
                window.location.href = '/admin-profile.html';
                </script>
                `);

            } else {
             
                res.status(401).send("Invalid password.");
            }
        } else {
           
            res.status(401).send("Invalid email.");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});





function generateOTP() {
    return crypto.randomBytes(3).toString('hex').toUpperCase();
}

let EMAIL;
app.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    EMAIL = req.body;
    console.log(email);
    storedOTP_forgot = generateOTP();
    otpData.forgot = storedOTP_forgot; // Store OTP for forgot password flow

    try {
        const [user] = await dbConnection.query("SELECT * FROM users WHERE email = ?", [email]);

        if (user && user.length > 0) {
            const mailOptions = {
                from: "captainpriceb6goingdark@gmail.com",
                to: email,
                subject: "Password Reset OTP",
                text: `Your OTP for password reset is: ${storedOTP_forgot}`
            };

            // Send OTP to user's email
            await transporter.sendMail(mailOptions);
            res.send(`
            <script>
            window.location.href = '/verify-otp.html';
            </script>
            `);
        } else {
            res.status(404).send("User not found with this email.");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});
app.post("/reset-password", async (req, res) => {
    const { newPassword } = req.body;
    // Extract email from the EMAIL object
    const email = EMAIL.email;

    console.log(req.body);
    try {
        // Update the user's password in the database
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updateQuery = "UPDATE users SET password = ? WHERE email = ?";
        await dbConnection.query(updateQuery, [hashedPassword, email]);

        
        res.status(200).send("Password reset successful!");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/verify-otp", async (req, res) => {
    console.log("verify-otp");
    const { otp } = req.body;
    
    if (otp && otp.toString() === otpData.forgot.toString()) {
        console.log("Correct OTP for forgot password flow");
        return res.redirect('/reset-password');
    } else {
        return res.status(400).send("Incorrect OTP. Please try again.");
    }
});

app.post("/verify-otp-signup", async (req, res) => {
    console.log("verify-otp-signup");
    const { otp } = req.body;
    
    if (otp && otp.toString() === otpData.signup.toString()) {
       
        console.log("Correct OTP for signup flow");
        return res.redirect('/signin');
    } else {
        return res.status(400).send("Incorrect OTP. Please try again.");
    }
});



app.post("/signup", async (req, res) => {
    const { job_seeker_email, job_seeker_password } = req.body;
    console.log('Received password:', job_seeker_password); 
    console.log('Received email:', job_seeker_email); 
    const hashedPassword = await bcrypt.hash(job_seeker_password, 10); // Hash the password with a salt of 10 rounds
    storedOTP_signup = generateOTP(); // Store OTP for signup flow
    otpData.signup = storedOTP_signup; // Store OTP for signup flow
    
    try {
        // const salt = await bcrypt.genSalt(10);
        // const hashedPassword = await bcrypt.hash(password, salt);
        const [existingUser] = await dbConnection.query("SELECT * FROM jobseeker WHERE job_seeker_email = ?", [job_seeker_email]);
        
        if (existingUser.length > 0) {
            return res.status(400).send("User with this email already exists.");
        }
        
       
        await dbConnection.query("INSERT INTO jobseeker (job_seeker_email, job_seeker_password, otp) VALUES (?, ?, ?)", [job_seeker_email, hashedPassword, storedOTP_signup]);
        
        const mailOptions = {
            from: "captainpriceb6goingdark@gmail.com",
            to: job_seeker_email,
            subject: "Signup OTP",
            text: `Your OTP for password reset is: ${storedOTP_signup}`
        };
        
        // Send OTP to user's email
        await transporter.sendMail(mailOptions);
        
        res.send(`
        <script>
        window.location.href = '/verify-otp-signup.html';
        </script>
        `);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});



app.post("/signin", async (req, res) => {
    const { job_seeker_email, job_seeker_password } = req.body;
    EMAIL = job_seeker_email;
    console.log(job_seeker_email);
    try {
        // Check if the provided email and password match any user in the database
        const [user] = await dbConnection.query("SELECT * FROM jobseeker WHERE job_seeker_email = ?", [job_seeker_email]);

        if (user.length > 0) {
            const isPasswordValid = await bcrypt.compare(job_seeker_password, user[0].job_seeker_password);
            if (isPasswordValid) {
                // Sign-in successful
                globalEmailJobseeker = job_seeker_email;
                res.send(`
                <script>
                window.location.href = '/jobseekerFirstPage.html';
                </script>
                `);

            } else {
                // Sign-in failed (invalid password)
                res.status(401).send("Invalid password.");
            }
        } else {
            // Sign-in failed (invalid email)
            res.status(401).send("Invalid email.");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});



app.post("/employee-signin", async (req, res) => {
    const { employee_email, employee_password } = req.body;
    EMAIL = employee_email;
    console.log(employee_email);
    console.log(employee_password);
    try {
        // Check if the provided email and password match any user in the database
        const [user] = await dbConnection.query("SELECT * FROM employee WHERE employee_email = ?", [employee_email]);
        if (user.length > 0) {
            console.log(employee_password);
            console.log(user[0].employee_password);
            const isPasswordValid = await bcrypt.compare(employee_password, user[0].employee_password);
            console.log(isPasswordValid);
            if (isPasswordValid) {
                // Sign-in successful
                globalEmailEmployee = employee_email;
                console.log(globalEmailEmployee);
                res.send(`
                <script>
                window.location.href = '/employeeFirstPage.html';
                </script>
                `);

            } else {
               
                res.status(401).send("Invalid password.");
            }
        } else {
          
            res.status(401).send("Invalid email.");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});



app.post("/employee-signup", async (req, res) => {
    const { employee_email, employee_password, company_name, company_code, designation } = req.body;
    const hashedPassword = await bcrypt.hash(employee_password, 10);
    storedOTP_signup = generateOTP();
    otpData.signup = storedOTP_signup;

    try {
        const [existingUser] = await dbConnection.query("SELECT * FROM employee WHERE employee_email = ?", [employee_email]);

        if (existingUser.length > 0) {
            return res.status(400).send("User with this email already exists.");
        }

        // Verify if company_code and company_name match in the company table
        const [matchingCompany] = await dbConnection.query("SELECT * FROM company WHERE TRIM(company_name) = ? AND TRIM(company_code) = ?", [company_name, company_code]);

        console.log("company_name:", company_name);
        console.log("company_code:", company_code);


        if (matchingCompany.length === 0) {
            return res.status(400).send("Invalid company code or company name. Please check and try again.");
        }

        await dbConnection.query("INSERT INTO employee (employee_email, employee_password, otp, company_name, company_code, designation) VALUES (?, ?, ?, ?, ?, ?)", [employee_email, hashedPassword, storedOTP_signup, company_name, company_code, designation]);

        const mailOptions = {
            from: "captainpriceb6goingdark@gmail.com",
            to: employee_email,
            subject: "Signup OTP",
            text: `Your OTP for password reset is: ${storedOTP_signup}`
        };

        await transporter.sendMail(mailOptions);

        res.send(`
        <script>
        window.location.href = '/employer-verify-otp-signup';
        </script>
        `);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});



app.post("/employee-verify-otp-signup", async (req, res) => {
    console.log("verify-otp-signup");
    const { otp } = req.body;
    
    if (otp && otp.toString() === otpData.signup.toString()) {
        
        console.log("Correct OTP for signup flow");
        return res.redirect('/employee-signin');
    } else {
   
        return res.status(400).send("Incorrect OTP. Please try again.");
    }
});
app.post("/employee-verify-otp", async (req, res) => {
    console.log("verify-otp");
    const { otp } = req.body;
    
    if (otp && otp.toString() === otpData.forgot.toString()) {
        
        console.log("Correct OTP for forgot password flow");
        return res.redirect('/employee-resetpassword');
    } else {
       
        return res.status(400).send("Incorrect OTP. Please try again.");
    }
});
app.post("/employee-forgot-password", async (req, res) => {
    const { employee_email } = req.body;
    EMAIL = req.body;
    console.log(employee_email);
    storedOTP_forgot = generateOTP();
    otpData.forgot = storedOTP_forgot; 

    try {
        const [user] = await dbConnection.query("SELECT * FROM employee WHERE employee_email = ?", [employee_email]);

        if (user && user.length > 0) {
            const mailOptions = {
                from: "captainpriceb6goingdark@gmail.com",
                to: email,
                subject: "Password Reset OTP",
                text: `Your OTP for password reset is: ${storedOTP_forgot}`
            };

            // Send OTP to user's email
            await transporter.sendMail(mailOptions);
            res.send(`
            <script>
            window.location.href = '/employee-verify-otp.html';
            </script>
            `);
        } else {
            res.status(404).send("User not found with this email.");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});


app.post("/employee-resetpassword", async (req, res) => {
    const { newPassword } = req.body;
    // Extract email from the EMAIL object
    const email = EMAIL.employee_email;

    console.log(req.body);
    try {
       
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updateQuery = "UPDATE employee SET password = ? WHERE employee_email = ?";
        await dbConnection.query(updateQuery, [hashedPassword, email]);

       
        res.status(200).send("Password reset successful!");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});



app.post("/employer-signup", async (req, res) => {
    const { email, password, company_name, company_code, designation } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    storedOTP_signup = generateOTP();
    otpData.signup = storedOTP_signup;

    try {
        const [existingUser] = await dbConnection.query("SELECT * FROM users WHERE email = ?", [email]);

        if (existingUser.length > 0) {
            return res.status(400).send("User with this email already exists.");
        }

        const [matchingCompany] = await dbConnection.query("SELECT * FROM company WHERE TRIM(company_name) = ? AND TRIM(company_code) = ?", [company_name, company_code]);

        console.log("company_name:", company_name);
        console.log("company_code:", company_code);


        if (matchingCompany.length === 0) {
            return res.status(400).send("Invalid company code or company name. Please check and try again.");
        }

        await dbConnection.query("INSERT INTO users (email, password, otp, company_name, company_code, designation) VALUES (?, ?, ?, ?, ?, ?)", [email, hashedPassword, storedOTP_signup, company_name, company_code, designation]);

        const mailOptions = {
            from: "captainpriceb6goingdark@gmail.com",
            to: email,
            subject: "Signup OTP",
            text: `Your OTP for password reset is: ${storedOTP_signup}`
        };

        await transporter.sendMail(mailOptions);

        res.send(`
        <script>
        window.location.href = '/employer-verify-otp-signup';
        </script>
        `);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/employer-signin", async (req, res) => {
    const { email, password } = req.body;
    EMAIL = email;
    console.log(email);
    console.log(password);
    try {
        // Check if the provided email and password match any user in the database
        const [user] = await dbConnection.query("SELECT * FROM users WHERE email = ?", [email]);
        if (user.length > 0) {
            console.log(password);
            console.log(user[0].password);
            const isPasswordValid = await bcrypt.compare(password, user[0].password);
            console.log(isPasswordValid);
            if (isPasswordValid) {
             
                globalEmail = email;
                res.send(`
                <script>
                window.location.href = '/employerFirstPage.html';
                </script>
                `);

            } else {
                
                res.status(401).send("Invalid password.");
            }
        } else {
           
            res.status(401).send("Invalid email.");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});



app.post("/employer-verify-otp-signup", async (req, res) => {
    console.log("employer-verify-otp-signup");
    const { otp } = req.body;
    
    if (otp && otp.toString() === otpData.signup.toString()) {
       
        console.log("Correct OTP for signup flow");
        return res.redirect('/employer-signin');
    } else {
        
        return res.status(400).send("Incorrect OTP. Please try again.");
    }
});
app.post("/employer-verify-otp", async (req, res) => {
    console.log("verify-otp");
    const { otp } = req.body;
    
    if (otp && otp.toString() === otpData.forgot.toString()) {
        
        console.log("Correct OTP for forgot password flow");
        return res.redirect('/employer-resetpassword');
    } else {
    
        return res.status(400).send("Incorrect OTP. Please try again.");
    }
});


app.post("/employer-forgot-password", async (req, res) => {
    const { email } = req.body;
    EMAIL = req.body;
    console.log(email);
    storedOTP_forgot = generateOTP();
    otpData.forgot = storedOTP_forgot; // Store OTP for forgot password flow

    try {
        const [user] = await dbConnection.query("SELECT * FROM users WHERE email = ?", [email]);

        if (user && user.length > 0) {
            const mailOptions = {
                from: "captainpriceb6goingdark@gmail.com",
                to: email,
                subject: "Password Reset OTP",
                text: `Your OTP for password reset is: ${storedOTP_forgot}`
            };

            await transporter.sendMail(mailOptions);
            res.send(`
            <script>
            window.location.href = '/employer-verify-otp.html';
            </script>
            `);
        } else {
            res.status(404).send("User not found with this email.");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});
app.post("/employer-resetpassword", async (req, res) => {
    const { newPassword } = req.body;
    // Extract email from the EMAIL object
    const email = EMAIL.email;

    console.log(req.body);
    try {
        
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updateQuery = "UPDATE users SET password = ? WHERE email = ?";
        await dbConnection.query(updateQuery, [hashedPassword, email]);
     
        res.status(200).send("Password reset successful!");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});



app.post("/jobPost", (req, res) => {
    const { jobTitle, jobDescription, location, qualification, salary, companyName } = req.body;

    const currentDate = new Date().toISOString().slice(0, 19).replace("T", " ");

    const insertQuery = "INSERT INTO jobpost (job_title, job_description, location, qualification, salary, company_name,employer_email,post_date) VALUES (?, ?, ?, ?, ?, ?,?,?)";

    dbConnection.query(insertQuery, [jobTitle, jobDescription, location, qualification, salary, companyName,globalEmail,currentDate], (err, result) => {
        if (err) {
            console.error("Error inserting data into the jobpost table:", err);
            res.status(500).send("Internal Server Error");
        } else {
            // Include a script in the response to display an alert
            const responseWithAlert = `
                <script>
                    alert('Job posted successfully.');
                    window.location.href = '/jobPost.html'; // Redirect to a specific page after showing the alert
                </script>`;
            return res.send(responseWithAlert);
        }
    });
});

app.post("/addCompany", (req, res) => {
    const { companyName, companyCode } = req.body;

    const currentDate = new Date().toISOString().slice(0, 19).replace("T", " ");

    const insertQuery = "INSERT INTO company (company_name, company_code) VALUES (?, ?)";

    dbConnection.query(insertQuery, [companyName, companyCode], (err, result) => {
        if (err) {
            console.error("Error inserting data into the jobpost table:", err);
            res.status(500).send("Internal Server Error");
        } else {
            // Include a script in the response to display an alert
            const responseWithAlert = `
                <script>
                    alert('Company Added successfully.');
                    window.location.href = '/addCompany.html'; // Redirect to a specific page after showing the alert
                </script>`;
            return res.send(responseWithAlert);
        }
    });
});


app.get('/getJobOffers', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig); 
        const [jobOffers] = await connection.execute("SELECT job_post_id,company_name,job_title, job_description, location,  qualification, salary, post_date FROM jobpost");

       
        connection.end();
        console.log(jobOffers);
        res.json(jobOffers);
    } catch (error) {
        console.error('Error retrieving job offers:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.post('/apply', async (req, res) => {
    try {
        const job_offer_id = req.body.job_post_id; 

        
        const resume = req.files.resume;

        // Check if the resume is in PDF format
        if (!resume || resume.mimetype !== 'application/pdf') {
            return res.status(400).json({ error: 'Invalid file format. Please upload a PDF file.' });
        }

        const uploadDate = new Date();

        
        const insertQuery = 'INSERT INTO resumes (job_seeker_email, job_post_id, CV, upload_date) VALUES (?, ?, ?, ?)';
        const values = [globalEmailJobseeker, job_offer_id, 'path_to_uploaded_file.pdf', uploadDate]; 

        await dbConnection.query(insertQuery, values);

        return res.status(200).json({ success: 'Resume uploaded successfully.' });
    } catch (error) {
        console.error('Error handling resume upload:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


// app.post('/apply', async (req, res) => {
//     try {
//         const job_offer_id = req.body.job_post_id; 

        
//         const resume = req.files.resume;


//         if (!resume || resume.mimetype !== 'application/pdf') {
//             return res.status(400).json({ error: 'Invalid file format. Please upload a PDF file.' });
//         }

//         const uploadDate = new Date();
//         const downloadFolderPath = 'C:/Users/Asus/Downloads/';
      


//         const fileName = resume.name;

//         const filePath = path.join(downloadFolderPath, uploadDate.getTime() + '_' + fileName);

//         resume.mv(filePath);

        
//         // const insertQuery = 'INSERT INTO resumes (job_seeker_email, job_post_id, CV, upload_date) VALUES (?, ?, ?, ?)';
//         // const values = [globalEmailJobseeker, job_offer_id, 'path_to_uploaded_file.pdf', uploadDate]; 

//         const insertQuery = 'INSERT INTO resumes (job_seeker_email, job_post_id, CV, upload_date) VALUES (?, ?, ?, ?)';
//         const values = [globalEmailJobseeker, job_offer_id, filePath, uploadDate];


//         await dbConnection.query(insertQuery, values);

//         return res.send(`
//         <script>
//             alert('Resume uploaded successfully.');
//             window.location.href = '/viewJobOffers.html'; // Redirect to a specific page after showing the alert
//         </script>
//     `);
//     } catch (error) {
//         console.error('Error handling resume upload:', error);
//         return res.status(500).json({ error: 'Internal Server Error' });
//     }
// });


app.get('/getCV', async (req, res) => {
    try {
        // Make sure globalEmail is set (replace this with your actual logic)
        if (!globalEmail) {
            return res.status(400).send('Global email not set');
        }

        const connection = await mysql.createConnection(dbConfig);

        console.log("global Email: ", EMAIL);
        const [CVs] = await connection.execute(`
            SELECT R.CV, R.upload_date, R.job_seeker_email
            FROM Resumes R
            JOIN jobpost JP ON R.job_post_id = JP.job_post_id
            JOIN users E ON JP.employer_email = E.email
            WHERE E.email = ?;
        `, [EMAIL]);

        connection.end();

        res.json(CVs);  // Send JSON response

    } catch (error) {
        console.error('Error retrieving CVs:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/getCV/:job_seeker_email', async (req, res) => {
    try {
        const jobSeekerEmail = req.params.job_seeker_email;

        const connection = await mysql.createConnection(dbConfig);

        const [CV] = await connection.execute(`
            SELECT R.CV, R.upload_date, R.job_seeker_email
            FROM Resumes R
            JOIN jobpost JP ON R.job_post_id = JP.job_post_id
            JOIN users E ON JP.employer_email = E.email
            WHERE R.job_seeker_email = ?;
        `, [jobSeekerEmail]);

        connection.end();

        if (CV.length === 0) {
            return res.status(404).send('CV not found');
        }

        const cvContent = CV[0].CV;

        // Set appropriate content-type header based on the type of CV content
        res.setHeader('Content-Type', 'application/pdf'); // Adjust based on your CV content type

        // Set appropriate content-disposition header for download
        res.setHeader('Content-Disposition', `attachment; filename="${jobSeekerEmail}_CV.pdf"`);

        // Send the CV content as the response
        res.send(cvContent);
    } catch (error) {
        console.error('Error retrieving CV:', error);
        res.status(500).send('Internal Server Error');
    }
});







async function executeQueryAndLogResults(sqlQuery, params, logMessage, successCallback, errorCallback) {
    try {
        console.log(logMessage);
        console.log("SQL Query:", sqlQuery);

        const [results] = await dbConnection.query(sqlQuery, params);

        if (results.length > 0) {
            console.log(`Results for ${logMessage}:`, results);

            successCallback(results[0]);
        } else {
            console.log(`No matching record found for: ${logMessage}`);
        }
    } catch (error) {
        console.error(`Error executing query for: ${logMessage}`, error);
        errorCallback(error);
    }
}

app.post("/blogWriting", async (req, res) => {
    const { blogTitle, blogContent } = req.body;

    let companyName;
    let employeeId;

    try {
  
        const sqlQuery1 = 'SELECT company_name FROM employee WHERE employee_email = ?';
        await executeQueryAndLogResults(
            sqlQuery1,
            [globalEmailEmployee],
            'company_name',
            (companyNameResult) => {
                companyName = companyNameResult.company_name;
                console.log(`Do something with companyName: ${companyName}`);
            },
            (error) => {
                res.status(500).send("Internal Server Error");
            }
        );


        const sqlQuery2 = 'SELECT employee_id FROM employee WHERE employee_email = ?';
        await executeQueryAndLogResults(
            sqlQuery2,
            [globalEmailEmployee],
            'employee_id',
            (employeeIdResult) => {
                employeeId = employeeIdResult.employee_id;
                console.log(`Do something with employeeId: ${employeeId}`);
            },
            (error) => {
                res.status(500).send("Internal Server Error");
            }
        );

  
        const insertQuery = "INSERT INTO reviewblogpost (employee_id, title, content, company_name, employee_email) VALUES (?, ?, ?, ?, ?)";
        dbConnection.query(insertQuery, [employeeId, blogTitle, blogContent, companyName, globalEmailEmployee], (err, result) => {
            if (err) {
                console.error("Error inserting data into the reviewblogpost table:", err);
                res.status(500).send("Internal Server Error");
            } else {
                console.log("Blog post inserted successfully!");
                // res.send("Blog post inserted successfully!");
                const responseWithAlert = `
                <script>
                    alert('Blog Posted for Admin Approval.');
                    window.location.href = '/blogWriting.html'; 
                </script>`;
            return res.send(responseWithAlert);
            }
        });
    } catch (error) {
        console.error("Error in the main blogWriting function:", error);
        res.status(500).send("Internal Server Error");
    }
});



app.get('/getBlogPosts', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig); 
        const [blogposts] = await connection.execute("SELECT PostId, title, content, company_name, employee_email FROM reviewblogpost");

       
        connection.end();

        res.json(blogposts);
    } catch (error) {
        console.error('Error retrieving Blog Post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.post("/approveBlogPost", (req, res) => {
    const PostId = req.body.PostId;
  
    const insertQuery =
      "INSERT INTO blogpost SELECT * FROM reviewblogpost WHERE PostId = ?";
  
    dbConnection.query(insertQuery, [PostId], (err, result) => {
      if (err) {
        console.error("Error approving and inserting blog post:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        console.log("Blog post approved and inserted into the blogpost table");
        const responseWithAlert = `
        <script>
            alert('Blog Approved.');
            window.location.href = '/blogReview.html'; // Redirect to a specific page after showing the alert
        </script>`;
  
     
        const deleteQuery = "DELETE FROM reviewblogpost WHERE PostId = ?";
        dbConnection.query(deleteQuery, [PostId], (deleteError, deleteResults) => {
          if (deleteError) {
            console.error("Error deleting pending blog post:", deleteError);
            res.status(500).json({ error: "Internal Server Error" });
          } else {
            console.log("Pending blog post deleted");
            res.status(200).json({ message: "Blog post approved and inserted" });
          }

         
      return res.send(responseWithAlert);
        });
      }
    });
  });
  
 




app.get('/getBlogPostsJobseeker', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig); 
        const [blogposts] = await connection.execute("SELECT PostId, title, content, company_name, employee_email FROM blogpost");

       
        connection.end();

        res.json(blogposts);
    } catch (error) {
        console.error('Error retrieving Blog Post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/getJobInfo', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig); 
        const [jobInfo] = await connection.execute("SELECT Platform, Title, Company, Requirement, Experience, Link from job_info");

       
        connection.end();

        res.json(jobInfo);
    } catch (error) {
        console.error('Error retrieving Blog Post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




app.listen(8000, () => {
    console.log("Server started on port 8000");
});