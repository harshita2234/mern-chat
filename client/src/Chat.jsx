import { useContext, useEffect, useRef, useState } from "react";
import Avatar from "./Avatar";
import Logo from "./Logo";
import { UserContext } from "./UserContext";
import {uniqBy} from 'lodash'; 
import axios from "axios";
import Contact from "./Contact";

export default function Chat(){
    const [ws,setWs] = useState(null);
    const [onlinePeople,setOnlinePeople] = useState({});
    const [selectedUserId, setSelectedUserId] = useState(null);
    const {username,id,setId,setUsername} = useContext(UserContext);
    const [newMessageText, setNewMessageText]=useState('');
    const [messages,setMessages] = useState([]);
    const divUnderMessages = useRef();
    const [offlinePeople, setOfflinePeople] = useState({});
    useEffect(()=>{
        connectToWs();
    },[]);

    function connectToWs(){
        const ws = new WebSocket('ws://localhost:4000');
        setWs(ws);
        ws.addEventListener('message', handleMessage);
        ws.addEventListener('close', () => {
            //console.log("DISCONNECTED TRYING TO RECONNECT");
            setTimeout(connectToWs, 1000);
        });
        ws.addEventListener('error', (error) => {
            //console.error('WebSocket error:', error);
            ws.close();
        });
    }

    function showOnlinePeople(peopleArray){
        const people ={};
        peopleArray.forEach(({userId,username}) => {
            people[userId] = username;
        });
        setOnlinePeople(people);
    }
    function handleMessage(ev){
        const messageData = JSON.parse(ev.data);
        if ('online' in messageData){
            showOnlinePeople(messageData.online);
        } else if ('text' in messageData) {
            setMessages(prev => ([...prev,{...messageData}]));
        }
    }
    function sendMessage(ev,file=null){
        if (ev) ev.preventDefault();
        ws.send(JSON.stringify({
            recipient: selectedUserId,
            text: newMessageText,
            file,
        }));
        if (file){
            axios.get('/messages/'+selectedUserId).then(res=>{
                setMessages(res.data);
            });
        } else{
            setNewMessageText('');
            setMessages(prev => ([...prev,{
                text:newMessageText,
                sender: id,
                recipient: selectedUserId,
                _id: Date.now(),
            }]));
        }
    }

    function sendFile(ev){
        const reader = new FileReader();
        reader.readAsDataURL(ev.target.files[0]);    
        reader.onload=()=>{
            sendMessage(null, {
                name: ev.target.files[0].name,
                data: reader.result,
            });
        };
    }

    useEffect(()=>{
        axios.get('/people').then(res => {
            const offlinePeopleArr = res.data
            .filter(p=>p._id!==id)
            .filter(p=>!Object.keys(onlinePeople).includes(p._id));
            const offlinePeople = {};
            offlinePeopleArr.forEach(p=>{
                offlinePeople[p._id]=p;
            });
            setOfflinePeople(offlinePeople);
        });
    },[onlinePeople]);

    useEffect(()=>{
        const div = divUnderMessages.current;
        if (div){
            div.scrollIntoView({behavior:'smooth', block:'end'});
        }
    },[messages]);

    useEffect(()=>{
        if(selectedUserId){
            axios.get('/messages/'+selectedUserId).then(res=>{
                setMessages(res.data);
            });
        }
    },[selectedUserId]);

    const onlinePeopleExcludingSelf = {...onlinePeople};
    delete(onlinePeopleExcludingSelf[id]);
    const messagesWithoutDupes = uniqBy(messages,'_id');

    function logout(){
        axios.post('/logout').then(()=>{
            setWs(null);
            setId(null);
            setUsername(null);
        });
    }

    return(
        <div className="flex h-screen">
            <div className="bg-white w-1/3">
                <div className="flex-grow">
                    <Logo/>
                    {Object.keys(onlinePeopleExcludingSelf).map(userId => (
                        <Contact 
                        key={userId}
                        id={userId} 
                        online={true}
                        username={onlinePeopleExcludingSelf[userId]} 
                        onClick={()=> setSelectedUserId(userId)}
                        selected={userId === selectedUserId}/>
                    ))}
                    {Object.keys(offlinePeople).map(userId => (
                        <Contact 
                        key={userId}
                        id={userId} 
                        online={false}
                        username={offlinePeople[userId].username} 
                        onClick={()=> setSelectedUserId(userId)}
                        selected={userId === selectedUserId}/>
                    ))}
                </div>
                <div className="p-2 text-center">
                    <button 
                    className="text-sm bg-red-500 py-1 px-2 text-white rounded-md"
                    onClick={logout}>logout</button>
                </div>
            </div>
            <div className="flex flex-col bg-blue-50 w-2/3 p-2">
                <div className="flex-grow">
                    {!selectedUserId && (
                        <div className="flex h-full items-center justify-center">
                            <div className="text-gray-400">&larr; Select a Contact from Sidebar</div>
                        </div>
                    )}
                    {selectedUserId && (
                        <div className="relative h-full">
                            <div className="overflow-y-scroll absolute inset-0">
                                {messagesWithoutDupes.map(message => (
                                    <div key={message._id} className={(message.sender===id? 'text-right':'text-left')}>
                                        <div className={"inline-block p-2 m-1 rounded-md text-sm "+(message.sender===id?'bg-blue-500 text-white':'bg-white text-gray-500')}>
                                        {message.text}
                                        {message.file && (
                                            <div>
                                                <a target="_blank"
                                                className="underline flex items-center gap-1" 
                                                href={axios.defaults.baseURL+'/uploads/'+message.file}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15" />
                                                </svg>
                                                {message.file}
                                                </a>
                                            </div>
                                        )}
                                        </div>
                                    </div>
                                ))}
                                <div ref={divUnderMessages}></div>
                            </div>
                        </div>
                    )}
                </div>
                {selectedUserId && (
                    <form onSubmit={sendMessage} className="flex gap-2">
                        <input 
                            type="text" 
                            value={newMessageText}
                            onChange={ev=>setNewMessageText(ev.target.value)}
                            placeholder="type..." 
                            className="bg-white flex-grow border p-2 rounded-md"/>
                        <label type='button' className="bg-gray-400 p-2 text-white rounded-md cursor-pointer">
                            <input type='file' className="hidden" onChange={sendFile}></input>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                            </svg>
                        </label>
                        <button type='submit' className="bg-blue-500 p-2 text-white rounded-md">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                            </svg>
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}