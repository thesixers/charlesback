import express from 'express';
import jwt from 'jsonwebtoken';
import Seeker from '../model/serviceSeeker.js';
import Provider from '../model/serviceProvider.js';
import Order from '../model/order.js';
import Notification from '../model/notification.js';
import notification from '../model/notification.js';

const router = express.Router();


const JWT_SECRET = 'your_jwt_secret_key';


router.get('/me', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) {
      return res.status(401);
    }
  
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        return res.status(401);
      }

      let id = decodedToken.id; 

      let Us = await Seeker.findById(id);
      let Pro = await Provider.find();
      let orders = await Order.find();
      let notifications = await notification.find();

      let sN = notifications.filter(e => e.ownerID === Us.id);
      let order = orders.filter(e => e.seekerID === Us.id);

      console.log(sN);

      res.status(200).json({Us, Pro, order, sN});
    })
});

router.post('/order', async (req, res) => {
    try {
      let { providerId, serviceSeekerId, selectedServices, numberOfClothes} = req.body;
  
      let provider = await Provider.findById(providerId);
      let seeker = await Seeker.findById(serviceSeekerId);
  
      if (!provider || !seeker) {
        return res.status(404).json({ error: 'Provider or Seeker not found' });
      }
  
      let totalPrice = 0;
  
      const providerServices = provider.services;
  

      selectedServices.forEach(e => {
        console.log();
        totalPrice += Number(providerServices[e.toLowerCase()]) * Number(numberOfClothes)
      });

  
      const newOrder = new Order({
        time: new Date().toLocaleString(),
        pickupLocation: seeker.address,
        services: selectedServices,
        providerID: providerId,
        price: totalPrice,
        seekerID: serviceSeekerId
      });
  
      await newOrder.save();


      const notificationMessage = `You have a new order from ${seeker.name} for ${selectedServices.join(', ')} services please call his line to anything else ${seeker.telnumber}`;
      const newNotification = new Notification({
        message: notificationMessage,
        type: 1,
        ownerID: providerId
      });

  
      await newNotification.save();

      
      return res.status(201).json({ message: 'Order placed successfully', totalPrice });
  
    } catch (error) {
      console.error('Error placing order:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
