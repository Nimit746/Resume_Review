import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()
class Model:
    def __init__(self, model:str = 'openai/gpt-oss-20b', temp:float = 0.3):
        self.model = model
        self.temp = temp
        
    def create_model(self) -> ChatGroq:
        model = ChatGroq(
            model = self.model,
            temperature = self.temp,
            api_key=os.environ['GROQ_API'],
        )
        return model


class Prompt:
    def __init__(self, template:str, input_variables:list[str], partial_variables: dict | None = None):
        self.template = template
        self.input_variables = input_variables
        self.partial_variables = partial_variables or {}
        
    def create_prompt(self, ) -> PromptTemplate:
        prompt = PromptTemplate(
            template=self.template,
            input_variables=self.input_variables,
            partial_variables=self.partial_variables,
        )
        return prompt

class Chain:
    def __init__(self, prompt: PromptTemplate, model: ChatGroq):
        self.chain = prompt | model | StrOutputParser()
        
    def run(self, inputs:dict) -> str:
        return self.chain.invoke(inputs)