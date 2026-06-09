const Contact = require('../models/Contact');
const Notification = require('../models/Notification');
const mockStore = require('../config/mockDb');

// @desc    Submit a contact message
// @route   POST /api/contacts
// @access  Public
const submitContact = async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: 'Please fill out all fields' });
  }

  try {
    let newInquiry;
    let newNotification;

    const notifData = {
      type: 'contact',
      title: 'New Contact Inquiry',
      message: `Inquiry from ${name} about "${subject}"`,
      createdAt: new Date(),
    };

    if (global.dbConnected) {
      newInquiry = await Contact.create({ name, email, subject, message });
      newNotification = await Notification.create(notifData);
    } else {
      newInquiry = {
        _id: 'mock_contact_' + Date.now(),
        name,
        email,
        subject,
        message,
        resolved: false,
        createdAt: new Date(),
      };
      mockStore.contacts.push(newInquiry);

      newNotification = {
        _id: 'mock_notif_' + Date.now(),
        ...notifData,
        read: false,
      };
      mockStore.notifications.push(newNotification);
    }

    // Emit Socket.io event for real-time dashboard updates
    if (global.io) {
      global.io.emit('notification', newNotification);
      console.log('📡 Real-time notification emitted via Socket.io:', newNotification.title);
    }

    res.status(201).json({
      success: true,
      message: 'Your transmission has been broadcasted to the Novasphere core. We will connect soon.',
      data: newInquiry,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { submitContact };
