import { state } from '../state.js';
import { socketClient } from '../socket/socket.js';

export function Chat(params = {}) {
  const container = document.createElement('div');
  container.className = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-140px)] min-h-[500px] flex flex-col';

  let conversations = [];
  let activeConversation = null;
  let messages = [];
  let otherParticipant = null;
  let isTyping = false;
  let typingTimeout = null;
  let activeConversationId = params.conversationId || null;

  // Read conversationId from query parameter as fallback (?conversationId=...)
  if (!activeConversationId) {
    const hash = window.location.hash;
    const queryIndex = hash.indexOf('?');
    if (queryIndex !== -1) {
      const queryParams = new URLSearchParams(hash.slice(queryIndex));
      activeConversationId = queryParams.get('conversationId');
    }
  }

  // Load chat page resources
  const loadChatData = async () => {
    if (!state.currentUser) {
      state.showToast("Please log in to access your messages.", "error");
      window.location.hash = '#/login';
      return;
    }

    try {
      const res = await fetch(`${state.API_URL}/chat/conversations`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        conversations = await res.json();
        
        if (activeConversationId) {
          activeConversation = conversations.find(c => c._id === activeConversationId);
          if (activeConversation) {
            await selectConversation(activeConversation);
          }
        }
        drawPage();
      }
    } catch (e) {
      console.error("Failed to load conversations:", e);
    }
  };

  const selectConversation = async (conv) => {
    activeConversation = conv;
    activeConversationId = conv._id;
    
    // Find the other participant
    otherParticipant = conv.participants.find(p => p._id.toString() !== state.currentUser._id.toString());

    // Join room
    socketClient.joinChat(conv._id);

    // Fetch messages history
    try {
      const res = await fetch(`${state.API_URL}/chat/conversations/${conv._id}/messages`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        messages = await res.json();
        
        // Mark messages as seen
        socketClient.emitMessageSeen(conv._id, otherParticipant._id);
        
        // Reset unread locally
        if (conv.lastMessage && conv.lastMessage.sender === otherParticipant._id) {
          conv.lastMessage.seen = true;
        }

        // Fetch new unread count to update navbar badges immediately (with delay for DB write)
        setTimeout(() => {
          state.fetchUnreadCount();
        }, 200);

        drawPage();
        scrollToBottom();
      }
    } catch (e) {
      console.error("Failed to fetch messages:", e);
    }
  };

  // Format timestamp helper
  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const date = new Date(timeStr);
    const now = new Date();
    
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const scrollToBottom = () => {
    const chatBody = container.querySelector('#chat-messages-body');
    if (chatBody) {
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  };

  // Send a message
  const handleSendMessage = async (text, image = '') => {
    if (!text.trim() && !image) return;

    try {
      const res = await fetch(`${state.API_URL}/chat/conversations/${activeConversationId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ text, image })
      });

      if (res.ok) {
        const newMessage = await res.json();
        messages.push(newMessage);
        
        // Broadcast via Socket
        socketClient.sendMessage(newMessage, otherParticipant._id);
        
        // Update local conversation list order
        if (activeConversation) {
          activeConversation.lastMessage = newMessage;
          activeConversation.updatedAt = newMessage.createdAt;
          // Move conversation to top
          conversations = [activeConversation, ...conversations.filter(c => c._id !== activeConversationId)];
        }

        drawPage();
        scrollToBottom();
      }
    } catch (e) {
      console.error("Failed to send message:", e);
    }
  };

  // Socket Hook Registrations
  let unsubscribeReceive = () => {};
  let unsubscribeTyping = () => {};
  let unsubscribeStopTyping = () => {};
  let unsubscribeSeen = () => {};
  let unsubscribeSocketChange = () => {};

  const setupSocketListeners = () => {
    unsubscribeReceive = socketClient.onReceiveMessage((msg) => {
      // Check if message belongs to active chat
      if (activeConversationId && msg.conversation === activeConversationId) {
        messages.push(msg);
        socketClient.emitMessageSeen(activeConversationId, otherParticipant._id);
        setTimeout(() => {
          state.fetchUnreadCount();
        }, 200);
        drawPage();
        scrollToBottom();
      } else {
        // Find conversation list item and flag unread last message
        const conv = conversations.find(c => c._id === msg.conversation);
        if (conv) {
          conv.lastMessage = msg;
          conv.updatedAt = msg.createdAt;
          // Reorder list
          conversations = [conv, ...conversations.filter(c => c._id !== msg.conversation)];
          drawPage();
        } else {
          // Reload conversation list
          loadChatData();
        }
      }
    });

    unsubscribeTyping = socketClient.onTyping(({ conversationId }) => {
      if (activeConversationId && conversationId === activeConversationId) {
        isTyping = true;
        const typingEl = container.querySelector('#typing-indicator-container');
        if (typingEl) typingEl.classList.remove('hidden');
      }
    });

    unsubscribeStopTyping = socketClient.onStopTyping(({ conversationId }) => {
      if (activeConversationId && conversationId === activeConversationId) {
        isTyping = false;
        const typingEl = container.querySelector('#typing-indicator-container');
        if (typingEl) typingEl.classList.add('hidden');
      }
    });

    unsubscribeSeen = socketClient.onMessagesMarkedSeen(({ conversationId }) => {
      if (activeConversationId && conversationId === activeConversationId) {
        messages.forEach(m => {
          if (m.sender.toString() === state.currentUser._id.toString()) {
            m.seen = true;
          }
        });
        drawPage();
      }
    });

    unsubscribeSocketChange = socketClient.subscribe(() => {
      // Re-draw page to update online circles
      drawPage();
    });
  };

  // Destroy hooks on route change
  container.addEventListener('remove', () => {
    unsubscribeReceive();
    unsubscribeTyping();
    unsubscribeStopTyping();
    unsubscribeSeen();
    unsubscribeSocketChange();
  });

  const drawPage = () => {
    const isUserOnline = otherParticipant ? socketClient.isOnline(otherParticipant._id) : false;

    // Build Conversations Sidebar HTML
    let sidebarHtml = '';
    if (conversations.length === 0) {
      sidebarHtml = `
        <div class="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-slate-500">
          <i data-lucide="message-square-dashed" class="w-10 h-10 mb-2"></i>
          <p class="text-xs">No chats yet</p>
        </div>
      `;
    } else {
      sidebarHtml = conversations.map(c => {
        const contact = c.participants.find(p => p._id.toString() !== state.currentUser._id.toString());
        if (!contact) return '';

        const isActive = activeConversationId && c._id === activeConversationId;
        const contactOnline = socketClient.isOnline(contact._id);
        const lastMsg = c.lastMessage;
        
        let msgPreview = 'No messages yet';
        let isUnread = false;
        let isOwnLast = false;
        
        let sideIcon = 'check';
        let sideColor = 'text-slate-400 dark:text-slate-500';

        if (lastMsg) {
          isOwnLast = lastMsg.sender.toString() === state.currentUser._id.toString();
          msgPreview = lastMsg.image ? '📷 Sent an image' : lastMsg.text;
          isUnread = !isOwnLast && !lastMsg.seen;
          
          if (lastMsg.seen) {
            sideIcon = 'check-check';
            sideColor = 'text-blue-500 dark:text-blue-400';
          } else if (contactOnline) {
            sideIcon = 'check-check';
          }
        }

        return `
          <div data-id="${c._id}" class="conversation-item flex items-center gap-3 p-3.5 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition border border-transparent ${isActive ? 'bg-emerald-50/75 dark:bg-emerald-950/20 border-emerald-100/50 dark:border-emerald-900/20' : ''}">
            <div class="relative flex-shrink-0">
              <img src="${contact.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${contact.username}`}" class="w-11 h-11 rounded-full object-cover border border-slate-100 dark:border-slate-800" />
              <span class="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${contactOnline ? 'bg-emerald-500' : 'bg-slate-350'}"></span>
            </div>
            
            <div class="flex-grow min-w-0">
              <div class="flex items-center justify-between mb-0.5">
                <h4 class="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">${contact.username}</h4>
                <span class="text-[10px] text-slate-400 font-semibold">${formatTime(c.updatedAt)}</span>
              </div>
              
              <div class="flex items-center justify-between gap-2">
                <p class="text-xs text-slate-500 dark:text-slate-400 truncate ${isUnread ? 'font-bold text-slate-900 dark:text-white' : ''}">
                  ${isOwnLast ? '<span class="text-slate-400 font-medium">You: </span>' : ''}${msgPreview}
                </p>
                
                ${isUnread ? `
                  <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0"></span>
                ` : lastMsg && isOwnLast ? `
                  <i data-lucide="${sideIcon}" class="w-3.5 h-3.5 ${sideColor} flex-shrink-0"></i>
                ` : ''}
              </div>
              
              <span class="text-[10px] text-slate-450 truncate block mt-0.5 font-medium">🛒 ${c.product ? c.product.title : 'Deleted Product'}</span>
            </div>
          </div>
        `;
      }).join('');
    }

    // Build Chat Window HTML
    let windowHtml = '';
    if (!activeConversation) {
      windowHtml = `
        <div class="flex flex-col items-center justify-center h-full text-center p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex-grow">
          <div class="p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 rounded-2xl mb-4">
            <i data-lucide="message-circle" class="w-10 h-10"></i>
          </div>
          <h3 class="text-base font-bold text-slate-800 dark:text-white">Your Conversations</h3>
          <p class="text-xs text-slate-450 max-w-xs mt-1.5">Select a buyer or seller listing chat from the sidebar list to start messaging in real-time.</p>
        </div>
      `;
    } else {
      // Build Messages History bubbles
      let lastDate = '';
      const messagesHtml = messages.map(m => {
        const isOwn = m.sender.toString() === state.currentUser._id.toString();
        const msgDate = new Date(m.createdAt).toDateString();
        
        let checkIcon = 'check';
        let checkColor = 'text-slate-400 dark:text-slate-500';
        if (m.seen) {
          checkIcon = 'check-check';
          checkColor = 'text-blue-500 dark:text-blue-400';
        } else if (otherParticipant && socketClient.isOnline(otherParticipant._id)) {
          checkIcon = 'check-check';
        }

        let dateDivider = '';
        if (msgDate !== lastDate) {
          lastDate = msgDate;
          dateDivider = `
            <div class="flex justify-center my-4">
              <span class="px-2.5 py-0.5 text-[10px] font-bold text-slate-450 bg-slate-100 dark:bg-slate-800 rounded-md">
                ${new Date(m.createdAt).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
            </div>
          `;
        }

        const msgTime = new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return `
          ${dateDivider}
          <div class="flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3">
            <div class="max-w-[70%] min-w-[50px] flex flex-col ${isOwn ? 'items-end' : 'items-start'}">
              <div class="p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                isOwn 
                  ? 'bg-emerald-600 text-white rounded-tr-none' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none'
              }">
                ${m.image ? `<img src="${m.image}" class="max-w-xs max-h-48 rounded-lg mb-2 object-cover block cursor-pointer hover:opacity-90 transition" />` : ''}
                <p class="break-words font-medium">${m.text || ''}</p>
              </div>
              <div class="flex items-center gap-1 mt-1 text-[9px] font-bold text-slate-400">
                <span>${msgTime}</span>
                ${isOwn ? `
                  <i data-lucide="${checkIcon}" class="w-3 h-3 ${checkColor}"></i>
                ` : ''}
              </div>
            </div>
          </div>
        `;
      }).join('');

      windowHtml = `
        <div class="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm flex-grow">
          <!-- Chat Window Header -->
          <div class="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
            <div class="flex items-center gap-3">
              <!-- Back button for mobile screens -->
              <button id="chat-mobile-back-btn" class="md:hidden p-1.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition mr-1">
                <i data-lucide="arrow-left" class="w-5 h-5"></i>
              </button>
              <img src="${otherParticipant.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${otherParticipant.username}`}" class="w-10 h-10 rounded-full object-cover" />
              <div>
                <h4 class="text-sm font-bold text-slate-800 dark:text-white leading-none">${otherParticipant.username}</h4>
                <div class="flex items-center gap-1.5 mt-1">
                  <span class="w-2 h-2 rounded-full ${isUserOnline ? 'bg-emerald-500' : 'bg-slate-350'}"></span>
                  <span class="text-[10px] text-slate-450 font-semibold">${isUserOnline ? 'Online' : 'Offline'}</span>
                </div>
              </div>
            </div>

            <!-- Product Info banner -->
            ${activeConversation.product ? `
              <div class="flex items-center gap-2 pl-2 sm:pl-3.5 border-l border-slate-200 dark:border-slate-700 max-w-[60%] sm:max-w-sm">
                <img src="${activeConversation.product.images[0] || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80'}" class="w-8 h-8 sm:w-9 sm:h-9 rounded-lg object-cover flex-shrink-0" />
                <div class="min-w-0 hidden sm:block ml-2">
                  <h5 class="text-[11px] font-bold text-slate-800 dark:text-white truncate leading-none mb-0.5">${activeConversation.product.title}</h5>
                  <span class="text-[10px] font-black text-emerald-600 dark:text-emerald-400">₹${activeConversation.product.price}</span>
                </div>
                <a href="#/product/${activeConversation.product._id || activeConversation.product.id}" class="px-2 py-1 text-[9px] sm:text-[10px] font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md transition flex-shrink-0 ml-1.5">
                  View
                </a>
              </div>
            ` : ''}
          </div>

          <!-- Chat Window Body (Messages history scroll feed) -->
          <div id="chat-messages-body" class="flex-grow overflow-y-auto p-4 space-y-2 bg-slate-50/20 dark:bg-slate-900/10">
            ${messages.length === 0 ? `
              <div class="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-500 py-12">
                <i data-lucide="message-square-text" class="w-10 h-10 mb-2"></i>
                <p class="text-xs">Send a message to start the conversation!</p>
              </div>
            ` : messagesHtml}
            
            <!-- Real-time Typing Alert -->
            <div id="typing-indicator-container" class="${isTyping ? '' : 'hidden'} flex items-center gap-1.5 text-xs text-slate-450 font-semibold pl-4 py-1.5">
              <span>${otherParticipant.username} is typing</span>
              <span class="flex items-center gap-0.5 ml-0.5">
                <span class="w-1 h-1 rounded-full bg-slate-400 animate-bounce" style="animation-delay:0.1s"></span>
                <span class="w-1 h-1 rounded-full bg-slate-400 animate-bounce" style="animation-delay:0.2s"></span>
                <span class="w-1 h-1 rounded-full bg-slate-400 animate-bounce" style="animation-delay:0.3s"></span>
              </span>
            </div>
          </div>

          <!-- Selected Image Preview before sending -->
          <div id="image-preview-container" class="hidden px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/10 flex items-center justify-between">
            <div class="relative">
              <img id="preview-img-target" class="w-16 h-16 rounded-lg object-cover border border-slate-200 dark:border-slate-700" />
              <button id="cancel-preview-btn" type="button" class="absolute -top-1.5 -right-1.5 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 shadow transition">
                <i data-lucide="x" class="w-3 h-3"></i>
              </button>
            </div>
          </div>

          <!-- Chat Window Input Bar -->
          <form id="chat-input-form" class="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-white dark:bg-slate-900">
            <!-- Camera / Image Upload Input -->
            <input type="file" id="chat-image-input" class="hidden" accept="image/*" />
            <button id="trigger-image-btn" type="button" class="p-2.5 rounded-xl bg-slate-150 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-550 dark:text-slate-350 transition">
              <i data-lucide="image" class="w-5 h-5"></i>
            </button>
            
            <input 
              type="text" 
              id="message-text-input" 
              class="flex-grow px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500" 
              placeholder="Type your message..." 
              autocomplete="off"
            />
            
            <button type="submit" class="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow shadow-emerald-600/10 hover:shadow-emerald-700/20 active:scale-95 transition">
              <i data-lucide="send-horizontal" class="w-5 h-5"></i>
            </button>
          </form>
        </div>
      `;
    }

    container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-12 gap-6 h-full flex-grow">
        <!-- Sidebar Column (Conversations List) -->
        <div class="md:col-span-4 flex flex-col bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm h-full max-h-full ${activeConversation ? 'hidden md:flex' : 'flex'}">
          <div class="p-4 border-b border-slate-100 dark:border-slate-800">
            <h3 class="text-base font-bold text-slate-800 dark:text-white">Active Chats</h3>
          </div>
          <div class="flex-grow overflow-y-auto p-2 space-y-1.5">
            ${sidebarHtml}
          </div>
        </div>

        <!-- Chat Window Column -->
        <div class="md:col-span-8 flex flex-col h-full max-h-full ${activeConversation ? 'flex' : 'hidden md:flex'}">
          ${windowHtml}
        </div>
      </div>
    `;

    // Wire up sidebar list item click event listeners
    const convItems = container.querySelectorAll('.conversation-item');
    convItems.forEach(item => {
      item.addEventListener('click', () => {
        const id = item.getAttribute('data-id');
        const conv = conversations.find(c => c._id === id);
        if (conv) selectConversation(conv);
      });
    });

    // Wire up mobile back button
    if (activeConversation) {
      const mobileBackBtn = container.querySelector('#chat-mobile-back-btn');
      if (mobileBackBtn) {
        mobileBackBtn.addEventListener('click', () => {
          activeConversation = null;
          activeConversationId = null;
          otherParticipant = null;
          // Clear query params / hash back to plain #/chat
          window.history.pushState(null, '', '#/chat');
          drawPage();
        });
      }
    }

    // Wire up Chat input event listeners
    if (activeConversation) {
      const inputForm = container.querySelector('#chat-input-form');
      const textInput = container.querySelector('#message-text-input');
      const fileInput = container.querySelector('#chat-image-input');
      const triggerImageBtn = container.querySelector('#trigger-image-btn');
      const previewContainer = container.querySelector('#image-preview-container');
      const previewImg = container.querySelector('#preview-img-target');
      const cancelPreviewBtn = container.querySelector('#cancel-preview-btn');

      let uploadedImageBase64 = '';

      // Typing indicators trigger
      textInput.addEventListener('input', () => {
        socketClient.emitTyping(activeConversationId, otherParticipant._id);
        
        // Debounced stop-typing
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
          socketClient.emitStopTyping(activeConversationId, otherParticipant._id);
        }, 1500);
      });

      // Handle Image uploading selection
      triggerImageBtn.addEventListener('click', () => fileInput.click());
      
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          if (!file.type.startsWith('image/')) {
            state.showToast("Attachment must be an image", "error");
            return;
          }
          const reader = new FileReader();
          reader.onload = (event) => {
            uploadedImageBase64 = event.target.result;
            if (previewImg) previewImg.src = uploadedImageBase64;
            if (previewContainer) previewContainer.classList.remove('hidden');
          };
          reader.readAsDataURL(file);
        }
      });

      cancelPreviewBtn.addEventListener('click', () => {
        uploadedImageBase64 = '';
        fileInput.value = '';
        if (previewContainer) previewContainer.classList.add('hidden');
      });

      // Form submission
      inputForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = textInput.value;
        
        // Stop typing immediately
        clearTimeout(typingTimeout);
        socketClient.emitStopTyping(activeConversationId, otherParticipant._id);

        handleSendMessage(text, uploadedImageBase64);
        
        // Clear inputs
        textInput.value = '';
        uploadedImageBase64 = '';
        fileInput.value = '';
        if (previewContainer) previewContainer.classList.add('hidden');
      });
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  };

  // Init chat
  loadChatData();
  setupSocketListeners();

  return container;
}
