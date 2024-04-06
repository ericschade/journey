from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import MongoDBAtlasVectorSearch
from langchain_openai import OpenAIEmbeddings
from pydantic import AnyHttpUrl
from pymongo import MongoClient
from dotenv import load_dotenv
import os
from langchain.chains import RetrievalQA
from langchain_openai import OpenAI
from langchain_anthropic import Anthropic
from langchain.prompts import PromptTemplate


load_dotenv()

def answerQuestion(query):

    prompt_template = """Use the following pieces of context to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer.

    {context}

    Question: {question}
    """
    PROMPT = PromptTemplate(
        template=prompt_template, input_variables=["context", "question"]
    )

    vector_search = MongoDBAtlasVectorSearch.from_connection_string(
        connection_string= os.environ.get('mongodb_uri'),
        namespace= "memories.memoriescollections",
        embedding= OpenAIEmbeddings(),
        index_name="text_index",
        text_key="rawTextResponse",
        embedding_key="textResponseEmbedding",
    )
    
    qa_retriever = vector_search.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 10},
    )
    
    qa = RetrievalQA.from_chain_type(
        llm=Anthropic(),
        chain_type="stuff",
        retriever=qa_retriever,
        return_source_documents=True,
        chain_type_kwargs={"prompt": PROMPT},
    )

    docs = qa({"query": query})

    return docs["result"]

if __name__ == "__main__":
    result = answerQuestion("How do I feel when I go backpacking?")
    print(result)