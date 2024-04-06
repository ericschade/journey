from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import MongoDBAtlasVectorSearch
from langchain_openai import OpenAIEmbeddings
from pydantic import AnyHttpUrl
from pymongo import MongoClient
from dotenv import load_dotenv
import os
load_dotenv()

def get_memories(query):
        
    vector_search = MongoDBAtlasVectorSearch.from_connection_string(
        f"mongodb+srv://{os.getenv('mongodb_uri')},
        OpenAIEmbeddings(disallowed_special=()),
        index_name="text_index",
    )
    results = vector_search.similarity_search_with_score(
        query,
        k=5,
    )
    
    return results
