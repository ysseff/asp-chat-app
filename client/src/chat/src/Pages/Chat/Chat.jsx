import { useEffect, useState } from "react";
import style from "./Chat.module.css";
import axios from 'axios';

const Chat = () => {
    // let [conversations,setConversations]=useState(null);
    // // let [specificconversations,setSpecificConversations]=useState(null)
    // async function getConversationsMy() {
    //         const options={
    //             url:"http://localhost:5173//api/Conversations/my",
    //             method:"GET",
    //         }
    //         let{data}=await axios.request(options);
    //         setConversations(data);
    // }
//     async function getSpecificConversations({id}) {
//         const options={
//             url:`http://localhost:5173//api/Conversations/${id}`,
//             method:"GET",
//         }
//         let{data}=await axios.request(options);
//         setConversations(data);
        
// }
    // useEffect(()=>{getConversationsMy()},[]);
    return (
        <>
            <section className={`${style.chatHome}`}>
                <div className="container">
                    <div className="chatContent">
                        <p>
                            Select a conversation or start a new one
                        </p>
                    </div>
                    <div className="conversations">
                        <button type="button" className="NewConversation">
                        <div>
                        <div className="icon-conversations">
                        <i className="fa-solid fa-plus "></i>
                        </div>
                        <p >New Conversation</p>
                        </div>
                        </button>
                        <div className="conversationItem">
                            <i className="fa-regular fa-message"></i>
                            <p>John Doe</p>
                        </div>
                        {/* {conversations ?(conversations.map((conversationName,index)=>{
                            <div key={index} className="conversationItem">
                            <i className="fa-regular fa-message"></i>
                            <p>{conversationName}</p>
                            </div>}
                        )):("")} */}
                    </div>
                    <div className="auxiliaryTools">
                        <div className="Profile">
                        <i className="fa-regular fa-user"></i>
                        <p>Profile</p>
                        </div>
                        <div className="Logout">
                        <i className="fa-solid fa-right-from-bracket"></i>
                        
                        <p>Logout</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Chat;
