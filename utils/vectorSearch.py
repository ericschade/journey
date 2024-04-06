from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import MongoDBAtlasVectorSearch
from langchain_openai import OpenAIEmbeddings
from pydantic import AnyHttpUrl
from pymongo import MongoClient
from dotenv import load_dotenv
import os
load_dotenv()

vector_search = MongoDBAtlasVectorSearch.from_connection_string(
    f"mongodb+srv://{os.environ.get('MONGODB_LOGIN_USERNAME')}:{os.environ.get('MONGODB_LOGIN_PASSWORD')}@hackathon.0h4onx0.mongodb.net/?retryWrites=true&w=majority&appName=Hackathon",
    OpenAIEmbeddings(disallowed_special=()),
    index_name="text_index",
)
results = vector_search.similarity_search_with_score(
    query="Meetups i went to ",
    k=5,
)
