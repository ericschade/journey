from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import MongoDBAtlasVectorSearch
from langchain_openai import OpenAIEmbeddings
from pydantic import AnyHttpUrl
from pymongo import MongoClient
from dotenv import load_dotenv
import os
from langchain.chains import RetrievalQA
from langchain_openai import OpenAI

def answerQuestion(query):

    vector_search = MongoDBAtlasVectorSearch.from_connection_string(
        f"mongodb+srv://{os.environ.get('mongodb_uri')}",
        "memories.memoriesCollection",
        OpenAIEmbeddings(disallowed_special=()),
        index_name="text_index",
    )
    qa_retriever = vector_search.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 25},
    )
    
    qa = RetrievalQA.from_chain_type(
        llm=OpenAI(),
        chain_type="stuff",
        retriever=qa_retriever,
        return_source_documents=True,
        chain_type_kwargs={"prompt": "Please answer the following question:"},
    )

    docs = qa({"query": query})

    print(docs)