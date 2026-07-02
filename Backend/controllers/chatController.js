const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Get or create a conversation for a product
// @route   POST /api/chat/conversations
// @access  Private
const getOrCreateConversation = async (req, res, next) => {
  try {
    const { productId, sellerId } = req.body;
    const buyerId = req.user._id;

    if (!productId || !sellerId) {
      res.status(400);
      throw new Error('Product ID and Seller ID are required');
    }

    if (buyerId.toString() === sellerId.toString()) {
      res.status(400);
      throw new Error('You cannot start a conversation with yourself');
    }

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      product: productId,
      participants: { $all: [buyerId, sellerId] }
    })
      .populate('product', 'title price images city')
      .populate('participants', 'username avatar rating joined phone email')
      .populate('lastMessage');

    if (!conversation) {
      // Create new conversation
      conversation = await Conversation.create({
        product: productId,
        participants: [buyerId, sellerId]
      });

      // Populate fresh conversation details
      conversation = await Conversation.findById(conversation._id)
        .populate('product', 'title price images city')
        .populate('participants', 'username avatar rating joined phone email');
    }

    res.status(200).json(conversation);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all conversations for the logged-in user
// @route   GET /api/chat/conversations
// @access  Private
const getConversations = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const conversations = await Conversation.find({
      participants: userId
    })
      .populate('product', 'title price images city')
      .populate('participants', 'username avatar rating joined phone email')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });

    res.status(200).json(conversations);
  } catch (error) {
    next(error);
  }
};

// @desc    Get messages inside a conversation
// @route   GET /api/chat/conversations/:conversationId/messages
// @access  Private
const getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;

    // Verify conversation exists and user is a participant
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      res.status(404);
      throw new Error('Conversation not found');
    }

    if (!conversation.participants.includes(userId)) {
      res.status(401);
      throw new Error('Not authorized to view these messages');
    }

    const messages = await Message.find({ conversation: conversationId })
      .sort({ createdAt: 1 }); // oldest first

    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};

// @desc    Post a message in a conversation
// @route   POST /api/chat/conversations/:conversationId/messages
// @access  Private
const sendMessage = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { text, image } = req.body;
    const senderId = req.user._id;

    if (!text && !image) {
      res.status(400);
      throw new Error('Message body or image attachment is required');
    }

    // Verify conversation exists and sender is a participant
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      res.status(404);
      throw new Error('Conversation not found');
    }

    if (!conversation.participants.includes(senderId)) {
      res.status(401);
      throw new Error('Not authorized to message in this conversation');
    }

    // Create message
    const message = await Message.create({
      conversation: conversationId,
      sender: senderId,
      text: text || "",
      image: image || "",
      seen: false
    });

    // Update lastMessage and timestamps in conversation
    conversation.lastMessage = message._id;
    await conversation.save();

    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};

// @desc    Get total unread messages count
// @route   GET /api/chat/unread-count
// @access  Private
const getUnreadCount = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Find all conversations for this user
    const conversations = await Conversation.find({ participants: userId });
    const conversationIds = conversations.map(c => c._id);

    // Count messages in these conversations where sender is NOT the user and seen is false
    const unreadCount = await Message.countDocuments({
      conversation: { $in: conversationIds },
      sender: { $ne: userId },
      seen: false
    });

    res.status(200).json({ count: unreadCount });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOrCreateConversation,
  getConversations,
  getMessages,
  sendMessage,
  getUnreadCount
};
