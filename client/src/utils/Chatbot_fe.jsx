import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, User, Bot, CircleDot, Database, Code, Library, Landmark, Layers } from 'lucide-react'; // Thêm các icon phù hợp
import styles from './Chatbot.module.css';
import { useNavigate } from 'react-router-dom';

const Chatbot = () => {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const chatContainerRef = useRef(null);
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API;


    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory, loading]);
    const parseBotMessage = (content) => {
        const parts = [];
        let lastIndex = 0;
        const regex = /ITEM_START\n([\s\S]*?)\nITEM_END/g;
        let match;

        while ((match = regex.exec(content)) !== null) {
            if (match.index > lastIndex) {
                const textBefore = content.substring(lastIndex, match.index).trim();
                if (textBefore) {
                    parts.push({ type: 'text', content: textBefore });
                }
            }

            const itemContent = match[1].trim();
            const itemDetails = { };
            itemContent.split('\n').forEach(line => {
                const [keyWithColon, ...valueParts] = line.split(':');
                const key = keyWithColon.trim();
                const value = valueParts.join(':').trim();

                if (key === 'Loại') itemDetails.type = value;
                else if (key === 'ID') itemDetails.id = value;
                else if (key === 'Tên' || key === 'Tiêu đề') itemDetails.nameOrTitle = value;
                else if (key === 'Mô tả') itemDetails.description = value;
                else if (key === 'Hình ảnh') itemDetails.image = value;
                else if (key === 'Logo') itemDetails.logo = value;
                else if (key === 'Phụ đề') itemDetails.subtitle = value;
            });
            if (itemDetails.id && itemDetails.nameOrTitle && itemDetails.type) {
                parts.push({ type: 'item', data: itemDetails });
            } else {
                parts.push({ type: 'text', content: match[0] });
            }
            lastIndex = regex.lastIndex;
        }
        if (lastIndex < content.length) {
            const remainingText = content.substring(lastIndex).trim();
            if (remainingText) {
                parts.push({ type: 'text', content: remainingText });
            }
        }
        if (parts.length === 0 && content) {
            parts.push({ type: 'text', content: content });
        }
        return parts;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const userMessage = message;
        setMessage('');
        setChatHistory(prev => [...prev, { type: 'user', content: userMessage }]);
        setLoading(true);

        try {
            const res = await axios.post(`${API_URL}/api/chatbot`, {
                question: userMessage
            });
            setChatHistory(prev => [...prev, { type: 'bot', content: res.data.answer }]);
        } catch (error) {
            console.error('Chatbot error:', error);
            let errorMessage = 'Xin lỗi, đã xảy ra lỗi khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.';
            if (error.response && error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message; 
            } else if (error.message) {
                errorMessage = error.message; 
            }
            setChatHistory(prev => [...prev, {
                type: 'bot',
                content: errorMessage
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.chatbotWrapper}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={styles.toggleButton}
            >
                {isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                )}
            </button>

            <div className={`${styles.chatbotContainer} ${isOpen ? styles.open : styles.closed}`}>
                <div className={styles.chatHeader}>
                    <Bot className={styles.headerIcon} />
                    <h5 className={styles.headerTitle}>Trợ lý AI</h5>
                </div>

                <div ref={chatContainerRef} className={styles.chatMessages}>
                    {chatHistory.length === 0 && !loading && (
                        <div className={styles.welcomeMessage}>
                            <Bot className={styles.welcomeIcon} />
                            <p>Xin chào! Tôi là một trợ lý AI để hỗ trợ khách hàng</p>
                        </div>
                    )}
                    {chatHistory.map((chat, index) => (
                        <div
                            key={index}
                            className={`${styles.messageRow} ${chat.type === 'user' ? styles.userMessageRow : styles.botMessageRow}`}
                        >
                            <div className={`${styles.messageContent} ${chat.type === 'user' ? styles.userMessageContent : styles.botMessageContent}`}>
                                <div className={`${styles.avatar} ${chat.type === 'user' ? styles.userAvatar : styles.botAvatar}`}>
                                    {chat.type === 'user' ? <User className={styles.avatarIcon} /> : <Bot className={styles.avatarIcon} />}
                                </div>
                                <div className={`${styles.messageBubble} ${chat.type === 'user' ? styles.userBubble : styles.botBubble}`}>
                                    {chat.type === 'bot' ? (
                                        parseBotMessage(chat.content).map((part, partIndex) => {
                                            if (part.type === 'item' && part.data) {
                                                const { id, type, nameOrTitle, description, image, logo, subtitle } = part.data;
                                                const displayImage = image && image !== 'Chưa có ảnh' ? image : (logo && logo !== 'Chưa có logo' ? logo : null);
                                                
                                                let itemIcon;
                                                switch(type) {
                                                    case 'Brand': itemIcon = <Landmark size={18} />; break;
                                                    case 'Category': itemIcon = <Layers size={18} />; break;
                                                    case 'Language': itemIcon = <Code size={18} />; break;
                                                    default: itemIcon = <CircleDot size={18} />;
                                                }

                                                return (
                                                    <div
                                                        key={`${index}-item-${partIndex}`}
                                                        className={styles.itemCard}
                                                         onClick={() => handleProductClick(part.data.slug)}
                                                        role="button"
                                                        tabIndex={0}
                                                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleProductClick(part.data.slug); }}
                                                    >
                                                        <div className={styles.itemCardHeader}>
                                                            {itemIcon}
                                                            {type && <span className={styles.itemType}>{type}</span>}
                                                            {nameOrTitle && <h4 className={styles.itemNameOrTitle}>{nameOrTitle}</h4>}
                                                        </div>
                                                        {displayImage && (
                                                            <img
                                                                src={displayImage}
                                                                alt={nameOrTitle || 'Item image'}
                                                                className={styles.itemImage}
                                                                onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/60x60?text=No+Image"; }} // Fallback
                                                            />
                                                        )}
                                                        <div className={styles.itemInfo}>
                                                            {id && <p className={styles.itemId}>ID: {id}</p>}
                                                            {subtitle && <p className={styles.itemSubtitle}>{subtitle}</p>}
                                                            {description && <p className={styles.itemDescription}>{description}</p>}
                                                            {/* Bạn có thể thêm các trường khác như price, summary, role nếu có */}
                                                        </div>
                                                    </div>
                                                );
                                            } else if (part.type === 'text' && part.content) {
                                                // Hiển thị phần văn bản
                                                return <p key={`${index}-text-${partIndex}`} className={styles.messageText}>{part.content}</p>;
                                            }
                                            return null;
                                        })
                                    ) : (
                                        <p className={styles.messageText}>{chat.content}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className={styles.botMessageRow}>
                            <div className={styles.botMessageContent}>
                                <div className={`${styles.avatar} ${styles.botAvatar}`}>
                                    <Bot className={styles.avatarIcon} />
                                </div>
                                <div className={`${styles.messageBubble} ${styles.botBubble}`}>
                                    <div className={styles.loadingDots}>
                                        <div className={`${styles.dot} ${styles.dot1}`}></div>
                                        <div className={`${styles.dot} ${styles.dot2}`}></div>
                                        <div className={`${styles.dot} ${styles.dot3}`}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className={styles.inputForm}>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Nhập tin nhắn..."
                        className={styles.inputField}
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={loading || !message.trim()}
                        className={`${styles.sendButton} ${(loading || !message.trim()) ? styles.buttonDisabled : ''}`}
                    >
                        <Send className={styles.buttonIcon} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chatbot;