// import React, { useState } from 'react';

// const ChatBox = ({ socket, gameId, playerName }) => {
//     const [message, setMessage] = useState('');

//     const handleSend = (e) => {
//         e.preventDefault();
//         if (message.trim()) {
//             socket.emit('sendMessage', {
//                 gameId,
//                 message: message.trim(),
//                 sender: playerName
//             });
//             setMessage('');
//         }
//     };

//     return (
//         <div className="chat-box">
//             <div className="messages">
//                 {/* Messages will be displayed here */}
//             </div>
//             <form onSubmit={handleSend}>
//                 <input
//                     type="text"
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     placeholder="Type a message..."
//                 />
//                 <button type="submit">Send</button>
//             </form>
//         </div>
//     );
// };

// export default ChatBox;
import React, { useState, useRef, useEffect } from 'react';

function ChatBox({ socket, gameId, playerName }) {
    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const chatContainerRef = useRef(null);

    useEffect(() => {
        // Listen for incoming messages
        socket.on('chatMessage', (msg) => {
            setChatMessages(prev => [...prev, msg]);
        });

        return () => {
            socket.off('chatMessage');
        };
    }, [socket]);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatMessages]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (message.trim()) {
            socket.emit('sendMessage', {
                gameId,
                message: message.trim(),
                sender: playerName
            });
            setMessage('');
        }
    };

    return (
        <div className="chat-box">
            <div className="chat-header">
                <h3>Chat</h3>
            </div>
            <div className="chat-messages" ref={chatContainerRef}>
                {chatMessages.map((msg, index) => (
                    <div 
                        key={index} 
                        className={`message ${msg.sender === playerName ? 'own-message' : 'other-message'}`}
                    >
                        <span className="sender">{msg.sender === playerName ? 'You' : msg.sender}</span>
                        <span className="text">{msg.message}</span>
                    </div>
                ))}
            </div>
            <form onSubmit={sendMessage} className="chat-input">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="input-field"
                />
                <button type="submit" className="button">Send</button>
            </form>
        </div>
    );
}

export default ChatBox;
