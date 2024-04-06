import pymongo
from dotenv import load_dotenv
import os

from langchain_openai import OpenAIEmbeddings

from langchain.prompts import PromptTemplate
# from langchain.output_parsers import PydanticOutputParser
from langchain_core.output_parsers import JsonOutputParser, StrOutputParser, PydanticOutputParser
import os

load_dotenv()

os.environ['LANGCHAIN_TRACING_V2'] = 'true'