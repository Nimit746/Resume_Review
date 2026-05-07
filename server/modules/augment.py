import os
import json
import re
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser

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
        # We invoke the model directly and handle parsing manually for maximum reliability
        self.chain = prompt | model
        
    def run(self, inputs:dict) -> dict:
        try:
            # 1. Invoke the model directly to get the raw message
            response = self.chain.invoke(inputs)
            content = response.content if hasattr(response, 'content') else str(response)
            
            # 2. Extract JSON using Regex
            # This handles models that talk before/after the JSON block
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                try:
                    return json.loads(json_match.group())
                except json.JSONDecodeError:
                    pass
            
            # 3. Fallback: if no valid JSON found, wrap the entire text in standard keys
            # This ensures the frontend doesn't crash even if the AI ignores formatting
            return {
                "answer": content,
                "cover_letter": content,
                "score": 0,
                "matching_keywords": [],
                "missing_keywords": [],
                "improvements": []
            }
            
        except Exception as e:
            # Final safety net to prevent 500 errors
            return {"answer": f"Error: {str(e)}", "cover_letter": f"Error: {str(e)}"}