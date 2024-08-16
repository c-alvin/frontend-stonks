import React, { useState, useEffect, useRef } from "react";


const users = ["noni7", "mahndoo", "dubdubz11", "howakang"];
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
    const [filteredCommands, setFilteredCommands] = useState([]);
    const [filteredusers, setFilteredUsers] = useState([]);

    // Create a ref to reference the chat messages container
    const messagesEndRef = useRef(null);

    const setChatMessages = () => {
        if (input.trim()) {
            setMessages([...messages, input]);
            setInput(''); // Clear the input field after adding the message
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInput(value);
    
        if (value.includes('@')) {
            setOptionsModal(true);  
            const searchValue = value.split('@').pop();
            const filtered = users.filter(user => user.toLowerCase().includes(searchValue.toLowerCase()));
            setFilteredUsers(filtered);
        } else if (value.includes('/')) {
            setCommandsModal(true);
            const searchValue = value.split('/').pop();
            const filtered = commands.filter(command => command.command.toLowerCase().includes(searchValue.toLowerCase()));
            setFilteredCommands(filtered);

        } else {
            setOptionsModal(false);
            setCommandsModal(false);
        }
    }

    const handleUserClick = (value) => {
        setInput(prevInput => {
            // Check if the input contains an '@' or '/' and append the value accordingly
            if (prevInput.includes('@')) {
                return `@${value}`;
            } else if (prevInput.includes('/')) {
                return `${value}`;
            }
        });
        setOptionsModal(false); // Close the options modal
        setCommandsModal(false); // Close the commands modal
    };
    

    // Scroll to the bottom of the chat messages whenever they change
    // useEffect(() => {
    //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    // }, [messages]);

    return (
        <div className="relative w-full max-w-[550px] px-4 py-3 rounded-lg bg-slate-900 opacity-80 h-[500px] flex flex-col mt-10">
            <div className="chat-messages flex-1 overflow-y-auto">
                {messages.map((msg, index) => (
                    <div className="text-[#EFEFF1]" key={index}><span className="text-[teal]">Stonks:</span> {msg}</div>
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
