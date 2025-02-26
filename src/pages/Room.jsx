import React from "react";
import client, { databases } from "../appwrite/config";
import { useEffect } from "react";
import conf from "../conf/conf";
import { useState } from "react";
import { ID, Permission, Query, Role } from "appwrite";
import { RiSendPlaneFill } from "react-icons/ri";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { Logout } from "../components";
import { useAuth } from "../utils/AuthContext";

const Room = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [messageBody, setMessageBody] = useState("");

  // getmessage function from the database
  const getMessages = async () => {
    try {
      const response = await databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        [Query.orderDesc("$createdAt")]
      );
      setMessages(response.documents);
      // console.log("resoponse", response);
    } catch (error) {
      console.error("error fetching message", error.message);
      alert("unable to fetch messages please try again");
    }
  };
  useEffect(() => {
    getMessages();
    const unsubscribe = client.subscribe(
      `databases.${conf.appwriteDatabaseId}.collections.${conf.appwriteCollectionId}.documents`,
      (response) => {
        // Callback will be executed on changes for documents A and all files.
        // console.log("Real Time", response);
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.create"
          )
        ) {
          // console.log("A message was created");
          setMessages((prev) => [response.payload, ...prev]);
        }
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.delete"
          )
        ) {
          // console.log("A message was deleted");
          setMessages((prev) =>
            prev.filter((message) => message.$id !== response.payload.$id)
          );
        }
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

  // handlesubmit function

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (messageBody === "") {
      alert("please enter text");
      return;
    }
    try {
      let payload = {
        body: messageBody,
        username: user.name,
        user_id: user.$id,
      };
      let permissions = [Permission.write(Role.user(user.$id))];
      const response = await databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        ID.unique(),
        payload,
        permissions
      );
      // setMessages((prev) => [response, ...prev]);
      // console.log(response);
      setMessageBody("");
    } catch (error) {
      console.error("Error creating document:", error.message);
    }
  };

  // delete message from database

  const deleteMessage = async (messageId) => {
    try {
      await databases.deleteDocument(
        conf.appwriteDatabaseId, // databaseId
        conf.appwriteCollectionId, // collectionId
        messageId // documentId
      );
      setMessages((prev) =>
        prev.filter((message) => message.$id !== messageId)
      );
    } catch (error) {
      console.error("error in creating document", error.message);
    }
  };

  return (
    <>
      <div className="md:p-5 bg-gradient-to-br from-gray-800 via-gray-900 to-black h-screen">
        <div className="md:max-w-2xl w-full mx-auto bg-gray-100 rounded-lg shadow-lg h-full flex flex-col justify-between">
          {/* Header */}
          <div className="bg-green-800 flex justify-between items-center px-5 text-white text-center py-4 rounded-t-lg shadow">
            <h1 className="text-lg font-semibold">Chat Room</h1>
            {/* dropdown */}
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="m-1 text-2xl">
                <HiOutlineDotsVertical />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
              >
                <li>
                  <Logout className="text-black" />
                </li>
              </ul>
            </div>
            {/* dropdown end*/}
          </div>

          {/* Messages */}
          <div className="px-5 overflow-y-auto h-full bg-slate-800 flex flex-col-reverse">
            {messages.map((message) => (
              <div
                key={message.$id}
                className={`chat ${
                  message.user_id === user.$id ? "chat-end" : "chat-start"
                }`}
              >
                <div className="chat-header text-white mb-1">
                  {message.username.toUpperCase()}{" "}
                  <time className="text-xs opacity-60">
                    {" "}
                    {new Date(message.$createdAt).toLocaleTimeString()}
                  </time>
                </div>
                <div
                  className={`chat chat-bubble text-white chat-bubble-success
                ${message.user_id === user.$id ? "dropdown dropdown-left" : ""}
                   `}
                >
                  <div tabIndex={0} role="button">
                    <p className="text-xl">{message.body}</p>
                  </div>
                  {message.user_id === user.$id && (
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu bg-base-100 rounded-box z-[1] p-2 shadow"
                    >
                      <li className="text-black">
                        <button
                          onClick={() => deleteMessage(message.$id)}
                          className=""
                        >
                          delete
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
                {/* delete buttion */}
              </div>
            ))}
          </div>

          {/* Message Input */}
          <form
            className="flex items-center gap-2 p-4 bg-slate-800 shadow-md rounded-b-lg"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 bg-transparent px-4 py-2 border border-blue-400 rounded-lg focus:outline-none focus:ring focus:ring-blue-400 text-white"
              value={messageBody}
              onChange={(e) => setMessageBody(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 focus:outline-none focus:ring focus:ring-green-400"
            >
              <RiSendPlaneFill className="text-xl" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Room;
