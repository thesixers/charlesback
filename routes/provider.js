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

      let Us = await Provider.findById(id);
      let order = await Order.find();
      let notifications = await notification.find();

      let sN = notifications.filter(e => e.ownerID === Us.id);
      let orders = order.filter(e => e.providerID === Us.id);

      res.status(200).json({Us, orders, sN});
    })
});

router.put('/orders/:id', async (req, res) => {
    try {
      const { id } = req.params; // Get order ID from the URL
      const { status } = req.body; // Get the new status from the request body
  
      // Find the order by ID and update the status
      const updatedOrder = await Order.findByIdAndUpdate(id, { status: status }, { new: true });
  
      // Check if the order was found and updated
      if (!updatedOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      // Respond with the updated order
      res.status(200).json(updatedOrder);
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

export default router;
