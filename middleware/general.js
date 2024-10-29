import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
config();

const {EMAIL_USER,EMAIL_PASS} = process.env;


export const handleError = (err) =>{
    const errors = {user: '', password: ''};

    if(err.message === 'No account with this email'){
        errors.user = 'Account does not exist'
    }

    if(err.message === 'passwaord field is empty'){
        errors.password = 'passwaord field is empty';
    }

    if(err.message === 'incorrect password'){
        errors.password = 'incorrect password'
    }

    if(err.code === 11000){
        if(err.message.includes('email_1 dup key')){
            errors.email = 'This email already exists';
        }
    }

    return errors
};

export const createJwt = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: 1 * 24 * 60 * 60})
}


export const checkLogin = (req,res,next) =>{

        // Get the token from the Authorization header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
      
        if (token == null) {
          return res.sendStatus(401);
        }
      
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
          if (err) {
            return res.sendStatus(403);
          }
          req.user = user;
          next(); 
        });
      };



export const sendEmails = (mailType,complaint) =>{
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS
        }
    });

    const mailOptions = {
        from: EMAIL_USER,
        to: complaint.email,
        subject: 'Complaint Resolved',
        text:( mailType === 'resolve') ? `Dear User, your complaint titled "${complaint.title}" has been resolved. Thank you for your patience.` : `Dear User, your complaint titled "${complaint.title}" has been received.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return 'Error sending email:', error;
        } else {
            return 'Email sent:', info.response;
        }
    });
}
