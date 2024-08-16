import React, { useState, useEffect, useRef } from "react";
import catJamEmote from '../assets/catJam.webp';
import EZEmote from '../assets/EZ.webp';
import KEKWEmote from '../assets/KEKW.webp';
import monkaSEmote from '../assets/monkaS.webp';


const users = ["noni7", "mahndoo", "dubdubz11", "howakang"];
const emotes = [
    { name: 'catJam', url: catJamEmote },
    { name: 'EZ', url: EZEmote },
    { name: 'KEKW', url: KEKWEmote },
    { name: 'monkaS', url: monkaSEmote },
  ];
const commands = [
    { command: '/block', description: 'Block a user from interacting with you on Twitch' },
    { command: '/unblock', description: 'Remove user from your block list' },
    { command: '/color', description: 'Change your username color, i.e. blue, green, etc.' },
    { command: '/gift', description: 'Gift a specified number of Subs to the community.' },
    { command: '/help', description: 'Get detailed information on using a chat command' },
    { command: '/mods', description: 'Display a list of moderators for this channel' },
    { command: '/vips', description: 'Display a list of VIPs for this channel' },
    { command: '/vote', description: 'Vote in the active poll on the given channel' }
  ];

const Chat = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [filteredOptions, setFilteredOptions]= useState([]);
    const [optionsModal, setOptionsModal] = useState(false);
    const [commandsModal, setCommandsModal] = useState(false);
    const [emotesModal, setEmotesModal] = useState(false);
    const [filteredEmotes, setFilteredEmotes] = useState([]);
    const [filteredCommands, setFilteredCommands] = useState([]);
    const [filteredusers, setFilteredUsers] = useState([]);
    const inputRef = useRef(null);


    // Create a ref to reference the chat messages container


    const handleEmoteClick = (emote) => {
        const parts = input.split(':');
        parts.pop();
        const newInput = parts.join(':') + ':' + emote + ' ';
        setInput(newInput);
        setShowEmoteSuggestions(false);
        inputRef && inputRef.current && inputRef.current.focus();
    };

    const setChatMessages = () => {
        if (input.trim()) {
            setMessages([...messages, input]);
            setInput(''); // Clear the input field after adding the message
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInput(value);
    
        // Determine the index of '/' and '@'
        const lastAtIndex = value.lastIndexOf('@');
        const lastSlashIndex = value.lastIndexOf('/');
        const lastColonIndex= value.lastIndexOf(':');
    
        // Show user options modal if '@' is present
        if (lastAtIndex > -1) {
            setOptionsModal(true);  
            const searchValue = value.slice(lastAtIndex + 1);
            const filtered = users.filter(user => user.toLowerCase().includes(searchValue.toLowerCase()));
            setFilteredUsers(filtered);
        } else {
            setOptionsModal(false);
        }

        if(lastColonIndex > -1) {
            setEmotesModal(true);
            const searchValue = value.slice(lastColonIndex + 1);
            const filtered = emotes.filter(emote => emote.name.toLowerCase().includes(searchValue.toLowerCase()));
            setFilteredEmotes(filtered);
        } else {
            setEmotesModal(false);
        }
    
        // Show commands modal only if '/' is at the beginning of the input
        if (lastSlashIndex === 0) {
            setCommandsModal(true);
            const searchValue = value.slice(1);
            const filtered = commands.filter(command => command.command.toLowerCase().includes(searchValue.toLowerCase()));
            setFilteredCommands(filtered);
        } else {
            setCommandsModal(false);
        }
    };

    
    

    const handleUserClick = (value) => {
        setInput(prevInput => {
            const lastAtIndex = prevInput.lastIndexOf('@');
            const lastSlashIndex = prevInput.lastIndexOf('/');
            const lastColonIndex = prevInput.lastIndexOf(':');
    
            // Determine what type of input is being auto-completed
            if (lastAtIndex > -1) {
                const lastSpaceIndex = prevInput.lastIndexOf(' ');
                return prevInput.slice(0, lastSpaceIndex + 1) + `@${value}`; // Auto-complete username
            } else if (lastSlashIndex === 0) {
                const lastSpaceIndex = prevInput.lastIndexOf(' ');
                return prevInput.slice(0, lastSpaceIndex + 1) + `${value}`; // Auto-complete command
            } else if (lastColonIndex > -1) {
                const lastSpaceIndex = prevInput.lastIndexOf(' ');
                console.log(value);    
                return prevInput.slice(0, lastSpaceIndex + 1) + `:${value.name}:`; // Auto-complete emote
            } else {
                return prevInput + ` ${value}`; // Default to appending at the end
            }
        });
    
        // Close modals after selection
        setOptionsModal(false);
        setCommandsModal(false);
        setEmotesModal(false);
    };
    

    const parseMessage = (message) => {
    // Replace placeholders with image elements
    return message.split(' ').map((part, index) => {
        // Check if part is an emote
        if (part.startsWith(':') && part.endsWith(':')) {
            const emoteName = part.slice(1, -1); // Remove leading and trailing colons
            const emote = emotes.find(e => e.name === emoteName)

            if (emote) {
                return <img key={index} src={emote.url} alt={emoteName} style={{ height: '28px', width: '28px' }} />;
            }
        }
        return <span key={index}>{part} </span>; // Return other parts as plain text
    });
};
    
    

    // Scroll to the bottom of the chat messages whenever they change
    // useEffect(() => {
    //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    // }, [messages]);

    return (
        <div className="relative w-full max-w-[550px] px-4 py-3 rounded-lg bg-slate-900 opacity-80 h-[500px] flex flex-col mt-10">
            <div className="chat-messages flex-1 overflow-y-auto">
                {messages.map((msg, index) => (
                    <div className="text-[#EFEFF1] flex" key={index}><span className="text-[teal]">Stonks:</span> {parseMessage(msg)}</div>
                ))}
                {/* Invisible div to scroll into view */}
                {/* <div ref={messagesEndRef} /> */}
            </div>
            {optionsModal && (
                <div className=" bg-opacity-75 flex">
                    <div className="p-1.5 cursor-pointer bg-[#18181B] border rounded border-[#333] text-white w-full">
                        {filteredusers.map((user, index) => (
                            <div className="mb-2" key={index}
                            onClick={() => handleUserClick(user)}
                            >
                                {user}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {commandsModal && (
                <div className="bg-opacity-75 flex">
                    <div className="p-1.5 cursor-pointer bg-[#18181B] border rounded border-[#333] text-white w-full max-h-48 overflow-y-auto">
                        {filteredCommands.map((command, index) => (
                            <div className="mb-2" key={index} onClick={() => handleUserClick(command.command)}>
                                <h6>
                                    {command.command === '/unblock' || command.command === '/block'
                                        ? `${command.command} [username]`
                                        : command.command
                                    }</h6>
                                <h6 className="text-sm text-gray-400">{command.description}</h6>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {emotesModal &&
                <div className=" bg-opacity-75 flex">
                <div className="p-1.5 cursor-pointer bg-[#18181B] border rounded border-[#333] text-white w-full">
                    {filteredEmotes.map((emote, index) => (
                        <div className="mb-2 flex" key={index}
                        onClick={() => handleUserClick(emote)}
                        >
                            <img className="h-[28px] w-[28px]"src={emote.url} />
                            {emote.name}
                        </div>
                    ))}
                </div>
            </div>
            }
            <div className="chat-input mt-auto">
                <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded bg-slate-700 focus:outline-none focus:ring-purple-500 focus:ring-2"
                    placeholder="Send a chat message"
                />
            </div>
            <div>
                <button
                    className="bg-purple-600 p-2 float-right mt-2 rounded-md"
                    type="button"
                    onClick={setChatMessages}
                >
                    Chat
                </button>
            </div>
        </div>
    );
};

export default Chat;
