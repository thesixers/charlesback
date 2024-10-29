import express from 'express';
import jwt from 'jsonwebtoken';
import { createJwt, handleError } from '../middleware/general.js';
import Provider from '../model/serviceProvider.js';
import Seeker from '../model/serviceSeeker.js';

const router = express.Router();


const JWT_SECRET = 'your_jwt_secret_key';


router.post('/register', async (req, res) => {
    let {role} = req.body;
    try{
        if(role === 'provider'){
            let { businessName, email,location,phone,serviceRates,password } = req.body;
            // availableDays = Object.entries(availableDays)
            // .filter(([day, isTrue]) => isTrue)
            // .map(([day]) => day)
            let it = await Provider.create({ businessName,email,location,telnumber:phone,services:serviceRates,password });
            console.log('prover:' + it);
            res.status(200).json({M: 'Account created'});
        }else{
            let { name,email,password,address,phone } = req.body;
            let it = await Seeker.create({ name,email,password,address,telnumber:phone });
            console.log('seeker:' + it);
            res.status(200).json({M: 'Account created'});
        }
    }
    catch(err){
        console.log(err);
        let errors = handleError(err);
        console.log(errors);
        res.status(500).json({errors}); 
    }
  
});


router.post('/login', async (req, res) => {
    const { email, password, role } = req.body;
    console.log({ email, password, role });
    console.log(req.body);

    try {
        if(role === 'provider'){
            const user = await Provider.login({ email, password });

            let id = user._id

            const token = createJwt(id);

            return res.status(200).json({
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                },
            });
        }else{
            const user = await Seeker.login({ email, password });

            let id = user._id

            const token = createJwt(id);

            return res.status(200).json({
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                },
            });
        }
    } catch (err) {
       console.log(err.message);
       let error = handleError(err);
       console.log(error);
       res.status(500).json({error})
    }
});


router.post('/logout', (req, res) => {
  
});


export default router;
