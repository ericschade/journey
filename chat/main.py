
import streamlit as st
from streamlit_chat import message
from dotenv import load_dotenv
import os
# ...
from langchain_anthropic import ChatAnthropic
from langchain.schema import (
    SystemMessage,
    HumanMessage,
    AIMessage
)

def init():
    load_dotenv()
    #loading env variable

    if os.getenv("ANTHROPIC_API_KEY") is None or os.getenv("ANTHROPIC_API_KEY") == "":
        print("ANTHROPIC_API_KEY is not set")
        exit(1)
    else:
        print("ANTHROPIC_API_KEY is Set")


    st.set_page_config(
        page_title = "Journey",
        page_icon="🔥"
    )

def main():
    init()
    
    chat = ChatAnthropic(temperature=0, model_name="claude-3-opus-20240229")

    if "messages" not in st.session_state:
        st.session_state.messages = [
            SystemMessage(content="You are a helpful assistant.")
        ]


    st.header("Journey - Your memory Companion")

    with st.sidebar:
        user_input = st.text_input("your message: ", key="user_input")

        if user_input:
            #message(user_input, is_user=True)
            st.session_state.messages.append(HumanMessage(content=user_input))
            with st.spinner("Thinking...."):
                response = chat(st.session_state.messages)
            st.session_state.messages.append(AIMessage(content=response.content))
            #message(response.content, is_user=False)

    messages = st.session_state.get('messages', [])
    for i, msg in enumerate(messages[1:]):
        if i % 2 == 0:
            message(msg.content, is_user=True, key=str(i) + '_user')
        else:
            message(msg.content, is_user=False, key=str(i) + '_ai')

if __name__ == '__main__':
    main()
