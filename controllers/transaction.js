const User = require("../models/user.js");
const Transaction = require("../models/transaction.js")
const sendEmail = require('../config/sendEmail.js');

const transfer = async (req, res) => {
  try {
    const { receiver, amount, sender } = req.body;

    const recipient = await User.findOne({ email: receiver });
    const senderUser = await User.findOne({ email: sender });


    console.log('Recipient:', recipient);
    console.log('Sender:', senderUser);

    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    if (!senderUser) {
      return res.status(404).json({ message: 'Sender not found' });
    }

    if (senderUser.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    senderUser.balance -= amount;
    recipient.balance += amount;

    await senderUser.save();
    await recipient.save();

    const transaction = new Transaction({
      sender: senderUser._id,
      receiver: recipient._id,
      amount,
    });
    await transaction.save();

    await sendEmail(
      senderUser.email,
      'Transaction Successful',
      `You have successfully transferred ${amount} to ${recipient.email}`
    );

    await sendEmail(
      recipient.email,
      'Transaction Successful',
      `You have received ${amount} from ${senderUser.email}`
    );

    res.status(200).json({ message: 'Transfer successful' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const transactionHistory = async (req, res) => {
  try {
    console.log('transactionHistory endpoint called');

    if (!req.user) {
      console.log('User not found in request');
      return res.status(401).send('User not authenticated');
    }

    const user = req.user;
    console.log('User:', user);

    let transactions;
    const adminEmail = 'shubhr457@gmail.com';

    if (user.email === adminEmail) {
      transactions = await Transaction.find({})
        .populate('sender', 'email')
        .populate('receiver', 'email');
      console.log('Admin viewing all transactions');
    } else {
      const userId = user._id;
      console.log('User ID for query:', userId);

      const query = {
        $or: [
          { sender: userId },
          { receiver: userId }
        ]
      };


      transactions = await Transaction.find(query)
        .populate('sender', 'email')
        .populate('receiver', 'email');
      console.log('User viewing their own transactions');
    }

    console.log('Transactions:', transactions);

    res.json(transactions);
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).send('Server Error');
  }
};


module.exports={ transfer, transactionHistory };
